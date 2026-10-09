const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('🔍 Проверка данных в БД...\n');

    const categories = await prisma.computer_categories.findMany();
    console.log(`📁 Категории: ${categories.length}`);
    categories.forEach(c => console.log(`   - ${c.name}`));

    const computers = await prisma.computers.findMany();
    console.log(`\n💻 Компьютеры: ${computers.length}`);

    const tariffs = await prisma.tariffs.findMany();
    console.log(`\n💰 Тарифы: ${tariffs.length}`);
    
    if (tariffs.length > 0) {
      console.log('Примеры тарифов:');
      tariffs.slice(0, 3).forEach(t => console.log(`   - ${t.name}: ${t.price} сом`));
    }

    const users = await prisma.users.findMany({ where: { role: { in: ['admin', 'manager'] } } });
    console.log(`\n👤 Админы/Менеджеры: ${users.length}`);
    users.forEach(u => console.log(`   - ${u.email} (${u.role})`));

    console.log('\n' + '='.repeat(50));
    
    if (categories.length === 0) {
      console.log('⚠️  Нет категорий! Нужно создать категории.');
    } else if (computers.length === 0) {
      console.log('⚠️  Нет компьютеров! Нужно создать компьютеры.');
    } else if (tariffs.length === 0) {
      console.log('⚠️  Нет тарифов! Запустите: node seed-tariffs.js');
    } else {
      console.log('✅ Все данные готовы для тестирования оплаты!');
    }

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
