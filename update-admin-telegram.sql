-- Обновить telegram_chat_id для админа
-- Chat ID получен из бота: 7510511621

UPDATE users 
SET telegram_chat_id = '7510511621' 
WHERE email = 'admin@ronin.kg' OR role = 'admin';

-- Проверка
SELECT id, name, email, role, telegram_chat_id 
FROM users 
WHERE role IN ('admin', 'manager');
