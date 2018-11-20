import { FormatKeys } from "./format";
import { Locales } from "./locales";
import { parseDirectory } from "./parser";

export type TranslatorOptions = {
    throwUndefinedKey?: boolean
    defaultLanguage?: string
    data: TranslatorData
}

export type TranslatorData = { [lang: string]: FormatKeys }

export class Translator {
    private defaultLanguage?: string
    private throwUndefinedKey: boolean
    private data: TranslatorData
    private localesMap: { [lang: string]: Locales } = {}

    constructor(options: TranslatorOptions) {
        this.throwUndefinedKey = options.throwUndefinedKey === undefined
            ? true
            : options.throwUndefinedKey;

        this.defaultLanguage = options.defaultLanguage;
        this.data = { ...options.data };

        if (this.defaultLanguage && !this.data[this.defaultLanguage]) {
            throw new Error(`Default language must be part of data`);
        }
    }

    locales(language: string) {
        if (!this.localesMap[language]) {
            if (this.data[language]) {
                this.localesMap[language] = new Locales(this.data[language],
                    {
                        throwUndefinedKey: this.throwUndefinedKey,
                        defaultKeys: this.defaultLanguage && this.data[this.defaultLanguage] || undefined,
                        language,
                    });
            } else if (this.defaultLanguage) {
                this.localesMap[language] = new Locales(this.data[this.defaultLanguage], {
                    throwUndefinedKey: this.throwUndefinedKey,
                    language,
                })
            } else {
                throw new Error(`No translation for lang ${language}`);
            }
        }

        return this.localesMap[language];
    }
}

export type DirectoryTranslatorOptions = {
    directory: string
    languages?: string[]
    defaultLanguage?: string
    throwUndefinedKey?: boolean
}

export function createDirectoryTranslator(options: DirectoryTranslatorOptions) {
    const { directory, defaultLanguage, throwUndefinedKey, languages } = options;

    const data = parseDirectory({ directory, languages });

    return new Translator({
        defaultLanguage,
        throwUndefinedKey,
        data,
    })
}
