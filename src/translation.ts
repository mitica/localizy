
export function parseTranslationData(data: { [index: string]: any }): TranslationKeys {
    return Object.keys(data)
        .reduce<TranslationKeys>((keys, key) => {
            keys[key] = parseTranslationKey(key, data[key])
            return keys;
        }, {});
}

export function simplifyTranslationKeys(data: TranslationKeys): { [index: string]: any } {
    return Object.keys(data)
        .reduce<{ [index: string]: any }>((keys, key) => {
            keys[key] = simplifyKeyValue(data[key].value, data[key].context);
            return keys;
        }, {});
}

export type TranslationKeys = { [key: string]: TranslationKey }

export type TranslationKey = {
    value: TranslationKeyValue
    context?: TranslationKeyContext
}

export type TranslationKeyValue = string | TranslationKeyCountValue[]
export type TranslationKeyCountValue = [number | null, number | null, string]
export type TranslationKeyContext = TranslationKeyContextItem[]
export type TranslationKeyContextItem = { value: TranslationKeyValue, matches: TranslationKeyContextMatches }
export type TranslationKeyContextMatches = { [index: string]: string | number | null | undefined }

function parseTranslationKey(key: string, data: any): TranslationKey {
    if (isValidValue(data)) {
        return {
            value: data as TranslationKeyValue,
        }
    }
    if (!data.value) {
        throw new Error(`Invalid key value: ${key}`);
    }
    if (!isValidValue(data.value)) {
        throw new Error(`Invalid key value: ${key}`);
    }

    const keyData: TranslationKey = {
        value: data.value as TranslationKeyValue,
    }

    if (Array.isArray(data.context)) {
        data.context.forEach((item: any) => {
            if (!isValidValue(item.value)) {
                throw new Error(`Invalid key context value: ${key}`);
            }
            if (!item.matches) {
                throw new Error(`Invalid key context matches`);
            }
        })
        keyData.context = data.context;
    } else if (data.context) {
        throw new Error(`Context is invalid for key: ${key}`);
    }

    return keyData;
}

function isValidValue(value: TranslationKeyValue) {
    return typeof value === 'string' || Array.isArray(value) && value.length > 0;
}

function simplifyKeyValue(value: TranslationKeyValue, context?: TranslationKeyContext) {
    if (context) {
        return {
            value,
            context,
        }
    }
    return value;
}
