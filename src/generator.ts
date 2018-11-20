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

    return generateClass(data, options);
}

export function generateClass(data: { [lang: string]: FormatKeys }, options?: GenerateOptions) {
    options = options || {};
    const className = options.className || 'TranslatorProvider';

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
import { Provider, Translator, ProviderOptions, DirectoryProviderOptions, parseDirectory } from 'lang-text';

export class ${className}<T extends GeneratedTranslator = GeneratedTranslator> {
    private provider: Provider
    private translators: { [lang: string]: T } = {}

    constructor(options: ProviderOptions, private createTranslator?: (t: Translator) => T) {
        this.provider = new Provider(options);
    }

    translator(lang: string) {
        if (!this.translators[lang]) {
            if (this.createTranslator) {
                this.translators[lang] = this.createTranslator(this.provider.translator(lang));
            } else {
                this.translators[lang] = new GeneratedTranslator(this.provider.translator(lang)) as T;
            }
        }

        return this.translators[lang];
    }

    static createFromDirectory(options: DirectoryProviderOptions) {
        const { directory, defaultLanguage, throwUndefinedKey, languages } = options;

        const data = parseDirectory({ directory, languages });

        return new ${className}({
            defaultLanguage,
            throwUndefinedKey,
            data,
        })
    }
}

export class GeneratedTranslator {
    private __translator: Translator
    constructor(translator: Translator) {
        this.__translator = translator;
    }

    s(key: TranslatorKey, ...args: any[]) {
        return this.v(key, args);
    }

    v(key: TranslatorKey, args?: any[]) {
        return this.__translator.t(key, args);
    }
    ${keys.map(key => {
            const params = keysParams[key].map(item => '_' + item.name + ': ' + item.type.join('|'));
            if (keysData[key].context) {
                params.push('_options?: {context: {[index: string]: string | number}}');
            }
            const head = `${formatFunctionName(key)}(${params.join(', ')})`;
            const body = `return this.v('${key}', Array.from(arguments));`;

            return `

    ${head} {
        ${body}
    }`;
        }).join('')}
}

export type TranslatorKey = ${keys.map(key => `'${key}'`).join('\n    | ') || 'string'};
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
