import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Quick seed: Создаем тестовые данные...');

  // 1. Категория
  const category = await prisma.computer_categories.upsert({
    where: { id: 'cat-test' },
    update: {},
    create: {
      id: 'cat-test',
      name: 'STANDART',
      description: 'Тестовые компьютеры',
      image_url: null,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  console.log('✅ Категория создана');

  // 2. Компьютеры
  for (let i = 1; i <= 10; i++) {
    await prisma.computers.upsert({
      where: { id: `pc-${i}` },
      update: {},
      create: {
        id: `pc-${i}`,
        number: i,
        category_id: category.id,
        status: 'available',
        specifications: {
          cpu: 'Intel Core i5-12400F',
          gpu: 'RTX 3060',
          ram: '16GB DDR4',
          storage: '512GB SSD',
          monitor: '24" 144Hz',
        },
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }
  console.log('✅ 10 компьютеров создано');

  // 3. Тариф
  await prisma.tariffs.upsert({
    where: { id: 'tariff-1h' },
    update: {},
    create: {
      id: 'tariff-1h',
      name: '1 час',
      type: 'hourly',
      duration_minutes: 60,
      price: 150,
      category_id: category.id,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  console.log('✅ Тариф создан');

  console.log('🎉 Seed завершен успешно!');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
