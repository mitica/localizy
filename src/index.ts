
export {
    createDirectoryProvider,
    DirectoryProviderOptions,
    Provider,
    ProviderOptions,
} from './provider';

export {
    Translator,
    TranslatorContext,
    TranslatorOptions,
} from './translator';

export {
    generateClass,
    generateFromDirectory,
    GenerateDirecatoryOptions,
    GenerateOptions,
} from './generator';

export {
    parseDirectory,
} from './parser';

// const code = generateClass({ro:{hello:{value: 'Hello'}}});

// writeFileSync('src/code.ts', code, 'utf8');
