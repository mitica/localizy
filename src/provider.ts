import { FormatKeys } from "./format";
import { Translator } from "./translator";

export type ProviderOptions = {
    throwUndefinedKey?: boolean
    defaultLanguage?: string
    data: { [lang: string]: FormatKeys }
}

export class Provider {
    private defaultLanguage?: string
    private throwUndefinedKey: boolean
    private data: { [lang: string]: FormatKeys }
    private translators: { [lang: string]: Translator } = {}

    constructor(options: ProviderOptions) {
        this.throwUndefinedKey = options.throwUndefinedKey === undefined
            ? true
            : options.throwUndefinedKey;
            
        this.defaultLanguage = options.defaultLanguage;
        this.data = { ...options.data };

        if (this.defaultLanguage && !this.data[this.defaultLanguage]) {
            throw new Error(`Default language must be part of data`);
        }
    }

    translator(lang: string) {
        if (!this.translators[lang]) {
            if (this.data[lang]) {
                this.translators[lang] = new Translator(this.data[lang],
                    {
                        throwUndefinedKey: this.throwUndefinedKey,
                        defaultKeys: this.defaultLanguage && this.data[this.defaultLanguage] || undefined,
                    });
            } else if (this.defaultLanguage) {
                this.translators[lang] = new Translator(this.data[this.defaultLanguage], {
                    throwUndefinedKey: this.throwUndefinedKey,
                })
            } else {
                throw new Error(`No translation for lang ${lang}`);
            }
        }

        return this.translators[lang];
    }
}
