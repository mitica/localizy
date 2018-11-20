import { parseKeys, FormatKeys } from "./format";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

export function parseJsonFile(file: string) {
    const content = JSON.parse(readFileSync(file, 'utf8'));

    return parseJsonData(content);
}

export function parseJsonData(data: any) {
    return parseKeys(data);
}

export function parseDirectory(options: { directory: string, languages?: string[] }) {
    const directory = options.directory;
    const languages = options.languages;
    const files = readdirSync(directory, 'utf8');

    const data: { [lang: string]: FormatKeys } = {};

    for (const fileName of files) {
        if (!/\.json$/.test(fileName)) {
            continue;
        }
        const language = fileName.substr(0, fileName.length - 5);
        if (languages && languages.indexOf(language) < 0) {
            continue;
        }
        const file = join(directory, fileName);
        const keys = parseJsonFile(file);

        data[language] = keys;
    }

    return data;
}