# ✅ Чеклист деплоя на Vercel

## Перед деплоем

- [ ] Все локальные изменения закоммичены в Git
- [ ] Проект билдится локально без ошибок (`npm run build`)
- [ ] База данных работает (Neon PostgreSQL)
- [ ] Все environment variables записаны

## Шаг 1: Создание проекта на Vercel

1. Откройте https://vercel.com
2. Нажмите "Add New" → "Project"
3. Импортируйте Git репозиторий
4. **Root Directory**: установите `ronin` (если проект в подпапке)
5. **Framework Preset**: Next.js (auto-detected)
6. Не нажимайте Deploy пока!

## Шаг 2: Environment Variables

В настройках проекта добавьте **ВСЕ** переменные из `.env` файла:

### ⚠️ КРИТИЧЕСКИ ВАЖНЫЕ:

```bash
DATABASE_URL="ваш_url_от_neon"
NEXTAUTH_URL="https://your-domain.vercel.app"  # ЗАМЕНИТЕ!
NEXTAUTH_SECRET="2a3/JO8FlzMH7txi7s4tPOFQ7wX5inZ6eoZqQG1Qcsk="
```

### Остальные переменные:
Скопируйте из `.env` все переменные (смотрите VERCEL_SETUP.md)

## Шаг 3: Build Settings

Vercel должен автоматически определить:
- Build Command: `npm run build` ✅
- Output Directory: `.next` ✅
- Install Command: `npm install` ✅

Если нет - установите вручную.

## Шаг 4: Deploy!

1. Нажмите "Deploy"
2. Ждите 2-5 минут
3. Если ошибка - читайте Build Logs

## Шаг 5: После успешного деплоя

### 1. Обновите Google OAuth
- Откройте https://console.cloud.google.com
- Ваш проект → Credentials → OAuth 2.0 Client IDs
- Добавьте Authorized redirect URIs:
  ```
  https://your-domain.vercel.app/api/auth/callback/google
  ```

### 2. Обновите NEXTAUTH_URL
- Vercel Dashboard → Settings → Environment Variables
- Измените `NEXTAUTH_URL` на реальный домен
- Redeploy

### 3. Запустите миграции (если нужно)
```bash
# Через Vercel CLI или через API
npx prisma migrate deploy
```

### 4. Добавьте аватары в БД
Выполните SQL из `add-avatars.sql` через Prisma Studio или Neon console

## Шаг 6: Тестирование

Проверьте все функции:

- [ ] Главная страница загружается
- [ ] Hero анимация работает (фразы меняются полностью)
- [ ] Регистрация/вход работает
- [ ] Google OAuth работает
- [ ] Страница профиля открывается
- [ ] Выбор аватара работает (8 персонажей без пустых карточек)
- [ ] Бронирование работает
- [ ] AI чат показывает ошибку (пока нет ключа) с контактами
- [ ] Оплата FINIK работает
- [ ] Переключение языка работает (RU/EN/KY)
- [ ] Мобильная версия работает

## Распространенные ошибки

### "MODULE_NOT_FOUND: @prisma/client"
**Решение**: `postinstall` скрипт уже добавлен в package.json

### "NEXTAUTH_URL is not defined"
**Решение**: Добавьте env var в Vercel

### "Failed to connect to database"
**Решение**: Проверьте DATABASE_URL в Vercel env vars

### "Build timeout"
**Решение**: Оптимизируйте build:
- Удалите неиспользуемые зависимости
- Проверьте размер node_modules
- Возможно нужен Pro план Vercel

### Изображения аватаров не загружаются
**Решение**: Уже исправлено - используются URL-encoded пути

## Важные заметки

1. **AI чат не работает** пока не получите новый GEMINI_API_KEY:
   - Откройте https://aistudio.google.com/apikey
   - Создайте новый ключ (начинается с "AIza...")
   - Добавьте в Vercel Environment Variables
   - Redeploy

2. **Admin 2FA** требует правильные:
   - TELEGRAM_BOT_TOKEN
   - TELEGRAM_ADMIN_CHAT_ID
   
3. **Forgot password** требует:
   - Реальный RESEND_API_KEY

4. **Первый деплой может занять 5-10 минут** - это нормально

## После успешного деплоя

- [ ] Сделайте screenshot рабочего сайта
- [ ] Протестируйте на мобильном
- [ ] Настройте custom domain (опционально)
- [ ] Включите Vercel Analytics
- [ ] Настройте мониторинг ошибок (Sentry)

## Поддержка

Если что-то не работает:
1. Проверьте Build Logs в Vercel
2. Проверьте Runtime Logs в Vercel Functions
3. Проверьте Browser Console на ошибки
4. Все env vars установлены?

---

**Удачи с деплоем! 🚀**
