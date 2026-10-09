/**
 * Telegram Bot API утилиты для 2FA
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

interface TelegramResponse {
  ok: boolean;
  result?: any;
  description?: string;
}

/**
 * Отправить сообщение в Telegram
 */
export async function sendTelegramMessage(
  chatId: string,
  message: string
): Promise<boolean> {
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    const data: TelegramResponse = await response.json();
    return data.ok;
  } catch (error) {
    console.error("Telegram send error:", error);
    return false;
  }
}

/**
 * Отправить 2FA код в Telegram
 */
export async function send2FACode(chatId: string, code: string): Promise<boolean> {
  const message = `
🔐 <b>RONIN Admin Login</b>

Ваш код для входа в админку:

<b>${code}</b>

⏰ Код действителен 5 минут.

⚠️ Если это были не вы, немедленно свяжитесь с администрацией!
  `.trim();

  return sendTelegramMessage(chatId, message);
}

/**
 * Отправить уведомление об успешном входе
 */
export async function sendLoginNotification(
  chatId: string,
  userName: string,
  ipAddress?: string
): Promise<boolean> {
  const message = `
✅ <b>Успешный вход</b>

Пользователь: ${userName}
${ipAddress ? `IP: ${ipAddress}` : ""}
Время: ${new Date().toLocaleString("ru-RU")}
  `.trim();

  return sendTelegramMessage(chatId, message);
}

/**
 * Получить информацию о чате (проверка существования)
 */
export async function getChatInfo(chatId: string): Promise<any> {
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/getChat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
      }),
    });

    const data: TelegramResponse = await response.json();
    return data.ok ? data.result : null;
  } catch (error) {
    console.error("Telegram getChat error:", error);
    return null;
  }
}
