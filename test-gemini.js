// Тест Gemini API
require('dotenv').config({ path: '.env' });

const API_KEY = process.env.GEMINI_API_KEY;

console.log('\n=== GEMINI API TEST ===\n');
console.log('API Key from .env:', API_KEY ? `${API_KEY.substring(0, 20)}...` : 'NOT FOUND');
console.log('Key length:', API_KEY?.length || 0);
console.log('Starts with AIza:', API_KEY?.startsWith('AIza') || false);
console.log('Starts with AQ.:', API_KEY?.startsWith('AQ.') || false);

if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
  console.error('\n❌ ERROR: GEMINI_API_KEY not set in .env file!\n');
  process.exit(1);
}

if (API_KEY.startsWith('AQ.')) {
  console.error('\n❌ ERROR: Это неправильный тип ключа!');
  console.error('Вы получили "API & services credentials" вместо "Gemini API key"');
  console.error('\nПравильный путь:');
  console.error('1. Откройте: https://aistudio.google.com/apikey');
  console.error('2. Нажмите "Get API key" или "Create API key"');
  console.error('3. Выберите "Create API key in new project"');
  console.error('4. Скопируйте ключ (начинается с AIza)\n');
  process.exit(1);
}

if (!API_KEY.startsWith('AIza')) {
  console.warn('\n⚠️  WARNING: Ключ не начинается с "AIza"');
  console.warn('Обычно Gemini API ключи начинаются с AIza');
  console.warn('Но попробуем протестировать...\n');
}

// Test API call
async function testGemini() {
  console.log('\n🔄 Testing Gemini API...\n');
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Скажи "Привет" на русском'
          }]
        }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ API Error:', response.status, response.statusText);
      console.error('Response:', JSON.stringify(data, null, 2));
      
      if (data.error?.message?.includes('API key')) {
        console.error('\n💡 Проблема с API ключом!');
        console.error('Проверьте:');
        console.error('1. Ключ скопирован полностью (без пробелов)');
        console.error('2. Ключ из правильного места: https://aistudio.google.com/apikey');
        console.error('3. API Key не заблокирован');
        console.error('4. Gemini API включен для вашего проекта\n');
      }
      
      process.exit(1);
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('✅ SUCCESS! Gemini ответил:', text);
    console.log('\n✅ API Key работает правильно!\n');
    console.log('Теперь:');
    console.log('1. Перезапустите сервер: npm run dev');
    console.log('2. Откройте сайт');
    console.log('3. Попробуйте AI чат\n');
    
  } catch (error) {
    console.error('❌ Network Error:', error.message);
    console.error('\nВозможные причины:');
    console.error('- Нет интернета');
    console.error('- Gemini API недоступен');
    console.error('- Firewall блокирует запрос\n');
    process.exit(1);
  }
}

testGemini();
