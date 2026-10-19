const fs = require('fs');

// Простой парсер .env файла
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

const BOT_TOKEN = envVars.TELEGRAM_BOT_TOKEN;
const CHAT_ID = envVars.TELEGRAM_ADMIN_CHAT_ID;

console.log('\n🔐 Тестирование Telegram 2FA отправки...\n');
console.log('Bot Token:', BOT_TOKEN ? '✅ найден' : '❌ не найден');
console.log('Chat ID:', CHAT_ID || '❌ не указан');
console.log('');

if (!BOT_TOKEN || !CHAT_ID) {
  console.error('❌ Проверьте .env файл!');
  process.exit(1);
}

const testCode = '123456';
const message = `
🔐 <b>RONIN Admin Login TEST</b>

Ваш код для входа в админку:

<b>${testCode}</b>

⏰ Код действителен 5 минут.

⚠️ Если это были не вы, немедленно свяжитесь с администрацией!
`.trim();

console.log('📤 Отправка тестового сообщения...\n');

async function sendMessage() {
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const result = await response.json();

    if (result.ok) {
      console.log('✅ Сообщение успешно отправлено!');
      console.log('📱 Проверьте Telegram бота');
      console.log('');
      console.log('Детали:');
      console.log(`   Message ID: ${result.result.message_id}`);
      console.log(`   Chat ID: ${result.result.chat.id}`);
      console.log(`   Имя: ${result.result.chat.first_name}`);
      if (result.result.chat.username) {
        console.log(`   Username: @${result.result.chat.username}`);
      }
    } else {
      console.error('❌ Ошибка отправки:');
      console.error(result);
    }
  } catch (error) {
    console.error('❌ Ошибка запроса:', error.message);
  }
}

sendMessage();
