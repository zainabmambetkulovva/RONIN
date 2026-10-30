/**
 * ИИ-ассистент клуба на Groq (OpenAI-совместимый API: https://console.groq.com/docs/api-reference).
 * Ключ — переменная окружения GROQ_API_KEY (только в Vercel / локальном .env, не в Git).
 */

interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AIResponse {
  text: string;
  tokens?: number;
  error?: string;
}

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
// Если модель снята с поддержки, пробуем следующую
const FALLBACK_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];

/** Ключ из Vercel мог прийти с пробелами или кавычками — убираем их. */
function getGroqKey(): string {
  return (process.env.GROQ_API_KEY || '').trim().replace(/^["']|["']$/g, '');
}

export function isAIConfigured(): boolean {
  return Boolean(getGroqKey());
}

/** Безопасное описание ключа для диагностики: первые символы и длина, без самого ключа. */
export function describeAIKey(): string {
  const key = getGroqKey();
  if (!key) return 'ключ не задан';
  return `ключ «${key.slice(0, 4)}…», ${key.length} симв.`;
}

class AIService {
  private temperature = 0.7;
  private maxTokens = 1024;

  /**
   * Один запрос к Groq
   */
  async generateContent(prompt: string): Promise<AIResponse> {
    const apiKey = getGroqKey();
    if (!apiKey) {
      console.error('GROQ_API_KEY not configured');
      return { text: 'AI временно недоступен: не настроен ключ GROQ_API_KEY.', error: 'Не задан GROQ_API_KEY' };
    }

    const models = Array.from(new Set([process.env.GROQ_MODEL?.trim() || FALLBACK_MODELS[0], ...FALLBACK_MODELS]));
    let last: AIResponse = { text: 'AI временно недоступен. Попробуйте позже.', error: 'No model available' };
    for (const model of models) {
      try {
        const response = await fetch(GROQ_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: prompt }],
            temperature: this.temperature,
            max_tokens: this.maxTokens,
          }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          const message: string = data.error?.message || `HTTP ${response.status}`;
          console.error('Groq API error response:', { model, status: response.status, error: message });
          if (response.status === 401 || response.status === 403) {
            return { text: 'AI недоступен: Groq не принял ключ. Проверьте GROQ_API_KEY.', error: `Ключ отклонён Groq: ${response.status} ${message}`.slice(0, 300) };
          }
          if (response.status === 429) {
            return { text: 'AI временно недоступен из-за превышения лимита запросов. Попробуйте позже.', error: 'Quota exceeded' };
          }
          // Модель не найдена или снята — следующая
          if (response.status === 404 || /model/i.test(message)) {
            last = { text: 'AI временно недоступен. Попробуйте позже.', error: `Groq: ${message}`.slice(0, 300) };
            continue;
          }
          return { text: 'Произошла ошибка при обращении к AI.', error: `Groq: ${response.status} ${message}`.slice(0, 300) };
        }
        const text: string = data.choices?.[0]?.message?.content?.trim() || 'Нет ответа';
        return { text, tokens: data.usage?.total_tokens };
      } catch (error: any) {
        console.error('Groq API error:', error);
        return { text: 'Произошла ошибка при обращении к AI. Проверьте подключение к интернету.', error: error.message };
      }
    }
    return last;
  }

  /**
   * Chatbot диалог с историей
   */
  async chat(messages: AIMessage[], facts: string): Promise<AIResponse> {
    // История диалога одним текстом
    const conversationHistory = messages
      .map(msg => `${msg.role === 'user' ? 'Пользователь' : 'Ассистент'}: ${msg.content}`)
      .join('\n\n');

    // Факты приходят с сервера из БД (src/server/services/club-facts.ts) — не хардкодим цены и контакты
    const systemPrompt = `Ты - AI ассистент RONIN, киберспортивного клуба в Бишкеке.
Твои задачи:
- Отвечать на вопросы о клубе, ценах, свободных компьютерах и бронировании
- Помогать выбрать зал и тариф
- Быть дружелюбным, отвечать кратко, на языке пользователя (русский, кыргызский или английский)

Строгие правила:
- Используй ТОЛЬКО факты ниже. Не придумывай цены, свободные места, акции, характеристики компьютеров или игры.
- Ты не можешь создавать, подтверждать, менять или отменять брони и не видишь чужие брони. Для брони отправляй на страницу «Забронировать» (/booking).
- Если о свободных местах на нужное время в фактах нет данных — скажи, что точную доступность видно на странице бронирования, и предложи указать время (например «в 20:00»).
- Если вопрос не о клубе — вежливо верни разговор к клубу.

Факты (актуальные данные системы):
${facts}

История диалога:
${conversationHistory}

Ответь на последнее сообщение пользователя:`;

    return this.generateContent(systemPrompt);
  }

  /**
   * Рекомендация игр на основе предпочтений
   */
  async recommendGames(userPreferences: {
    genres?: string[];
    playedGames?: string[];
    pcCategory?: string;
  }): Promise<AIResponse> {
    const prompt = `Ты - игровой консультант RONIN Gaming Club.

Пользователь ищет игру со следующими предпочтениями:
- Любимые жанры: ${userPreferences.genres?.join(', ') || 'не указаны'}
- Играл в: ${userPreferences.playedGames?.join(', ') || 'не указаны'}
- Категория ПК: ${userPreferences.pcCategory || 'любая'}

Популярные игры в нашем клубе:
- CS:GO, Dota 2, Valorant (киберспорт)
- GTA V, Cyberpunk 2077, RDR2 (приключения)
- Fortnite, Apex Legends, PUBG (Battle Royale)
- Minecraft, Terraria (песочница)
- League of Legends, Overwatch 2 (MOBA/шутеры)

Порекомендуй 3-5 игр с кратким описанием (2-3 предложения на каждую).
Формат ответа:
1. **Название игры** - описание почему подходит
2. **Название игры** - описание почему подходит
...`;

    return this.generateContent(prompt);
  }

  /**
   * Подбор оптимального тарифа
   */
  async suggestTariff(userNeeds: {
    duration?: string;
    budget?: number;
    timeOfDay?: string;
    frequency?: string;
  }): Promise<AIResponse> {
    const prompt = `Ты - консультант по тарифам RONIN Gaming Club.

Потребности пользователя:
- Длительность игры: ${userNeeds.duration || 'не указана'}
- Бюджет: ${userNeeds.budget ? `до ${userNeeds.budget}с` : 'не указан'}
- Время игры: ${userNeeds.timeOfDay || 'любое'}
- Частота посещений: ${userNeeds.frequency || 'не указана'}

Доступные тарифы:
1. **Почасовой** - от 50с/час (STANDART), 70с/час (VIP), 100с/час (ULTRA)
   Подходит для: короткие сессии 1-3 часа
   
2. **Ночной** - 250с с 00:00 до 10:00 (10 часов)
   Подходит для: ночные марафоны
   
3. **Безлимит** - 400с за 24 часа
   Подходит для: длительные игровые сессии

Порекомендуй оптимальный тариф с обоснованием (3-4 предложения).`;

    return this.generateContent(prompt);
  }

  /**
   * Генерация описания для игры/события
   */
  async generateGameDescription(gameName: string): Promise<AIResponse> {
    const prompt = `Напиши краткое привлекательное описание игры "${gameName}" для сайта киберспортивного клуба RONIN.

Требования:
- 2-3 предложения
- Упомяни жанр и ключевые особенности
- Стиль: энергичный, молодежный
- Без технических спецификаций

Пример формата: "CS:GO - легендарный тактический шутер, где команды террористов и спецназа сражаются за выполнение миссий. Требует точной стрельбы, командной работы и стратегического мышления."`;

    return this.generateContent(prompt);
  }

  /**
   * Ответы на FAQ
   */
  async answerFAQ(question: string, facts: string): Promise<AIResponse> {
    const prompt = `Ты - поддержка компьютерного клуба RONIN в Бишкеке. Ответь на вопрос пользователя.
Используй только факты ниже; если ответа в них нет — предложи позвонить в клуб.

${facts}

Вопрос пользователя: ${question}

Ответь кратко и по делу (2-4 предложения).`;

    return this.generateContent(prompt);
  }
}

// Singleton instance
let aiService: AIService | null = null;

export function getAIService(): AIService {
  if (!aiService) aiService = new AIService();
  return aiService;
}

export type { AIMessage, AIResponse };
