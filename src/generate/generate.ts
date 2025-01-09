import program = require("commander");
import { join } from "path";
import {
  DEFAULT_PROVIDER_NAME,
  GenerateDirecatoryOptions,
  generateCode
} from "./generator";
import { writeFileSync } from "fs";
import { TranslationKeys, parseTranslationData } from "../translation";
const p = program.program;
p.version("0.1.0")
  .option("-o, --output <value>", "Output path to directory or file(.ts)")
  .option(
    "-d, --directory <value>",
    "Directory in which are located json files"
  )
  .option("-c, --className [value]", "Class name to be generated")
  .parse(process.argv);
const options = p.opts();
let output: string = options.output || process.cwd();
const directory = options.directory as string;
const className = (options.className as string) || DEFAULT_PROVIDER_NAME;

if (!directory) {
  throw new Error(`--directory is required!`);
}

async function run() {
  if (!output.endsWith(".ts")) {
    output = join(output, className + ".ts");
  }

  console.log(`output: ${output}`);
  console.log(`directory: ${directory}`);
  console.log(`className: ${className}`);

  const code = generateFromDirectory({
    className,
    directory
  });

  writeFileSync(output, code, "utf8");
}

run()
  .then(() => console.log("OK!"))
  .catch((e) => console.trace(e));

function generateFromDirectory(options: GenerateDirecatoryOptions) {
  const { directory, languages } = options;
  const data = parseDirectory({ directory, languages });

  return generateCode(data, options);
}

function parseDirectory(options: { directory: string; languages?: string[] }) {
  const readdirSync = require("fs").readdirSync;
  const join = require("path").join;
  const directory = options.directory;
  const languages = options.languages;
  const files = readdirSync(directory, "utf8");

  const data: { [lang: string]: TranslationKeys } = {};

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

function parseJsonFile(file: string) {
  const readFileSync = require("fs").readFileSync;
  const content = JSON.parse(readFileSync(file, "utf8"));

  return parseTranslationData(content);
}
