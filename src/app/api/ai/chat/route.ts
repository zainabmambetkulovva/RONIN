import { NextResponse } from "next/server";
import { z } from "zod";
import { getAIService } from "@/lib/ai";
import { checkRateLimit, rateLimitError } from "@/lib/rate-limiter";
import { ApiError, handle, parseJson } from "@/server/http";
import { buildClubFacts } from "@/server/services/club-facts";

export const dynamic = "force-dynamic";

const MAX_HISTORY = 10;

const schema = z.object({
  messages: z
    .array(
      z.object({
        // Роль "system" от клиента не принимается — системные инструкции задаёт только сервер
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(4000),
      })
    )
    .min(1, "Messages array is required")
    .max(50),
});

/**
 * POST /api/ai/chat
 * AI-ассистент клуба. Отвечает только по реальным данным (прайс, свободные ПК, контакты) из БД.
 */
export const POST = handle(async (req) => {
  const rate = await checkRateLimit(req, "ai-chat", 20, 10 * 60 * 1000);
  if (!rate.allowed) throw new ApiError(429, rateLimitError(rate.remaining, rate.resetAt).error, "rate_limited");

  const { messages } = await parseJson(req, schema);
  const history = messages.slice(-MAX_HISTORY);
  const lastUser = [...history].reverse().find((m) => m.role === "user")?.content ?? "";

  const facts = await buildClubFacts(lastUser);
  const response = await getAIService().chat(history, facts);

  if (response.error) {
    return NextResponse.json({ error: response.error, text: response.text }, { status: 503 });
  }
  return NextResponse.json({ text: response.text, tokens: response.tokens });
});
