const bcrypt = require('bcryptjs');

// Использование: node create-admin-simple.js '<пароль администратора>'
function requirePassword() {
  const password = process.argv[2];
  if (!password || password.length < 8) {
    console.error("Укажите пароль не короче 8 символов: node create-admin-simple.js '<пароль>'");
    process.exit(1);
  }
  return password;
}
const crypto = require('crypto');

async function createAdmin() {
  try {
    console.log('🔐 Генерация данных админа...\n');

    const hashedPassword = await bcrypt.hash(requirePassword(), 10);
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    console.log('✅ SQL для создания админа:\n');
    console.log(`INSERT INTO users (id, email, name, password, telegram_chat_id, role, status, avatar, created_at, updated_at)
VALUES (
  '${id}',
  'admin@ronin.kg',
  'Admin RONIN',
  '${hashedPassword}',
  '8824394948',
  'admin',
  'active',
  'default',
  '${now}',
  '${now}'
)
ON CONFLICT (email) 
DO UPDATE SET 
  password = EXCLUDED.password,
  telegram_chat_id = EXCLUDED.telegram_chat_id,
  role = EXCLUDED.role,
  updated_at = EXCLUDED.updated_at;`);

    console.log('\n\n📋 Или скопируйте эти данные:');
    console.log('Email: admin@ronin.kg');
    console.log('Password: (из аргумента командной строки)');
    console.log('Password Hash:', hashedPassword);
    console.log('Telegram Chat ID: 8824394948');
    console.log('UUID:', id);

  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

createAdmin();
