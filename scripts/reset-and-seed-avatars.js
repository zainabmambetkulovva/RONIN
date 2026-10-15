/**
 * Reset and seed avatars - removes old avatars and creates new ones
 * 
 * Usage: node scripts/reset-and-seed-avatars.js
 */

const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const prisma = new PrismaClient();

const AVATARS_DIR = path.join(__dirname, "../public/avatars");

async function resetAndSeedAvatars() {
  console.log("🎨 Starting avatar reset and seeding...\n");

  try {
    // Step 1: Delete all existing avatars
    console.log("🗑️  Deleting old avatars...");
    const deleteResult = await prisma.avatars.deleteMany({});
    console.log(`   Deleted ${deleteResult.count} old avatars\n`);

    // Step 2: Read all files from avatars directory
    const files = fs.readdirSync(AVATARS_DIR);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|webp)$/i.test(file) && 
      file !== "README.md" &&
      !file.startsWith('image_') // Skip old avatar files
    );

    console.log(`Found ${imageFiles.length} new avatar images\n`);

    // Step 3: Create new avatars in database
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const avatarCode = `avatar${i + 1}`;
      const imageUrl = `/avatars/${file}`;

      await prisma.avatars.create({
        data: {
          id: crypto.randomUUID(),
          code: avatarCode,
          image_url: imageUrl,
          is_active: true
        }
      });

      console.log(`✅ Created ${avatarCode}: ${file}`);
    }

    console.log("\n✨ Avatar seeding completed!");
    
    // Step 4: Show total count
    const totalAvatars = await prisma.avatars.count();
    console.log(`\n📊 Total avatars in database: ${totalAvatars}`);

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetAndSeedAvatars();
