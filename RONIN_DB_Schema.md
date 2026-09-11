# RONIN — Схема базы данных

**Проект:** RONIN  
**Тип:** компьютерный клуб  
**Локация:** Бишкек, Кыргызстан  
**Филиалов:** 1  
**Количество компьютеров:** 96  
**СУБД:** PostgreSQL  
**Cache:** Redis  
**Storage:** S3  

---

# 1. Обозначения

- `★ PK` — Primary Key, уникальный идентификатор записи.
- `▲ FK` — Foreign Key, связь с другой таблицей.
- `■ REQUIRED` — обязательное поле.
- `○ NULL` — необязательное поле.

---

# 2. Типы данных

| Тип | Описание |
|---|---|
| `UUID` | Уникальный идентификатор |
| `VARCHAR(n)` | Короткий текст ограниченной длины |
| `TEXT` | Длинный текст |
| `INT` | Целое число |
| `DECIMAL(10,2)` | Число с точностью, используется для цены |
| `BOOLEAN` | `true / false` |
| `TIMESTAMP` | Дата и время |
| `JSONB` | Структурированные данные в JSON |
| `ENUM` | Значение из заранее заданного списка |

---

# 3. ENUM

## user_role_enum

- `client`
- `manager`
- `admin`

## user_status_enum

- `active`
- `blocked`
- `deleted`

## otp_type_enum

- `registration`
- `login`

## computer_status_enum

- `available`
- `maintenance`

> Состояние `playing` не хранится в `computers`. Оно определяется активной игровой сессией.

## tariff_type_enum

- `hourly`
- `package`
- `night`
- `morning`

## booking_status_enum

- `pending`
- `confirmed`
- `cancelled`
- `completed`
- `expired`

## payment_method_enum

- `electronic_wallet`
- `cash`

## payment_status_enum

- `pending`
- `paid`
- `failed`
- `refunded`

## gaming_session_status_enum

- `active`
- `completed`
- `expired`

## ai_provider_enum

- `openai`
- `gemini`

## ai_role_enum

- `user`
- `assistant`

## content_type_enum

- `banner`
- `text`
- `image`

---

# 4. Таблица `users`

Хранит клиентов, менеджеров и администраторов.

| Поле | Тип | Описание |
|---|---|---|
| ★ `id` | UUID | Уникальный ID пользователя |
| ■ `name` | VARCHAR(100) | Имя пользователя |
| ■ `phone` | VARCHAR(20) | Номер телефона |
| ○ `email` | VARCHAR(255) | Email |
| ■ `role` | ENUM | Роль пользователя |
| ■ `status` | ENUM | Статус аккаунта |
| ■ `created_at` | TIMESTAMP | Дата создания |
| ■ `updated_at` | TIMESTAMP | Дата изменения |

---

# 5. Таблица `otp_codes`

Хранит одноразовые коды для регистрации и входа.

| Поле | Тип | Описание |
|---|---|---|
| ★ `id` | UUID | Уникальный ID |
| ▲ `user_id` | UUID | Пользователь |
| ■ `destination` | VARCHAR(255) | Телефон или другой адрес получения OTP |
| ■ `code_hash` | VARCHAR(255) | Хэш OTP-кода |
| ■ `type` | ENUM | Тип OTP |
| ■ `expires_at` | TIMESTAMP | Срок действия кода |
| ■ `attempts` | INT | Количество попыток |
| ○ `used_at` | TIMESTAMP | Время использования |
| ■ `created_at` | TIMESTAMP | Дата создания |

**FK:**

`user_id → users.id`

---

# 6. Таблица `sessions`

Хранит активные пользовательские сессии.

| Поле | Тип | Описание |
|---|---|---|
| ★ `id` | UUID | Уникальный ID сессии |
| ▲ `user_id` | UUID | Пользователь |
| ■ `token_hash` | VARCHAR(255) | Хэш токена |
| ■ `expires_at` | TIMESTAMP | Срок действия |
| ○ `revoked_at` | TIMESTAMP | Время отзыва сессии |
| ■ `created_at` | TIMESTAMP | Дата создания |

**FK:**

`user_id → users.id`

---

# 7. Таблица `computer_categories`

Хранит категории игровых компьютеров.

Примеры: Comfort, Standard, Premium, Ronin Rooms.

| Поле | Тип | Описание |
|---|---|---|
| ★ `id` | UUID | Уникальный ID категории |
| ■ `name` | VARCHAR(100) | Название категории |
| ■ `description` | TEXT | Описание |
| ○ `image_url` | TEXT | Изображение категории |
| ■ `is_active` | BOOLEAN | Активна ли категория |
| ■ `created_at` | TIMESTAMP | Дата создания |
| ■ `updated_at` | TIMESTAMP | Дата изменения |

---

# 8. Таблица `computers`

Хранит информацию о 96 компьютерах клуба.

| Поле | Тип | Описание |
|---|---|---|
| ★ `id` | UUID | Уникальный ID компьютера |
| ▲ `category_id` | UUID | Категория компьютера |
| ■ `number` | INT | Номер компьютера |
| ■ `specifications` | JSONB | Характеристики компьютера |
| ○ `image_url` | TEXT | Фото компьютера |
| ■ `status` | ENUM | Статус компьютера |
| ■ `created_at` | TIMESTAMP | Дата создания |
| ■ `updated_at` | TIMESTAMP | Дата изменения |

**FK:**

`category_id → computer_categories.id`

**Статусы:**

- 🟢 `available` — свободен
- ⚫ `maintenance` — на обслуживании
- 🔴 `playing` — отображается по активной записи в `gaming_sessions`

---

# 9. Таблица `tariffs`

Хранит тарифы клуба.

| Поле | Тип | Описание |
|---|---|---|
| ★ `id` | UUID | Уникальный ID тарифа |
| ▲ `category_id` | UUID | Категория компьютера |
| ■ `name` | VARCHAR(100) | Название тарифа |
| ■ `duration_minutes` | INT | Продолжительность в минутах |
| ■ `price` | DECIMAL(10,2) | Стоимость |
| ■ `type` | ENUM | Тип тарифа |
| ■ `is_active` | BOOLEAN | Активен ли тариф |
| ■ `created_at` | TIMESTAMP | Дата создания |
| ■ `updated_at` | TIMESTAMP | Дата изменения |

**FK:**

`category_id → computer_categories.id`

### Примеры тарифов

- 1 час — 120 сом
- 3 часа — 300 сом
- 5 часов — 500 сом
- Ночной пакет — 600 сом
- Утренний пакет — 300 сом

Менеджер и администратор могут создавать, изменять, отключать и удалять тарифы.

---

# 10. Таблица `bookings`

Основная таблица бронирований.

| Поле | Тип | Описание |
|---|---|---|
| ★ `id` | UUID | Уникальный ID бронирования |
| ■ `booking_number` | VARCHAR(30) | Номер бронирования |
| ▲ `user_id` | UUID | Клиент |
| ▲ `computer_id` | UUID | Забронированный компьютер |
| ▲ `tariff_id` | UUID | Выбранный тариф |
| ■ `start_at` | TIMESTAMP | Начало бронирования |
| ■ `end_at` | TIMESTAMP | Окончание бронирования |
| ■ `duration_minutes` | INT | Продолжительность |
| ■ `price` | DECIMAL(10,2) | Цена на момент бронирования |
| ■ `status` | ENUM | Статус бронирования |
| ■ `qr_token` | VARCHAR(255) | Код для проверки чека |
| ■ `created_at` | TIMESTAMP | Дата создания |
| ■ `updated_at` | TIMESTAMP | Дата изменения |

**FK:**

- `user_id → users.id`
- `computer_id → computers.id`
- `tariff_id → tariffs.id`

> `price` сохраняется отдельно, чтобы изменение тарифа в будущем не изменило стоимость уже созданного бронирования.

---

# 11. Таблица `payments`

Хранит информацию об оплате бронирования.

| Поле | Тип | Описание |
|---|---|---|
| ★ `id` | UUID | Уникальный ID платежа |
| ▲ `booking_id` | UUID | Бронирование |
| ■ `amount` | DECIMAL(10,2) | Сумма оплаты |
| ■ `method` | ENUM | Способ оплаты |
| ■ `status` | ENUM | Статус платежа |
| ○ `provider` | VARCHAR(100) | Платёжный сервис |
| ○ `transaction_id` | VARCHAR(255) | ID транзакции |
| ○ `paid_at` | TIMESTAMP | Время оплаты |
| ○ `refunded_at` | TIMESTAMP | Время возврата |
| ■ `created_at` | TIMESTAMP | Дата создания |

**FK:**

`booking_id → bookings.id`

### Способы оплаты

- `electronic_wallet`
- `cash`

Онлайн-бронирование подтверждается только после успешной оплаты.

---

# 12. Таблица `gaming_sessions`

Хранит игровые сессии клиентов.

| Поле | Тип | Описание |
|---|---|---|
| ★ `id` | UUID | Уникальный ID сессии |
| ▲ `booking_id` | UUID | Бронирование |
| ▲ `computer_id` | UUID | Компьютер |
| ▲ `started_by` | UUID | Менеджер, запустивший сессию |
| ■ `started_at` | TIMESTAMP | Начало игры |
| ○ `ended_at` | TIMESTAMP | Окончание игры |
| ■ `status` | ENUM | Статус игровой сессии |
| ■ `created_at` | TIMESTAMP | Дата создания |

**FK:**

- `booking_id → bookings.id`
- `computer_id → computers.id`
- `started_by → users.id`

### Логика статуса

Активная сессия:

`🔴 Сейчас играет`

После окончания:

`gaming_session → completed`

Компьютер:

`🟢 Свободен`

---

# 13. Таблица `booking_status_history`

История изменения статусов бронирования.

| Поле | Тип | Описание |
|---|---|---|
| ★ `id` | UUID | Уникальный ID |
| ▲ `booking_id` | UUID | Бронирование |
| ○ `old_status` | ENUM | Предыдущий статус |
| ■ `new_status` | ENUM | Новый статус |
| ▲ `changed_by` | UUID | Кто изменил статус |
| ○ `reason` | TEXT | Причина изменения |
| ■ `created_at` | TIMESTAMP | Дата изменения |

**FK:**

- `booking_id → bookings.id`
- `changed_by → users.id`

Пример:

`pending → confirmed → completed`

или

`pending → cancelled`

---

# 14. Таблица `notifications`

Уведомления пользователей.

| Поле | Тип | Описание |
|---|---|---|
| ★ `id` | UUID | Уникальный ID |
| ▲ `user_id` | UUID | Получатель |
| ■ `type` | VARCHAR(50) | Тип уведомления |
| ■ `title` | VARCHAR(255) | Заголовок |
| ■ `message` | TEXT | Текст уведомления |
| ■ `is_read` | BOOLEAN | Прочитано ли |
| ■ `created_at` | TIMESTAMP | Дата создания |

**FK:**

`user_id → users.id`

---

# 15. Таблица `ai_chats`

Хранит AI-чаты пользователей.

| Поле | Тип | Описание |
|---|---|---|
| ★ `id` | UUID | Уникальный ID чата |
| ▲ `user_id` | UUID | Пользователь |
| ■ `provider` | ENUM | OpenAI или Gemini |
| ■ `created_at` | TIMESTAMP | Дата создания |
| ■ `updated_at` | TIMESTAMP | Дата изменения |

**FK:**

`user_id → users.id`

---

# 16. Таблица `ai_messages`

Хранит сообщения AI-чата.

| Поле | Тип | Описание |
|---|---|---|
| ★ `id` | UUID | Уникальный ID сообщения |
| ▲ `chat_id` | UUID | AI-чат |
| ■ `role` | ENUM | Пользователь или AI |
| ■ `message` | TEXT | Текст сообщения |
| ■ `created_at` | TIMESTAMP | Дата создания |

**FK:**

`chat_id → ai_chats.id`

AI отвечает только на вопросы о RONIN:

- стоимость компьютера;
- наличие свободных мест;
- как забронировать;
- какой компьютер лучше выбрать.

---

# 17. Таблица `content`

Контент сайта, которым управляет администратор.

| Поле | Тип | Описание |
|---|---|---|
| ★ `id` | UUID | Уникальный ID |
| ■ `type` | ENUM | Тип контента |
| ○ `title` | VARCHAR(255) | Заголовок |
| ○ `description` | TEXT | Описание |
| ○ `image_url` | TEXT | Ссылка на изображение |
| ■ `is_active` | BOOLEAN | Активен ли контент |
| ▲ `created_by` | UUID | Кто создал |
| ■ `updated_at` | TIMESTAMP | Дата изменения |

**FK:**

`created_by → users.id`

---

# 18. Таблица `audit_logs`

История важных действий менеджеров и администраторов.

| Поле | Тип | Описание |
|---|---|---|
| ★ `id` | UUID | Уникальный ID |
| ▲ `user_id` | UUID | Кто выполнил действие |
| ■ `action` | VARCHAR(100) | Выполненное действие |
| ■ `entity_type` | VARCHAR(100) | Тип объекта |
| ○ `entity_id` | UUID | ID объекта |
| ○ `old_data` | JSONB | Данные до изменения |
| ○ `new_data` | JSONB | Данные после изменения |
| ■ `created_at` | TIMESTAMP | Дата действия |

**FK:**

`user_id → users.id`

Пример действий:

- создание тарифа;
- изменение тарифа;
- удаление тарифа;
- отмена бронирования;
- возврат оплаты;
- изменение статуса компьютера.

---

# 19. Связи между таблицами

```text
users
 │
 ├── 1 : N ── otp_codes
 ├── 1 : N ── sessions
 ├── 1 : N ── bookings
 ├── 1 : N ── notifications
 ├── 1 : N ── ai_chats
 ├── 1 : N ── content
 └── 1 : N ── audit_logs


computer_categories
 │
 ├── 1 : N ── computers
 └── 1 : N ── tariffs


bookings
 │
 ├── 1 : N ── payments
 ├── 1 : N ── gaming_sessions
 └── 1 : N ── booking_status_history


computers
 │
 └── 1 : N ── bookings


tariffs
 │
 └── 1 : N ── bookings


ai_chats
 │
 └── 1 : N ── ai_messages
```

---

# 20. Основная логика бронирования

```text
Клиент
   ↓
Выбирает компьютер
   ↓
Выбирает дату
   ↓
Выбирает время
   ↓
Выбирает тариф
   ↓
Система проверяет доступность
   ↓
Показывает стоимость
   ↓
Оплата
   ↓
Оплата успешна?
   ├── НЕТ → бронирование не подтверждается
   │          компьютер остаётся свободным
   │
   └── ДА
        ↓
   Бронирование подтверждено
        ↓
   Электронный чек
        ↓
   Клиент приходит в клуб
        ↓
   Менеджер проверяет чек
        ↓
   Игровая сессия начинается
        ↓
   🔴 Сейчас играет
        ↓
   Время закончилось
        ↓
   🔴 СРОК ИСТЁК
        ↓
   Сессия завершена
        ↓
   🟢 Компьютер свободен
```

---

# 21. Электронный чек

Отдельная таблица `receipts` не требуется.

Чек формируется на основе данных:

```text
bookings
+
payments
+
computers
+
tariffs
```

В чеке отображаются:

- RONIN;
- номер бронирования;
- компьютер;
- категория;
- дата;
- время начала;
- время окончания;
- тариф;
- продолжительность;
- стоимость;
- статус оплаты;
- QR-код / код проверки.

Статус чека:

```text
🟢 ДЕЙСТВУЕТ

или

🔴 СРОК ИСТЁК
```

---

# 22. Итог

**Всего: 17 таблиц**

1. `users`
2. `otp_codes`
3. `sessions`
4. `computer_categories`
5. `computers`
6. `tariffs`
7. `bookings`
8. `payments`
9. `gaming_sessions`
10. `booking_status_history`
11. `notifications`
12. `ai_chats`
13. `ai_messages`
14. `content`
15. `audit_logs`

> Примечание: в основной нумерации выше таблицы идут до `audit_logs`; служебные ENUM и типы данных таблицами не считаются. Для тетради удобно считать именно **15 основных таблиц**. 
