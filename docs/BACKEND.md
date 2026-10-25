# RONIN — архитектура бэкенда

Бэкенд — API-роуты Next.js (App Router) + Prisma/PostgreSQL. Цель структуры: фронтенд
(редизайн, PWA, будущее мобильное приложение) зависит только от **контракта API**, а не от
схемы БД и внутренней логики.

## Слои

```
src/app/api/**/route.ts     тонкие роуты: авторизация → валидация (zod) → сервис → DTO
src/server/http.ts          единый формат ошибок, обёртка handle(), parseJson()
src/server/auth/            сессии и права
  tokens.ts                 подпись/проверка JWT (Edge-safe, используется middleware)
  session.ts                клиентская сессия: getSessionUser(), requireUser()
  staff.ts                  сессия персонала: getStaffUser(), requireStaff(), requireAdmin()
  two-factor.ts             генерация и хэширование 2FA-кодов
src/server/services/        бизнес-логика (без HTTP)
  availability.ts           доступность ПК во времени (общая для брони, AI-чата, 3D-карты)
  bookings.ts               создание (serializable-транзакция), отмена, истечение
  tariffs.ts                схемы валидации тарифов
  users.ts                  изменение собственного профиля
  audit.ts                  журнал действий и уведомления пользователям
src/server/mappers.ts       Prisma (snake_case) → DTO (camelCase)
src/server/config.ts        константы: имена cookie, сроки сессий, удержание брони
src/types/api.ts            контракт API (DTO) — общий для сервера и клиента
src/lib/api-client.ts       типизированный клиент API для браузера
```

Правило: компонент не делает `fetch` к произвольным URL и не знает полей БД — он использует
`api.*` из `src/lib/api-client.ts` и типы из `src/types/api.ts`.

## Формат ответов

- Успех: объект с данными, например `{ booking: BookingDTO }`, `{ tariffs: TariffDTO[], total }`.
- Ошибка: `{ error: string, code: string }` + HTTP-статус.
  Коды: `unauthorized` (401), `forbidden` (403), `not_found` (404), `validation_error` / `bad_request` (400),
  `conflict` / `computer_busy` / `payment_required` / `tariff_in_use` (409), `rate_limited` (429),
  `internal_error` (500). Внутренние сообщения Prisma клиенту не отдаются.
- Даты — ISO 8601, деньги — число в сомах.

## Аутентификация и роли

| Кто | Как входит | Cookie | Проверка в API |
|---|---|---|---|
| Клиент | email+пароль (`/api/auth/login`) или Google (`/api/auth/google`) | `session-token` (httpOnly, 30 дней) | `requireUser()` |
| Менеджер / админ | пароль + Telegram-код (`/api/admin/auth/send-2fa` → `verify-2fa`) | `admin-token` (httpOnly, SameSite=strict, 12 ч) | `requireStaff(req)` / `requireAdmin(req)` |

- Клиентская сессия **не даёт** доступа к API персонала, даже если у пользователя роль admin.
- Роль и статус всегда читаются из БД: блокировка/смена роли действуют сразу.
- `middleware.ts` только перенаправляет страницы (`/admin/*`, `/manager` → вход); права на данные
  проверяются в каждом API-роуте.

### Права (текущая реализация)

| Операция | admin | manager |
|---|---|---|
| Брони: список, поиск, создание для клиента, отмена, смена статуса | ✅ | ✅ |
| Компьютеры: просмотр; статистика | ✅ | ✅ |
| Пользователи, менеджеры, тарифы (изменение) | ✅ | ❌ |

## Бронирование

1. `POST /api/bookings` → бронь `pending`, цена копируется из тарифа (`bookings.price`).
   Правка тарифа не меняет цену существующих броней.
2. Проверка пересечений выполняется внутри serializable-транзакции — двойная бронь исключена.
3. Неоплаченная бронь удерживает ПК `BOOKING_HOLD_MINUTES` (10 мин), затем ПК снова свободен
   (учитывается в запросах сразу; cron `/api/cron/expire-bookings` переводит такие брони в `expired`).
4. `confirmed` — только по подтверждённой оплате (webhook Finik). Персонал не может подтвердить
   бронь без `payment_status = paid`.
5. Отмена и возврат денег — разные операции; возврат не выполняется автоматически.

Компьютер занят в интервале, если пересекается бронь: `confirmed`, или оплаченная (`payment_status = paid`),
или `pending` моложе срока удержания. ПК со статусом `maintenance` недоступен всегда.

## Основные эндпоинты

Публичные: `GET /api/tariffs[?categoryId]`, `GET /api/categories`,
`GET /api/computers[?categoryId&start&durationMinutes]` (поле `availableForSlot`), `GET /api/avatars`.

Клиент: `GET|PATCH /api/user/profile`, `POST /api/user/update-profile`, `PATCH /api/user/avatar`,
`GET|POST /api/bookings`, `GET /api/bookings/[id]` (только своя бронь).

Персонал: `GET|POST /api/admin/bookings`, `GET|PATCH|DELETE /api/admin/bookings/[id]`,
`POST /api/manager/bookings/[id]/cancel`, `GET /api/admin/computers`, `GET /api/admin/stats`,
`GET /api/admin/auth/verify-token`, `POST /api/admin/auth/logout`.

Только admin: `/api/admin/users*`, `/api/admin/managers*`, `GET|POST /api/admin/tariffs`,
`PATCH|DELETE /api/admin/tariffs/[id]`, `PATCH /api/admin/tariffs/[id]/toggle`.

Оплата (Finik, без изменений): `POST /api/finik/create-payment`, `POST /api/finik/webhook`.
Демо-оплата `POST /api/payments` работает только при `ENABLE_DEMO_PAYMENTS=true` и не в production.

## Переменные окружения

`DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_SECRET` (обязательна — без неё сессии не выдаются),
`NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `TELEGRAM_BOT_TOKEN`,
`TELEGRAM_ADMIN_CHAT_ID`, `CRON_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`, `REDIS_URL` (рекомендуется),
`FINIK_*`, `GEMINI_API_KEY`. Значения хранятся только в Vercel / локальном `.env`, не в Git.
