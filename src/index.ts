export {
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
    GenerateDirecatoryOptions,
    GenerateOptions,
} from './generate/generator';

export {
    parseTranslationData,
} from './translation';

// const code = generateCode({ ro: {} });

// writeFileSync('src/code.ts', code, 'utf8');
