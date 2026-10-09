-- Удалить старые тарифы
DELETE FROM "Tariff";

-- Standard тарифы (сом)
INSERT INTO "Tariff" ("id", "categoryId", "name", "durationMinutes", "price", "type", "isActive", "createdAt", "updatedAt")
SELECT gen_random_uuid(), c.id, '1 час', 60, 80, 'hourly', true, NOW(), NOW()
FROM "ComputerCategory" c WHERE c.name = 'Standard';

INSERT INTO "Tariff" ("id", "categoryId", "name", "durationMinutes", "price", "type", "isActive", "createdAt", "updatedAt")
SELECT gen_random_uuid(), c.id, '2 часа', 120, 150, 'hourly', true, NOW(), NOW()
FROM "ComputerCategory" c WHERE c.name = 'Standard';

INSERT INTO "Tariff" ("id", "categoryId", "name", "durationMinutes", "price", "type", "isActive", "createdAt", "updatedAt")
SELECT gen_random_uuid(), c.id, '3 часа', 180, 210, 'hourly', true, NOW(), NOW()
FROM "ComputerCategory" c WHERE c.name = 'Standard';

INSERT INTO "Tariff" ("id", "categoryId", "name", "durationMinutes", "price", "type", "isActive", "createdAt", "updatedAt")
SELECT gen_random_uuid(), c.id, 'Ночной тариф', 480, 400, 'night', true, NOW(), NOW()
FROM "ComputerCategory" c WHERE c.name = 'Standard';

-- Comfort тарифы (сом)
INSERT INTO "Tariff" ("id", "categoryId", "name", "durationMinutes", "price", "type", "isActive", "createdAt", "updatedAt")
SELECT gen_random_uuid(), c.id, '1 час', 60, 100, 'hourly', true, NOW(), NOW()
FROM "ComputerCategory" c WHERE c.name = 'Comfort';

INSERT INTO "Tariff" ("id", "categoryId", "name", "durationMinutes", "price", "type", "isActive", "createdAt", "updatedAt")
SELECT gen_random_uuid(), c.id, '2 часа', 120, 190, 'hourly', true, NOW(), NOW()
FROM "ComputerCategory" c WHERE c.name = 'Comfort';

INSERT INTO "Tariff" ("id", "categoryId", "name", "durationMinutes", "price", "type", "isActive", "createdAt", "updatedAt")
SELECT gen_random_uuid(), c.id, '3 часа', 180, 270, 'hourly', true, NOW(), NOW()
FROM "ComputerCategory" c WHERE c.name = 'Comfort';

INSERT INTO "Tariff" ("id", "categoryId", "name", "durationMinutes", "price", "type", "isActive", "createdAt", "updatedAt")
SELECT gen_random_uuid(), c.id, 'Ночной тариф', 480, 500, 'night', true, NOW(), NOW()
FROM "ComputerCategory" c WHERE c.name = 'Comfort';

-- Premium тарифы (сом)
INSERT INTO "Tariff" ("id", "categoryId", "name", "durationMinutes", "price", "type", "isActive", "createdAt", "updatedAt")
SELECT gen_random_uuid(), c.id, '1 час', 60, 150, 'hourly', true, NOW(), NOW()
FROM "ComputerCategory" c WHERE c.name = 'Premium';

INSERT INTO "Tariff" ("id", "categoryId", "name", "durationMinutes", "price", "type", "isActive", "createdAt", "updatedAt")
SELECT gen_random_uuid(), c.id, '2 часа', 120, 290, 'hourly', true, NOW(), NOW()
FROM "ComputerCategory" c WHERE c.name = 'Premium';

INSERT INTO "Tariff" ("id", "categoryId", "name", "durationMinutes", "price", "type", "isActive", "createdAt", "updatedAt")
SELECT gen_random_uuid(), c.id, '3 часа', 180, 420, 'hourly', true, NOW(), NOW()
FROM "ComputerCategory" c WHERE c.name = 'Premium';

INSERT INTO "Tariff" ("id", "categoryId", "name", "durationMinutes", "price", "type", "isActive", "createdAt", "updatedAt")
SELECT gen_random_uuid(), c.id, 'Ночной тариф', 480, 800, 'night', true, NOW(), NOW()
FROM "ComputerCategory" c WHERE c.name = 'Premium';

-- Ronin Rooms тарифы (сом)
INSERT INTO "Tariff" ("id", "categoryId", "name", "durationMinutes", "price", "type", "isActive", "createdAt", "updatedAt")
SELECT gen_random_uuid(), c.id, '1 час', 60, 600, 'hourly', true, NOW(), NOW()
FROM "ComputerCategory" c WHERE c.name = 'Ronin Rooms';

INSERT INTO "Tariff" ("id", "categoryId", "name", "durationMinutes", "price", "type", "isActive", "createdAt", "updatedAt")
SELECT gen_random_uuid(), c.id, '2 часа', 120, 1100, 'hourly', true, NOW(), NOW()
FROM "ComputerCategory" c WHERE c.name = 'Ronin Rooms';

INSERT INTO "Tariff" ("id", "categoryId", "name", "durationMinutes", "price", "type", "isActive", "createdAt", "updatedAt")
SELECT gen_random_uuid(), c.id, '3 часа', 180, 1500, 'hourly', true, NOW(), NOW()
FROM "ComputerCategory" c WHERE c.name = 'Ronin Rooms';
