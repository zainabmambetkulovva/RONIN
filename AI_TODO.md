# 🎯 AI Integration TODO List

## ✅ DONE (Готово)

### Backend Infrastructure
- [x] Gemini service library (`src/lib/gemini.ts`)
- [x] Chat API endpoint (`/api/ai/chat`)
- [x] Game recommendations endpoint (`/api/ai/recommend-games`)
- [x] Tariff suggestion endpoint (`/api/ai/suggest-tariff`)
- [x] FAQ endpoint (`/api/ai/faq`)
- [x] Environment configuration (`.env`)
- [x] Documentation (`AI_INTEGRATION.md`, `AI_QUICKSTART.md`)

### Configuration
- [x] `.env` with `GEMINI_API_KEY` placeholder
- [x] `.env.example` updated
- [x] API key security (server-side only)

---

## 🚧 TODO (Нужно сделать)

### Phase 1: UI Components (HIGH Priority)

#### 1. AI Chatbot Widget
**Файл:** `src/components/ai/AIChatWidget.tsx`

**Функционал:**
- [ ] Floating button в правом нижнем углу
- [ ] Модальное окно чата (открыть/закрыть)
- [ ] История сообщений (user + assistant)
- [ ] Typing indicator во время ответа AI
- [ ] Quick replies (быстрые вопросы)
- [ ] Scroll to bottom при новом сообщении
- [ ] Сохранение истории в localStorage (опционально)

**Design:**
- Киберпанк стиль (синий/фиолетовый неон)
- Compact на мобильных
- Анимации (fade in/out, slide up)

**Где разместить:**
- `/dashboard` - для авторизованных пользователей
- `/` (landing) - для всех посетителей
- `/booking` - помощь при бронировании

**Пример API использования:**
```typescript
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  body: JSON.stringify({ 
    messages: [
      { role: 'user', content: userInput }
    ] 
  })
});
const data = await response.json();
console.log(data.text); // Ответ AI
```

---

#### 2. Smart Tariff Helper Page
**Файл:** `src/app/tariff-helper/page.tsx`

**Функционал:**
- [ ] Форма с вопросами:
  - Сколько часов планируете играть?
  - Какой у вас бюджет?
  - В какое время приходите? (утро/день/вечер/ночь)
  - Как часто посещаете клуб? (первый раз/редко/часто)
- [ ] AI анализирует ответы
- [ ] Показывает рекомендованный тариф с обоснованием
- [ ] Кнопка "Забронировать с этим тарифом"

**Design:**
- Wizard-style (шаг за шагом)
- Прогресс бар (1/4, 2/4, 3/4, 4/4)
- Анимированный результат

**Где разместить:**
- Ссылка в Navbar: "AI Помощник"
- Кнопка на `/booking`: "Не знаете какой тариф? Помощник AI"

---

#### 3. Personalized Game Recommendations
**Файл:** `src/components/dashboard/AIGameRecommendations.tsx`

**Функционал:**
- [ ] Показывает 3-5 рекомендованных игр
- [ ] На основе:
  - История бронирований пользователя (если есть)
  - Популярные игры в клубе
  - Категория ПК пользователя (если выбрана)
- [ ] Каждая игра: название, описание от AI, жанр
- [ ] Кнопка "Показать еще"

**Design:**
- Карточки игр (grid layout)
- Skeleton loader во время загрузки
- Hover эффект (glow)

**Где разместить:**
- `/dashboard` - секция "Рекомендуем попробовать"
- `/profile` - "Игры для тебя"

---

#### 4. AI-powered FAQ Page
**Файл:** `src/app/faq/page.tsx`

**Функционал:**
- [ ] Поле поиска/ввода вопроса
- [ ] AI генерирует ответ на любой вопрос
- [ ] Показывает также статичный FAQ (популярные вопросы)
- [ ] Feedback: "Полезно" / "Не полезно" (сохранить в БД)
- [ ] История вопросов пользователя (optional)

**Design:**
- Minimalist
- Большое поле ввода в центре
- Ответ появляется с fade-in анимацией

**Где разместить:**
- Footer: ссылка "Частые вопросы"
- Navbar: "Поддержка AI"

---

### Phase 2: Optimization (MEDIUM Priority)

#### 5. Response Caching
**Файл:** `src/lib/ai-cache.ts`

**Функционал:**
- [ ] Кешировать популярные вопросы в Redis/БД
- [ ] TTL: 24 часа
- [ ] Ключ: hash от промпта
- [ ] Fallback к API если нет в кеше

**Зачем:**
- Экономия API requests
- Быстрее ответы (без ожидания API)
- Меньше costs

---

#### 6. Rate Limiting
**Файл:** `src/middleware.ts` или `src/lib/rate-limit.ts`

**Функционал:**
- [ ] Лимит: 10 AI requests за 1 минуту на IP
- [ ] Для авторизованных: 20 requests/min
- [ ] 429 response при превышении
- [ ] Показать сообщение: "Слишком много запросов, подождите..."

**Зачем:**
- Защита от злоупотреблений
- Контроль costs

---

#### 7. Analytics Dashboard
**Файл:** `src/app/admin/ai-analytics/page.tsx`

**Функционал:**
- [ ] Общее количество AI requests
- [ ] Разбивка по типам (chat/games/tariff/faq)
- [ ] Средняя длина ответов (tokens)
- [ ] Популярные вопросы (top 10)
- [ ] График по дням/неделям
- [ ] Estimated cost (tokens * price)

**Зачем:**
- Мониторинг использования
- Планирование бюджета
- Выявление популярных тем

---

### Phase 3: Advanced Features (LOW Priority)

#### 8. Multi-language AI
**Функционал:**
- [ ] Определять язык вопроса (ru/ky/en)
- [ ] AI отвечает на том же языке
- [ ] Переключатель языка в chatbot

**Как реализовать:**
Добавить в промпт:
```
Ответь на языке пользователя (русский/кыргызский/английский).
Вопрос: ${userQuestion}
```

---

#### 9. Voice Input (Speech-to-Text)
**Функционал:**
- [ ] Кнопка микрофона в chatbot
- [ ] Web Speech API или OpenAI Whisper
- [ ] Конвертация голоса в текст
- [ ] Отправка текста в AI

**Зачем:**
- Удобство на мобильных
- Accessibility (для людей с ограничениями)

---

#### 10. AI Event Description Generator (Admin)
**Файл:** `src/app/admin/events/ai-generate.tsx`

**Функционал:**
- [ ] Admin создает турнир/event
- [ ] Кнопка "Сгенерировать описание AI"
- [ ] AI создает промо-текст
- [ ] Admin редактирует и публикует

**Зачем:**
- Экономия времени админов
- Качественные описания

---

## 📊 Priority Matrix

| Feature | Priority | Effort | Impact | Status |
|---------|----------|--------|--------|--------|
| AI Chatbot Widget | 🔴 HIGH | Medium | High | TODO |
| Tariff Helper | 🔴 HIGH | Low | High | TODO |
| Game Recommendations | 🟡 MEDIUM | Medium | Medium | TODO |
| FAQ Page | 🟡 MEDIUM | Low | Medium | TODO |
| Response Caching | 🟡 MEDIUM | Medium | High | TODO |
| Rate Limiting | 🟡 MEDIUM | Low | High | TODO |
| Analytics | 🟢 LOW | High | Low | TODO |
| Multi-language | 🟢 LOW | Low | Low | TODO |
| Voice Input | 🟢 LOW | High | Low | TODO |
| Event Generator | 🟢 LOW | Low | Low | TODO |

---

## 🎯 Recommended Order

### Week 1: Core Features
1. ✅ Backend API (DONE)
2. AI Chatbot Widget
3. Tariff Helper Page

### Week 2: Enhancements
4. Game Recommendations
5. FAQ Page
6. Response Caching

### Week 3: Polish & Monitoring
7. Rate Limiting
8. Analytics Dashboard
9. Testing & Bug fixes

### Week 4+: Advanced (Optional)
10. Multi-language
11. Voice Input
12. Event Generator

---

## 🚀 Quick Wins (Быстро сделать)

Если нужно показать AI функционал быстро:

1. **AI Chat Button на главной** (2-3 часа)
   - Простой floating button
   - Базовый чат (без истории)
   - Один запрос → один ответ

2. **FAQ с AI** (1-2 часа)
   - Поле ввода
   - Кнопка "Спросить AI"
   - Показать ответ

3. **"Спроси AI" на booking странице** (1 час)
   - Кнопка возле выбора тарифа
   - Открывает prompt: "Какой тариф мне подходит?"
   - Показывает ответ AI

---

## 📝 Notes

- Все backend endpoints готовы и работают
- Нужно только frontend UI компоненты
- API key должен быть настроен в `.env`
- Тестировать можно через cURL или Postman
- Документация: `AI_INTEGRATION.md` и `AI_QUICKSTART.md`

---

**Дата:** 2024-12-14  
**Версия:** 1.0  
**Статус:** Backend ✅ | Frontend ⏳
