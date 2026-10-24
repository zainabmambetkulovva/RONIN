import crypto from "crypto";

/** Коды 2FA хранятся в БД только в виде SHA-256 хэша. */
export function hashTwoFactorCode(code: string) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export function generateTwoFactorCode() {
  return crypto.randomInt(100000, 1000000).toString();
}
