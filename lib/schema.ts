import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core'

// ─── ENUMs ────────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum('user_role_enum', [
  'client',
  'manager',
  'admin',
])

export const userStatusEnum = pgEnum('user_status_enum', [
  'active',
  'blocked',
  'deleted',
])

export const otpTypeEnum = pgEnum('otp_type_enum', ['registration', 'login'])

export const computerStatusEnum = pgEnum('computer_status_enum', [
  'available',
  'maintenance',
])

export const tariffTypeEnum = pgEnum('tariff_type_enum', [
  'hourly',
  'package',
  'night',
  'morning',
])

export const bookingStatusEnum = pgEnum('booking_status_enum', [
  'pending',
  'confirmed',
  'cancelled',
  'completed',
  'expired',
])

export const paymentMethodEnum = pgEnum('payment_method_enum', [
  'electronic_wallet',
  'cash',
])

export const paymentStatusEnum = pgEnum('payment_status_enum', [
  'pending',
  'paid',
  'failed',
  'refunded',
])

export const gamingSessionStatusEnum = pgEnum('gaming_session_status_enum', [
  'active',
  'completed',
  'expired',
])

export const aiProviderEnum = pgEnum('ai_provider_enum', ['openai', 'gemini'])

export const aiRoleEnum = pgEnum('ai_role_enum', ['user', 'assistant'])

export const contentTypeEnum = pgEnum('content_type_enum', [
  'banner',
  'text',
  'image',
])

// ─── TABLES ───────────────────────────────────────────────────────────────────

// 1. users
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  email: varchar('email', { length: 255 }),
  role: userRoleEnum('role').notNull(),
  status: userStatusEnum('status').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// 2. otp_codes
export const otpCodes = pgTable('otp_codes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  destination: varchar('destination', { length: 255 }).notNull(),
  codeHash: varchar('code_hash', { length: 255 }).notNull(),
  type: otpTypeEnum('type').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  attempts: integer('attempts').notNull().default(0),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// 3. sessions
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  tokenHash: varchar('token_hash', { length: 255 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  revokedAt: timestamp('revoked_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// 4. computer_categories
export const computerCategories = pgTable('computer_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// 5. computers
export const computers = pgTable('computers', {
  id: uuid('id').primaryKey().defaultRandom(),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => computerCategories.id),
  number: integer('number').notNull(),
  specifications: jsonb('specifications').notNull(),
  imageUrl: text('image_url'),
  status: computerStatusEnum('status').notNull().default('available'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// 6. tariffs
export const tariffs = pgTable('tariffs', {
  id: uuid('id').primaryKey().defaultRandom(),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => computerCategories.id),
  name: varchar('name', { length: 100 }).notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  type: tariffTypeEnum('type').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// 7. bookings
export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingNumber: varchar('booking_number', { length: 30 }).notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  computerId: uuid('computer_id')
    .notNull()
    .references(() => computers.id),
  tariffId: uuid('tariff_id')
    .notNull()
    .references(() => tariffs.id),
  startAt: timestamp('start_at').notNull(),
  endAt: timestamp('end_at').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  status: bookingStatusEnum('status').notNull().default('pending'),
  qrToken: varchar('qr_token', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// 8. payments
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingId: uuid('booking_id')
    .notNull()
    .references(() => bookings.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  method: paymentMethodEnum('method').notNull(),
  status: paymentStatusEnum('status').notNull().default('pending'),
  provider: varchar('provider', { length: 100 }),
  transactionId: varchar('transaction_id', { length: 255 }),
  paidAt: timestamp('paid_at'),
  refundedAt: timestamp('refunded_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// 9. gaming_sessions
export const gamingSessions = pgTable('gaming_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingId: uuid('booking_id')
    .notNull()
    .references(() => bookings.id),
  computerId: uuid('computer_id')
    .notNull()
    .references(() => computers.id),
  startedBy: uuid('started_by')
    .notNull()
    .references(() => users.id),
  startedAt: timestamp('started_at').notNull(),
  endedAt: timestamp('ended_at'),
  status: gamingSessionStatusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// 10. booking_status_history
export const bookingStatusHistory = pgTable('booking_status_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingId: uuid('booking_id')
    .notNull()
    .references(() => bookings.id),
  oldStatus: bookingStatusEnum('old_status'),
  newStatus: bookingStatusEnum('new_status').notNull(),
  changedBy: uuid('changed_by')
    .notNull()
    .references(() => users.id),
  reason: text('reason'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// 11. notifications
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  type: varchar('type', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// 12. ai_chats
export const aiChats = pgTable('ai_chats', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  provider: aiProviderEnum('provider').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// 13. ai_messages
export const aiMessages = pgTable('ai_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  chatId: uuid('chat_id')
    .notNull()
    .references(() => aiChats.id),
  role: aiRoleEnum('role').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// 14. content
export const content = pgTable('content', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: contentTypeEnum('type').notNull(),
  title: varchar('title', { length: 255 }),
  description: text('description'),
  imageUrl: text('image_url'),
  isActive: boolean('is_active').notNull().default(true),
  createdBy: uuid('created_by')
    .notNull()
    .references(() => users.id),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// 15. audit_logs
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  entityType: varchar('entity_type', { length: 100 }).notNull(),
  entityId: uuid('entity_id'),
  oldData: jsonb('old_data'),
  newData: jsonb('new_data'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
