// i18n Configuration
// Поддерживаемые языки: кыргызский (kg) и русский (ru)

export type Language = 'kg' | 'ru'

export const DEFAULT_LANGUAGE: Language = 'ru'
export const SUPPORTED_LANGUAGES: Language[] = ['kg', 'ru']

export const LANGUAGE_NAMES: Record<Language, string> = {
  kg: 'Кыргызча',
  ru: 'Русский',
}

/**
 * Типы страниц, для которых есть переводы
 */
export type PageType = 'landing' | 'booking' | 'profile' | 'admin-panel' | 'common'

/**
 * Структура всех доступных переводов
 */
export interface TranslationKeys {
  landing: Record<string, any>
  booking: Record<string, any>
  profile: Record<string, any>
  'admin-panel': Record<string, any>
  common: Record<string, any>
}
