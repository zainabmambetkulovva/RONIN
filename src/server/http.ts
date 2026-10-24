/**
 * Единый формат ответов и ошибок API.
 *
 * Ошибка всегда: `{ error: string, code: string }` + HTTP-статус.
 * Внутренние детали (сообщения Prisma, стек) клиенту не отдаются.
 */
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import type { ZodType } from "zod";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code: string = "error"
  ) {
    super(message);
  }
}

export const badRequest = (message: string, code = "bad_request") => new ApiError(400, message, code);
export const unauthorized = (message = "Требуется вход в аккаунт") => new ApiError(401, message, "unauthorized");
export const forbidden = (message = "Недостаточно прав") => new ApiError(403, message, "forbidden");
export const notFound = (message = "Не найдено") => new ApiError(404, message, "not_found");
export const conflict = (message: string, code = "conflict") => new ApiError(409, message, code);

export function errorResponse(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Запись не найдена", code: "not_found" }, { status: 404 });
    }
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Такая запись уже существует", code: "duplicate" }, { status: 409 });
    }
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Запись связана с другими данными и не может быть изменена", code: "has_relations" },
        { status: 409 }
      );
    }
  }
  console.error("[API] Unhandled error:", error);
  return NextResponse.json({ error: "Внутренняя ошибка сервера", code: "internal_error" }, { status: 500 });
}

type RouteContext<P> = { params: P };

/** Оборачивает route handler: любые ошибки превращаются в единый формат ответа. */
export function handle<P = Record<string, string>>(
  fn: (req: NextRequest, ctx: RouteContext<P>) => Promise<Response>
) {
  return async (req: NextRequest, ctx: RouteContext<P>) => {
    try {
      return await fn(req, ctx);
    } catch (error) {
      return errorResponse(error);
    }
  };
}

/** Читает JSON-тело запроса и валидирует его схемой zod. */
export async function parseJson<T>(req: Request, schema: ZodType<T>): Promise<T> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw badRequest("Некорректный JSON в теле запроса");
  }
  const result = schema.safeParse(body);
  if (!result.success) {
    throw badRequest(result.error.issues[0]?.message || "Некорректные данные", "validation_error");
  }
  return result.data;
}
