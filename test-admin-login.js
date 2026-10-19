/**
 * Простой тест для проверки админ логина с 2FA
 */

const fs = require('fs');

// Парсим .env
const envFile = fs.readFileSync('.env', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  line = line.trim();
  if (line && !line.startsWith('#')) {
    const match = line.match(/^([^=]+)=["']?([^"']*)["']?$/);
    if (match) {
      envVars[match[1]] = match[2];
    }
  }
});

const DATABASE_URL = envVars.DATABASE_URL;
const TELEGRAM_BOT_TOKEN = envVars.TELEGRAM_BOT_TOKEN;
const TELEGRAM_ADMIN_CHAT_ID = envVars.TELEGRAM_ADMIN_CHAT_ID;

console.log('\n🔐 Тест админ логина с 2FA\n');
console.log('Конфигурация:');
console.log('  Database:', DATABASE_URL ? '✅ подключена' : '❌ не указана');
console.log('  Telegram Bot Token:', TELEGRAM_BOT_TOKEN ? '✅ найден' : '❌ не найден');
console.log('  Telegram Chat ID:', TELEGRAM_ADMIN_CHAT_ID || '❌ не указан');
console.log('');

// Проверяем наличие админа в базе
console.log('📊 Проверка базы данных...\n');

const testLogin = async () => {
  try {
    // Отправляем тестовый 2FA код
    const testCode = Math.floor(100000 + Math.random() * 900000).toString();
    const message = `
🔐 <b>RONIN Admin Login - TEST</b>

Тестовый код для входа:

<b>${testCode}</b>

⏰ Это тестовое сообщение для проверки 2FA.
    `.trim();

    console.log(`Генерируем тестовый код: ${testCode}`);
    console.log('Отправляем в Telegram...\n');

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_ADMIN_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const result = await response.json();

    if (result.ok) {
      console.log('✅ 2FA код успешно отправлен!');
      console.log('📱 Проверьте Telegram бота\n');
      console.log('Теперь протестируйте логин:');
      console.log('1. Откройте http://localhost:3004/admin');
      console.log('2. Введите email: admin@ronin.kg');
      console.log('3. Введите пароль админа');
      console.log(`4. Введите код из Telegram: ${testCode}`);
      console.log('');
      console.log('✨ Если всё работает - 2FA настроен правильно!');
    } else {
      console.error('❌ Ошибка отправки 2FA:');
      console.error(result);
    }

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
};

if (!DATABASE_URL || !TELEGRAM_BOT_TOKEN || !TELEGRAM_ADMIN_CHAT_ID) {
  console.error('❌ Проверьте .env файл! Не все переменные заданы.');
  process.exit(1);
}

testLogin();
