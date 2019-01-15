import program = require('commander');
import { join } from 'path';
import { generateFromDirectory, DEFAULT_PROVIDER_NAME } from './generator';
import { writeFileSync } from 'fs';

program
    .version('0.1.0')
    .option('-o, --output <value>', 'Output path to directory or file(.ts)')
    .option('-d, --directory <value>', 'Directory in which are located json files')
    .option('-c, --className [value]', 'Class name to be generated')
    .parse(process.argv);

let output: string = program.output || process.cwd();
const directory = program.directory as string;
const className = program.className as string || DEFAULT_PROVIDER_NAME;

if (!directory) {
    throw new Error(`--directory is required!`);
}

async function run() {

    if (!output.endsWith('.ts')) {
        output = join(output, className + '.ts');
    }

    console.log(`output: ${output}`);
    console.log(`directory: ${directory}`);
    console.log(`className: ${className}`);

    const code = generateFromDirectory({
        className,
        directory,
    });

    writeFileSync(output, code, 'utf8');
}

run()
    .then(() => console.log('OK!'))
    .catch(e => console.trace(e));
