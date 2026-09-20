"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "ru" | "en" | "kg";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  ru: {
    // Navbar
    "nav.about": "О клубе",
    "nav.booking": "Бронирование",
    "nav.computers": "Компьютеры",
    "nav.tariffs": "Тарифы",
    "nav.games": "Игры",
    "nav.contacts": "Контакты",
    "nav.login": "Войти",
    "nav.register": "Регистрация",

    // Hero
    "hero.title": "RONIN",
    "hero.subtitle": "Компьютерный клуб в Бишкеке",
    "hero.description": "Мощные игровые ПК • Комфортная атмосфера • Лучшие тарифы",
    "hero.button": "Забронировать",

    // About
    "about.tag": "Почему RONIN?",
    "about.heading1": "НЕ ПРОСТО ПК.",
    "about.heading2": "СВОЁ МЕСТО",
    "about.heading3": "ДЛЯ ИГРЫ.",
    "about.description": "96 топовых игровых станций от Standard до VIP. Intel i9, RTX 4090, 240Hz мониторы, профессиональные кресла. Круглосуточная работа, онлайн-бронирование, 4 тарифа на выбор.",
    "about.power.title": "МОЩНОСТЬ",
    "about.power.desc1": "Мощные игровые компьютеры",
    "about.comfort.title": "КОМФОРТ",
    "about.comfort.desc1": "Игровые кресла • большие мониторы",
    "about.atmosphere.title": "АТМОСФЕРА",
    "about.atmosphere.desc1": "Тёмный интерьер • неоновый свет",
    "about.atmosphere.desc2": "качественный звук • кибер атмосфера",
    "about.session.title": "ТВОЯ СЕССИЯ",
    "about.session.desc1": "Выбери компьютер • дату • время",
    "about.session.desc2": "оплати онлайн • приходи • играй",
    "about.title": "Почему RONIN?",
    "about.feature1.title": "Топовое железо",
    "about.feature1.desc": "RTX 4090, i9-13900K, 165Hz мониторы",
    "about.feature2.title": "24/7 работаем",
    "about.feature2.desc": "Круглосуточно без выходных",
    "about.feature3.title": "Кибер-атмосфера",
    "about.feature3.desc": "RGB подсветка, удобные кресла",
    "about.feature4.title": "Выгодные тарифы",
    "about.feature4.desc": "От 150₸/час, ночные пакеты",

    // Booking Flow
    "booking.tag": "Как забронировать",
    "booking.title": "Бронирование за 3 шага",
    "booking.step1.title": "Регистрация",
    "booking.step1.desc": "Создайте аккаунт за 30 секунд",
    "booking.step2.title": "Выбор ПК и времени",
    "booking.step2.desc": "Выберите категорию, дату и время",
    "booking.step3.title": "Оплата и QR",
    "booking.step3.desc": "Оплатите и получите QR-код",

    // Stats
    "stats.computers": "КОМПЬЮТЕРОВ",
    "stats.monitors": "HZ МОНИТОРЫ",
    "stats.categories": "КАТЕГОРИИ ПК",
    "stats.work": "МЫ РАБОТАЕМ",
    "stats.clients": "Клиентов",
    "stats.hours": "Часов игры",
    "stats.games": "Игр",

    // Tariffs
    "tariffs.tag": "Наши тарифы",
    "tariffs.title": "Выберите свой тариф",
    "tariffs.vip.name": "VIP",
    "tariffs.vip.desc": "RTX 4090, i9-13900K, 240Hz",
    "tariffs.vip.price": "400₸",
    "tariffs.vip.duration": "час",
    "tariffs.premium.name": "Premium",
    "tariffs.premium.desc": "RTX 4070 Ti, i7-13700K, 165Hz",
    "tariffs.premium.price": "300₸",
    "tariffs.premium.duration": "час",
    "tariffs.standard.name": "Standard",
    "tariffs.standard.desc": "RTX 4060 Ti, i5-13600K, 144Hz",
    "tariffs.standard.price": "150₸",
    "tariffs.standard.duration": "час",
    "tariffs.button": "Забронировать",

    // Games
    "games.tag": "В нашем клубе",
    "games.title": "Игры",

    // Contacts
    "contacts.tag": "Контакты",
    "contacts.title1": "ОСТАЛИСЬ",
    "contacts.title2": "ВОПРОСЫ?",
    "contacts.description": "Мы всегда на связи! Напиши нам, и мы поможем выбрать ПК, ответим на все вопросы и поможем с бронированием.",
    "contacts.title": "Найдите нас",
    "contacts.address": "Адрес",
    "contacts.addressValue": "г. Бишкек, ул. Горького 130, 2 этаж",
    "contacts.phone": "Телефон",
    "contacts.whatsapp": "WhatsApp",
    "contacts.instagram": "Instagram",

    // Footer
    "footer.description": "Современный компьютерный клуб в Бишкеке. Мощные ПК, комфортная атмосфера и онлайн-бронирование.",
    "footer.navigation": "Навигация",
    "footer.rights": "Все права защищены",
    "footer.location": "Бишкек, Кыргызстан",
    "footer.club": "Компьютерный клуб RONIN",
  },

  en: {
    // Navbar
    "nav.about": "About",
    "nav.booking": "Booking",
    "nav.computers": "Computers",
    "nav.tariffs": "Tariffs",
    "nav.games": "Games",
    "nav.contacts": "Contacts",
    "nav.login": "Login",
    "nav.register": "Sign Up",

    // Hero
    "hero.title": "RONIN",
    "hero.subtitle": "Gaming Club in Bishkek",
    "hero.description": "Powerful Gaming PCs • Comfortable Atmosphere • Best Prices",
    "hero.button": "Book Now",

    // About
    "about.tag": "Why RONIN?",
    "about.heading1": "NOT JUST PC.",
    "about.heading2": "YOUR PLACE",
    "about.heading3": "FOR GAMING.",
    "about.description": "96 top gaming stations from Standard to VIP. Intel i9, RTX 4090, 240Hz monitors, professional chairs. 24/7 operation, online booking, 4 tariffs to choose from.",
    "about.power.title": "POWER",
    "about.power.desc1": "Powerful gaming computers",
    "about.comfort.title": "COMFORT",
    "about.comfort.desc1": "Gaming chairs • large monitors",
    "about.atmosphere.title": "ATMOSPHERE",
    "about.atmosphere.desc1": "Dark interior • neon light",
    "about.atmosphere.desc2": "quality sound • cyber atmosphere",
    "about.session.title": "YOUR SESSION",
    "about.session.desc1": "Choose computer • date • time",
    "about.session.desc2": "pay online • come • play",
    "about.title": "Why RONIN?",
    "about.feature1.title": "Top Hardware",
    "about.feature1.desc": "RTX 4090, i9-13900K, 165Hz monitors",
    "about.feature2.title": "24/7 Open",
    "about.feature2.desc": "Round the clock, no days off",
    "about.feature3.title": "Cyber Atmosphere",
    "about.feature3.desc": "RGB lighting, comfortable chairs",
    "about.feature4.title": "Best Prices",
    "about.feature4.desc": "From 150₸/hour, night packages",

    // Booking Flow
    "booking.tag": "How to Book",
    "booking.title": "Booking in 3 Steps",
    "booking.step1.title": "Registration",
    "booking.step1.desc": "Create account in 30 seconds",
    "booking.step2.title": "Choose PC & Time",
    "booking.step2.desc": "Select category, date and time",
    "booking.step3.title": "Payment & QR",
    "booking.step3.desc": "Pay and get QR code",

    // Stats
    "stats.computers": "COMPUTERS",
    "stats.monitors": "HZ MONITORS",
    "stats.categories": "PC CATEGORIES",
    "stats.work": "WE WORK",
    "stats.clients": "Clients",
    "stats.hours": "Gaming Hours",
    "stats.games": "Games",

    // Tariffs
    "tariffs.tag": "Our Tariffs",
    "tariffs.title": "Choose Your Tariff",
    "tariffs.vip.name": "VIP",
    "tariffs.vip.desc": "RTX 4090, i9-13900K, 240Hz",
    "tariffs.vip.price": "400₸",
    "tariffs.vip.duration": "hour",
    "tariffs.premium.name": "Premium",
    "tariffs.premium.desc": "RTX 4070 Ti, i7-13700K, 165Hz",
    "tariffs.premium.price": "300₸",
    "tariffs.premium.duration": "hour",
    "tariffs.standard.name": "Standard",
    "tariffs.standard.desc": "RTX 4060 Ti, i5-13600K, 144Hz",
    "tariffs.standard.price": "150₸",
    "tariffs.standard.duration": "hour",
    "tariffs.button": "Book Now",

    // Games
    "games.tag": "In Our Club",
    "games.title": "Games",

    // Contacts
    "contacts.tag": "Contacts",
    "contacts.title1": "HAVE",
    "contacts.title2": "QUESTIONS?",
    "contacts.description": "We are always in touch! Write to us, and we will help you choose a PC, answer all questions and help with booking.",
    "contacts.title": "Find Us",
    "contacts.address": "Address",
    "contacts.addressValue": "Bishkek, Gorkogo 130, 2nd floor",
    "contacts.phone": "Phone",
    "contacts.whatsapp": "WhatsApp",
    "contacts.instagram": "Instagram",

    // Footer
    "footer.description": "Modern gaming club in Bishkek. Powerful PCs, comfortable atmosphere and online booking.",
    "footer.navigation": "Navigation",
    "footer.rights": "All rights reserved",
    "footer.location": "Bishkek, Kyrgyzstan",
    "footer.club": "RONIN Gaming Club",
  },

  kg: {
    // Navbar
    "nav.about": "Клуб жөнүндө",
    "nav.booking": "Брондоо",
    "nav.computers": "Компьютерлер",
    "nav.tariffs": "Тарифтер",
    "nav.games": "Оюндар",
    "nav.contacts": "Байланыш",
    "nav.login": "Кирүү",
    "nav.register": "Катталуу",

    // Hero
    "hero.title": "RONIN",
    "hero.subtitle": "Бишкектеги компьютердик клуб",
    "hero.description": "Күчтүү оюн ПКлары • Ыңгайлуу атмосфера • Эң жакшы тарифтер",
    "hero.button": "Брондоо",

    // About
    "about.tag": "Эмне үчүн RONIN?",
    "about.heading1": "ЖӨН ЭМЕС ПК.",
    "about.heading2": "ӨЗҮҢДҮН ОРУН",
    "about.heading3": "ОЮНДАРГА.",
    "about.description": "Standard-дан VIP-ге чейин 96 оюн станциясы. Intel i9, RTX 4090, 240Hz мониторлор, профессионалдык орундуктар. 24/7 иштейбиз, онлайн брондоо, 4 тариф.",
    "about.power.title": "КҮЧ",
    "about.power.desc1": "Күчтүү оюн компьютерлери",
    "about.comfort.title": "ЫҢГАЙЛУУЛУК",
    "about.comfort.desc1": "Оюн орундуктары • чоң мониторлор",
    "about.atmosphere.title": "АТМОСФЕРА",
    "about.atmosphere.desc1": "Караңгы интерьер • неон жарык",
    "about.atmosphere.desc2": "сапаттуу добуш • кибер атмосфера",
    "about.session.title": "СЕНИН СЕССИЯ",
    "about.session.desc1": "Компьютер тандаңыз • күн • убакыт",
    "about.session.desc2": "онлайн төлөңүз • келиңиз • ойноңуз",
    "about.title": "Эмне үчүн RONIN?",
    "about.feature1.title": "Топ техника",
    "about.feature1.desc": "RTX 4090, i9-13900K, 165Hz мониторлор",
    "about.feature2.title": "24/7 иштейбиз",
    "about.feature2.desc": "Тынымсыз убакытсыз",
    "about.feature3.title": "Кибер атмосфера",
    "about.feature3.desc": "RGB жарык, ыңгайлуу отургучтар",
    "about.feature4.title": "Пайдалуу тарифтер",
    "about.feature4.desc": "150₸/саат, түнкү пакеттер",

    // Booking Flow
    "booking.tag": "Кантип брондоого болот",
    "booking.title": "3 кадамда брондоо",
    "booking.step1.title": "Катталуу",
    "booking.step1.desc": "30 секундда аккаунт түзүңүз",
    "booking.step2.title": "ПК жана убакыт тандоо",
    "booking.step2.desc": "Категория, күн жана убакыт тандаңыз",
    "booking.step3.title": "Төлөм жана QR",
    "booking.step3.desc": "Төлөп QR код алыңыз",

    // Stats
    "stats.computers": "КОМПЬЮТЕРЛЕР",
    "stats.monitors": "HZ МОНИТОРЛОР",
    "stats.categories": "ПК КАТЕГОРИЯЛАР",
    "stats.work": "БИЗ ИШТЕЙБИЗ",
    "stats.clients": "Кардарлар",
    "stats.hours": "Оюн сааттары",
    "stats.games": "Оюндар",

    // Tariffs
    "tariffs.tag": "Биздин тарифтер",
    "tariffs.title": "Тарифти тандаңыз",
    "tariffs.vip.name": "VIP",
    "tariffs.vip.desc": "RTX 4090, i9-13900K, 240Hz",
    "tariffs.vip.price": "400₸",
    "tariffs.vip.duration": "саат",
    "tariffs.premium.name": "Premium",
    "tariffs.premium.desc": "RTX 4070 Ti, i7-13700K, 165Hz",
    "tariffs.premium.price": "300₸",
    "tariffs.premium.duration": "саат",
    "tariffs.standard.name": "Standard",
    "tariffs.standard.desc": "RTX 4060 Ti, i5-13600K, 144Hz",
    "tariffs.standard.price": "150₸",
    "tariffs.standard.duration": "саат",
    "tariffs.button": "Брондоо",

    // Games
    "games.tag": "Биздин клубта",
    "games.title": "Оюндар",

    // Contacts
    "contacts.tag": "Байланыш",
    "contacts.title1": "СУРООЛОР",
    "contacts.title2": "КАЛДЫБЫ?",
    "contacts.description": "Биз ар дайым байланыштабыз! Бизге жазыңыз, биз ПК тандап, бардык суроолорго жооп берип, брондоого жардам беребиз.",
    "contacts.title": "Бизди табыңыз",
    "contacts.address": "Дарек",
    "contacts.addressValue": "Бишкек, Горького 130, 2-кабат",
    "contacts.phone": "Телефон",
    "contacts.whatsapp": "WhatsApp",
    "contacts.instagram": "Instagram",

    // Footer
    "footer.description": "Бишкектеги заманбап компьютердик клуб. Күчтүү ПКлар, ыңгайлуу атмосфера жана онлайн брондоо.",
    "footer.navigation": "Навигация",
    "footer.rights": "Бардык укуктар корголгон",
    "footer.location": "Бишкек, Кыргызстан",
    "footer.club": "RONIN компьютердик клубу",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ru");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ronin-language") as Language;
    if (saved && (saved === "ru" || saved === "en" || saved === "kg")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("ronin-language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.ru] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
