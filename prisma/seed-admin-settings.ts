import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Добавление настроек админа...');

  // Telegram Bot Token
  await prisma.setting.upsert({
    where: { key: 'ADMIN_TELEGRAM_BOT_TOKEN' },
    update: {
      value: process.env.TELEGRAM_BOT_TOKEN || '8824394948:AAE7yJ-Ync30pXVHZo7AOyjDD_1ad_TPc0s',
      description: 'Telegram бот для отправки 2FA кодов админам',
    },
    create: {
      key: 'ADMIN_TELEGRAM_BOT_TOKEN',
      value: process.env.TELEGRAM_BOT_TOKEN || '8824394948:AAE7yJ-Ync30pXVHZo7AOyjDD_1ad_TPc0s',
      description: 'Telegram бот для отправки 2FA кодов админам',
    },
  });

  // Admin Telegram User ID (замените на реальный!)
  await prisma.setting.upsert({
    where: { key: 'ADMIN_TELEGRAM_USER_ID' },
    update: {
      value: '123456789', // ЗАМЕНИТЕ НА РЕАЛЬНЫЙ TELEGRAM ID
      description: 'Telegram ID главного администратора',
    },
    create: {
      key: 'ADMIN_TELEGRAM_USER_ID',
      value: '123456789', // ЗАМЕНИТЕ НА РЕАЛЬНЫЙ TELEGRAM ID
      description: 'Telegram ID главного администратора',
    },
  });

  console.log('✅ Настройки админа добавлены!');
  console.log('⚠️  НЕ ЗАБУДЬТЕ обновить ADMIN_TELEGRAM_USER_ID на реальный Telegram ID!');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
