import { ky } from './ky';
import { ru } from './ru';
import { en } from './en';

export const translations = {
  ky,
  ru,
  en,
};

export type Locale = keyof typeof translations;
export type TranslationKey = keyof typeof translations.ru;

export const locales: Locale[] = ['ky', 'ru', 'en'];

export const localeNames = {
  ky: 'Кыргызча',
  ru: 'Русский',
  en: 'English',
};
