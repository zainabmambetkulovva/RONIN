/**
 * Единый источник публичной информации о клубе (контакты, часы, соцсети, рейтинг).
 * Компоненты не должны дублировать эти данные у себя.
 *
 * Источник: карточка клуба в 2GIS (предоставлена владельцем, октябрь 2026).
 * Цены и тарифы здесь НЕ хранятся — они берутся из БД через /api/tariffs.
 */

export const club = {
  name: "RONIN",
  tagline: "Киберспортивный клуб",
  city: "Бишкек",

  address: {
    ru: "ул. Анкара, 282, 2 этаж",
    en: "282 Ankara St., 2nd floor",
    ky: "Анкара көч., 282, 2-кабат",
  },
  district: {
    ru: "Первомайский район, Бишкек",
    en: "Pervomaisky district, Bishkek",
    ky: "Биринчи Май району, Бишкек",
  },
  landmarks: {
    ru: "Рядом: ТЦ Vefa Center (250 м), пересечение Жусупа Абдрахманова и Анкара (150 м)",
    en: "Nearby: Vefa Center mall (250 m), Zhusupa Abdrakhmanova & Ankara crossing (150 m)",
    ky: "Жакын: Vefa Center соода борбору (250 м), Жусуп Абдрахманов жана Анкара кесилиши (150 м)",
  },

  phone: { display: "+996 771 00 11 67", tel: "+996771001167" },

  /** Круглосуточно (подтверждено владельцем). */
  openAroundTheClock: true,

  socials: {
    instagram: "https://www.instagram.com/ronin__kg",
    tiktok: "https://www.tiktok.com/@ronin_kg",
    /** Тот же номер, что и телефон клуба (подтверждён владельцем). */
    whatsapp: "https://wa.me/996771001167",
  },

  /** Карточка клуба в 2GIS (id организации из существующего виджета карты). */
  twoGis: {
    firmUrl: "https://2gis.kg/bishkek/firm/70000001083373538",
    reviewsUrl: "https://2gis.kg/bishkek/firm/70000001083373538/tab/reviews",
    widgetSrc:
      "https://widgets.2gis.com/widget?type=firmsonmap&options=%7B%22pos%22%3A%7B%22lat%22%3A42.87661267975688%2C%22lon%22%3A74.60592836141588%2C%22zoom%22%3A16%7D%2C%22opt%22%3A%7B%22city%22%3A%22bishkek%22%7D%2C%22org%22%3A%2270000001083373538%22%7D",
    rating: 4.7,
    ratingsCount: 594,
  },

  paymentMethods: ["card", "cash", "transfer", "qr"] as const,

  /**
   * Время действия ночного и утреннего пакетов. null — не показывать на сайте,
   * пока не подтверждено (в репозитории встречаются противоречивые значения).
   */
  tariffWindows: {
    night: null as string | null,
    morning: null as string | null,
  },

  /**
   * Фирменный персонаж для Hero. Положите PNG без фона в public/brand/samurai.png
   * и укажите путь здесь. Пока null — показывается логотип.
   */
  heroCharacter: "/brand/samurai.png" as string | null,
} as const;

export type ClubLanguage = "ru" | "en" | "ky";
