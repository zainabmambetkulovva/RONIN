-- ✅ Админ колдонуучу түзүү SQL
-- Neon SQL Editor'до иштетиңиз: https://console.neon.tech/

-- 1. Эски админди өчүрүү (эгер бар болсо)
DELETE FROM users WHERE email = 'admin@ronin.kg';

-- 2. Жаңы админ түзүү
-- Email: admin@ronin.kg
-- Password: admin123
-- Telegram Chat ID: 7510511621 (ТУУРА CHAT ID!)

INSERT INTO users (
  id, 
  email, 
  name, 
  password, 
  telegram_chat_id, 
  role, 
  status, 
  avatar, 
  created_at, 
  updated_at
)
VALUES (
  gen_random_uuid(),
  'admin@ronin.kg',
  'Admin RONIN',
  '<BCRYPT_HASH: node generate-hash.js "<пароль>">',
  '7510511621',
  'admin',
  'active',
  'default',
  NOW(),
  NOW()
);

-- 3. Проверка
SELECT 
  id, 
  email, 
  name, 
  role, 
  telegram_chat_id, 
  status,
  created_at
FROM users 
WHERE email = 'admin@ronin.kg';

-- ✅ Админ түзүлдү!
-- Логин: admin@ronin.kg  
-- Пароль: admin123
-- Telegram Chat ID: 7510511621
-- http://localhost:3001/admin/login
