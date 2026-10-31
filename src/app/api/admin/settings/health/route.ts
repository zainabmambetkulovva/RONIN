import { NextResponse } from "next/server";
import { handle } from "@/server/http";
import { requireAdmin } from "@/server/auth/staff";
import { describeAIKey, getAIService, isAIConfigured } from "@/lib/ai";

export const dynamic = "force-dynamic";

const has = (name: string) => Boolean(process.env[name] && process.env[name] !== "your_key_here");

/**
 * GET /api/admin/settings/health — какие подключения настроены на этом сайте.
 * Отдаёт только «есть / нет» и текст ошибки сервиса, никогда — сами ключи.
 */
export const GET = handle(async (req) => {
  await requireAdmin(req);
  const origin = req.nextUrl.origin;

  let ai: { ok: boolean; message: string };
  if (!isAIConfigured()) {
    ai = { ok: false, message: "Не задан GROQ_API_KEY" };
  } else {
    const res = await getAIService().generateContent("Ответь одним словом: ок");
    ai = res.error ? { ok: false, message: `${res.error} · ${describeAIKey()}`.slice(0, 300) } : { ok: true, message: "Отвечает" };
  }

  return NextResponse.json({
    origin,
    checks: [
      { key: "ai", label: "ИИ-чат (Groq)", ...ai, fix:
          "console.groq.com → API Keys → Create API Key (ключ «gsk_…»). Vercel → Settings → Environment Variables → GROQ_API_KEY, окружение Production, без кавычек и пробелов → Redeploy. Если «Ключ отклонён Groq: 401» — ключ удалён или скопирован не полностью. Если «does not exist or you do not have access» / «не вернул других доступных моделей» — console.groq.com → Settings → Projects → ваш проект → Limits / Model permissions: разрешите хотя бы одну текстовую модель (например llama или gpt-oss), затем «Проверить снова»",
      },
      {
        key: "google",
        label: "Вход через Google",
        ok: has("GOOGLE_CLIENT_ID") && has("GOOGLE_CLIENT_SECRET"),
        message: has("GOOGLE_CLIENT_ID") && has("GOOGLE_CLIENT_SECRET") ? "Ключи заданы" : "Не заданы GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET",
        fix: `Google Cloud Console → Credentials → OAuth Client → Authorized redirect URIs: ${origin}/api/auth/google/callback`,
      },
      { key: "finik", label: "Оплата Finik", ok: has("FINIK_API_KEY") && has("FINIK_ACCOUNT_ID"), message: has("FINIK_API_KEY") && has("FINIK_ACCOUNT_ID") ? "Ключи заданы" : "Не заданы FINIK_API_KEY / FINIK_ACCOUNT_ID", fix: "Vercel → Environment Variables" },
      { key: "telegram", label: "Telegram (коды входа в админку)", ok: has("TELEGRAM_BOT_TOKEN"), message: has("TELEGRAM_BOT_TOKEN") ? "Бот задан" : "Не задан TELEGRAM_BOT_TOKEN", fix: "Vercel → Environment Variables; у сотрудников — Telegram chat ID" },
      { key: "cron", label: "Автоотмена неоплаченных броней", ok: has("CRON_SECRET"), message: has("CRON_SECRET") ? "CRON_SECRET задан" : "Не задан CRON_SECRET", fix: "Vercel → Environment Variables → CRON_SECRET (любая длинная строка)" },
      { key: "email", label: "Письма (восстановление пароля)", ok: has("RESEND_API_KEY"), message: has("RESEND_API_KEY") ? "Ключ задан" : "Не задан RESEND_API_KEY", fix: "Vercel → Environment Variables" },
    ],
  });
});
