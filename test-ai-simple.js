// Простейший тест Gemini API
const fs = require('fs');
const path = require('path');

// Читаем .env файл напрямую
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');

// Ищем GEMINI_API_KEY
const match = envContent.match(/GEMINI_API_KEY="([^"]+)"/);

if (!match) {
  console.error('❌ GEMINI_API_KEY не найден в .env файле!');
  process.exit(1);
}

const apiKey = match[1];

console.log('\n╔════════════════════════════════════════╗');
console.log('║     GEMINI API KEY ПРОВЕРКА           ║');
console.log('╚════════════════════════════════════════╝\n');

console.log('🔍 Найденный ключ:', apiKey.substring(0, 15) + '...');
console.log('📏 Длина:', apiKey.length, 'символов');
console.log('');

// Проверки
const checks = [
  {
    name: 'Правильный формат',
    test: apiKey.startsWith('AIza') || apiKey.startsWith('AQ.'),
    good: apiKey.startsWith('AIza') ? '✅ API Key формат (AIza)' : '✅ OAuth формат (AQ) - новый тип ключа',
    bad: '❌ ОШИБКА! Ключ должен начинаться с "AIza" или "AQ."'
  },
  {
    name: 'Не placeholder',
    test: apiKey !== 'your_gemini_api_key_here' && apiKey !== 'AIza...',
    good: '✅ Реальный ключ',
    bad: '❌ Это placeholder, нужен реальный ключ!'
  },
  {
    name: 'Правильная длина',
    test: apiKey.length >= 35 && apiKey.length <= 60,
    good: '✅ Длина в пределах нормы',
    bad: '⚠️  Необычная длина, может быть ошибка'
  }
];

let allGood = true;
checks.forEach(check => {
  const passed = check.test;
  console.log(passed ? check.good : check.bad);
  if (!passed) allGood = false;
});

console.log('');

if (!allGood) {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  ❌ КЛЮЧ НЕПРАВИЛЬНЫЙ!                ║');
  console.log('╚════════════════════════════════════════╝\n');
  console.log('📋 Как получить правильный ключ:\n');
  console.log('1. Откройте: https://aistudio.google.com/apikey');
  console.log('2. Нажмите "Create API key"');
  console.log('3. Скопируйте ключ (начинается с AIza)');
  console.log('4. Вставьте в .env файл');
  console.log('5. Перезапустите сервер\n');
  process.exit(1);
}

console.log('╔════════════════════════════════════════╗');
console.log('║  ✅ КЛЮЧ ВЫГЛЯДИТ ПРАВИЛЬНО!          ║');
console.log('╚════════════════════════════════════════╝\n');
console.log('🔄 Теперь тестируем API запрос...\n');

// Тестовый запрос
async function testAPI() {
  const isOAuthKey = apiKey.startsWith('AQ.');
  
  let url, headers;
  if (isOAuthKey) {
    url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`;
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
  } else {
    url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    headers = { 'Content-Type': 'application/json' };
  }
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Скажи просто "Работает"' }] }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.log('❌ API вернул ошибку:', response.status);
      console.log('');
      console.log('Детали ошибки:');
      console.log(JSON.stringify(data, null, 2));
      console.log('');
      
      if (data.error?.message) {
        console.log('💬 Сообщение:', data.error.message);
        
        if (data.error.message.includes('API key not valid')) {
          console.log('');
          console.log('💡 Решение:');
          console.log('   - Получите НОВЫЙ ключ на https://aistudio.google.com/apikey');
          console.log('   - Скопируйте БЕЗ пробелов');
          console.log('   - Обновите .env файл');
        }
        
        if (data.error.message.includes('billing')) {
          console.log('');
          console.log('💡 Решение:');
          console.log('   - Включите биллинг в Google Cloud');
          console.log('   - Gemini имеет бесплатный tier!');
        }
      }
      
      process.exit(1);
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    console.log('╔════════════════════════════════════════╗');
    console.log('║  🎉 УСПЕХ! API РАБОТАЕТ!              ║');
    console.log('╚════════════════════════════════════════╝\n');
    console.log('🤖 Ответ от Gemini:', text);
    console.log('');
    console.log('✅ Всё отлично! Теперь:');
    console.log('   1. Перезапустите сервер (Ctrl+C, потом npm run dev)');
    console.log('   2. Откройте сайт');
    console.log('   3. Попробуйте AI чат\n');
    
  } catch (error) {
    console.log('❌ Ошибка сети:', error.message);
    console.log('');
    console.log('💡 Возможные причины:');
    console.log('   - Нет интернета');
    console.log('   - Firewall блокирует');
    console.log('   - VPN/прокси мешает\n');
    process.exit(1);
  }
}

testAPI();
