import { TranslationKeys, TranslationKeyContext, TranslationKeyValue } from "./translation";
import { vsprintf } from 'sprintf-js';

export type LocalesOptions = {
    throwUndefinedKey: boolean
    defaultKeys?: TranslationKeys
    language: string
}
export type LocalesContext = { [index: string]: any }

export class Locales {
    private throwUndefinedKey: boolean
    private defaultKeys?: TranslationKeys
    private _language: string

    constructor(private keys: TranslationKeys, options: LocalesOptions) {
        this._language = options.language;
        this.throwUndefinedKey = options.throwUndefinedKey;
        this.defaultKeys = options.defaultKeys && { ...options.defaultKeys } || undefined;
    }

    language() {
        return this._language;
    }

    t(key: string, args?: any[], options?: { context: LocalesContext }) {
        const format = this.getFormat(key, args, options && options.context);
        return vsprintf(format, args || []);
    }

    protected getFormat(keyName: string, args?: any[], context?: LocalesContext) {
        const key = this.keys[keyName] || this.defaultKeys && this.defaultKeys[keyName];
        if (!key) {
            if (!this.throwUndefinedKey) {
                return keyName;
            }
            throw new Error(`Undefined key: ${keyName}`)
        }

        if (key.context && context) {
            return this.getContextFormat(key.context, context, args)
                || this.getFormatValue(key.value, args);
        }

        return this.getFormatValue(key.value, args);
    }

    protected getContextFormat(keyContext: TranslationKeyContext, context: LocalesContext, args?: any[]) {
        for (const item of keyContext) {
            let match = true;
            for (const prop of Object.keys(item.matches)) {
                if (item.matches[prop] !== context[prop]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                return this.getFormatValue(item.value, args);
            }
        }
    }

    protected getFormatValue(value: TranslationKeyValue, args?: any[]) {
        if (!Array.isArray(value)) {
            return value;
        }
        if (!args) {
            throw new Error(`Arguments are required!`);
        }
        const count = args.find(item => typeof item === 'number') as number | undefined;

        if (typeof count !== 'number') {
            throw new Error(`Format ${value[0]} requires a number argument!`);
        }

        for (const item of value) {
            let min = item[0] === null ? Number.MIN_VALUE : item[0] as number;
            let max = item[1] === null ? Number.MAX_VALUE : item[1] as number;

            if (min <= count && count <= max) {
                return item[2];
            }
        }

        return value[value.length - 1][2];
    }
}
