import { NextRequest, NextResponse } from "next/server";
import { getGeminiService } from "@/lib/gemini";

/**
 * POST /api/ai/faq
 * Ответы на часто задаваемые вопросы через AI
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const gemini = getGeminiService();
    const response = await gemini.answerFAQ(question);

    if (response.error) {
      return NextResponse.json(
        { error: response.error, text: response.text },
        { status: 500 }
      );
    }

    return NextResponse.json({
      answer: response.text,
      tokens: response.tokens
    });
  } catch (error: any) {
    console.error("AI FAQ error:", error);
    return NextResponse.json(
      { error: "Failed to answer question" },
      { status: 500 }
    );
  }
}
