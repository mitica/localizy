export {
    createDirectoryTranslator,
    DirectoryTranslatorOptions,
    Translator,
    TranslatorOptions,
} from './translator';

export {
    Locales,
    LocalesContext,
    LocalesOptions,
} from './locales';

export {
    generateCode,
    generateFromDirectory,
    GenerateDirecatoryOptions,
    GenerateOptions,
} from './generate/generator';

export {
    parseDirectory,
} from './generate/parser';

// const code = generateCode({ ro: {} });

// writeFileSync('src/code.ts', code, 'utf8');
