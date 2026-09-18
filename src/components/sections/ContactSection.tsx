"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Phone, Send, Mail, MapPin, Clock, Zap, Shield } from "lucide-react";

export function ContactSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="contacts" className="py-20 relative overflow-hidden">
      {/* Background image with blur */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/images%20(5).jpg)',
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
            opacity: 0.3
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ronin-black via-ronin-black/95 to-ronin-black/85"></div>
        <div className="absolute inset-0 bg-ronin-black/60"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-ronin-neon/10 border border-ronin-neon/30 text-ronin-neon text-sm font-bold mb-6 uppercase tracking-wider">
              КОНТАКТЫ
            </span>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              <span className="text-white">ОСТАЛИСЬ</span>
              <br />
              <span className="ronin-gradient-text">ВОПРОСЫ?</span>
            </h2>

            <p className="text-gray-300 text-lg mb-8 max-w-lg">
              Мы всегда на связи! Напиши нам, и мы поможем выбрать ПК, ответим на все вопросы и поможем с бронированием.
            </p>

            {/* Contact Cards */}
            <div className="space-y-4 mb-8">
              {/* Phone */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-ronin-black/60 backdrop-blur-sm border border-ronin-neon/20 hover:border-ronin-neon/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-ronin-neon/10 flex items-center justify-center flex-shrink-0 group-hover:bg-neon-glow transition-all">
                  <Phone className="w-6 h-6 text-ronin-neon" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Телефон</h4>
                  <a href="tel:+996700000000" className="text-ronin-neon text-xl font-black hover:underline">
                    +996 700 000 000
                  </a>
                  <p className="text-gray-400 text-sm">Звони с 10:00 до 02:00</p>
                </div>
              </motion.div>

              {/* Telegram */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-ronin-black/60 backdrop-blur-sm border border-ronin-neon/20 hover:border-ronin-neon/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-ronin-neon/10 flex items-center justify-center flex-shrink-0 group-hover:bg-neon-glow transition-all">
                  <Send className="w-6 h-6 text-ronin-neon" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Telegram</h4>
                  <a href="https://t.me/ronin_support" className="text-ronin-neon font-bold hover:underline">
                    @ronin_support
                  </a>
                  <p className="text-gray-400 text-sm">Быстрые ответы на все вопросы</p>
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-ronin-black/60 backdrop-blur-sm border border-ronin-neon/20 hover:border-ronin-neon/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-ronin-neon/10 flex items-center justify-center flex-shrink-0 group-hover:bg-neon-glow transition-all">
                  <Mail className="w-6 h-6 text-ronin-neon" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Email</h4>
                  <a href="mailto:info@ronin.kg" className="text-ronin-neon font-bold hover:underline">
                    info@ronin.kg
                  </a>
                  <p className="text-gray-400 text-sm">Ответим в течение 1 часа</p>
                </div>
              </motion.div>

              {/* Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-ronin-black/60 backdrop-blur-sm border border-ronin-neon/20 hover:border-ronin-neon/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-ronin-neon/10 flex items-center justify-center flex-shrink-0 group-hover:bg-neon-glow transition-all">
                  <MapPin className="w-6 h-6 text-ronin-neon" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Адрес</h4>
                  <p className="text-ronin-neon font-bold">
                    г. Бишкек, ул. Турусбекова 56
                  </p>
                  <p className="text-gray-400 text-sm">Удобное расположение в центре города</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Quick Actions & Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Write to us card */}
            <div className="relative p-8 rounded-2xl border border-ronin-neon/30 bg-gradient-to-br from-ronin-gray/40 to-ronin-black/60 backdrop-blur-md overflow-hidden">
              <div className="absolute top-4 right-4 text-ronin-neon/20 animate-pulse">
                <span className="text-6xl font-black">💬</span>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-ronin-neon/10 flex items-center justify-center">
                    <Send className="w-6 h-6 text-ronin-neon" />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-xl">НАПИШИ ИЛИ ПОЗВОНИ</h3>
                    <p className="text-purple-400 text-sm font-bold uppercase tracking-wider">СЕЙЧАС</p>
                  </div>
                </div>

                <p className="text-gray-300 mb-6">
                  Выбери удобный способ и мы сразу ответим
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="tel:+996700000000"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-600 transition-all font-bold group"
                  >
                    <Phone className="w-5 h-5 group-hover:animate-bounce" />
                    Позвонить
                  </a>
                  <a
                    href="https://wa.me/996700000000"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-ronin-neon bg-ronin-neon/10 hover:bg-ronin-neon/20 transition-all font-bold text-ronin-neon group"
                  >
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    Написать в WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
                className="p-4 rounded-xl bg-ronin-black/60 border border-ronin-neon/20 text-center"
              >
                <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-white font-bold text-sm">Быстрые ответы</p>
                <p className="text-gray-400 text-xs">Не заставим ждать</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 }}
                className="p-4 rounded-xl bg-ronin-black/60 border border-ronin-neon/20 text-center"
              >
                <Shield className="w-8 h-8 text-ronin-neon mx-auto mb-2" />
                <p className="text-white font-bold text-sm">Профессиональная поддержка</p>
                <p className="text-gray-400 text-xs">Поможем всегда</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 }}
                className="p-4 rounded-xl bg-ronin-black/60 border border-ronin-neon/20 text-center"
              >
                <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-white font-bold text-sm">Удобное время</p>
                <p className="text-gray-400 text-xs">с 10:00 до 02:00</p>
              </motion.div>
            </div>

            {/* Bottom tagline */}
            <div className="text-center">
              <p className="text-ronin-neon font-black text-2xl tracking-wider">
                RONIN <span className="text-white">—</span>
              </p>
              <p className="text-purple-400 text-sm font-bold tracking-[0.2em] uppercase mt-1">
                ТВОЙ КОМПЬЮТЕРНЫЙ КЛУБ
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
