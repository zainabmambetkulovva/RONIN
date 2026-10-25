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
    this.apiKey = config.apiKey || process.env.GEMINI_API_KEY || '';
    this.model = config.model || 'gemini-1.5-flash'; // Updated to correct model name
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
    this.temperature = config.temperature || 0.7;
    this.maxTokens = config.maxTokens || 1024;
  }

  /**
   * Базовый запрос к Gemini API
   */
  async generateContent(prompt: string): Promise<GeminiResponse> {
    if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
      console.error('Gemini API key not configured');
      return {
        text: 'AI временно недоступен. Пожалуйста, настройте GEMINI_API_KEY в .env файле.',
        error: 'API key not configured'
      };
    }

    try {
      // Gemini API accepts API keys via query parameter (not Authorization header)
      const url = `${this.baseURL}/models/${this.model}:generateContent?key=${this.apiKey}`;
      const headers = {
        'Content-Type': 'application/json',
      };
      
      console.log('Calling Gemini API:', { model: this.model, url: url.replace(this.apiKey, '***') });
      
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
            maxOutputTokens: this.maxTokens,
          }
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Gemini API error response:', data);
        const errorMessage = data.error?.message || 'Gemini API error';
        
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

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Нет ответа';

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
  async answerFAQ(question: string): Promise<GeminiResponse> {
    const prompt = `Ты - поддержка RONIN Gaming Club. Ответь на вопрос пользователя.

Информация о клубе:
- Адрес: г. Бишкек, ул. Горького 130, 2 этаж
- Телефон: +996 501 004 700
- Режим работы: 24/7
- Категории ПК: STANDART, VIP, ULTRA
- Оплата: наличные, карты, FINIK Pay
- Бронирование: онлайн через сайт или по телефону
- Возрастное ограничение: 12+
- В клубе: игровые ПК, удобные кресла, кондиционеры, снеки/напитки

Вопрос пользователя: ${question}

Ответь кратко и по делу (2-4 предложения).`;

    return this.generateContent(prompt);
  }
}

// Singleton instance
let geminiService: GeminiService | null = null;

export function getGeminiService(config?: Partial<GeminiConfig>): GeminiService {
  if (!geminiService) {
    geminiService = new GeminiService({
      apiKey: process.env.GEMINI_API_KEY || '',
      model: 'gemini-1.5-flash', // Updated to correct model name
      ...config
    });
  }
  return geminiService;
}

export type { GeminiConfig, GeminiMessage, GeminiResponse };
