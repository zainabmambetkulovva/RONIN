import { PrismaClient, UserRole, UserStatus, ComputerStatus, TariffType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding RONIN database...");

  // ── Admin user ──
  const admin = await prisma.user.upsert({
    where: { phone: "+996700000001" },
    update: {},
    create: {
      name: "Admin RONIN",
      phone: "+996700000001",
      email: "admin@ronin.kg",
      role: UserRole.admin,
      status: UserStatus.active,
    },
  });

  // ── Manager user ──
  const manager = await prisma.user.upsert({   
    where: { phone: "+996700000002" },
    update: {},
    create: {
      name: "Manager RONIN",
      phone: "+996700000002",
      email: "manager@ronin.kg",
      role: UserRole.manager,
      status: UserStatus.active,
    },
  });

  console.log(`✅ Users: admin(${admin.id}), manager(${manager.id})`);

  // ── Computer categories ──
  const categories = [
    {
      name: "Standard",
      description: "Стандартные компьютеры для комфортной игры. Intel Core i5, GTX 1660.",
      imageUrl: null,
    },
    {
      name: "Comfort",
      description: "Комфортные места с улучшенными характеристиками. Intel Core i7, RTX 3060.",
      imageUrl: null,
    },
    {
      name: "Premium",
      description: "Премиум-компьютеры с топовым железом. Intel Core i9, RTX 4080.",
      imageUrl: null,
    },
    {
      name: "Ronin Rooms",
      description: "Приватные комнаты для группы. Топовое железо, изолированное пространство.",
      imageUrl: null,
    },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const c = await prisma.computerCategory.upsert({
      where: { name: cat.name } as any,
      update: {},
      create: { ...cat, isActive: true },
    });
    createdCategories[cat.name] = c.id;
  }

  console.log("✅ Categories created");

  // ── Computers (96 total) ──
  const distribution = [
    { category: "Standard", count: 40 },
    { category: "Comfort", count: 30 },
    { category: "Premium", count: 20 },
    { category: "Ronin Rooms", count: 6 },
  ];

  const specs: Record<string, object> = {
    Standard: {
      cpu: "Intel Core i5-12400F",
      gpu: "NVIDIA GTX 1660 Super 6GB",
      ram: "16GB DDR4",
      storage: "512GB NVMe SSD",
      monitor: "24\" IPS 144Hz",
      headset: "HyperX Cloud Core",
      keyboard: "HyperX Alloy FPS",
      mouse: "Logitech G102",
    },
    Comfort: {
      cpu: "Intel Core i7-12700F",
      gpu: "NVIDIA RTX 3060 12GB",
      ram: "32GB DDR4",
      storage: "1TB NVMe SSD",
      monitor: "27\" IPS 165Hz",
      headset: "HyperX Cloud II",
      keyboard: "SteelSeries Apex 3",
      mouse: "SteelSeries Rival 3",
    },
    Premium: {
      cpu: "Intel Core i9-13900K",
      gpu: "NVIDIA RTX 4080 16GB",
      ram: "64GB DDR5",
      storage: "2TB NVMe SSD",
      monitor: "32\" IPS 240Hz 4K",
      headset: "SteelSeries Arctis Nova Pro",
      keyboard: "Keychron Q1 Pro",
      mouse: "Logitech G Pro X Superlight 2",
    },
    "Ronin Rooms": {
      cpu: "Intel Core i9-13900KS",
      gpu: "NVIDIA RTX 4090 24GB",
      ram: "64GB DDR5",
      storage: "2TB NVMe SSD",
      monitor: "34\" Ultrawide 165Hz",
      headset: "SteelSeries Arctis Nova Pro",
      keyboard: "Keychron Q1 Pro",
      mouse: "Logitech G Pro X Superlight 2",
      extras: "Private room, sofa, mini-fridge",
    },
  };

  let computerNumber = 1;
  for (const { category, count } of distribution) {
    const categoryId = createdCategories[category];
    for (let i = 0; i < count; i++) {
      await prisma.computer.upsert({
        where: { number: computerNumber },
        update: {},
        create: {
          categoryId,
          number: computerNumber,
          specifications: specs[category],
          status: ComputerStatus.available,
        },
      });
      computerNumber++;
    }
  }

  console.log(`✅ ${computerNumber - 1} computers created`);

  // ── Tariffs ──
  const tariffData = [
    // Standard
    { category: "Standard", name: "1 час", duration: 60, price: 120, type: TariffType.hourly },
    { category: "Standard", name: "3 часа", duration: 180, price: 300, type: TariffType.hourly },
    { category: "Standard", name: "5 часов", duration: 300, price: 500, type: TariffType.hourly },
    { category: "Standard", name: "Ночной пакет", duration: 480, price: 600, type: TariffType.night },
    { category: "Standard", name: "Утренний пакет", duration: 240, price: 300, type: TariffType.morning },
    // Comfort
    { category: "Comfort", name: "1 час", duration: 60, price: 150, type: TariffType.hourly },
    { category: "Comfort", name: "3 часа", duration: 180, price: 390, type: TariffType.hourly },
    { category: "Comfort", name: "5 часов", duration: 300, price: 600, type: TariffType.hourly },
    { category: "Comfort", name: "Ночной пакет", duration: 480, price: 800, type: TariffType.night },
    { category: "Comfort", name: "Утренний пакет", duration: 240, price: 380, type: TariffType.morning },
    // Premium
    { category: "Premium", name: "1 час", duration: 60, price: 200, type: TariffType.hourly },
    { category: "Premium", name: "3 часа", duration: 180, price: 550, type: TariffType.hourly },
    { category: "Premium", name: "5 часов", duration: 300, price: 850, type: TariffType.hourly },
    { category: "Premium", name: "Ночной пакет", duration: 480, price: 1200, type: TariffType.night },
    { category: "Premium", name: "Утренний пакет", duration: 240, price: 600, type: TariffType.morning },
    // Ronin Rooms
    { category: "Ronin Rooms", name: "1 час", duration: 60, price: 500, type: TariffType.hourly },
    { category: "Ronin Rooms", name: "3 часа", duration: 180, price: 1300, type: TariffType.hourly },
    { category: "Ronin Rooms", name: "Ночной пакет", duration: 480, price: 2500, type: TariffType.night },
  ];

  for (const t of tariffData) {
    await prisma.tariff.create({
      data: {
        categoryId: createdCategories[t.category],
        name: t.name,
        durationMinutes: t.duration,
        price: t.price,
        type: t.type,
        isActive: true,
      },
    });
  }

  console.log("✅ Tariffs created");
  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
