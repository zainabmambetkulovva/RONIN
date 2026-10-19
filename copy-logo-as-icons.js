/**
 * Простой скрипт копирования логотипа как PWA иконок
 * Использует только встроенные Node.js модули (без зависимостей)
 */

const fs = require('fs');
const path = require('path');

console.log('\n📱 Копирование логотипа как PWA иконок\n');

const logoPath = path.join(__dirname, 'public', 'logo-new.png');
const iconsDir = path.join(__dirname, 'public', 'icons');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Проверяем логотип
if (!fs.existsSync(logoPath)) {
  console.error('❌ Файл logo-new.png не найден в public/');
  console.log('');
  console.log('Альтернативные варианты:');
  console.log('1. Скопируйте ваш логотип в public/logo-new.png');
  console.log('2. Или используйте онлайн генератор: https://realfavicongenerator.net/');
  process.exit(1);
}

// Создаём папку для иконок
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Копируем логотип для всех размеров
console.log('📦 Копирование логотипа для всех размеров...\n');

sizes.forEach(size => {
  const targetPath = path.join(iconsDir, `icon-${size}x${size}.png`);
  fs.copyFileSync(logoPath, targetPath);
  console.log(`  ✅ Скопировано: icon-${size}x${size}.png`);
});

console.log('\n⚠️  ВАЖНО: Это временное решение!\n');
console.log('Текущие иконки - это копии оригинального логотипа.');
console.log('Для лучшего качества рекомендуем:');
console.log('');
console.log('Вариант 1: Автоматическая генерация');
console.log('  1. npm install sharp');
console.log('  2. node generate-pwa-icons.js');
console.log('');
console.log('Вариант 2: Онлайн генератор');
console.log('  1. Откройте: https://realfavicongenerator.net/');
console.log('  2. Загрузите logo-new.png');
console.log('  3. Скачайте и замените иконки в public/icons/');
console.log('');
console.log('✨ Базовые иконки готовы! Можно продолжать.\n');
