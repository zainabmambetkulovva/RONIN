# Инструкции по тестированию исправлений

## Запуск сервера

```bash
cd ronin
npm run dev
```

## Что было исправлено

### 1. Prisma модели (snake_case)
- ✅ `prisma.computer` → `prisma.computers`
- ✅ `prisma.booking` → `prisma.bookings`  
- ✅ `prisma.user` → `prisma.users`
- ✅ `prisma.tariff` → `prisma.tariffs`
- ✅ `prisma.auditLog` → `prisma.audit_logs`
- ✅ `prisma.notification` → `prisma.notifications`

### 2. Поля базы данных (snake_case)
- ✅ `startAt` → `start_at`
- ✅ `endAt` → `end_at`
- ✅ `createdAt` → `created_at`
- ✅ `updatedAt` → `updated_at`
- ✅ `isActive` → `is_active`
- ✅ `userId` → `user_id`
- ✅ И другие поля...

### 3. Трансформация данных
- ✅ API автоматически преобразует snake_case → camelCase для фронтенда
- ✅ Prisma работает с snake_case из схемы БД
- ✅ React компоненты получают привычный camelCase

### 4. Статистика Dashboard
Добавлена статистика за сегодня:
- ✅ **Клиенты сегодня** - количество новых регистраций за сегодня
- ✅ **Играют сейчас** - активные игровые сессии в данный момент
- ✅ **Забронировали** - количество бронирований на сегодня

## Страницы для тестирования

### 1. Dashboard (`/admin`)
- Проверьте карточки статистики
- **Клиенты сегодня** - должно показывать новые регистрации
- **Играют сейчас** - активные сессии
- **Забронировали** - бронирования за день
- Upcoming Bookings - ближайшие бронирования
- Recent Users - последние регистрации

### 2. Компьютеры (`/admin/computers`)
- Список всех компьютеров
- Статусы: Доступен / Занят / Ремонт
- Hover для деталей бронирования

### 3. Бронирования (`/admin/bookings`)
- Список всех бронирований
- Фильтры по статусу
- Поиск по номеру/коду/имени

### 4. Пользователи (`/admin/users`)
- Список пользователей
- **Добавить пользователя** - должно работать без ошибок
- Блокировка/разблокировка пользователей
- Удаление пользователей

## Файлы которые были изменены

### API Routes:
- ✅ `src/app/api/admin/users/route.ts`
- ✅ `src/app/api/admin/users/[id]/route.ts`
- ✅ `src/app/api/admin/users/[id]/status/route.ts`
- ✅ `src/app/api/admin/stats/route.ts`

### Admin Pages:
- ✅ `src/app/admin/page.tsx` (Dashboard)
- ✅ `src/app/admin/computers/page.tsx`
- ✅ `src/app/admin/bookings/page.tsx`

### Components:
- ✅ `src/components/admin/AdminHeader.tsx`

## Ожидаемые результаты

### ✅ Страница Компьютеры
- Должна загружаться без ошибки `Cannot read properties of undefined (reading 'findMany')`
- Показывать список компьютеров с правильными статусами

### ✅ Страница Бронирования  
- Должна загружаться корректно
- Показывать бронирования с данными пользователей и компьютеров

### ✅ Страница Пользователи
- Добавление пользователя должно работать
- Список пользователей должен отображаться

### ✅ Dashboard
- Статистика отображается корректно
- Показывает:
  - Сколько клиентов зарегистрировались сегодня
  - Сколько сейчас играют (активных сессий)
  - Сколько забронировали на сегодня

## Если возникнут ошибки

1. **"Cannot read properties of undefined"**
   - Убедитесь что Prisma Client сгенерирован: `npx prisma generate`
   
2. **Ошибки в полях**
   - Проверьте что используете правильные имена полей (snake_case в Prisma)
   
3. **Пустая статистика**
   - Убедитесь что в БД есть тестовые данные

## Telegram 2FA

Email: admin@ronin.kg
Telegram Chat ID: 7510511621

Коды должны приходить в Telegram бот после ввода email на странице входа.
