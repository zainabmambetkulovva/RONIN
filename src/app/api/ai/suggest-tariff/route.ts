import { NextRequest, NextResponse } from "next/server";
import { getGeminiService } from "@/lib/gemini";

/**
 * POST /api/ai/suggest-tariff
 * Подбор оптимального тарифа на основе потребностей
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { duration, budget, timeOfDay, frequency } = body;

    const gemini = getGeminiService();
    const response = await gemini.suggestTariff({
      duration: duration || undefined,
      budget: budget || undefined,
      timeOfDay: timeOfDay || undefined,
      frequency: frequency || undefined
    });

    if (response.error) {
      return NextResponse.json(
        { error: response.error, text: response.text },
        { status: 500 }
      );
    }

    return NextResponse.json({
      suggestion: response.text,
      tokens: response.tokens
    });
  } catch (error: any) {
    console.error("AI suggest tariff error:", error);
    return NextResponse.json(
      { error: "Failed to generate tariff suggestion" },
      { status: 500 }
    );
  }
}
