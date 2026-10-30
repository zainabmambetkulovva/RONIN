/**
 * Gemini AI Integration
 * 
 * Функциялары:
 * - Игра рекомендациялары
 * - Тариф оптимизациясы
 * - Chatbot поддержка
 * - Контент генерация
 */

interface GeminiConfig {
  apiKey: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

interface GeminiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface GeminiResponse {
  text: string;
  tokens?: number;
  error?: string;
}

class GeminiService {
  private apiKey: string;
  private model: string;
  private baseURL: string;
  private temperature: number;
  private maxTokens: number;

  constructor(config: GeminiConfig) {
    // Ключ, вставленный в Vercel, мог прийти с пробелами или кавычками — убираем их
    this.apiKey = (config.apiKey || process.env.GEMINI_API_KEY || '').trim().replace(/^["']|["']$/g, '');
    this.model = config.model || process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
    this.temperature = config.temperature || 0.7;
    this.maxTokens = config.maxTokens || 1024;
  }

  /**
   * Базовый запрос к Gemini API
   */
  async generateContent(prompt: string): Promise<GeminiResponse> {
    // Есть ключ Groq — отвечает Groq, иначе Gemini
    const groqKey = getGroqKey();
    if (groqKey) return generateWithGroq(groqKey, prompt, this.temperature, this.maxTokens);
    // gemini-1.5-* сняты Google с поддержки; если модель недоступна (404), пробуем следующую
    const models = Array.from(new Set([this.model, 'gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.0-flash']));
    // Ключ в заголовке x-goog-api-key (так в документации Google). Новые ключи AI Studio «AQ.…»
    // на части аккаунтов принимаются только как токен — для них при 401/403 пробуем Authorization: Bearer.
    const authModes: Array<'header' | 'bearer'> = this.apiKey.startsWith('AQ.') ? ['header', 'bearer'] : ['header'];
    let result: GeminiResponse = { text: 'Произошла ошибка при обращении к AI.', error: 'No model available' };
    for (const model of models) {
      for (const mode of authModes) {
        result = await this.generateWithModel(model, prompt, mode);
        if (result.error !== 'auth_rejected') break;
      }
      if (result.error === 'auth_rejected') {
        return { text: 'AI недоступен: Google не принял ключ. Проверьте GEMINI_API_KEY.', error: `Ключ отклонён Google: ${result.text}`.slice(0, 300) };
      }
      if (result.error !== 'model_not_found') {
        if (!result.error) this.model = model;
        return result;
      }
    }
    return { ...result, text: 'AI временно недоступен. Попробуйте позже.' };
  }

  private async generateWithModel(model: string, prompt: string, auth: 'header' | 'bearer' = 'header'): Promise<GeminiResponse> {
    if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
      console.error('Gemini API key not configured');
      return {
        text: 'AI временно недоступен. Пожалуйста, настройте GEMINI_API_KEY в .env файле.',
        error: 'API key not configured'
      };
    }

    try {
      const url = `${this.baseURL}/models/${model}:generateContent`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(auth === 'bearer' ? { Authorization: `Bearer ${this.apiKey}` } : { 'x-goog-api-key': this.apiKey }),
      };
      
      console.log('Calling Gemini API:', { model });
      
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: this.temperature,
            // Модели без отключаемых «размышлений» тратят на них часть лимита — даём запас
            maxOutputTokens: model.startsWith('gemini-2.5') || model.startsWith('gemini-2.0') ? this.maxTokens : Math.max(this.maxTokens, 4096),
            // У 2.5 «размышления» съедают лимит токенов ответа; для чата они не нужны
            ...(model.startsWith('gemini-2.5') && { thinkingConfig: { thinkingBudget: 0 } }),
          }
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Gemini API error response:', { model, status: response.status, error: data.error?.message });
        const errorMessage = data.error?.message || 'Gemini API error';

        if (response.status === 404) return { text: '', error: 'model_not_found' };
        // Ключ не принят (401/403, кроме лимитов) — текст ошибки Google без самого ключа
        if (((response.status === 401 || response.status === 403) && !/quota/i.test(errorMessage)) || errorMessage.includes('API key not valid')) {
          // Причина и проект из ответа Google (например API_KEY_SERVICE_BLOCKED, projects/123) — помогают найти, какой ключ в Vercel
          const details: Array<{ reason?: string; metadata?: Record<string, string> }> = data.error?.details ?? [];
          const info = details.find((d) => d.reason);
          const extra = info?.metadata?.consumer ?? '';
          return { text: `${response.status} ${info?.reason ?? data.error?.status ?? ''}${extra ? ` (${extra})` : ''}`.trim(), error: 'auth_rejected' };
        }
        
        // Provide user-friendly error messages
        if (errorMessage.includes('API key not valid')) {
          return {
            text: 'AI недоступен: неверный API ключ. Обратитесь к администратору.',
            error: 'Invalid API key'
          };
        }
        if (errorMessage.includes('quota')) {
          return {
            text: 'AI временно недоступен из-за превышения лимита запросов. Попробуйте позже.',
            error: 'Quota exceeded'
          };
        }
        
        throw new Error(errorMessage);
      }

      const parts: Array<{ text?: string; thought?: boolean }> = data.candidates?.[0]?.content?.parts ?? [];
      const text = parts.filter((p) => !p.thought && p.text).map((p) => p.text).join('').trim() || 'Нет ответа';

      return {
        text,
        tokens: data.usageMetadata?.totalTokenCount
      };
    } catch (error: any) {
      console.error('Gemini API error:', error);
      return {
        text: 'Произошла ошибка при обращении к AI. Проверьте подключение к интернету.',
        error: error.message
      };
    }
  }

  /**
   * Chatbot диалог с историей
   */
  async chat(messages: GeminiMessage[], facts: string): Promise<GeminiResponse> {
    // Форматируем историю для Gemini
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
  }): Promise<GeminiResponse> {
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
  }): Promise<GeminiResponse> {
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
  async generateGameDescription(gameName: string): Promise<GeminiResponse> {
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
  async answerFAQ(question: string, facts: string): Promise<GeminiResponse> {
    const prompt = `Ты - поддержка компьютерного клуба RONIN в Бишкеке. Ответь на вопрос пользователя.
Используй только факты ниже; если ответа в них нет — предложи позвонить в клуб.

${facts}

Вопрос пользователя: ${question}

Ответь кратко и по делу (2-4 предложения).`;

    return this.generateContent(prompt);
  }
}

/** Ключ Groq: GROQ_API_KEY или ключ «gsk_…», вставленный в GEMINI_API_KEY. */
function getGroqKey(): string {
  const clean = (v?: string) => (v || '').trim().replace(/^["']|["']$/g, '');
  const groq = clean(process.env.GROQ_API_KEY);
  if (groq) return groq;
  const gemini = clean(process.env.GEMINI_API_KEY);
  return gemini.startsWith('gsk_') ? gemini : '';
}

export function isGroqConfigured(): boolean {
  return Boolean(getGroqKey());
}

/** Groq — OpenAI-совместимый API (https://console.groq.com/docs/api-reference). */
async function generateWithGroq(apiKey: string, prompt: string, temperature: number, maxTokens: number): Promise<GeminiResponse> {
  // Если модель снята с поддержки, пробуем следующую
  const models = Array.from(new Set([process.env.GROQ_MODEL || 'llama-3.3-70b-versatile', 'llama-3.3-70b-versatile', 'llama-3.1-8b-instant']));
  let last: GeminiResponse = { text: 'AI временно недоступен. Попробуйте позже.', error: 'No model available' };
  for (const model of models) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], temperature, max_tokens: maxTokens }),
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

// Singleton instance
let geminiService: GeminiService | null = null;

/** Безопасное описание ключа для диагностики: первые символы и длина, без самого ключа. */
export function describeGeminiKey(): string {
  const key = getGroqKey() || (process.env.GEMINI_API_KEY || '').trim().replace(/^["']|["']$/g, '');
  if (!key) return 'ключ не задан';
  return `ключ «${key.slice(0, 4)}…», ${key.length} симв.`;
}

export function getGeminiService(config?: Partial<GeminiConfig>): GeminiService {
  if (!geminiService) {
    geminiService = new GeminiService({
      ...(config as GeminiConfig),
      apiKey: config?.apiKey || process.env.GEMINI_API_KEY || '',
    });
  }
  return geminiService;
}

export type { GeminiConfig, GeminiMessage, GeminiResponse };
