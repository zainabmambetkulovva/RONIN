// getTranslation Server-Side Utility
// Утилита для получения переводов на сервере (для использования в RSC)

import { Language, PageType, DEFAULT_LANGUAGE } from './config'
import { getTranslations, getNestedTranslation, interpolate } from './loader'

/**
 * Получить функцию переводов для конкретного языка и страницы (серверная функция)
 * Используется в Server Components
 *
 * @param language - Язык (kg, ru)
 * @param page - Страница (landing, booking, profile, admin-panel, common)
 * @returns Функция для получения переводов
 */
export function getTranslation(language: Language, page: PageType) {
  const translations = getTranslations(language, page)

  /**
   * Функция переводов
   * @param key - Ключ перевода (поддерживает вложенные ключи через точку: auth.login)
   * @param defaultValue - Значение по умолчанию если перевод не найден
   * @param variables - Переменные для интерполяции
   */
  function t(key: string, defaultValue: string = '', variables?: Record<string, any>): string {
    let text = getNestedTranslation(translations, key, '')

    // Если перевод не найден, ищем в common
    if (!text && page !== 'common') {
      const commonTranslations = getTranslations(language, 'common')
      text = getNestedTranslation(commonTranslations, key, '')
    }

    // Используем значение по умолчанию если перевод не найден
    if (!text) {
      text = defaultValue
    }

    // Интерполируем переменные
    if (variables && text) {
      text = interpolate(text, variables)
    }

    return text
  }

  return t
}

/**
 * Получить объект функций переводов для всех поддерживаемых языков
 * Используется для быстрого доступа ко всем переводам
 */
export function getTranslationForAllLanguages(page: PageType) {
  return {
    kg: getTranslation('kg', page),
    ru: getTranslation('ru', page),
  }
}

/**
 * Получить все переводы для конкретного языка
 * Используется для передачи в клиентские компоненты
 */
export function getAllTranslationsForLanguage(language: Language) {
  const result: Record<PageType, Record<string, any>> = {
    landing: getTranslations(language, 'landing'),
    booking: getTranslations(language, 'booking'),
    profile: getTranslations(language, 'profile'),
    'admin-panel': getTranslations(language, 'admin-panel'),
    common: getTranslations(language, 'common'),
  }

  return result
}

/**
 * Получить язык из searchParams (для Page компонентов)
 * @param searchParams - searchParams из Page props
 * @param defaultLang - Язык по умолчанию
 */
export function getLanguageFromParams(
  searchParams?: Record<string, string | string[]>,
  defaultLang: Language = DEFAULT_LANGUAGE
): Language {
  if (!searchParams) return defaultLang

  const lang = searchParams.lang
  if (typeof lang === 'string') {
    return lang === 'kg' ? 'kg' : 'ru'
  }

  return defaultLang
}
