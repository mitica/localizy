import { FormatKeys, FormatKeyContext, FormatKeyValue } from "./format";
import { vsprintf } from 'sprintf-js';

export type TranslatorOptions = {
    throwUndefinedKey: boolean
    defaultKeys?: FormatKeys
}
export type TranslatorContext = { [index: string]: any }

export class Translator {
    private throwUndefinedKey: boolean
    private defaultKeys?: FormatKeys

    constructor(private keys: FormatKeys, options: TranslatorOptions) {
        this.throwUndefinedKey = options.throwUndefinedKey;
        this.defaultKeys = options.defaultKeys && { ...options.defaultKeys } || undefined;
    }

    t(key: string, args?: any[], context?: TranslatorContext) {
        const format = this.getFormat(key, args, context);
        return vsprintf(format, args || []);
    }

    protected getFormat(keyName: string, args?: any[], context?: TranslatorContext) {
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

    protected getContextFormat(keyContext: FormatKeyContext, context: TranslatorContext, args?: any[]) {
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

    protected getFormatValue(value: FormatKeyValue, args?: any[]) {
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
            let min = item[0] === null ? Number.MIN_VALUE : item[0];
            let max = item[1] === null ? Number.MAX_VALUE : item[1];

            if (min <= count && count <= max) {
                return item[2];
            }
        }

        return value[0][2];
    }
}
