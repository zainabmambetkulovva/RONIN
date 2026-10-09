import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";



// GET /api/avatars - получить все аватары для выбора пользователем
export async function GET(req: NextRequest) {
  try {
    const avatars = await prisma.avatar.findMany({
      where: { isActive: true },
      orderBy: { code: "asc" },
    });

    return NextResponse.json({ avatars });
  } catch (error) {
    console.error("Error fetching avatars:", error);
    return NextResponse.json(
      { error: "Failed to fetch avatars" },
      { status: 500 }
    );
  }
}
