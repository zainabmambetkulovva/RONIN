# RONIN Computer Club - Project Architecture

## Directory Structure

```
artexx/
├── app/
│   ├── (client)/                    # Клиентская часть
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Главная с 3D
│   │   ├── (routes)/
│   │   │   ├── computers/page.tsx
│   │   │   ├── tariffs/page.tsx
│   │   │   ├── ai-chat/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   ├── booking/page.tsx
│   │   │   └── receipt/[id]/page.tsx
│   │   └── components/
│   │       ├── hero-3d/
│   │       ├── computer-card/
│   │       ├── booking-wizard/
│   │       └── ...
│   │
│   ├── manager/                     # Менеджер панель
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Dashboard
│   │   ├── (routes)/
│   │   │   ├── receipts/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   ├── sessions/page.tsx
│   │   │   ├── archive/page.tsx
│   │   │   └── tariffs/page.tsx
│   │   └── components/
│   │       ├── receipt-board/
│   │       ├── add-order-modal/
│   │       └── ...
│   │
│   ├── admin/                       # Админ панель
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Dashboard
│   │   ├── (routes)/
│   │   │   ├── computers/page.tsx
│   │   │   ├── bookings/page.tsx
│   │   │   ├── payments/page.tsx
│   │   │   ├── tariffs/page.tsx
│   │   │   ├── users/page.tsx
│   │   │   ├── managers/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── components/
│   │
│   ├── components/                  # Глобальные компоненты
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── Footer.tsx
│   │   └── animations/
│   │
│   ├── layout.tsx
│   ├── globals.css
│   └── page.tsx                     # Главная страница выбора роли
│
├── lib/
│   ├── types/                       # TypeScript типы
│   │   ├── index.ts
│   │   ├── computer.ts
│   │   ├── booking.ts
│   │   ├── payment.ts
│   │   ├── receipt.ts
│   │   └── ...
│   │
│   ├── data/                        # Mock и database logic
│   │   ├── mock-data.ts
│   │   ├── computers.ts
│   │   ├── bookings.ts
│   │   ├── payments.ts
│   │   └── ...
│   │
│   ├── hooks/                       # Custom hooks
│   │   ├── useBooking.ts
│   │   ├── usePayment.ts
│   │   ├── useReceipt.ts
│   │   ├── useRealtime.ts
│   │   └── ...
│   │
│   ├── services/                    # Бизнес-логика
│   │   ├── bookingService.ts
│   │   ├── paymentService.ts
│   │   ├── receiptService.ts
│   │   ├── computerService.ts
│   │   └── ...
│   │
│   ├── utils/
│   │   ├── validation.ts
│   │   ├── formatting.ts
│   │   ├── constants.ts
│   │   └── ...
│   │
│   ├── ai/                          # AI интеграция
│   │   ├── systemPrompt.ts
│   │   ├── tools.ts
│   │   └── context.ts
│   │
│   └── db/                          # Database
│       ├── schema.ts
│       ├── seed.ts
│       └── client.ts
│
├── public/
│   ├── 3d-models/
│   └── assets/
│
└── styles/
    ├── globals.css
    ├── animations.css
    ├── neon.css
    └── ...
```

## Data Types

### Computer
```typescript
type Computer = {
  id: string
  number: string              // PC-01
  name: string               // Gaming Master Pro
  category: string           // Premium, Standard, Budget
  specs: {
    cpu: string
    gpu: string
    ram: string
    monitor: string
  }
  price_per_hour: number
  status: 'available' | 'busy' | 'reserved' | 'maintenance'
  booking_until?: Date        // Если зарезервирован
  created_at: Date
  updated_at: Date
}
```

### Tariff
```typescript
type Tariff = {
  id: string
  name: string               // "1 Hour"
  type: string               // 'hourly' | 'night' | 'morning'
  duration_minutes: number
  price: number
  description?: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}
```

### Booking
```typescript
type Booking = {
  id: string
  booking_number: string     // BK-001
  customer_name: string
  customer_phone: string
  computer_id: string
  computer_number: string    // Snapshot при создании
  tariff_id: string
  tariff_snapshot: {         // Snapshot тарифа при создании
    name: string
    price: number
    duration_minutes: number
  }
  start_time: Date
  end_time: Date
  total_price: number
  payment_status: 'pending' | 'paid' | 'refunded'
  booking_status: 'confirmed' | 'cancelled' | 'completed'
  created_by: 'customer' | 'manager'
  created_at: Date
  updated_at: Date
}
```

### Payment
```typescript
type Payment = {
  id: string
  booking_id: string
  amount: number
  method: 'electronic_wallet' | 'cash'
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  transaction_id?: string
  created_at: Date
  updated_at: Date
}
```

### Receipt (Чек)
```typescript
type Receipt = {
  id: string
  receipt_code: string       // 4-digit code: 4821
  booking_id: string
  customer_name: string
  customer_phone: string
  computer_number: string
  computer_category: string
  tariff_name: string
  date: Date
  start_time: Date
  end_time: Date
  duration_minutes: number
  price: number
  payment_method: string
  payment_status: string
  status: 'active' | 'expired'
  qr_code?: string
  created_at: Date
  expires_at: Date
}
```

### GameSession
```typescript
type GameSession = {
  id: string
  receipt_id: string
  booking_id: string
  computer_id: string
  customer_name: string
  start_time: Date
  end_time: Date
  status: 'active' | 'completed' | 'cancelled'
  started_by_manager?: string
  ended_by_manager?: string
  created_at: Date
  updated_at: Date
}
```

## API Routes

### Client API
```
GET  /api/computers              - Список компьютеров
GET  /api/computers/:id          - Подробно о компьютере
GET  /api/computers/available/:date/:time  - Доступные в дату/время

GET  /api/tariffs                - Все тарифы
GET  /api/tariffs/:id            - Тариф

POST /api/bookings               - Создать бронирование
GET  /api/bookings/:id           - Подробно о бронировании
GET  /api/bookings/check-availability - Проверка доступности

POST /api/payments               - Создать платёж
GET  /api/payments/:id           - Статус платежа

GET  /api/receipts/:id           - Получить чек
GET  /api/receipts/code/:code    - Чек по 4-digit коду

POST /api/ai/chat                - AI чат
```

### Manager API
```
GET  /api/manager/dashboard      - Dashboard данные
GET  /api/manager/receipts       - Активные чеки
GET  /api/manager/receipts/search/:code - Поиск по коду
POST /api/manager/orders         - Создать заказ
GET  /api/manager/archive        - Архив
GET  /api/manager/sessions       - Игровые сессии
POST /api/manager/sessions/start  - Начать сессию
POST /api/manager/sessions/end    - Завершить сессию
```

### Admin API
```
GET  /api/admin/dashboard        - Dashboard данные
GET  /api/admin/computers        - Все компьютеры
POST /api/admin/computers        - Добавить компьютер
PUT  /api/admin/computers/:id    - Обновить компьютер
DELETE /api/admin/computers/:id  - Удалить компьютер

GET  /api/admin/tariffs          - Все тарифы
POST /api/admin/tariffs          - Добавить тариф
PUT  /api/admin/tariffs/:id      - Обновить тариф
DELETE /api/admin/tariffs/:id    - Удалить тариф

GET  /api/admin/bookings         - Все бронирования
GET  /api/admin/payments         - Все платежи
POST /api/admin/payments/refund  - Возврат

GET  /api/admin/users            - Пользователи
GET  /api/admin/managers         - Менеджеры
```

## Key Services

### BookingService
- Создание бронирования
- Проверка доступности
- Защита от double booking
- Отмена бронирования
- Таблица истории

### PaymentService
- Обработка платежей
- Проверка статуса
- Возвраты

### ReceiptService
- Создание чека
- Генерация 4-digit кода
- QR код
- Статус (active/expired)
- Countdown

### ComputerService
- Список компьютеров
- Фильтрация по статусу
- Realtime обновления
- История использования

### AIService
- Context из RONIN данных
- Ответы на вопросы
- Рекомендации компьютеров

## State Management

Используется:
- React Context для глобального состояния
- Custom hooks для логики
- Zustand (опционально) для сложного состояния
- Supabase Realtime для реального времени

## Realtime Updates

Использовать Supabase Realtime или polling для:
- Статусы компьютеров
- Новые бронирования
- Чеки на Manager Dashboard
- Активные игровые сессии
- Countdown чеков

## Authentication Ready

Хотя полная авторизация не реализована, архитектура готова:
- JWT токены
- Role-based access control (client/manager/admin)
- Protected API routes
- Session management

## Performance

- Code splitting по ролям
- Lazy loading для страниц
- Image optimization
- 3D объект оптимизирован
- Efficient realtime updates
- Caching где уместно

## Security

- Input validation на frontend и backend
- XSS protection
- CSRF protection ready
- Sanitization
- Rate limiting ready
- Double booking prevention
