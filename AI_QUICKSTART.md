# 🚀 AI Quick Start Guide

## Быстрый старт за 5 минут

### 1️⃣ Получить API Key

1. Перейди на https://makersuite.google.com/app/apikey
2. Войди через Google
3. Нажми "Create API Key"
4. Скопируй ключ

### 2️⃣ Добавить в .env

```bash
GEMINI_API_KEY="AIzaSy..."  # Твой настоящий ключ
```

### 3️⃣ Готово! 🎉

API endpoints автоматически работают:
- ✅ `/api/ai/chat` - чатбот
- ✅ `/api/ai/recommend-games` - рекомендации игр
- ✅ `/api/ai/suggest-tariff` - подбор тарифа
- ✅ `/api/ai/faq` - ответы на вопросы

---

## 🧪 Тест API

### Вариант 1: cURL (terminal)

```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Привет! Какие игры популярны?"}]}'
```

### Вариант 2: JavaScript (browser console)

```javascript
fetch('/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Какой тариф лучше для 3 часов игры?' }
    ]
  })
})
.then(r => r.json())
.then(data => console.log(data.text));
```

### Вариант 3: Postman

1. Method: `POST`
2. URL: `http://localhost:3000/api/ai/chat`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "messages": [
    { "role": "user", "content": "Сколько стоит час игры?" }
  ]
}
```

---

## 📱 Примеры использования

### Chatbot Dialog

**Request:**
```json
POST /api/ai/chat
{
  "messages": [
    { "role": "user", "content": "Привет!" },
    { "role": "assistant", "content": "Привет! Чем могу помочь?" },
    { "role": "user", "content": "Какие у вас есть категории ПК?" }
  ]
}
```

**Response:**
```json
{
  "text": "В RONIN Gaming Club три категории компьютеров: STANDART (базовые игры), VIP (современные игры на высоких настройках), и ULTRA (топовые игры в 4K). Какая категория вас интересует?",
  "tokens": 85
}
```

---

### Game Recommendations

**Request:**
```json
POST /api/ai/recommend-games
{
  "genres": ["шутеры", "киберспорт"],
  "playedGames": ["CS:GO", "Valorant"],
  "pcCategory": "VIP"
}
```

**Response:**
```json
{
  "recommendations": "1. **Apex Legends** - Динамичный Battle Royale с уникальными персонажами...\n2. **Rainbow Six Siege** - Тактический шутер...\n3. **Overwatch 2** - Командный герой-шутер...",
  "tokens": 156
}
```

---

### Tariff Suggestion

**Request:**
```json
POST /api/ai/suggest-tariff
{
  "duration": "3-4 часа",
  "budget": 200,
  "timeOfDay": "вечер",
  "frequency": "выходные"
}
```

**Response:**
```json
{
  "suggestion": "Для вас оптимален Почасовой тариф на VIP категории (70с/час). За 3 часа выйдет 210 сомов, что укладывается в ваш бюджет. Можете забронировать онлайн со скидкой 10%.",
  "tokens": 92
}
```

---

### FAQ Answer

**Request:**
```json
POST /api/ai/faq
{
  "question": "Можно ли оплатить картой?"
}
```

**Response:**
```json
{
  "answer": "Да, в RONIN Gaming Club принимаем оплату банковскими картами, наличными и через FINIK Pay. Онлайн-бронирование также доступно с картами Visa/MasterCard.",
  "tokens": 68
}
```

---

## 🎨 UI Examples (для копирования)

### Simple Chat Component

```typescript
'use client';
import { useState } from 'react';

export function AIChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.text }]);
    } catch (error) {
      console.error('AI error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chat">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>
      <input 
        value={input} 
        onChange={e => setInput(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && send()}
        placeholder="Задай вопрос..."
        disabled={loading}
      />
      <button onClick={send} disabled={loading}>
        {loading ? 'Думаю...' : 'Отправить'}
      </button>
    </div>
  );
}
```

---

## ❓ FAQ

**Q: Сколько стоит?**
A: Бесплатно до 60 запросов/минуту. Для RONIN этого достаточно.

**Q: Быстро ли отвечает?**
A: Обычно 1-3 секунды. Зависит от длины промпта.

**Q: Работает без интернета?**
A: Нет, нужно интернет соединение к Google API.

**Q: Можно ли кешировать?**
A: Да! Популярные вопросы можно сохранить в БД.

**Q: Мультиязычность?**
A: Gemini понимает русский, кыргызский, английский.

---

## 🔗 Полезные ссылки

- 📘 [Полная документация](./AI_INTEGRATION.md)
- 🌐 [Gemini API Docs](https://ai.google.dev/docs)
- 🔑 [Получить API Key](https://makersuite.google.com/app/apikey)
- 💬 [Google AI Community](https://discuss.ai.google.dev/)

---

**Дата:** 2024-12-14  
**Статус:** ✅ Ready to use
