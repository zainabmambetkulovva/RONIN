const { PrismaClient } = require('@prisma/client');
const { randomUUID } = require('crypto');

const prisma = new PrismaClient();

async function seedAvatars() {
  console.log('🌱 Seeding avatars...');

  try {
    // Clear existing avatars
    await prisma.avatars.deleteMany({});
    console.log('✅ Cleared existing avatars');

    // Avatar data matching files in public/avatars
    const avatars = [
      { code: 'NINJA', image_url: '/avatars/ninja_transparent.png' },
      { code: 'WIZARD', image_url: '/avatars/Загадочный маг с сияющими глазами.png' },
      { code: 'CYBER_LYNX', image_url: '/avatars/Кибернетическая рысь Ронин с неоновым хвостом.png' },
      { code: 'NEON_PANDA', image_url: '/avatars/Неоновая киберпанк-панда ROXIN.png' },
      { code: 'NEON_R', image_url: '/avatars/Неоновая эмблема R с кристаллическим разрезом.png' },
      { code: 'SPIRIT_GUARD', image_url: '/avatars/Неоновый дух-страж с питомцем.png' },
      { code: 'CYBER_CAT', image_url: '/avatars/Неоновый киберпанк-кот в наушниках.png' },
      { code: 'PANDA_NINJA', image_url: '/avatars/Неоновый киберпанк-панда-ниндзя.png' },
      { code: 'SNOW_LEOPARD', image_url: '/avatars/Неоновый киберснежный леопард-котенок.png' },
      { code: 'ASSASSIN_CAT', image_url: '/avatars/Неоновый кот-ассасин в фиолетовой энергии.png' },
      { code: 'GHOST', image_url: '/avatars/Неоновый фиолетовый призрак в капюшоне.png' },
      { code: 'NECROMANCER', image_url: '/avatars/Скелет-некромант в вихре синего огня.png' },
      { code: 'DARK_RABBIT', image_url: '/avatars/Суровый чёрный кролик в худи.png' },
    ];

    // Insert avatars
    for (const avatar of avatars) {
      await prisma.avatars.create({
        data: {
          id: randomUUID(),
          code: avatar.code,
          image_url: avatar.image_url,
          is_active: true,
        },
      });
      console.log(`✅ Created avatar: ${avatar.code}`);
    }

    console.log('🎉 Successfully seeded', avatars.length, 'avatars!');

    // Verify
    const count = await prisma.avatars.count();
    console.log(`📊 Total avatars in database: ${count}`);
  } catch (error) {
    console.error('❌ Error seeding avatars:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedAvatars()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
