const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔄 Тестирование подключения к БД...');
    
    // Простой запрос
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Подключение успешно!', result);
    
    // Проверка таблиц
    const users = await prisma.user.findMany({ take: 1 });
    console.log('✅ Таблица users существует. Найдено пользователей:', users.length);
    
  } catch (error) {
    console.error('❌ Ошибка подключения:', error.message);
    console.error('\n📝 Детали:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
