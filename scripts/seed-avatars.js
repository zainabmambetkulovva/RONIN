/**
 * Seed avatars from public/avatars folder to database
 * 
 * Usage: node scripts/seed-avatars.js
 */

const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const AVATARS_DIR = path.join(__dirname, "../public/avatars");

async function seedAvatars() {
  console.log("🎨 Starting avatar seeding...\n");

  try {
    // Read all files from avatars directory
    const files = fs.readdirSync(AVATARS_DIR);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|webp)$/i.test(file) && file !== "README.md"
    );

    console.log(`Found ${imageFiles.length} avatar images\n`);

    // Create avatars in database
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const avatarCode = `avatar${i + 1}`;
      const imageUrl = `/avatars/${file}`;

      // Check if avatar already exists
      const existing = await prisma.avatars.findUnique({
        where: { code: avatarCode }
      });

      if (existing) {
        console.log(`⏭️  Skipping ${avatarCode} (already exists)`);
        continue;
      }

      // Create new avatar
      await prisma.avatars.create({
        data: {
          id: require('crypto').randomUUID(),
          code: avatarCode,
          image_url: imageUrl,
          is_active: true
        }
      });

      console.log(`✅ Created ${avatarCode}: ${file}`);
    }

    console.log("\n✨ Avatar seeding completed!");
    
    // Show total count
    const totalAvatars = await prisma.avatars.count();
    console.log(`\n📊 Total avatars in database: ${totalAvatars}`);

  } catch (error) {
    console.error("❌ Error seeding avatars:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedAvatars();
