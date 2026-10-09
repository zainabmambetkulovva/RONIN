const https = require('https');

const BOT_TOKEN = '8824394948:AAE7yJ-Ync30pXVHZo7AOyjDD_1ad_TPc0s';

async function getChatId() {
  return new Promise((resolve, reject) => {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          
          console.log('\n🤖 Telegram Bot Updates:\n');
          
          if (!result.ok) {
            console.error('❌ Ошибка от Telegram API:', result);
            reject(new Error('Telegram API error'));
            return;
          }
          
          if (result.result.length === 0) {
            console.log('⚠️  Нет сообщений от бота.');
            console.log('');
            console.log('📱 Чтобы получить Chat ID:');
            console.log('1. Откройте Telegram');
            console.log('2. Найдите бота (узнайте username у @BotFather)');
            console.log('3. Нажмите START');
            console.log('4. Отправьте любое сообщение боту');
            console.log('5. Запустите этот скрипт снова: node get-telegram-chat-id.js');
            return;
          }
          
          console.log('✅ Найдены сообщения!\n');
          
          // Группируем по chat_id
          const chats = {};
          result.result.forEach(update => {
            if (update.message && update.message.chat) {
              const chat = update.message.chat;
              const chatId = chat.id;
              
              if (!chats[chatId]) {
                chats[chatId] = {
                  id: chatId,
                  type: chat.type,
                  firstName: chat.first_name,
                  lastName: chat.last_name,
                  username: chat.username,
                  lastMessage: update.message.text || '[no text]',
                };
              }
            }
          });
          
          console.log('📋 Список пользователей, писавших боту:\n');
          Object.values(chats).forEach((chat, i) => {
            console.log(`${i + 1}. Chat ID: ${chat.id}`);
            console.log(`   Имя: ${chat.firstName || ''} ${chat.lastName || ''}`);
            if (chat.username) console.log(`   Username: @${chat.username}`);
            console.log(`   Последнее сообщение: "${chat.lastMessage}"`);
            console.log('');
          });
          
          if (Object.keys(chats).length === 1) {
            const chatId = Object.keys(chats)[0];
            console.log('✅ Используйте этот Chat ID для админа:');
            console.log(`\n   ${chatId}\n`);
            console.log('Команды для обновления:');
            console.log('1. В Neon SQL Editor:');
            console.log(`   UPDATE users SET telegram_chat_id = '${chatId}' WHERE email = 'admin@ronin.kg';`);
            console.log('');
            console.log('2. Раскомментируйте Telegram отправку в send-2fa/route.ts');
          } else if (Object.keys(chats).length > 1) {
            console.log('⚠️  Несколько пользователей писали боту. Выберите нужный Chat ID.');
          }
          
          resolve(chats);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

getChatId().catch(error => {
  console.error('❌ Ошибка:', error.message);
});
