import { PrismaClient, ComputerStatus, TariffType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начинаем seed базы данных...');

  // 1. Создаем категории компьютеров
  console.log('📂 Создаем категории...');
  
  const standartCategory = await prisma.computer_categories.create({
    data: {
      id: 'cat-standart',
      name: 'STANDART',
      description: '70 станций с отличными характеристиками для комфортной игры',
      image_url: '/categories/standart.jpg',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  const premiumCategory = await prisma.computer_categories.create({
    data: {
      id: 'cat-premium',
      name: 'PREMIUM',
      description: '10 станций с премиальным оборудованием для требовательных игр',
      image_url: '/categories/premium.jpg',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  const vipCategory = await prisma.computerCategory.create({
    data: {
      name: 'VIP',
      description: '10 станций с топовым железом и эксклюзивным комфортом',
      imageUrl: '/categories/vip.jpg',
      isActive: true,
    },
  });

  const roninRoomsCategory = await prisma.computerCategory.create({
    data: {
      name: 'RONIN ROOMS',
      description: '3 индивидуальные стримерские комнаты с максимальной мощностью',
      imageUrl: '/categories/ronin-rooms.jpg',
      isActive: true,
    },
  });

  console.log('✅ Категории созданы!');

  // 2. Создаем тарифы
  console.log('💰 Создаем тарифы...');

  // Тарифы для STANDART (Comfort цены)
  await prisma.tariff.createMany({
    data: [
      {
        categoryId: standartCategory.id,
        name: '1 час',
        durationMinutes: 60,
        price: 120,
        type: TariffType.hourly,
        isActive: true,
      },
      {
        categoryId: standartCategory.id,
        name: '3 часа',
        durationMinutes: 180,
        price: 300,
        type: TariffType.package,
        isActive: true,
      },
      {
        categoryId: standartCategory.id,
        name: '5 часов',
        durationMinutes: 300,
        price: 500,
        type: TariffType.package,
        isActive: true,
      },
      {
        categoryId: standartCategory.id,
        name: 'Ночь пакет',
        durationMinutes: 540, // 9 часов (23:00-08:00)
        price: 600,
        type: TariffType.night,
        isActive: true,
      },
      {
        categoryId: standartCategory.id,
        name: 'Утро пакет',
        durationMinutes: 240, // 4 часа (08:00-12:00)
        price: 300,
        type: TariffType.morning,
        isActive: true,
      },
    ],
  });

  // Тарифы для PREMIUM
  await prisma.tariff.createMany({
    data: [
      {
        categoryId: premiumCategory.id,
        name: '1 час',
        durationMinutes: 60,
        price: 250,
        type: TariffType.hourly,
        isActive: true,
      },
      {
        categoryId: premiumCategory.id,
        name: '3 часа',
        durationMinutes: 180,
        price: 550,
        type: TariffType.package,
        isActive: true,
      },
      {
        categoryId: premiumCategory.id,
        name: '5 часов',
        durationMinutes: 300,
        price: 850,
        type: TariffType.package,
        isActive: true,
      },
      {
        categoryId: premiumCategory.id,
        name: 'Ночь пакет',
        durationMinutes: 540,
        price: 700,
        type: TariffType.night,
        isActive: true,
      },
      {
        categoryId: premiumCategory.id,
        name: 'Утро пакет',
        durationMinutes: 240,
        price: 550,
        type: TariffType.morning,
        isActive: true,
      },
    ],
  });

  // Тарифы для VIP (такие же как Premium)
  await prisma.tariff.createMany({
    data: [
      {
        categoryId: vipCategory.id,
        name: '1 час',
        durationMinutes: 60,
        price: 250,
        type: TariffType.hourly,
        isActive: true,
      },
      {
        categoryId: vipCategory.id,
        name: '3 часа',
        durationMinutes: 180,
        price: 550,
        type: TariffType.package,
        isActive: true,
      },
      {
        categoryId: vipCategory.id,
        name: '5 часов',
        durationMinutes: 300,
        price: 850,
        type: TariffType.package,
        isActive: true,
      },
      {
        categoryId: vipCategory.id,
        name: 'Ночь пакет',
        durationMinutes: 540,
        price: 700,
        type: TariffType.night,
        isActive: true,
      },
      {
        categoryId: vipCategory.id,
        name: 'Утро пакет',
        durationMinutes: 240,
        price: 550,
        type: TariffType.morning,
        isActive: true,
      },
    ],
  });

  // Тарифы для RONIN ROOMS (такие же как Premium)
  await prisma.tariff.createMany({
    data: [
      {
        categoryId: roninRoomsCategory.id,
        name: '1 час',
        durationMinutes: 60,
        price: 250,
        type: TariffType.hourly,
        isActive: true,
      },
      {
        categoryId: roninRoomsCategory.id,
        name: '3 часа',
        durationMinutes: 180,
        price: 550,
        type: TariffType.package,
        isActive: true,
      },
      {
        categoryId: roninRoomsCategory.id,
        name: '5 часов',
        durationMinutes: 300,
        price: 850,
        type: TariffType.package,
        isActive: true,
      },
      {
        categoryId: roninRoomsCategory.id,
        name: 'Ночь пакет',
        durationMinutes: 540,
        price: 700,
        type: TariffType.night,
        isActive: true,
      },
      {
        categoryId: roninRoomsCategory.id,
        name: 'Утро пакет',
        durationMinutes: 240,
        price: 550,
        type: TariffType.morning,
        isActive: true,
      },
    ],
  });

  console.log('✅ Тарифы созданы!');

  // 3. Создаем компьютеры
  console.log('💻 Создаем компьютеры...');

  // STANDART компьютеры (1-70)
  for (let i = 1; i <= 70; i++) {
    await prisma.computer.create({
      data: {
        categoryId: standartCategory.id,
        number: i,
        specifications: {
          cpu: 'Intel Core i5 12400F',
          gpu: 'GEFORCE RTX 4060',
          ram: 'KINGSTON FURY BEAST 16x2',
          monitor: '27" ASUS TUF 280Hz',
          keyboard: 'HyperX Alloy Origins',
          mouse: 'HyperX Pulsefire Core',
          chair: 'Anda Seat Phantom 3',
        },
        status: ComputerStatus.available,
      },
    });
  }

  // PREMIUM компьютеры (71-80)
  for (let i = 71; i <= 80; i++) {
    await prisma.computer.create({
      data: {
        categoryId: premiumCategory.id,
        number: i,
        specifications: {
          cpu: 'Intel Core i7 12700',
          gpu: 'GEFORCE RTX 4070 TI',
          ram: '32GB KINGSTON FURY BEAST',
          monitor: '27" ASUS TUF 280Hz',
          keyboard: 'Varmilo Limited Edition',
          mouse: 'Logitech Pro SuperLight',
          chair: 'Anda Seat Dark Knight XL',
        },
        status: ComputerStatus.available,
      },
    });
  }

  // VIP компьютеры (81-90)
  for (let i = 81; i <= 90; i++) {
    await prisma.computer.create({
      data: {
        categoryId: vipCategory.id,
        number: i,
        specifications: {
          cpu: 'Intel Core i7 12700',
          gpu: 'GEFORCE RTX 4060 TI',
          ram: '32GB KINGSTON FURY BEAST',
          monitor: '27" ASUS TUF 280Hz',
          keyboard: 'HyperX Alloy Elite 2',
          mouse: 'HyperX Pulsefire Surge',
          chair: 'Anda Seat Kaiser II XL',
        },
        status: ComputerStatus.available,
      },
    });
  }

  // RONIN ROOMS (91-93) - самые мощные для стримеров
  for (let i = 91; i <= 93; i++) {
    await prisma.computer.create({
      data: {
        categoryId: roninRoomsCategory.id,
        number: i,
        specifications: {
          cpu: 'Intel Core i9 13900K',
          gpu: 'GEFORCE RTX 4090',
          ram: '64GB DDR5 KINGSTON FURY BEAST',
          monitor: '32" ASUS ROG Swift 360Hz',
          keyboard: 'Razer Huntsman V3 Pro',
          mouse: 'Razer Viper V3 Pro',
          chair: 'Secretlab Titan Evo 2024',
          microphone: 'Shure SM7B',
          camera: 'Sony A7 III',
          streamDeck: 'Elgato Stream Deck XL',
          lighting: 'Elgato Key Light Air x2',
        },
        status: ComputerStatus.available,
      },
    });
  }

  console.log('✅ 93 компьютера созданы!');

  // 4. Создаем аватары
  console.log('👤 Создаем аватары...');

  const avatars = [
    'samurai', 'ninja', 'warrior', 'mage', 'archer', 'knight', 'assassin', 'monk',
    'ronin-gold', 'ronin-silver', 'dragon', 'phoenix', 'tiger',
  ];

  for (let i = 0; i < avatars.length; i++) {
    await prisma.avatar.create({
      data: {
        code: avatars[i],
        imageUrl: `/avatars/${avatars[i]}.png`,
        isActive: true,
      },
    });
  }

  console.log('✅ 13 аватаров созданы!');

  console.log('');
  console.log('🎉 SEED ЗАВЕРШЕН УСПЕШНО!');
  console.log('');
  console.log('📊 СОЗДАНО:');
  console.log('  • 4 категории');
  console.log('  • 20 тарифов (5 на категорию)');
  console.log('  • 93 компьютера');
  console.log('    - STANDART: 70 ПК');
  console.log('    - PREMIUM: 10 ПК');
  console.log('    - VIP: 10 ПК');
  console.log('    - RONIN ROOMS: 3 ПК');
  console.log('  • 13 аватаров');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при выполнении seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
