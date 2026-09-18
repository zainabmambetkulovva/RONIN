-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('client', 'manager', 'admin');
CREATE TYPE "UserStatus" AS ENUM ('active', 'blocked', 'deleted');
CREATE TYPE "OtpType" AS ENUM ('registration', 'login');
CREATE TYPE "ComputerStatus" AS ENUM ('available', 'maintenance');
CREATE TYPE "TariffType" AS ENUM ('hourly', 'package', 'night', 'morning');
CREATE TYPE "BookingStatus" AS ENUM ('pending', 'confirmed', 'cancelled', 'completed', 'expired');
CREATE TYPE "PaymentMethod" AS ENUM ('electronic_wallet', 'cash');
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE "GamingSessionStatus" AS ENUM ('active', 'completed', 'expired');
CREATE TYPE "AiProvider" AS ENUM ('openai', 'gemini');
CREATE TYPE "AiRole" AS ENUM ('user', 'assistant');
CREATE TYPE "ContentType" AS ENUM ('banner', 'text', 'image');

-- CreateTable users
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255),
    "role" "UserRole" NOT NULL DEFAULT 'client',
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateTable otp_codes
CREATE TABLE "otp_codes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "destination" VARCHAR(255) NOT NULL,
    "code_hash" VARCHAR(255) NOT NULL,
    "type" "OtpType" NOT NULL,
    "expires_at" TIMESTAMP NOT NULL,
    "attempts" INT NOT NULL DEFAULT 0,
    "used_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "otp_codes_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "otp_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL
);

-- CreateTable sessions
CREATE TABLE "sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP NOT NULL,
    "revoked_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- CreateTable computer_categories
CREATE TABLE "computer_categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "computer_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable computers
CREATE TABLE "computers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "category_id" UUID NOT NULL,
    "number" INT NOT NULL,
    "specifications" JSONB NOT NULL,
    "image_url" TEXT,
    "status" "ComputerStatus" NOT NULL DEFAULT 'available',
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "computers_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "computers_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "computer_categories"("id")
);
CREATE UNIQUE INDEX "computers_number_key" ON "computers"("number");

-- CreateTable tariffs
CREATE TABLE "tariffs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "category_id" UUID,
    "name" VARCHAR(100) NOT NULL,
    "duration_minutes" INT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "type" "TariffType" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "tariffs_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "tariffs_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "computer_categories"("id")
);

-- CreateTable bookings
CREATE TABLE "bookings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "booking_number" VARCHAR(30) NOT NULL,
    "user_id" UUID NOT NULL,
    "computer_id" UUID NOT NULL,
    "tariff_id" UUID NOT NULL,
    "start_at" TIMESTAMP NOT NULL,
    "end_at" TIMESTAMP NOT NULL,
    "duration_minutes" INT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'pending',
    "qr_token" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id"),
    CONSTRAINT "bookings_computer_id_fkey" FOREIGN KEY ("computer_id") REFERENCES "computers"("id"),
    CONSTRAINT "bookings_tariff_id_fkey" FOREIGN KEY ("tariff_id") REFERENCES "tariffs"("id")
);
CREATE UNIQUE INDEX "bookings_booking_number_key" ON "bookings"("booking_number");
CREATE UNIQUE INDEX "bookings_qr_token_key" ON "bookings"("qr_token");

-- CreateTable payments
CREATE TABLE "payments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "booking_id" UUID NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "provider" VARCHAR(100),
    "transaction_id" VARCHAR(255),
    "paid_at" TIMESTAMP,
    "refunded_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "payments_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "payments_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id")
);

-- CreateTable gaming_sessions
CREATE TABLE "gaming_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "booking_id" UUID NOT NULL,
    "computer_id" UUID NOT NULL,
    "started_by" UUID NOT NULL,
    "started_at" TIMESTAMP NOT NULL,
    "ended_at" TIMESTAMP,
    "status" "GamingSessionStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "gaming_sessions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "gaming_sessions_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id"),
    CONSTRAINT "gaming_sessions_computer_id_fkey" FOREIGN KEY ("computer_id") REFERENCES "computers"("id"),
    CONSTRAINT "gaming_sessions_started_by_fkey" FOREIGN KEY ("started_by") REFERENCES "users"("id")
);

-- CreateTable booking_status_history
CREATE TABLE "booking_status_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "booking_id" UUID NOT NULL,
    "old_status" "BookingStatus",
    "new_status" "BookingStatus" NOT NULL,
    "changed_by" UUID NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "booking_status_history_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "booking_status_history_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id"),
    CONSTRAINT "booking_status_history_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "users"("id")
);

-- CreateTable notifications
CREATE TABLE "notifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- CreateTable ai_chats
CREATE TABLE "ai_chats" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "provider" "AiProvider" NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "ai_chats_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ai_chats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- CreateTable ai_messages
CREATE TABLE "ai_messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "chat_id" UUID NOT NULL,
    "role" "AiRole" NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "ai_messages_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ai_messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "ai_chats"("id") ON DELETE CASCADE
);

-- CreateTable content
CREATE TABLE "content" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" "ContentType" NOT NULL,
    "title" VARCHAR(255),
    "description" TEXT,
    "image_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "content_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "content_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id")
);

-- CreateTable audit_logs
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "entity_type" VARCHAR(100) NOT NULL,
    "entity_id" UUID,
    "old_data" JSONB,
    "new_data" JSONB,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id")
);

-- Indexes for performance
CREATE INDEX "bookings_user_id_idx" ON "bookings"("user_id");
CREATE INDEX "bookings_computer_id_idx" ON "bookings"("computer_id");
CREATE INDEX "bookings_status_idx" ON "bookings"("status");
CREATE INDEX "bookings_start_at_idx" ON "bookings"("start_at");
CREATE INDEX "gaming_sessions_computer_id_idx" ON "gaming_sessions"("computer_id");
CREATE INDEX "gaming_sessions_status_idx" ON "gaming_sessions"("status");
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");
CREATE INDEX "otp_codes_destination_idx" ON "otp_codes"("destination");
