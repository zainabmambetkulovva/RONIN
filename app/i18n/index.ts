// i18n Index
// Экспорт всех i18n утилит и типов

export type { Language, PageType, TranslationKeys } from './config'

export { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, LANGUAGE_NAMES } from './config'

export { getTranslations, getAllTranslations, getNestedTranslation, interpolate } from './loader'
