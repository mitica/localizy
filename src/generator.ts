import { parseDirectory } from "./parser";
import { FormatKeys } from "./format";
import { parseParams, TsParam } from 'sprintf-ts';


export interface GenerateDirecatoryOptions extends GenerateOptions {
    directory: string
    languages?: string[]
}

export function generateFromDirectory(options: GenerateDirecatoryOptions) {
    const { directory, languages } = options;
    const data = parseDirectory({ directory, languages });

    return generateCode(data, options);
}

export function generateCode(data: { [lang: string]: FormatKeys }, options?: GenerateOptions) {
    options = options || {};
    const className = options.className || 'LocalesProvider';

    const keysData = Object.keys(data).reduce<FormatKeys>((container, lang) => {
        container = Object.assign(container, data[lang]);
        return container;
    }, {});

    const keys = Object.keys(keysData);

    const keysParams = keys.reduce<{ [index: string]: TsParam[] }>((container, key) => {
        const item = keysData[key];
        const format = Array.isArray(item.value) ? item.value[item.value.length - 1][2] : item.value;
        const params = parseParams(format);

        container[key] = params;

        return container;
    }, {});

    const code = `
import { Locales, Translator, TranslatorOptions, DirectoryTranslatorOptions, parseDirectory } from 'lang-text';

export class ${className}<T extends GeneratedLocales = GeneratedLocales> {
    private translator: Translator
    private localesMap: { [lang: string]: T } = {}

    constructor(options: TranslatorOptions, private createLocales?: (t: Locales) => T) {
        this.translator = new Translator(options);
    }

    locales(lang: string) {
        if (!this.localesMap[lang]) {
            if (this.createLocales) {
                this.localesMap[lang] = this.createLocales(this.translator.locales(lang));
            } else {
                this.localesMap[lang] = new GeneratedLocales(this.translator.locales(lang)) as T;
            }
        }

        return this.localesMap[lang];
    }

    static createFromDirectory(options: DirectoryTranslatorOptions) {
        const { directory, defaultLanguage, throwUndefinedKey, languages } = options;

        const data = parseDirectory({ directory, languages });

        return new ${className}({
            defaultLanguage,
            throwUndefinedKey,
            data,
        })
    }
}

export class GeneratedLocales {
    protected __locales: Locales
    constructor(locales: Locales) {
        this.__locales = locales;
    }

    s(key: LocalesKey, ...args: any[]) {
        return this.v(key, args);
    }

    v(key: LocalesKey, args?: any[]) {
        return this.__locales.t(key, args);
    }
    ${keys.map(key => {
            const params = keysParams[key].map(item => '_' + item.name + ': ' + item.type.join('|'));
            if (keysData[key].context) {
                params.push('_options?: {context: {[index: string]: string | number}}');
            }
            const head = `${formatFunctionName(key)}(${params.join(', ')})`;
            const body = params.length
                ? `return this.v('${key}', Array.from(arguments));`
                : `return this.v('${key}');`;

            return `

    ${head} {
        ${body}
    }`;
        }).join('')}
}

export type LocalesKey = ${keys.map(key => `'${key}'`).join('\n    | ') || 'string'};
`;

    return code;
}


export interface GenerateOptions {
    className?: string
}

function formatFunctionName(key: string) {
    if (/^\d+/.test(key)) {
        key = '$' + key;
    }

    return key;
}
