// Quick test script to check if booking creation works
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testBooking() {
  console.log('🔍 Testing booking creation...\n');

  try {
    // 1. Check if mock user exists
    console.log('1. Checking mock user...');
    const user = await prisma.user.findUnique({
      where: { id: 'mock-user-id' },
    });
    
    if (!user) {
      console.error('❌ Mock user not found!');
      return;
    }
    console.log('✅ Mock user found:', user.name);

    // 2. Check categories
    console.log('\n2. Checking categories...');
    const categories = await prisma.computerCategory.findMany({
      where: { isActive: true },
    });
    console.log(`✅ Found ${categories.length} categories`);

    // 3. Check tariffs
    console.log('\n3. Checking tariffs...');
    const tariffs = await prisma.tariff.findMany({
      where: { isActive: true },
      take: 5,
    });
    console.log(`✅ Found ${tariffs.length} tariffs`);
    if (tariffs.length > 0) {
      console.log('   First tariff:', tariffs[0].name, '-', tariffs[0].price, 'сом');
    }

    // 4. Check computers
    console.log('\n4. Checking computers...');
    const computers = await prisma.computer.findMany({
      where: { status: 'available' },
      take: 5,
    });
    console.log(`✅ Found ${computers.length} available computers`);

    // 5. Try to create a test booking
    if (categories.length > 0 && tariffs.length > 0 && computers.length > 0) {
      console.log('\n5. Creating test booking...');
      
      const testDate = new Date();
      testDate.setHours(testDate.getHours() + 1);
      
      const endDate = new Date(testDate);
      endDate.setMinutes(endDate.getMinutes() + tariffs[0].durationMinutes);

      const booking = await prisma.booking.create({
        data: {
          bookingNumber: `TEST-${Date.now()}`,
          bookingCode: String(Math.floor(10000 + Math.random() * 90000)),
          userId: 'mock-user-id',
          computerId: computers[0].id,
          tariffId: tariffs[0].id,
          startAt: testDate,
          endAt: endDate,
          durationMinutes: tariffs[0].durationMinutes,
          price: tariffs[0].price,
          status: 'pending',
          qrToken: require('crypto').randomBytes(32).toString('hex'),
        },
      });

      console.log('✅ Test booking created successfully!');
      console.log('   Booking ID:', booking.id);
      console.log('   Booking Code:', booking.bookingCode);

      // Clean up test booking
      await prisma.booking.delete({
        where: { id: booking.id },
      });
      console.log('✅ Test booking cleaned up');
    }

    console.log('\n🎉 All checks passed! Booking system is working.');
    
  } catch (error) {
    console.error('\n❌ Error during test:');
    console.error(error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testBooking();
