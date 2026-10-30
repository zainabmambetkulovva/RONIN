# 🎮 RONIN Gaming Club

Современный киберспортивный клуб в Бишкеке с онлайн бронированием, AI-помощником и интегрированными платежами.

---

## 🚀 Основные возможности

### Для пользователей
- 🎯 **Онлайн бронирование** - выбор ПК, тарифа и времени
- 💳 **FINIK Pay** - удобная онлайн оплата
- 🤖 **AI Ассистент** (Groq) - помощь с выбором игр и тарифов
- 📱 **Мобильная версия** - адаптивный дизайн
- 🎨 **Киберпанк дизайн** - неоновый стиль, анимации
- 🌐 **Мультиязычность** - русский, кыргызский, английский
- 📊 **Личный профиль** - история бронирований, аватары
- 🎫 **Электронные чеки** - QR-коды для входа

### Для администрации
- 👨‍💼 **Админ панель** - управление ПК, тарифами, пользователями
- 🔐 **2FA авторизация** (Telegram) - безопасный вход
- 📈 **Аналитика** - статистика бронирований, доходов
- 🎮 **Управление играми** - добавление игр и турниров
- 📧 **Уведомления** - Telegram alerts о новых бронированиях
- 🛠️ **Статусы ПК** - мониторинг доступности компьютеров

---

## 🛠️ Технологический стек

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - типизация
- **Tailwind CSS** - стилизация
- **Framer Motion** - анимации
- **i18next** - интернационализация

### Backend
- **Next.js API Routes** - serverless functions
- **Prisma** - ORM для PostgreSQL
- **NextAuth** - аутентификация (credentials + Google OAuth)
- **Neon PostgreSQL** - serverless база данных

### AI & Integrations
- **Groq API** - AI chatbot и рекомендации
- **FINIK Pay API** - платежная система
- **Telegram Bot API** - 2FA и уведомления
- **QR Code** - генерация чеков

---

## 📦 Установка

### 1. Клонировать репозиторий
```bash
git clone <repository-url>
cd ronin
```

### 2. Установить зависимости
```bash
npm install
```

### 3. Настроить переменные окружения
```bash
cp .env.example .env
```

Заполни `.env`:
```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Telegram Bot
TELEGRAM_BOT_TOKEN="..."
TELEGRAM_ADMIN_CHAT_ID="..."

# Groq AI (опционально)
GROQ_API_KEY="..."

# FINIK Pay (опционально)
FINIK_API_KEY="..."
FINIK_ACCOUNT_ID="..."
```

### 4. Настроить базу данных
```bash
# Сгенерировать Prisma Client
npm run db:generate

# Применить миграции
npm run db:push

# Заполнить тестовыми данными
npm run db:seed
```

### 5. Запустить dev сервер
```bash
npm run dev
```

Открой http://localhost:3000

---

## 🤖 AI Integration (Groq)

### Быстрый старт

1. Получи API key: https://console.groq.com/keys
2. Добавь в `.env`:
   ```env
   GROQ_API_KEY="gsk_..."
   ```
3. Готово! API endpoints работают:
   - `/api/ai/chat` - chatbot
   - `/api/ai/recommend-games` - рекомендации игр
   - `/api/ai/suggest-tariff` - подбор тарифа
   - `/api/ai/faq` - FAQ ответы

### Документация
- 📘 [Полная документация](./AI_INTEGRATION.md)
- 🚀 [Быстрый старт](./AI_QUICKSTART.md)
- 📝 [TODO список](./AI_TODO.md)

### Тест API
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Привет!"}]}'
```

---

## 📂 Структура проекта

```
ronin/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed data
├── public/                 # Static files
│   └── Неоновая киберпанк-эмблема R.png
├── src/
│   ├── app/                # Next.js pages & API routes
│   │   ├── api/            # API endpoints
│   │   │   ├── ai/         # 🤖 AI endpoints
│   │   │   ├── auth/       # Auth (NextAuth)
│   │   │   ├── bookings/   # Booking management
│   │   │   ├── finik/      # FINIK Pay integration
│   │   │   └── ...
│   │   ├── admin/          # Admin panel
│   │   ├── dashboard/      # User dashboard
│   │   ├── login/          # Login page
│   │   ├── register/       # Registration
│   │   ├── profile/        # User profile
│   │   ├── booking/        # Booking flow
│   │   └── page.tsx        # Landing page
│   ├── components/         # React components
│   │   ├── sections/       # Page sections
│   │   ├── layout/         # Navbar, Footer
│   │   ├── auth/           # Auth forms
│   │   └── ui/             # UI primitives
│   ├── lib/                # Utilities
│   │   ├── ai.ts           # 🤖 AI service (Groq)
│   │   ├── prisma.ts       # Prisma client
│   │   ├── telegram.ts     # Telegram notifications
│   │   └── finik.ts        # FINIK Pay client
│   └── types/              # TypeScript types
├── .env                    # Environment variables
├── AI_INTEGRATION.md       # 🤖 AI docs
├── AI_QUICKSTART.md        # 🤖 AI quick start
├── AI_TODO.md              # 🤖 AI roadmap
└── package.json
```

---

## 🎨 Дизайн система

### Цвета
- **Primary Blue:** `#3b82f6`
- **Primary Purple:** `#8b5cf6`
- **Accent Pink:** `#ec4899`
- **Background:** `#03030a`
- **Dark:** `#0a0a14`

### Градиенты
```css
/* Синий → Фиолетовый */
background: linear-gradient(90deg, #3b82f6, #8b5cf6);

/* Radial glow */
background: radial-gradient(circle, rgba(59,130,246,0.4), transparent);
```

### Анимации
- Hero: Rotating circles, pulsing logo, particles
- Loading: Spinning rings (1s)
- Booking cards: Glow каждые 2 секунды
- Games carousel: Infinite scroll с hover pause

---

## 📱 Screens

1. **Landing (/)** - Hero, Games, Tariffs, Booking Flow, Contacts
2. **Dashboard (/dashboard)** - Quick actions, Games carousel
3. **Booking (/booking)** - Multi-step booking с категориями ПК
4. **Profile (/profile)** - User info, avatar, stats
5. **Admin (/admin)** - Dashboard, computers, bookings, analytics
6. **Login/Register** - Auth with Google OAuth + 2FA для админов

---

## 🔐 Роли и доступ

### User (client)
- Бронирование ПК
- Просмотр своих чеков
- Редактирование профиля
- AI чатбот

### Manager
- Все что User +
- Просмотр всех бронирований
- Управление статусами ПК
- Telegram 2FA вход

### Admin
- Все что Manager +
- Управление пользователями
- Управление тарифами
- Управление играми
- Аналитика и статистика
- Telegram 2FA вход

---

## 🚀 Deployment

### Vercel (рекомендуется)

1. Push код на GitHub
2. Импортируй проект в Vercel
3. Добавь environment variables из `.env`
4. Deploy!

**Важно:**
- Используй Neon PostgreSQL (serverless)
- Настрой Google OAuth redirect URLs
- Добавь NEXTAUTH_URL production URL

### Документация
- [Vercel Deploy Guide](./VERCEL_DEPLOY.md)

---

## 🧪 Testing

### Manual Testing
```bash
# Test database connection
node test-db.js

# Test booking flow
node test-booking.js

# Check admin creation
node check-data.js
```

### API Testing
Используй Postman коллекцию или cURL:
```bash
# Test AI chat
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'
```

---

## 📚 Документация

- [AI Integration](./AI_INTEGRATION.md) - Groq AI setup & usage
- [AI Quick Start](./AI_QUICKSTART.md) - 5-minute AI guide
- [AI TODO](./AI_TODO.md) - AI features roadmap
- [Telegram Setup](./TELEGRAM_SETUP.md) - Bot configuration
- [Vercel Deploy](./VERCEL_DEPLOY.md) - Production deployment
- [Testing Instructions](./TESTING_INSTRUCTIONS.md) - QA guide

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing`
5. Open Pull Request

---

## 📞 Контакты

**RONIN Gaming Club**
- 📍 г. Бишкек, ул. Горького 130, 2 этаж
- 📱 +996 501 004 700
- 📧 info@ronin.kg
- 📷 Instagram: [@ronin__kg](https://www.instagram.com/ronin__kg)
- 💬 Telegram: [@ronin_support](https://t.me/ronin_support)

---

## 📄 License

Proprietary - © 2024 RONIN Gaming Club

---

## 🎯 Roadmap

### v1.0 (Current) ✅
- [x] Landing page
- [x] Booking система
- [x] FINIK Pay интеграция
- [x] Admin панель
- [x] Google OAuth
- [x] Telegram 2FA
- [x] AI Backend (Groq)

### v1.1 (In Progress) 🚧
- [ ] AI Chatbot Widget (UI)
- [ ] Tariff Helper (AI)
- [ ] Game Recommendations (AI)
- [ ] FAQ Page (AI)

### v1.2 (Planned) 📋
- [ ] Mobile app (React Native)
- [ ] Loyalty program
- [ ] Tournaments system
- [ ] Social features (friends, teams)
- [ ] Voice commands (AI)

### v2.0 (Future) 🔮
- [ ] VR/AR experiences
- [ ] Streaming integration
- [ ] Multi-location support
- [ ] Blockchain loyalty tokens

---

**Made with ❤️ and ⚡ by RONIN Team**
