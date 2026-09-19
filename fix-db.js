/**
 * Скрипт для синхронизации базы данных
 * Запустите: node fix-db.js
 */

const { execSync } = require('child_process');

console.log('🔄 Начинаю синхронизацию базы данных...\n');

try {
  console.log('1️⃣ Генерация Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('\n2️⃣ Применение миграций к базе данных...');
  execSync('npx prisma db push --force-reset', { stdio: 'inherit' });
  
  console.log('\n✅ База данных успешно синхронизирована!');
  console.log('Теперь регистрация должна работать.\n');
  
} catch (error) {
  console.error('\n❌ Ошибка при синхронизации:', error.message);
  console.log('\nПопробуйте вручную:');
  console.log('  1. npx prisma generate');
  console.log('  2. npx prisma db push --force-reset');
  process.exit(1);
}
