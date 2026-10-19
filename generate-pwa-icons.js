/**
 * Скрипт для генерации PWA иконок
 * 
 * Требования:
 * - Установите sharp: npm install sharp
 * - Поместите logo-new.png в public/
 * 
 * Запуск: node generate-pwa-icons.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n📱 Генерация PWA иконок для RONIN Gaming Club\n');

// Проверяем наличие sharp
let sharp;
try {
  sharp = require('sharp');
  console.log('✅ sharp установлен');
} catch (error) {
  console.error('❌ sharp не установлен!');
  console.log('');
  console.log('Установите командой:');
  console.log('  npm install sharp');
  console.log('');
  process.exit(1);
}

// Размеры иконок
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Путь к исходному логотипу
const inputLogo = path.join(__dirname, 'public', 'logo-new.png');
const outputDir = path.join(__dirname, 'public', 'icons');

// Проверяем наличие логотипа
if (!fs.existsSync(inputLogo)) {
  console.error(`❌ Файл не найден: ${inputLogo}`);
  console.log('');
  console.log('Убедитесь что logo-new.png находится в папке public/');
  process.exit(1);
}

// Создаём папку для иконок
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log('📁 Создана папка: public/icons/');
}

// Генерируем иконки
async function generateIcons() {
  console.log('\n🔨 Генерация иконок...\n');
  
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    
    try {
      await sharp(inputLogo)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`  ✅ ${size}x${size} -> ${outputPath}`);
    } catch (error) {
      console.error(`  ❌ Ошибка при создании ${size}x${size}:`, error.message);
    }
  }
  
  console.log('\n✨ Готово! Все иконки созданы в public/icons/\n');
  console.log('Следующие шаги:');
  console.log('1. Проверьте иконки в папке public/icons/');
  console.log('2. Убедитесь что manifest.json подключен в layout.tsx');
  console.log('3. Запустите npm run build для проверки PWA');
  console.log('4. Протестируйте в Chrome DevTools -> Lighthouse -> PWA');
  console.log('');
}

generateIcons().catch((error) => {
  console.error('❌ Критическая ошибка:', error);
  process.exit(1);
});
