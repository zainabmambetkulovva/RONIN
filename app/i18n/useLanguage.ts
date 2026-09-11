// useLanguage Hook
// React хук для работы с текущим языком приложения

'use client'

import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import {
  Language,
  PageType,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  LANGUAGE_NAMES,
} from './config'
import { getTranslations, getNestedTranslation, interpolate } from './loader'

/**
 * Контекст языка приложения
 */
interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (page: PageType, key: string, defaultValue?: string, variables?: Record<string, any>) => string
  languageName: string
  isSupported: (lang: string) => boolean
}

// Создание контекста
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

/**
 * Провайдер для передачи контекста языка всему приложению
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE)
  const [mounted, setMounted] = useState(false)

  // Инициализация языка из localStorage при загрузке
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null
    if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      setLanguageState(savedLanguage)
    } else {
      // Попытка определить язык браузера
      const browserLang = navigator.language.split('-')[0] as Language
      if (SUPPORTED_LANGUAGES.includes(browserLang)) {
        setLanguageState(browserLang)
      }
    }
    setMounted(true)
  }, [])

  // Функция для смены языка с сохранением в localStorage
  const setLanguage = useCallback((lang: Language) => {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      setLanguageState(lang)
      localStorage.setItem('language', lang)
      // Обновляем lang атрибут html тега
      document.documentElement.lang = lang
    }
  }, [])

  // Функция переводов
  const t = useCallback(
    (
      page: PageType,
      key: string,
      defaultValue: string = '',
      variables?: Record<string, any>
    ): string => {
      const translations = getTranslations(language, page)
      let text = getNestedTranslation(translations, key, defaultValue)

      // Если перевод не найден, ищем в common
      if (!text && page !== 'common') {
        const commonTranslations = getTranslations(language, 'common')
        text = getNestedTranslation(commonTranslations, key, defaultValue)
      }

      // Заменяем плейсхолдеры переменными если они есть
      if (variables) {
        text = interpolate(text, variables)
      }

      return text || defaultValue
    },
    [language]
  )

  // Функция для проверки поддерживается ли язык
  const isSupported = useCallback(
    (lang: string): boolean => SUPPORTED_LANGUAGES.includes(lang as Language),
    []
  )

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    languageName: LANGUAGE_NAMES[language],
    isSupported,
  }

  // Не рендериме компоненты пока приложение не инициализировалось
  if (!mounted) {
    return null
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

/**
 * Хук для использования языка в компонентах
 * @throws Error если компонент не обернут в LanguageProvider
 */
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

/**
 * Удобный хук для получения функции переводов для конкретной страницы
 * Автоматически передает текущий язык
 */
export function useTranslation(page: PageType) {
  const { t } = useLanguage()

  return useCallback(
    (key: string, defaultValue?: string, variables?: Record<string, any>) => {
      return t(page, key, defaultValue, variables)
    },
    [page, t]
  )
}
