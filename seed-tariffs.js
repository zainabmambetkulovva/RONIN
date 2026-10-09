const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function seedTariffs() {
  try {
    console.log('📦 Создание тарифов...\n');

    // Получаем все категории
    const categories = await prisma.computer_categories.findMany();
    
    if (categories.length === 0) {
      console.log('⚠️  Нет категорий! Сначала создайте категории.');
      return;
    }

    console.log(`✅ Найдено ${categories.length} категорий\n`);

    // Тарифы для каждой категории
    const tariffTemplates = [
      { name: '1 час', duration_minutes: 60, price: 100, type: 'hourly' },
      { name: '2 часа', duration_minutes: 120, price: 180, type: 'hourly' },
      { name: '3 часа', duration_minutes: 180, price: 250, type: 'hourly' },
      { name: '5 часов', duration_minutes: 300, price: 400, type: 'hourly' },
      { name: 'Ночь (8 часов)', duration_minutes: 480, price: 600, type: 'night' },
    ];

    for (const category of categories) {
      console.log(`📋 Создание тарифов для "${category.name}"...`);

      for (const template of tariffTemplates) {
        // Проверяем существует ли уже
        const existing = await prisma.tariffs.findFirst({
          where: {
            category_id: category.id,
            name: template.name,
          }
        });

        if (existing) {
          console.log(`  ⏭️  "${template.name}" уже существует`);
          continue;
        }

        await prisma.tariffs.create({
          data: {
            id: crypto.randomUUID(),
            category_id: category.id,
            name: template.name,
            duration_minutes: template.duration_minutes,
            price: template.price,
            type: template.type,
            description: `${template.name} игры на компьютере категории ${category.name}`,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
          }
        });

        console.log(`  ✅ "${template.name}" создан`);
      }

      console.log('');
    }

    console.log('🎉 Все тарифы созданы!\n');
    console.log('Теперь можете протестировать оплату:');
    console.log('http://localhost:3001/booking');

  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTariffs();
