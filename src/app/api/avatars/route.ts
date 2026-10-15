import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";



// GET /api/avatars - получить все аватары для выбора пользователем
export async function GET(req: NextRequest) {
  try {
    const avatars = await prisma.avatars.findMany({
      where: { is_active: true },
      orderBy: { code: "asc" },
      select: {
        id: true,
        code: true,
        image_url: true,
        is_active: true
      }
    });

    // Transform to camelCase for frontend
    const transformedAvatars = avatars.map(avatar => ({
      id: avatar.id,
      code: avatar.code,
      imageUrl: avatar.image_url,
      isActive: avatar.is_active
    }));

    return NextResponse.json({ avatars: transformedAvatars });
  } catch (error) {
    console.error("Error fetching avatars:", error);
    return NextResponse.json(
      { error: "Failed to fetch avatars" },
      { status: 500 }
    );
  }
}
