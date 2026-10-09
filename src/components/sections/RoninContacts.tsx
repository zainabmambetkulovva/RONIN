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
      className="py-16 sm:py-20 lg:py-24 relative overflow-hidden"
      style={{ background: "#03030a" }}
      ref={ref}
    >
      {/* Top divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.25), transparent)" }}
      />

      {/* BG purple glow bottom right */}
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 65%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">

          {/* ── LEFT ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                background: "rgba(59,130,246,0.08)",
                border: "1px solid rgba(59,130,246,0.25)",
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span
                className="text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: "#3b82f6" }}
              >
                {t("contacts.tag")}
              </span>
            </div>

            {/* Big heading */}
            <h2
              className="font-black uppercase leading-[0.9] mb-4 sm:mb-6"
              style={{ fontSize: "clamp(2rem, 6vw, 5rem)" }}
            >
              <span className="block text-white">{t("contacts.title1")}</span>
              <span
                className="block"
                style={{
                  background: "linear-gradient(90deg, #8b5cf6, #3b82f6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 20px rgba(124,58,237,0.4))",
                }}
              >
                {t("contacts.title2")}
              </span>
            </h2>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-md">
              {t("contacts.description")}
            </p>

            {/* Contact cards */}
            <div className="space-y-3 mb-8">
              {[
                {
                  icon: PhoneIcon,
                  label: "Телефон",
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
                  label: "Адрес",
                  value: "г. Бишкек, ул. Горького 130, 2 этаж",
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
                    className="card-sweep flex items-center gap-4 p-5 rounded-xl group transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                      background: "rgba(7,7,26,0.8)",
                      border: "1px solid rgba(59,130,246,0.15)",
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300"
                      style={{
                        background: "rgba(59,130,246,0.1)",
                        border: "1px solid rgba(59,130,246,0.3)",
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: "#3b82f6" }} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-0.5">{c.label}</p>
                      <p className="text-white font-bold text-base group-hover:text-blue-400 transition-colors">
                        {c.value}
                      </p>
                      <p className="text-gray-500 text-sm">{c.sub}</p>
                    </div>
                  </motion.a>
                );
              })}
            </div>

            {/* Quick contact bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="rounded-2xl p-5"
              style={{
                background: "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.08))",
                border: "1px solid rgba(99,102,241,0.2)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}
                >
                  <ZapIcon className="w-5 h-5" style={{ color: "#8b5cf6" }} />
                </div>
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: "#3b82f6" }}
                  >
                    Быстрая связь
                  </p>
                  <p className="text-white font-black text-sm">
                    Выбери удобный способ и мы сразу ответим
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href="tel:+996501004700"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm text-white transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(90deg, #7c3aed, #4f46e5)",
                    boxShadow: "0 0 20px rgba(124,58,237,0.3)",
                  }}
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
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
                  style={{
                    background: "rgba(59,130,246,0.08)",
                    border: "1.5px solid rgba(59,130,246,0.4)",
                    color: "#3b82f6",
                  }}
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
                { icon: ZapIcon, title: "Быстрые ответы", sub: "Не заставим ждать" },
                { icon: ShieldIcon, title: "Проф. поддержка", sub: "Поможем всегда" },
                { icon: ClockIcon, title: "Удобное время", sub: "с 10:00 до 02:00" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex flex-col items-center text-center gap-2 py-3">
                    <Icon className="w-5 h-5" style={{ color: i === 1 ? "#3b82f6" : "#8b5cf6" }} />
                    <p className="text-white text-xs font-bold leading-tight">{item.title}</p>
                    <p className="text-gray-600 text-xs">{item.sub}</p>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* ── RIGHT — Large RONIN logo display ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex items-center justify-center"
            style={{ minHeight: "600px" }}
          >
            {/* Giant glowing RONIN text */}
            <div className="relative">
              {/* Glow layers */}
              <div
                className="absolute inset-0 blur-[100px]"
                style={{
                  background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(139,92,246,0.2) 50%, transparent 70%)",
                }}
              />
              <div
                className="absolute inset-0 blur-[60px]"
                style={{
                  background: "radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 60%)",
                }}
              />
              
              {/* Main text */}
              <h1
                className="font-black uppercase tracking-tighter relative z-10"
                style={{
                  fontSize: "clamp(4rem, 15vw, 12rem)",
                  background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #3b82f6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 0 80px rgba(59,130,246,0.5)",
                  lineHeight: "0.85",
                }}
              >
                RONIN
              </h1>

              {/* Subtitle */}
              <p
                className="text-center mt-6 text-sm sm:text-base font-bold uppercase tracking-[0.3em]"
                style={{
                  color: "rgba(139,92,246,0.7)",
                }}
              >
                Твой компьютерный клуб
              </p>

              {/* Decorative lines */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <div className="h-px w-20" style={{ background: "linear-gradient(90deg, transparent, #3b82f6, transparent)" }} />
                <div className="w-2 h-2 rounded-full" style={{ background: "#8b5cf6", boxShadow: "0 0 20px #8b5cf6" }} />
                <div className="h-px w-20" style={{ background: "linear-gradient(90deg, transparent, #8b5cf6, transparent)" }} />
              </div>

              {/* Stats badges */}
              <div className="flex items-center justify-center gap-6 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-black" style={{ color: "#3b82f6" }}>50+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Компьютеров</div>
                </div>
                <div className="w-px h-12" style={{ background: "rgba(139,92,246,0.3)" }} />
                <div className="text-center">
                  <div className="text-3xl font-black" style={{ color: "#8b5cf6" }}>24/7</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Работаем</div>
                </div>
                <div className="w-px h-12" style={{ background: "rgba(59,130,246,0.3)" }} />
                <div className="text-center">
                  <div className="text-3xl font-black" style={{ color: "#6366f1" }}>5★</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Рейтинг</div>
                </div>
              </div>

              {/* Map below */}
              <div className="mt-12 rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(99,102,241,0.2)" }}>
                <iframe
                  src="https://widgets.2gis.com/widget?type=firmsonmap&options=%7B%22pos%22%3A%7B%22lat%22%3A42.87661267975688%2C%22lon%22%3A74.60592836141588%2C%22zoom%22%3A16%7D%2C%22opt%22%3A%7B%22city%22%3A%22bishkek%22%7D%2C%22org%22%3A%2270000001083373538%22%7D"
                  width="100%"
                  height="500"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
