import { NextRequest, NextResponse } from "next/server";
import { getGeminiService } from "@/lib/gemini";
import type { GeminiMessage } from "@/lib/gemini";

/**
 * POST /api/ai/chat
 * AI Chatbot для поддержки пользователей
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const gemini = getGeminiService();
    const response = await gemini.chat(messages as GeminiMessage[]);

    if (response.error) {
      return NextResponse.json(
        { error: response.error, text: response.text },
        { status: 500 }
      );
    }

    return NextResponse.json({
      text: response.text,
      tokens: response.tokens
    });
  } catch (error: any) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
