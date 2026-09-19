/**
 * Скрипт быстрой настройки БД для RONIN
 * Запуск: node scripts/setup-db.js
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Настройка базы данных RONIN...\n");

  try {
    // Проверка подключения
    await prisma.$connect();
    console.log("✅ Подключение к БД успешно\n");

    // Создаём тестового админа
    const adminEmail = "admin@ronin.kg";
    const adminPassword = "admin123";

    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log("⚠️  Admin уже существует");
      console.log(`   Email: ${adminEmail}`);
      console.log(`   ID: ${existingAdmin.id}\n`);
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      const admin = await prisma.user.create({
        data: {
          name: "Admin User",
          email: adminEmail,
          password: hashedPassword,
          role: "admin",
          status: "active",
        },
      });

      console.log("✅ Admin создан!");
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      console.log(`   ID: ${admin.id}\n`);
    }

    // Создаём тестового менеджера
    const managerEmail = "manager@ronin.kg";
    const managerPassword = "manager123";

    const existingManager = await prisma.user.findUnique({
      where: { email: managerEmail },
    });

    if (existingManager) {
      console.log("⚠️  Manager уже существует");
      console.log(`   Email: ${managerEmail}`);
      console.log(`   ID: ${existingManager.id}\n`);
    } else {
      const hashedPassword = await bcrypt.hash(managerPassword, 10);

      const manager = await prisma.user.create({
        data: {
          name: "Manager User",
          email: managerEmail,
          password: hashedPassword,
          role: "manager",
          status: "active",
        },
      });

      console.log("✅ Manager создан!");
      console.log(`   Email: ${managerEmail}`);
      console.log(`   Password: ${managerPassword}`);
      console.log(`   ID: ${manager.id}\n`);
    }

    console.log("🎉 Настройка завершена!\n");
    console.log("Теперь можешь:");
    console.log("1. Зайти в админку: http://localhost:3000/login");
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log("\n2. Регистрировать новых пользователей: http://localhost:3000/register\n");
  } catch (error) {
    console.error("❌ Ошибка:", error.message);
    console.error("\nПопробуй:");
    console.error("1. npx prisma generate");
    console.error("2. npx prisma db push");
    console.error("3. node scripts/setup-db.js\n");
  } finally {
    await prisma.$disconnect();
  }
}

main();
