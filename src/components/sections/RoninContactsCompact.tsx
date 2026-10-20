"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Phone, Send, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function RoninContactsCompact() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const { t } = useLanguage();

  return (
    <section
      id="contacts"
      className="py-16 relative overflow-hidden"
      ref={ref}
    >
      {/* Gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* LEFT - Contacts */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            {/* Tag */}
            <div className="inline-block px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400">
                {t("contacts.tag")}
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-2">
              <span className="text-white">{t("contacts.title1")}</span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {t("contacts.title2")}
              </span>
            </h2>

            <p className="text-gray-400 mb-8 leading-relaxed">
              {t("contacts.description")}
            </p>

            {/* Contact cards */}
            <div className="space-y-3">
              {[
                {
                  icon: Phone,
                  label: t("contacts.phone"),
                  value: "+996 501 004 700",
                  subKey: "contacts.phone.subtitle",
                  href: "tel:+996501004700",
                },
                {
                  icon: Send,
                  label: "Telegram",
                  value: "@ronin_support",
                  subKey: "contacts.telegram.subtitle",
                  href: "https://t.me/ronin_support",
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: "info@ronin.kg",
                  subKey: "contacts.email.subtitle",
                  href: "mailto:info@ronin.kg",
                },
                {
                  icon: MapPin,
                  label: t("contacts.address"),
                  value: t("contacts.addressValue"),
                  subKey: "contacts.address.subtitle",
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
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-gray-900/50 to-gray-950/50 border border-purple-500/20 hover:border-purple-500/40 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">{c.label}</p>
                      <p className="text-white font-bold mb-1 group-hover:text-purple-400 transition-colors break-words">
                        {c.value}
                      </p>
                      <p className="text-xs text-gray-500">{t(c.subKey)}</p>
                    </div>
                  </motion.a>
                );
              })}
            </div>

            {/* Quick buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="grid grid-cols-2 gap-3 mt-6"
            >
              <a
                href="tel:+996501004700"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all hover:scale-105"
              >
                <Phone className="w-4 h-4" />
                {t("contacts.callButton")}
              </a>

              <a
                href="https://wa.me/996501004700"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm text-purple-400 bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 transition-all hover:scale-105"
              >
                <Send className="w-4 h-4" />
                {t("contacts.whatsappButton")}
              </a>
            </motion.div>
          </motion.div>

          {/* RIGHT - RONIN + Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            {/* Giant RONIN text */}
            <div className="text-center mb-8">
              <h1 className="font-black uppercase tracking-tighter leading-[0.85] text-[clamp(4rem,12vw,10rem)] bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                RONIN
              </h1>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-purple-500/70 mt-2">
                {t("contacts.subtitle")}
              </p>

              {/* Decorative line */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="h-px w-20 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                <div className="w-2 h-2 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50" />
                <div className="h-px w-20 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-black text-purple-400">50+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">{t("contacts.stat.computers")}</div>
                </div>
                <div className="w-px h-12 bg-purple-500/30" />
                <div className="text-center">
                  <div className="text-3xl font-black text-pink-400">24/7</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">{t("contacts.stat.working")}</div>
                </div>
                <div className="w-px h-12 bg-purple-500/30" />
                <div className="text-center">
                  <div className="text-3xl font-black text-blue-400">5★</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">{t("contacts.stat.rating")}</div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-purple-500/20">
              <iframe
                src="https://widgets.2gis.com/widget?type=firmsonmap&options=%7B%22pos%22%3A%7B%22lat%22%3A42.87661267975688%2C%22lon%22%3A74.60592836141588%2C%22zoom%22%3A16%7D%2C%22opt%22%3A%7B%22city%22%3A%22bishkek%22%7D%2C%22org%22%3A%2270000001083373538%22%7D"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="RONIN Club Location"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
