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

/**
 * Отправить уведомление о новой регистрации
 */
export async function sendNewUserNotification(
  adminChatId: string,
  userData: {
    name: string;
    email?: string;
    phone?: string;
  }
): Promise<boolean> {
  const message = `
🎉 <b>Новая регистрация!</b>

👤 Имя: <b>${userData.name}</b>
${userData.email ? `📧 Email: ${userData.email}` : ""}
${userData.phone ? `📱 Телефон: ${userData.phone}` : ""}
🕐 Время: ${new Date().toLocaleString("ru-RU", { timeZone: "Asia/Bishkek" })}

Добро пожаловать в RONIN! 🎮
  `.trim();

  return sendTelegramMessage(adminChatId, message);
}

/**
 * Отправить уведомление о новом бронировании
 */
export async function sendNewBookingNotification(
  adminChatId: string,
  bookingData: {
    bookingCode: string;
    userName: string;
    computerName: string;
    computerNumber: number;
    tariffName: string;
    startAt: Date;
    endAt: Date;
    price: string;
  }
): Promise<boolean> {
  const startTime = new Date(bookingData.startAt).toLocaleString("ru-RU", { 
    timeZone: "Asia/Bishkek",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
  const endTime = new Date(bookingData.endAt).toLocaleTimeString("ru-RU", { 
    timeZone: "Asia/Bishkek",
    hour: "2-digit",
    minute: "2-digit"
  });

  const message = `
💰 <b>Новое бронирование!</b>

📋 Код: <b>${bookingData.bookingCode}</b>
👤 Клиент: ${bookingData.userName}
🖥 Компьютер: <b>${bookingData.computerName} #${bookingData.computerNumber}</b>
📊 Тариф: ${bookingData.tariffName}
⏰ Время: ${startTime} - ${endTime}
💵 Сумма: <b>${bookingData.price} сом</b>

✅ Оплачено и подтверждено
  `.trim();

  return sendTelegramMessage(adminChatId, message);
}
