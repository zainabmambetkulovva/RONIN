# Vercel Deployment Setup для RONIN Gaming Club

## 1. Environment Variables (обязательно!)

В Vercel Dashboard → Settings → Environment Variables добавьте:

```bash
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:npg_WdI8regtZC2G@ep-billowing-bird-b5l08v6w-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
DIRECT_URL="postgresql://neondb_owner:npg_WdI8regtZC2G@ep-billowing-bird-b5l08v6w.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require"

# NextAuth
NEXTAUTH_URL="https://your-vercel-domain.vercel.app"  # ВАЖНО: замените на ваш домен!
NEXTAUTH_SECRET="2a3/JO8FlzMH7txi7s4tPOFQ7wX5inZ6eoZqQG1Qcsk="

# Google OAuth (получите на https://console.cloud.google.com)
GOOGLE_CLIENT_ID="your_google_client_id_here"
GOOGLE_CLIENT_SECRET="your_google_client_secret_here"

# Resend Email API (получите на https://resend.com)
RESEND_API_KEY="your_resend_api_key_here"
EMAIL_FROM="noreply@ronin.kg"

# Telegram Bot для 2FA
TELEGRAM_BOT_TOKEN="8824394948:AAE7yJ-Ync30pXVHZo7AOyjDD_1ad_TPc0s"
TELEGRAM_ADMIN_CHAT_ID="7510511621"

# Контакты RONIN
CONTACT_PHONE="+996501004700"
CONTACT_EMAIL="info@ronin.kg"
CONTACT_ADDRESS="г. Бишкек, ул. Горького 130, 2 этаж"
INSTAGRAM_URL="https://www.instagram.com/ronin__kg"
TELEGRAM_URL="https://t.me/ronin_support"
WHATSAPP_URL="https://wa.me/996501004700"
GIS_2_URL="https://2gis.kg/bishkek/geo/70000001083373538"

# Gemini AI (ПОЛУЧИТЕ НОВЫЙ КЛЮЧ!)
# Старый ключ неправильный - получите на https://aistudio.google.com/apikey
GEMINI_API_KEY="AIza..."  # Замените на реальный ключ, начинается с AIza

# FINIK PAY
FINIK_ENV="prod"
FINIK_API_KEY="WWeYjjsYE93LxEG5dI9Ce49zq5PD67yR7JfO51gC"
FINIK_ACCOUNT_ID="aadda212-e6ae-441f-8c9f-41e155849209"
FINIK_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDD+HWgsnEBicy4
ltZQfMWqMWIss4mzzTOg1baoy6p2uXQaE+8rxBd49Qfct9e/SdAhoHapkn6prm4Z
vz95XzXXU7HMn6mQpzd9H7Ob9BTVfVXJzym4VsQj7Ugo5ZeaBK9xcaNKnCEV6XrH
bLp82oAByiznNM7QxCRJR2aCfUnwJykakw8WKRr23SOLRv9lYYh7eC2U2jeV7fVX
mSDv5PPKqjHsLELYSwWS6FbPcE412R5GcvZKpSNDWgGoosL7L0ftjr+iQqILvdXA
9uxUXzsDR1fH8yT6f0vhtewkVBhWYEUgQlmYWLc8QvLTcWiCIOAMwJyC2ynkuzha
EoFv3rxPAgMBAAECggEAJJgq7v0jWRQwZG/WSWVjS+q42HwWRLsW3vvJhi+x/0WW
RqBeUx/k+jNXaoHyCchw0zaxseynNmxaJvitk66R0UnRs9JEybxQAk9/LKohkdQ7
xtmmgsPBEKxogyqMarhhQp/jzDTngL3+rWrCUDpFGRB13h7gV9+onv50R/25Zty0
5BGclakp/6RD7ftqCSnNvkZBHuoI17BTWkLyyC86ZMStZ8XXTqmTuEX/lggic16X
wxaQrBbwYhgQETnXsTb+OoXa/SqcM2vOxo3TDySoOEGInASW8/ZSGi9emKiY695J
AU4p31+KlEEh6oGh4udbQrNVBR8uVwVlPs19klXe4QKBgQD9yLu6/6kApWCvI4Sl
GFcS4qldfUpKJzxNkgb980CXL0PPJ/gKhWFhGU1hBEOymh2TLIewIs8ZrFyr179y
TXXG9vhTyouTxdjAxKD4NdxCOJBhg3+K712jNAZO4N0jA70a+Uk07w/rrOxvyt7T
QEssd1DfUBMz2SE7SCVt8PjQ5wKBgQDFrn/VdnrBOw5ZVOeLnVRIU+cMkFI5HwMX
C67mDHTH9emf4Xa31Qx8EE7HL8w/U5V9bWB21w6iBZjW8IS+mpdAQG2Oi79lABGi
WFKSqSo/xR0cDjSzV+AkFjSjqfthgNeGtDtjYmzGoJ9jXtmHu43dNdOmw6h4HK0v
pY2YtUGEWQKBgHLku8jvEa4PMPRZWiX8HP+Zyh9fJ5DmrnBX2f6CcA2CAmr4p1zs
AagZ8mQnsBZdm2IT2OIvAB+ZXuMVa8DtvJJ1IPueSQ5/lZ+/5Tg5+huozAS5qbZW
o8fNN8XiG3tMqAJcNX5XdJe309rQt4xgIShiZCSVdfwVIuxZv0hEvgClAoGBAIoC
a6jh0I265yeiyQyFyGO+f94bm+vZJNUgCPj+1UENBA/k3nc1PEQZNoaFbjj/56vr
gp81QTgIZE4bGPHhB5uJ33LXScX/qFAJDYzqoV5oBQyjNlPHE+rdvd5NO/00cEPQ
7G1UN9DsLpq3i3LhlAdOHvecPa+thZNwJ0znrlfxAoGANRfxytCwZJnZV8y/yZP/
8kLgnOGTVONSd2SCWO4pumRzr8CzN5z7M3ynE/bMTwY+Oso+cSyGKf0rP4MIiiBV
/5oho4fsEeqE8uOsPdq+ELtfCZE3F8vTbAq1uvYaYbDvKVk50k9g0IYfw7oHuLVB
0cbq6guU56pcZg8tjvWbXWo=
-----END PRIVATE KEY-----"
```

## 2. Важные настройки Vercel

### Build Settings
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Root Directory
- Установите: `ronin` (если проект в подпапке)

## 3. Исправления для Vercel

### ✅ Уже исправлено:
- ✅ Убран `Metadata` из client component layout.tsx
- ✅ Отключен `reactStrictMode` для избежания двойных рендеров
- ✅ Добавлена поддержка serverless functions для Prisma
- ✅ URL-encoded кириллические имена файлов аватаров
- ✅ Исправлен avatar API (findFirst вместо findUnique)

### ⚠️ Требует внимания:

1. **Google OAuth Redirect URI**
   - В Google Console добавьте: `https://your-domain.vercel.app/api/auth/callback/google`

2. **NEXTAUTH_URL**
   - Обязательно установите production URL в Vercel env vars

3. **Database Migration**
   ```bash
   # После первого деплоя на Vercel, выполните:
   npx prisma migrate deploy
   
   # Или добавьте аватары:
   npx prisma db execute --file add-avatars.sql
   ```

4. **Кириллические файлы**
   - Все аватары с кириллицей URL-encoded в базе
   - Next.js Image component поддерживает encoded URLs

## 4. Проверка после деплоя

1. **Тест API endpoints**:
   - https://your-domain.vercel.app/api/avatars
   - https://your-domain.vercel.app/api/tariffs
   - https://your-domain.vercel.app/api/auth/session

2. **Тест функционала**:
   - ✅ Регистрация/вход
   - ✅ Выбор аватара
   - ✅ Бронирование
   - ✅ Оплата FINIK
   - ⚠️ AI чат (требует новый GEMINI_API_KEY)

## 5. Распространенные ошибки

### Error: MODULE_NOT_FOUND
**Решение**: Проверьте, что все зависимости в `package.json`

### Error: NEXTAUTH_URL not set
**Решение**: Добавьте env var в Vercel

### Error: Database connection failed
**Решение**: Проверьте DATABASE_URL и используйте connection pooler URL

### Error: API timeout
**Решение**: Vercel Hobby plan имеет 10s timeout для serverless functions
- Оптимизируйте медленные запросы
- Используйте индексы в базе данных
- Для длительных операций используйте Vercel Cron Jobs

## 6. Оптимизация для Production

1. **Добавьте кэширование**:
   ```typescript
   export const revalidate = 60; // ISR каждые 60 секунд
   ```

2. **Оптимизируйте изображения**:
   - Все изображения через Next.js Image
   - WebP формат где возможно
   - Правильные sizes prop

3. **Мониторинг**:
   - Vercel Analytics
   - Vercel Speed Insights
   - Error tracking (Sentry)

## 7. После успешного деплоя

- [ ] Обновите NEXTAUTH_URL в Google Console
- [ ] Выполните database migration
- [ ] Добавьте аватары через SQL
- [ ] Получите новый GEMINI_API_KEY
- [ ] Протестируйте все функции
- [ ] Настройте custom domain (опционально)

## Полезные команды

```bash
# Локальный билд для проверки
npm run build

# Проверка Prisma
npx prisma generate
npx prisma db push

# Логи Vercel
vercel logs [deployment-url]
```

## Поддержка

При проблемах с деплоем:
1. Проверьте Vercel Build Logs
2. Проверьте Runtime Logs в Vercel Dashboard
3. Проверьте все environment variables установлены
