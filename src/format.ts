
export function parseKeys(data: { [index: string]: any }): FormatKeys {
    return Object.keys(data)
        .reduce<FormatKeys>((keys, key) => {
            keys[key] = parseFormatKey(key, data[key])
            return keys;
        }, {});
}

export function simplifyKeys(data: FormatKeys): { [index: string]: any } {
    return Object.keys(data)
        .reduce<{ [index: string]: any }>((keys, key) => {
            keys[key] = simplifyKeyValue(data[key].value, data[key].context);
            return keys;
        }, {});
}

export type FormatKeys = { [key: string]: FormatKey }

export type FormatKey = {
    value: FormatKeyValue
    context?: FormatKeyContext
}

export type FormatKeyValue = string | FormatKeyCountValue[]
export type FormatKeyCountValue = [number | null, number | null, string]
export type FormatKeyContext = FormatKeyContextItem[]
export type FormatKeyContextItem = { value: FormatKeyValue, matches: FormatKeyContextMatches }
export type FormatKeyContextMatches = { [index: string]: string | number | null | undefined }

function parseFormatKey(key: string, data: any): FormatKey {
    if (isValidValue(data)) {
        return {
            value: data as FormatKeyValue,
        }
    }
    if (!data.value) {
        throw new Error(`Invalid key value: ${key}`);
    }
    if (!isValidValue(data.value)) {
        throw new Error(`Invalid key value: ${key}`);
    }

    const keyData: FormatKey = {
        value: data.value as FormatKeyValue,
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

function isValidValue(value: FormatKeyValue) {
    return typeof value === 'string' || Array.isArray(value) && value.length > 0;
}

function simplifyKeyValue(value: FormatKeyValue, context?: FormatKeyContext) {
    if (context) {
        return {
            value,
            context,
        }
    }
    return value;
}
