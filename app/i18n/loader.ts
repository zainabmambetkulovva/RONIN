// Translation Loader
// Загрузчик переводов из JSON файлов

import { Language, PageType } from './config'

// Импортируем переводы
import kgLanding from './locales/kg/landing.json'
import ruLanding from './locales/ru/landing.json'

import kgBooking from './locales/kg/booking.json'
import ruBooking from './locales/ru/booking.json'

import kgProfile from './locales/kg/profile.json'
import ruProfile from './locales/ru/profile.json'

import kgAdminPanel from './locales/kg/admin-panel.json'
import ruAdminPanel from './locales/ru/admin-panel.json'

import kgCommon from './locales/kg/common.json'
import ruCommon from './locales/ru/common.json'

/**
 * Объект со всеми переводами
 * Структура: translations[язык][страница]
 */
const translations = {
  kg: {
    landing: kgLanding,
    booking: kgBooking,
    profile: kgProfile,
    'admin-panel': kgAdminPanel,
    common: kgCommon,
  },
  ru: {
    landing: ruLanding,
    booking: ruBooking,
    profile: ruProfile,
    'admin-panel': ruAdminPanel,
    common: ruCommon,
  },
}

/**
 * Получить переводы для конкретной страницы и языка
 * @param language - Язык (kg, ru)
 * @param page - Страница (landing, booking, profile, admin-panel, common)
 * @returns Объект с переводами
 */
export function getTranslations(language: Language, page: PageType): Record<string, any> {
  return translations[language]?.[page] || {}
}

/**
 * Получить все переводы для языка
 * @param language - Язык (kg, ru)
 * @returns Объект со всеми переводами для этого языка
 */
export function getAllTranslations(language: Language): Record<string, any> {
  return translations[language] || {}
}

/**
 * Получить значение из цепочки ключей
 * Пример: t('auth.login') из объекта { auth: { login: 'Вход' } }
 * @param obj - Объект с переводами
 * @param path - Путь через точку (auth.login)
 * @returns Значение или пустая строка если не найдено
 */
export function getNestedTranslation(
  obj: Record<string, any>,
  path: string,
  defaultValue: string = ''
): string {
  return path.split('.').reduce((current: any, prop: string) => {
    return current?.[prop] ?? defaultValue
  }, obj)
}

/**
 * Заменить плейсхолдеры в строке переводом
 * Пример: t('validation.minLength', { min: 5 }) вернет 'Минимум 5 символов'
 * @param text - Текст с плейсхолдерами типа {ключ}
 * @param variables - Объект с переменными
 * @returns Строка с подставленными значениями
 */
export function interpolate(text: string, variables: Record<string, any> = {}): string {
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return String(variables[key] ?? match)
  })
}
