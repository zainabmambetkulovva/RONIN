const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function removeLogo() {
  try {
    const result = await prisma.avatars.deleteMany({
      where: {
        image_url: {
          contains: 'кристаллическим разрезом'
        }
      }
    });
    console.log('✅ Removed logo avatar:', result.count);
    
    const total = await prisma.avatars.count();
    console.log('📊 Total avatars now:', total);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

removeLogo();
