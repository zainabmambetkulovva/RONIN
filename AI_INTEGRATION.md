# 🤖 Gemini AI Integration для RONIN Gaming Club

## 📋 Обзор

Интеграция Google Gemini AI для улучшения пользовательского опыта:
- **AI Chatbot** - поддержка пользователей 24/7
- **Игровые рекомендации** - персонализированный подбор игр
- **Оптимизация тарифов** - помощь в выборе оптимального тарифа
- **FAQ Assistant** - автоматические ответы на вопросы

---

## 🔧 Настройка

### 1. Получить Gemini API Key

1. Перейти на https://makersuite.google.com/app/apikey
2. Войти через Google аккаунт
3. Создать новый API key
4. Скопировать ключ

### 2. Добавить в .env

```bash
GEMINI_API_KEY="YOUR_ACTUAL_API_KEY_HERE"
```

### 3. Установить зависимости (если нужно)

Все работает через встроенный `fetch`, дополнительные библиотеки не нужны.

---

## 📡 API Endpoints

### 1. **AI Chatbot**

**Endpoint:** `POST /api/ai/chat`

**Описание:** Диалог с AI ассистентом клуба

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Какие игры популярны в вашем клубе?" },
    { "role": "assistant", "content": "В RONIN популярны CS:GO, Dota 2, Valorant..." },
    { "role": "user", "content": "А какой тариф лучше для CS:GO?" }
  ]
}
```

**Response:**
```json
{
  "text": "Для CS:GO подойдет Почасовой тариф...",
  "tokens": 150
}
```

---

### 2. **Рекомендация игр**

**Endpoint:** `POST /api/ai/recommend-games`

**Описание:** Персонализированный подбор игр

**Request:**
```json
{
  "genres": ["шутеры", "MOBA"],
  "playedGames": ["CS:GO", "Dota 2"],
  "pcCategory": "VIP"
}
```

**Response:**
```json
{
  "recommendations": "1. **Valorant** - тактический шутер...\n2. **Apex Legends** - ...",
  "tokens": 200
}
```

---

### 3. **Подбор тарифа**

**Endpoint:** `POST /api/ai/suggest-tariff`

**Описание:** Оптимальный тариф на основе потребностей

**Request:**
```json
{
  "duration": "3-4 часа",
  "budget": 200,
  "timeOfDay": "вечер",
  "frequency": "2-3 раза в неделю"
}
```

**Response:**
```json
{
  "suggestion": "Для вас оптимален Почасовой тариф VIP категории...",
  "tokens": 120
}
```

---

### 4. **FAQ Assistant**

**Endpoint:** `POST /api/ai/faq`

**Описание:** Ответы на вопросы о клубе

**Request:**
```json
{
  "question": "Можно ли принести свою еду?"
}
```

**Response:**
```json
{
  "answer": "В RONIN Gaming Club вы можете приносить свою еду и напитки...",
  "tokens": 80
}
```

---

## 🎨 Frontend Components (будущие)

### AI Chat Widget

```typescript
// Пример использования в React компоненте
const [messages, setMessages] = useState<GeminiMessage[]>([]);
const [input, setInput] = useState('');

const sendMessage = async () => {
  const newMessages = [...messages, { role: 'user', content: input }];
  setMessages(newMessages);
  
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: newMessages })
  });
  
  const data = await response.json();
  setMessages([...newMessages, { role: 'assistant', content: data.text }]);
};
```

### Game Recommendations

```typescript
const getGameRecommendations = async (preferences: {
  genres: string[];
  playedGames: string[];
}) => {
  const response = await fetch('/api/ai/recommend-games', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preferences)
  });
  
  const data = await response.json();
  return data.recommendations;
};
```

---

## 🚀 Planned Features (Будущие фичи)

### 1. **AI Chatbot Widget** (priority: HIGH)
- Floating chat button в правом нижнем углу
- История диалогов
- Быстрые ответы (Quick Replies)
- Typing indicator

**Где разместить:**
- `/dashboard` - главная страница после логина
- `/booking` - помощь с бронированием
- `/` (landing) - поддержка новых пользователей

### 2. **Smart Tariff Selector** (priority: HIGH)
- Интерактивная форма с вопросами
- AI анализирует ответы и предлагает тариф
- Калькулятор экономии

**Где разместить:**
- `/booking` - перед выбором тарифа
- Отдельная страница `/tariff-helper`

### 3. **Personalized Game Feed** (priority: MEDIUM)
- AI рекомендации на основе истории
- Trending games с описаниями от AI
- "Игроки похожие на тебя играют в..."

**Где разместить:**
- `/dashboard` - персональный feed
- `/profile` - рекомендованные игры

### 4. **AI-powered FAQ** (priority: MEDIUM)
- Умный поиск по FAQ
- AI генерирует ответы на нестандартные вопросы
- Feedback система (полезно/не полезно)

**Где разместить:**
- `/support` или `/faq` - новая страница
- Footer - ссылка "Задать вопрос AI"

### 5. **Event Description Generator** (priority: LOW)
- Автоматическое описание турниров
- Генерация промо-текстов
- Для админки

**Где разместить:**
- `/admin/events` - кнопка "Сгенерировать описание"

---

## 💰 Cost Estimation

**Gemini API Pricing:**
- **Free tier:** 60 requests/minute
- **Pro tier:** от $0.0001 за 1K characters

**Примерный расход для RONIN:**
- Chatbot: ~100-200 requests/день = **FREE**
- Рекомендации: ~50 requests/день = **FREE**
- FAQ: ~30 requests/день = **FREE**

**Вывод:** На начальном этапе бесплатного tier достаточно.

---

## 🔒 Security & Privacy

### API Key Protection
- ✅ API key только в `.env` (server-side)
- ✅ Не отправляется на client
- ✅ Добавлен в `.gitignore`

### Rate Limiting (TODO)
Рекомендуется добавить:
```typescript
// middleware.ts
import { rateLimit } from '@/lib/rate-limit';

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api/ai/')) {
    const limited = await rateLimit(req);
    if (limited) {
      return new NextResponse('Too many requests', { status: 429 });
    }
  }
}
```

### Data Privacy
- ❌ НЕ отправляем персональные данные в промпты
- ✅ Только обезличенную информацию (жанры, предпочтения)
- ✅ История чатов НЕ сохраняется на Google серверах (stateless API)

---

## 📊 Monitoring & Analytics (TODO)

Рекомендуется отслеживать:
- Количество AI запросов в день
- Средняя длительность ответа
- Популярные вопросы/темы
- User satisfaction (like/dislike)

**Как реализовать:**
```typescript
// lib/analytics.ts
export async function trackAIUsage(type: string, tokens: number) {
  await prisma.ai_usage.create({
    data: { type, tokens, timestamp: new Date() }
  });
}
```

---

## 🧪 Testing

### Тестирование API вручную

```bash
# 1. Chat
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Привет!"}]}'

# 2. Game recommendations
curl -X POST http://localhost:3000/api/ai/recommend-games \
  -H "Content-Type: application/json" \
  -d '{"genres":["шутеры"],"playedGames":["CS:GO"]}'

# 3. Tariff suggestion
curl -X POST http://localhost:3000/api/ai/suggest-tariff \
  -H "Content-Type: application/json" \
  -d '{"duration":"3 часа","budget":150}'

# 4. FAQ
curl -X POST http://localhost:3000/api/ai/faq \
  -H "Content-Type: application/json" \
  -d '{"question":"Какой у вас адрес?"}'
```

---

## 📚 Next Steps

### Phase 1: Базовая интеграция ✅ (DONE)
- [x] Gemini library (`lib/gemini.ts`)
- [x] API endpoints (`/api/ai/*`)
- [x] .env configuration
- [x] Documentation

### Phase 2: UI Components (TODO)
- [ ] AI Chatbot Widget компонент
- [ ] Tariff Helper страница
- [ ] Game Recommendations в Dashboard
- [ ] FAQ страница с AI

### Phase 3: Advanced Features (TODO)
- [ ] Rate limiting
- [ ] Analytics tracking
- [ ] A/B testing AI responses
- [ ] Multi-language support (ru/ky/en)

### Phase 4: Optimization (TODO)
- [ ] Caching популярных запросов
- [ ] Response time optimization
- [ ] Cost monitoring dashboard

---

## 🐛 Troubleshooting

### "API key not configured"
**Решение:** Проверь `.env` файл, убедись что `GEMINI_API_KEY` установлен.

### "Too many requests"
**Решение:** Free tier ограничен 60 req/min. Подожди минуту или upgrade до Pro.

### "Failed to fetch"
**Решение:** 
1. Проверь интернет соединение
2. Убедись что API key валиден
3. Проверь firewall/proxy настройки

### Медленные ответы
**Решение:**
1. Уменьши `maxTokens` в config
2. Используй более короткие промпты
3. Кешируй популярные запросы

---

## 📞 Support

**Вопросы по интеграции:**
- GitHub Issues: [ссылка на репозиторий]
- Telegram: @ronin_dev

**Gemini API Documentation:**
- https://ai.google.dev/docs
- https://ai.google.dev/tutorials/rest_quickstart

---

**Последнее обновление:** 2024-12-14
**Версия:** 1.0.0
**Статус:** ✅ Готово к разработке UI
