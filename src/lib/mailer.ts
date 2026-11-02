/**
 * Отправка писем (коды восстановления пароля).
 * Основной способ — Gmail: GMAIL_USER (адрес) и GMAIL_APP_PASSWORD (пароль приложения Google, не обычный пароль).
 * Если Gmail не настроен, используется Resend (RESEND_API_KEY, EMAIL_FROM), как раньше.
 * Значения хранятся только в Vercel / локальном .env, не в Git.
 */
import nodemailer from "nodemailer";

interface MailInput {
  to: string;
  subject: string;
  html: string;
}

const clean = (v?: string) => (v || "").trim().replace(/^["']|["']$/g, "");

function gmailConfig() {
  const user = clean(process.env.GMAIL_USER);
  // Google показывает пароль приложения группами через пробел («abcd efgh ijkl mnop») — пробелы убираем
  const pass = clean(process.env.GMAIL_APP_PASSWORD).replace(/\s+/g, "");
  return user && pass ? { user, pass } : null;
}

export type MailProvider = "gmail" | "resend" | null;

export function mailProvider(): MailProvider {
  if (gmailConfig()) return "gmail";
  if (clean(process.env.RESEND_API_KEY)) return "resend";
  return null;
}

function gmailTransport(cfg: { user: string; pass: string }) {
  return nodemailer.createTransport({ host: "smtp.gmail.com", port: 465, secure: true, auth: cfg });
}

/** Понятная причина вместо технического ответа Gmail. */
function explainGmailError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  if (/535|Username and Password not accepted|Invalid login|BadCredentials/i.test(msg)) {
    return "Gmail не принял вход: проверьте GMAIL_USER и пароль приложения GMAIL_APP_PASSWORD (нужна двухэтапная проверка)";
  }
  if (/daily user sending limit|limit exceeded|550 5\.4\.5/i.test(msg)) return "Gmail: превышен дневной лимит писем";
  return `Gmail: ${msg}`.slice(0, 200);
}

/** Отправляет письмо. Бросает ошибку с понятным текстом, если отправить не удалось или почта не настроена. */
export async function sendMail({ to, subject, html }: MailInput): Promise<void> {
  const gmail = gmailConfig();
  if (gmail) {
    try {
      await gmailTransport(gmail).sendMail({
        from: { name: clean(process.env.EMAIL_FROM_NAME) || "RONIN", address: gmail.user },
        to,
        subject,
        html,
      });
      return;
    } catch (e) {
      throw new Error(explainGmailError(e));
    }
  }

  const resendKey = clean(process.env.RESEND_API_KEY);
  if (resendKey) {
    const { Resend } = await import("resend");
    // Resend не бросает исключение, а возвращает { error } — например, если домен отправителя не подтверждён
    const { error } = await new Resend(resendKey).emails.send({ from: process.env.EMAIL_FROM || "noreply@ronin.kg", to, subject, html });
    if (error) throw new Error(error.message || String(error));
    return;
  }

  throw new Error("Отправка писем не настроена: задайте GMAIL_USER и GMAIL_APP_PASSWORD");
}

/** Проверка для панели «Подключения»: для Gmail реально входит в почту, письмо не отправляет. */
export async function checkMail(): Promise<{ ok: boolean; message: string }> {
  const gmail = gmailConfig();
  if (gmail) {
    try {
      await gmailTransport(gmail).verify();
      return { ok: true, message: `Gmail: вход выполнен (${gmail.user})` };
    } catch (e) {
      return { ok: false, message: explainGmailError(e) };
    }
  }
  if (clean(process.env.RESEND_API_KEY)) return { ok: true, message: "Resend: ключ задан (письма дойдут только при подтверждённом домене)" };
  return { ok: false, message: "Не заданы GMAIL_USER и GMAIL_APP_PASSWORD" };
}
