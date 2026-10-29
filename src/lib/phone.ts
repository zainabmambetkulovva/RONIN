/**
 * Телефон Кыргызстана: приводим к виду +996XXXXXXXXX (9 цифр после кода страны).
 * Принимает «+996 555 123 456», «996555123456», «0555123456», «555 12 34 56».
 * Возвращает null, если номер не похож на кыргызский.
 */
export function normalizeKgPhone(input: string): string | null {
  const digits = input.replace(/[\s()+-]/g, "");
  if (!/^\d+$/.test(digits)) return null;
  let local: string;
  if (digits.length === 12 && digits.startsWith("996")) local = digits.slice(3);
  else if (digits.length === 10 && digits.startsWith("0")) local = digits.slice(1);
  else if (digits.length === 9) local = digits;
  else return null;
  // Код оператора/города не начинается с 0
  return /^[1-9]\d{8}$/.test(local) ? `+996${local}` : null;
}

export const KG_PHONE_ERROR = "Номер в формате +996 XXX XXX XXX";

/** Имя: буквы (кириллица, латиница), пробел, дефис, апостроф; от 2 символов. */
export function isValidPersonName(name: string): boolean {
  return /^[A-Za-zА-Яа-яЁёӨөҮүҢң][A-Za-zА-Яа-яЁёӨөҮүҢң\s'’-]{1,99}$/.test(name.trim());
}

export const PERSON_NAME_ERROR = "Имя — от 2 букв, без цифр и символов";
