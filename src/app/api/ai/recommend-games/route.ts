import { NextRequest, NextResponse } from "next/server";
import { getAIService } from "@/lib/ai";

/**
 * POST /api/ai/recommend-games
 * Рекомендация игр на основе предпочтений пользователя
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { genres, playedGames, pcCategory } = body;

    const ai = getAIService();
    const response = await ai.recommendGames({
      genres: genres || [],
      playedGames: playedGames || [],
      pcCategory: pcCategory || undefined
    });

    if (response.error) {
      return NextResponse.json(
        { error: response.error, text: response.text },
        { status: 500 }
      );
    }

    return NextResponse.json({
      recommendations: response.text,
      tokens: response.tokens
    });
  } catch (error: any) {
    console.error("AI recommend games error:", error);
    return NextResponse.json(
      { error: "Failed to generate game recommendations" },
      { status: 500 }
    );
  }
}
