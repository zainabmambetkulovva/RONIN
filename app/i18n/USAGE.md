# i18n Usage Guide

Руководство по использованию системы локализации в проекте RONIN.

## Структура файлов

```
app/
├── i18n/
│   ├── config.ts              # Конфигурация (языки, типы страниц)
│   ├── loader.ts              # Загрузчик переводов
│   ├── useLanguage.ts         # React хук для клиента
│   ├── getTranslation.ts      # Утилита для сервера
│   ├── index.ts               # Экспорт
│   ├── locales/
│   │   ├── kg/               # Кыргызские переводы
│   │   │   ├── landing.json
│   │   │   ├── booking.json
│   │   │   ├── profile.json
│   │   │   ├── admin-panel.json
│   │   │   └── common.json
│   │   └── ru/               # Русские переводы
│   │       ├── landing.json
│   │       ├── booking.json
│   │       ├── profile.json
│   │       ├── admin-panel.json
│   │       └── common.json
│   └── USAGE.md              # Этот файл
```

## Поддерживаемые языки

- `kg` - Кыргызский
- `ru` - Русский (по умолчанию)

## Типы страниц

- `landing` - Главная страница
- `booking` - Страница бронирования
- `profile` - Личный профиль
- `admin-panel` - Административная панель
- `common` - Общие переводы (для всех страниц)

## Использование на клиенте (React компоненты)

### Основное использование

```tsx
'use client'

import { useTranslation } from '@/app/i18n/useLanguage'

export function BookingPage() {
  const t = useTranslation('booking')

  return (
    <div>
      <h1>{t('title')}</h1>
      <button>{t('step4.button')}</button>
      <p>{t('errors.networkError')}</p>
    </div>
  )
}
```

### Смена языка

```tsx
'use client'

import { useLanguage } from '@/app/i18n/useLanguage'

export function LanguageSwitcher() {
  const { language, setLanguage, languageName } = useLanguage()

  return (
    <div>
      <p>Текущий язык: {languageName}</p>
      <button onClick={() => setLanguage('kg')}>Кыргызча</button>
      <button onClick={() => setLanguage('ru')}>Русский</button>
    </div>
  )
}
```

### Получение всех данных языка

```tsx
'use client'

import { useLanguage } from '@/app/i18n/useLanguage'

export function UserProfile() {
  const { t, language } = useLanguage()

  return (
    <div>
      <h1>{t('profile', 'title')}</h1>
      <p>{t('common', 'user.name')}</p>
      <p>Язык: {language}</p>
    </div>
  )
}
```

### С интерполяцией переменных

```tsx
const t = useTranslation('common')

// В файле common.json: "validation.minLength": "Минимум {min} символов"
const message = t('validation.minLength', '', { min: 5 })
// Результат: "Минимум 5 символов"
```

## Использование на сервере (Server Components)

### Основное использование

```tsx
import { getTranslation } from '@/app/i18n/getTranslation'

export default function LandingPage() {
  const t = getTranslation('ru', 'landing')

  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.subtitle')}</p>
      <button>{t('booking.button')}</button>
    </div>
  )
}
```

### С параметрами из URL

```tsx
interface Props {
  searchParams?: Record<string, string | string[]>
}

import { getLanguageFromParams, getTranslation } from '@/app/i18n/getTranslation'

export default function Page({ searchParams }: Props) {
  const language = getLanguageFromParams(searchParams, 'ru')
  const t = getTranslation(language, 'landing')

  return <div>{t('hero.title')}</div>
}
```

### Получение всех переводов

```tsx
import { getAllTranslationsForLanguage } from '@/app/i18n/getTranslation'

export default function AdminPage() {
  const allTranslations = getAllTranslationsForLanguage('ru')

  // allTranslations.landing, allTranslations.booking и т.д.
  return <div>{allTranslations.admin-panel.title}</div>
}
```

## Провайдер языка

Оберните ваше приложение в LanguageProvider в root layout:

```tsx
// app/layout.tsx
import { LanguageProvider } from '@/app/i18n/useLanguage'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
```

## Структура JSON файлов

### Простые переводы

```json
{
  "landing": {
    "hero": {
      "title": "RONIN",
      "subtitle": "Современный компьютерный клуб"
    }
  }
}
```

### Использование в коде

```tsx
t('hero.title')  // "RONIN"
t('hero.subtitle')  // "Современный компьютерный клуб"
```

## Добавление новых переводов

1. Добавьте новый JSON файл в `locales/kg/` и `locales/ru/`
2. Обновите `PageType` в `config.ts`
3. Добавьте импорт в `loader.ts`
4. Обновите объект `translations` в `loader.ts`
5. Используйте функции переводов как обычно

Пример:

```typescript
// config.ts
export type PageType = 'landing' | 'booking' | 'profile' | 'admin-panel' | 'common' | 'checkout'

// loader.ts
import kgCheckout from './locales/kg/checkout.json'
import ruCheckout from './locales/ru/checkout.json'

// В объекте translations добавьте:
const translations = {
  kg: {
    checkout: kgCheckout,
    // ...
  },
  ru: {
    checkout: ruCheckout,
    // ...
  },
}
```

## Лучшие практики

1. **Используйте вложенные ключи** для организации переводов:
   ```json
   {
     "auth": {
       "login": {
         "title": "Вход",
         "email": "Email"
       }
     }
   }
   ```

2. **Создавайте смысловые группы**:
   - `buttons.*` - кнопки
   - `messages.*` - сообщения
   - `errors.*` - ошибки
   - `validation.*` - валидация

3. **Используйте интерполяцию для переменных**:
   ```json
   {
     "validation": {
       "minLength": "Минимум {min} символов"
     }
   }
   ```

4. **Не забывайте про common.json** - здесь должны быть общие переводы, используемые на нескольких страницах

5. **Тестируйте оба языка** при разработке новых компонентов

## Типизация

Система полностью типизирована TypeScript:

```tsx
const t = useTranslation('landing')  // Page type checked
const msg = t('hero.title')  // Ключ автодополняется (если используются правильные типы)
```

## Производительность

- Переводы загружаются один раз при импорте
- Они не пересчитываются при изменении языка
- localStorage используется для сохранения выбора языка
- Нет дополнительных сетевых запросов после загрузки приложения
