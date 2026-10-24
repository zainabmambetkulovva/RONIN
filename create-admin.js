const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Использование: node create-admin.js '<пароль администратора>'
function requirePassword() {
  const password = process.argv[2];
  if (!password || password.length < 8) {
    console.error("Укажите пароль не короче 8 символов: node create-admin.js '<пароль>'");
    process.exit(1);
  }
  return password;
}
const crypto = require('crypto');

const prisma = new PrismaClient();

// ВАЖНО: Замените этот Chat ID на ваш
const ADMIN_TELEGRAM_CHAT_ID = process.argv[2] || '8824394948';

async function createAdmin() {
  try {
    console.log('🔐 Создание администратора...\n');
    console.log(`📱 Telegram Chat ID: ${ADMIN_TELEGRAM_CHAT_ID}\n`);

    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(requirePassword(), 10);

    // Проверяем существует ли уже
    const existing = await prisma.users.findFirst({
      where: { email: 'admin@ronin.kg' }
    });

    if (existing) {
      console.log('⚠️  Админ уже существует! Обновляем...\n');
      
      await prisma.users.update({
        where: { id: existing.id },
        data: {
          password: hashedPassword,
          telegram_chat_id: ADMIN_TELEGRAM_CHAT_ID,
          role: 'admin',
          status: 'active',
          updated_at: new Date(),
        }
      });

      console.log('✅ Админ обновлен!');
    } else {
      await prisma.users.create({
        data: {
          id: crypto.randomUUID(),
          email: 'admin@ronin.kg',
          name: 'Admin RONIN',
          password: hashedPassword,
          telegram_chat_id: ADMIN_TELEGRAM_CHAT_ID,
          role: 'admin',
          status: 'active',
          avatar: 'default',
          created_at: new Date(),
          updated_at: new Date(),
        }
      });

      console.log('✅ Админ создан!');
    }

    console.log('\n📋 Данные для входа:');
    console.log('Email: admin@ronin.kg');
    console.log('Password: (из аргумента командной строки)');
    console.log(`Telegram Chat ID: ${ADMIN_TELEGRAM_CHAT_ID}`);
    console.log('\n🚀 Теперь можно войти в админ панель!');
    console.log('   http://localhost:3001/admin/login');

  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
