import { parseKeys } from "./format";
import { readFileSync } from "fs";

export function parseJsonFile(file: string) {
    const content = JSON.parse(readFileSync(file, 'utf8'));

    return parseJsonData(content);
}

export function parseJsonData(data: any) {
    return parseKeys(data);
}
