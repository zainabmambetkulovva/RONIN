# 🚀 Инструкция по запуску RONIN

## Проблема: Ошибка при регистрации "password is required"

### Решение:

**1. Удали старые миграции и пересоздай БД:**

```bash
cd ronin
```

**2. Сбрось базу данных (ВНИМАНИЕ: удалит все данные!):**

```bash
npx prisma migrate reset --force
```

**3. Создай новую миграцию:**

```bash
npx prisma migrate dev --name init
```

**4. Сгенерируй Prisma Client:**

```bash
npx prisma generate
```

**5. Проверь что БД работает:**

```bash
npx prisma studio
```

**6. Перезапусти dev server**

Теперь регистрация должна работать!

---

## Альтернативный способ (если команды выше не работают):

**1. Открой файл `.env` и проверь DATABASE_URL:**

```
DATABASE_URL="postgresql://neondb_owner:npg_LZVlMS38chsI@ep-broad-haze-b4zi3zzy-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://neondb_owner:npg_LZVlMS38chsI@ep-broad-haze-b4zi3zzy.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

**2. Запусти через npx prisma db push (без миграций):**

```bash
npx prisma db push --force-reset
```

**3. Сгенерируй клиент:**

```bash
npx prisma generate
```

---

## Проверка работы:

1. Открой http://localhost:3000/register
2. Заполни форму
3. Если видишь ошибку в консоли браузера - скопируй её мне
4. Если видишь ошибку в терминале где запущен сервер - скопируй её мне

## Тестовые данные для входа в админку:

После того как регистрация заработает, создай admin аккаунт вручную через Prisma Studio:

1. `npx prisma studio`
2. Открой таблицу `User`
3. Создай нового пользователя:
   - name: Admin
   - email: admin@ronin.kg
   - password: (хеш пароля через bcrypt или просто тестовый пароль)
   - role: admin
   - status: active

Или используй SQL:

```sql
INSERT INTO "users" (id, name, email, password, role, status, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Admin User',
  'admin@ronin.kg',
  '$2a$10$HASH_HERE', -- замени на хеш пароля
  'admin',
  'active',
  NOW(),
  NOW()
);
```

---

Если ничего не помогает - дай мне знать и я создам скрипт автоматической настройки!
