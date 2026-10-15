"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { PhoneIcon, SendIcon, MailIcon, MapPinIcon, ZapIcon, ShieldIcon, ClockIcon } from "@/components/ui/icons";
import { useLanguage } from "@/contexts/LanguageContext";

export function RoninContacts() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const { t } = useLanguage();

  return (
    <section
      id="contacts"
      className="py-16 sm:py-20 lg:py-24 relative overflow-hidden bg-black dark:bg-black light:bg-gradient-to-b light:from-white light:to-gray-50"
      ref={ref}
    >
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/25 dark:via-blue-500/25 light:via-purple-300/40 to-transparent" />

      {/* BG glows */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(124,58,237,0.1)_0%,transparent_65%)] dark:bg-[radial-gradient(circle,rgba(124,58,237,0.1)_0%,transparent_65%)] light:bg-[radial-gradient(circle,rgba(167,139,250,0.08)_0%,transparent_65%)]" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(37,99,235,0.08)_0%,transparent_65%)] dark:bg-[radial-gradient(circle,rgba(37,99,235,0.08)_0%,transparent_65%)] light:bg-[radial-gradient(circle,rgba(147,197,253,0.06)_0%,transparent_65%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">

          {/* ── LEFT ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-blue-500/8 dark:bg-blue-500/8 light:bg-purple-100 border border-blue-500/25 dark:border-blue-500/25 light:border-purple-300">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-500 light:bg-purple-600 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500 dark:text-blue-500 light:text-purple-700">
                {t("contacts.tag")}
              </span>
            </div>

            {/* Big heading */}
            <h2 className="font-black uppercase leading-[0.9] mb-4 sm:mb-6 text-[clamp(2rem,6vw,5rem)]">
              <span className="block text-white dark:text-white light:text-gray-900">{t("contacts.title1")}</span>
              <span className="block bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(124,58,237,0.4)] dark:drop-shadow-[0_0_20px_rgba(124,58,237,0.4)] light:drop-shadow-none">
                {t("contacts.title2")}
              </span>
            </h2>

            <p className="text-gray-300 dark:text-gray-300 light:text-gray-700 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-md">
              {t("contacts.description")}
            </p>

            {/* Contact cards - Glassmorphism */}
            <div className="space-y-3 mb-8">
              {[
                {
                  icon: PhoneIcon,
                  label: t("contacts.phone"),
                  value: "+996 501 004 700",
                  sub: "Звони с 10:00 до 02:00",
                  href: "tel:+996501004700",
                },
                {
                  icon: SendIcon,
                  label: "Telegram",
                  value: "@ronin_support",
                  sub: "Быстрые ответы на все вопросы",
                  href: "https://t.me/ronin_support",
                },
                {
                  icon: MailIcon,
                  label: "Email",
                  value: "info@ronin.kg",
                  sub: "Отвечаем в течение 1 часа",
                  href: "mailto:info@ronin.kg",
                },
                {
                  icon: MapPinIcon,
                  label: t("contacts.address"),
                  value: t("contacts.addressValue"),
                  sub: "Удобное расположение в центре города",
                  href: "https://2gis.kg/bishkek/geo/70000001083373538",
                },
              ].map((c, i) => {
                const Icon = c.icon;
                return (
                  <motion.a
                    key={i}
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                    className="glass-card card-sweep flex items-center gap-4 p-5 rounded-xl group transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 bg-blue-500/10 dark:bg-blue-500/10 light:bg-purple-100 border border-blue-500/30 dark:border-blue-500/30 light:border-purple-300">
                      <Icon className="w-5 h-5 text-blue-500 dark:text-blue-500 light:text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-sm mb-0.5">{c.label}</p>
                      <p className="text-white dark:text-white light:text-gray-900 font-bold text-base group-hover:text-blue-400 dark:group-hover:text-blue-400 light:group-hover:text-purple-600 transition-colors">
                        {c.value}
                      </p>
                      <p className="text-gray-500 dark:text-gray-500 light:text-gray-600 text-sm">{c.sub}</p>
                    </div>
                  </motion.a>
                );
              })}
            </div>

            {/* Quick contact bar - Glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="glass-card rounded-2xl p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-500/15 dark:bg-indigo-500/15 light:bg-purple-100 border border-indigo-500/30 dark:border-indigo-500/30 light:border-purple-300">
                  <ZapIcon className="w-5 h-5 text-purple-600 dark:text-purple-500 light:text-purple-700" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-500 dark:text-blue-500 light:text-purple-600">
                    Быстрая связь
                  </p>
                  <p className="text-white dark:text-white light:text-gray-900 font-black text-sm">
                    Выбери удобный способ и мы сразу ответим
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href="tel:+996501004700"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm text-white transition-all hover:scale-105 bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                >
                  <PhoneIcon className="w-4 h-4" />
                  <div className="text-left">
                    <div className="text-xs font-black">Позвонить</div>
                    <div className="text-xs opacity-70">+996 501 004 700</div>
                  </div>
                  <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>

                <a
                  href="https://wa.me/996501004700"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 bg-blue-500/8 dark:bg-blue-500/8 light:bg-blue-50 border-[1.5px] border-blue-500/40 dark:border-blue-500/40 light:border-blue-300 text-blue-500 dark:text-blue-400 light:text-blue-600"
                >
                  <SendIcon className="w-4 h-4" />
                  <div className="text-left">
                    <div className="text-xs font-black">WhatsApp</div>
                    <div className="text-xs opacity-70">Быстрый ответ</div>
                  </div>
                  <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            </motion.div>

            {/* Bottom features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="grid grid-cols-3 gap-4 mt-6"
            >
              {[
                { icon: ZapIcon, title: "Быстрые ответы", sub: "Не заставим ждать", color: "#8b5cf6" },
                { icon: ShieldIcon, title: "Проф. поддержка", sub: "Поможем всегда", color: "#3b82f6" },
                { icon: ClockIcon, title: "Удобное время", sub: "с 10:00 до 02:00", color: "#8b5cf6" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex flex-col items-center text-center gap-2 py-3">
                    <Icon className="w-5 h-5" style={{ color: item.color }} />
                    <p className="text-white dark:text-white light:text-gray-900 text-xs font-bold leading-tight">{item.title}</p>
                    <p className="text-gray-600 dark:text-gray-600 light:text-gray-500 text-xs">{item.sub}</p>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* ── RIGHT — Asymmetric composition ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex items-center justify-center min-h-[600px]"
          >
            {/* Giant glowing RONIN text */}
            <div className="relative">
              {/* Glow layers - только для тёмной темы */}
              <div className="absolute inset-0 blur-[100px] dark:block light:hidden bg-[radial-gradient(circle,rgba(59,130,246,0.3)_0%,rgba(139,92,246,0.2)_50%,transparent_70%)]" />
              <div className="absolute inset-0 blur-[60px] dark:block light:hidden bg-[radial-gradient(circle,rgba(139,92,246,0.4)_0%,transparent_60%)]" />
              
              {/* Main text */}
              <h1 className="font-black uppercase tracking-tighter relative z-10 leading-[0.85] text-[clamp(4rem,15vw,12rem)] bg-gradient-to-br from-blue-500 via-purple-600 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_80px_rgba(59,130,246,0.5)] dark:drop-shadow-[0_0_80px_rgba(59,130,246,0.5)] light:drop-shadow-none">
                RONIN
              </h1>

              {/* Subtitle */}
              <p className="text-center mt-6 text-sm sm:text-base font-bold uppercase tracking-[0.3em] text-purple-600/70 dark:text-purple-600/70 light:text-purple-700/70">
                Твой компьютерный клуб
              </p>

              {/* Decorative lines */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <div className="h-px w-20 bg-gradient-to-r from-transparent via-blue-500 dark:via-blue-500 light:via-purple-400 to-transparent" />
                <div className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-600 light:bg-purple-500 shadow-[0_0_20px] shadow-purple-600 dark:shadow-purple-600 light:shadow-purple-400" />
                <div className="h-px w-20 bg-gradient-to-r from-transparent via-purple-600 dark:via-purple-600 light:via-purple-400 to-transparent" />
              </div>

              {/* Stats badges */}
              <div className="flex items-center justify-center gap-6 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-black text-blue-500 dark:text-blue-500 light:text-purple-600">50+</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 light:text-gray-600 uppercase tracking-wider">Компьютеров</div>
                </div>
                <div className="w-px h-12 bg-purple-600/30 dark:bg-purple-600/30 light:bg-purple-300/50" />
                <div className="text-center">
                  <div className="text-3xl font-black text-purple-600 dark:text-purple-600 light:text-purple-700">24/7</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 light:text-gray-600 uppercase tracking-wider">Работаем</div>
                </div>
                <div className="w-px h-12 bg-blue-500/30 dark:bg-blue-500/30 light:bg-purple-300/50" />
                <div className="text-center">
                  <div className="text-3xl font-black text-indigo-500 dark:text-indigo-500 light:text-purple-600">5★</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 light:text-gray-600 uppercase tracking-wider">Рейтинг</div>
                </div>
              </div>

              {/* Map below - HEIGHT: 400px */}
              <div className="mt-12 rounded-2xl overflow-hidden border border-indigo-500/20 dark:border-indigo-500/20 light:border-purple-300/40">
                <iframe
                  src="https://widgets.2gis.com/widget?type=firmsonmap&options=%7B%22pos%22%3A%7B%22lat%22%3A42.87661267975688%2C%22lon%22%3A74.60592836141588%2C%22zoom%22%3A16%7D%2C%22opt%22%3A%7B%22city%22%3A%22bishkek%22%7D%2C%22org%22%3A%2270000001083373538%22%7D"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="w-full"
                  title="RONIN Club Location"
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
