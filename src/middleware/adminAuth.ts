import jwt from "jsonwebtoken";

export interface AdminTokenPayload {
  userId: string;
  email: string;
  role: string;
  type: "admin";
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const jwtSecret = process.env.NEXTAUTH_SECRET || "fallback-secret-change-in-production";
    const decoded = jwt.verify(token, jwtSecret) as AdminTokenPayload;
    
    // Проверить что это действительно админ токен
    if (decoded.type !== "admin" || decoded.role !== "admin") {
      return null;
    }
    
    return decoded;
  } catch (error) {
    return null;
  }
}

export function getAdminTokenFromRequest(request: Request): string | null {
  // Попытка получить токен из заголовка Authorization
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  
  return null;
}
