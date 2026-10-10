# 🚀 Деплой RONIN на Vercel

## Шаг 1: Подготовка GitHub репозитория

1. Создайте репозиторий на GitHub (если еще не создан)
2. Добавьте remote:
```bash
cd ronin
git remote add origin https://github.com/YOUR_USERNAME/ronin-club.git
git branch -M main
git push -u origin main
```

## Шаг 2: Настройка Vercel

### 1. Создайте аккаунт на Vercel
- Перейдите на https://vercel.com
- Войдите через GitHub

### 2. Импортируйте проект
- Нажмите "Add New" → "Project"
- Выберите ваш репозиторий `ronin-club`
- Framework Preset: **Next.js** (автоматически определится)

### 3. Настройте Environment Variables
Добавьте все переменные из `.env` файла в Vercel:

**Database (обязательно):**
- `DATABASE_URL` - строка подключения к Neon PostgreSQL (с pooler)
- `DIRECT_URL` - прямое подключение к Neon PostgreSQL

**NextAuth (обязательно):**
- `NEXTAUTH_URL` - URL вашего приложения (например: `https://ronin-club.vercel.app`)
- `NEXTAUTH_SECRET` - секретный ключ (сгенерируйте: `openssl rand -base64 32`)

**Google OAuth (обязательно для входа через Google):**
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

**Telegram Bot (обязательно для 2FA админ панели):**
- `TELEGRAM_BOT_TOKEN` - токен вашего Telegram бота

**Контакты (опционально):**
- `CONTACT_PHONE`
- `CONTACT_EMAIL`
- `CONTACT_ADDRESS`
- `INSTAGRAM_URL`
- `TELEGRAM_URL`
- `WHATSAPP_URL`
- `GIS_2_URL`

**FINIK PAY (опционально, для оплаты):**
- `FINIK_ENV`
- `FINIK_API_KEY`
- `FINIK_ACCOUNT_ID`
- `FINIK_PRIVATE_KEY`

### 4. Build Settings
Оставьте по умолчанию:
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

## Шаг 3: Deploy

Нажмите **Deploy** и дождитесь завершения.

## Шаг 4: После деплоя

### 1. Обновите Google OAuth Redirect URIs
В Google Cloud Console (https://console.cloud.google.com) добавьте:
- Authorized JavaScript origins: `https://your-app.vercel.app`
- Authorized redirect URIs: `https://your-app.vercel.app/api/auth/callback/google`

### 2. Обновите NEXTAUTH_URL в Vercel
Если автоматический URL не подошел:
- Settings → Environment Variables
- Обновите `NEXTAUTH_URL` на ваш реальный домен

### 3. Запустите миграции базы данных
В терминале Vercel или локально:
```bash
npx prisma generate
npx prisma db push
```

### 4. Создайте админа
Используйте скрипт:
```bash
node create-admin.js
```
Или выполните SQL из `CREATE_ADMIN.sql` в Neon dashboard.

### 5. Добавьте seed данные (опционально)
```bash
npx prisma db seed
```

## Шаг 5: Настройка домена (опционально)

1. В настройках проекта Vercel → Domains
2. Добавьте свой домен
3. Настройте DNS записи согласно инструкциям Vercel

## 🔧 Полезные команды

### Локальная разработка:
```bash
npm run dev
```

### Проверка production билда:
```bash
npm run build
npm start
```

### Обновление Prisma Client:
```bash
npx prisma generate
```

### Проверка логов на Vercel:
- Откройте проект на Vercel
- Перейдите в Logs

## ⚠️ Важно

1. **Не коммитьте `.env` в git!** (уже в `.gitignore`)
2. Все секретные ключи храните только в Vercel Environment Variables
3. После изменений в схеме Prisma запускайте `npx prisma db push`
4. Telegram Bot должен быть создан через @BotFather
5. Neon PostgreSQL база должна быть создана и доступна

## 📝 Структура Environment Variables в Vercel

Рекомендуем создать 3 окружения:
- **Production** - для основного сайта
- **Preview** - для preview деплоев (pull requests)
- **Development** - для локальной разработки (опционально)

## 🐛 Решение проблем

### Ошибка при билде:
1. Проверьте логи в Vercel
2. Убедитесь что все переменные окружения установлены
3. Проверьте что `DATABASE_URL` и `DIRECT_URL` правильные

### Ошибки Prisma:
```bash
# Очистите кеш и перегенерируйте
rm -rf node_modules .next
npm install
npx prisma generate
```

### 500 Internal Server Error:
1. Проверьте логи в Vercel
2. Убедитесь что база данных доступна
3. Проверьте что `NEXTAUTH_SECRET` установлен

## 📚 Дополнительные ресурсы

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Neon PostgreSQL](https://neon.tech/docs)

## ✅ Чеклист перед деплоем

- [ ] GitHub репозиторий создан и код залит
- [ ] Neon PostgreSQL база данных создана
- [ ] Google OAuth настроен
- [ ] Telegram Bot создан
- [ ] Все Environment Variables добавлены в Vercel
- [ ] `.env` файл НЕ закоммичен в git
- [ ] Prisma schema актуальна
- [ ] Build локально проходит успешно (`npm run build`)

---

После успешного деплоя ваш сайт будет доступен по адресу:
**https://your-project-name.vercel.app**

Enjoy! 🎮🚀
