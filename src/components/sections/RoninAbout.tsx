"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Cpu, Armchair, Volume2, Zap, Trophy, Shield, Users, Clock } from "lucide-react";

export function RoninAbout() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const { t } = useLanguage();

  const features = [
    {
      icon: Cpu,
      title: t("about.power.title"),
      desc1: t("about.power.desc1"),
      desc2: t("about.power.desc2"),
      color: "#a855f7",
    },
    {
      icon: Armchair,
      title: t("about.comfort.title"),
      desc1: t("about.comfort.desc1"),
      desc2: t("about.comfort.desc2"),
      color: "#ec4899",
    },
    {
      icon: Volume2,
      title: t("about.atmosphere.title"),
      desc1: t("about.atmosphere.desc1"),
      desc2: t("about.atmosphere.desc2"),
      color: "#3b82f6",
    },
    {
      icon: Zap,
      title: t("about.session.title"),
      desc1: t("about.session.desc1"),
      desc2: t("about.session.desc2"),
      color: "#f59e0b",
    },
  ];

  const communityFeatures = [
    { icon: Trophy, title: "Турниры", desc: "Участвуй в соревнованиях", color: "#f59e0b" },
    { icon: Users, title: "Сообщество", desc: "Играй с друзьями", color: "#ec4899" },
    { icon: Shield, title: "Безопасность", desc: "Защита аккаунтов", color: "#3b82f6" },
    { icon: Clock, title: "24/7 Поддержка", desc: "Всегда на связи", color: "#a855f7" },
  ];

  return (
    <section
      id="about"
      className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
      ref={ref}
    >
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-40 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-6">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-sm font-bold uppercase tracking-wider text-purple-300">
              {t("about.tag")}
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black uppercase mb-6">
            <span className="block text-white">{t("about.heading1")}</span>
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              {t("about.heading2")} {t("about.heading3")}
            </span>
          </h2>

          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            {t("about.description")}
          </p>
        </motion.div>

        {/* Main Features Grid - E PLAY style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="group relative"
              >
                <div className="relative h-full p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02]">
                  
                  {/* Icon */}
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                    style={{
                      background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}10)`,
                      border: `2px solid ${feature.color}`,
                      boxShadow: `0 0 20px ${feature.color}30`,
                    }}
                  >
                    <Icon className="w-7 h-7" style={{ color: feature.color }} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-black text-white mb-2 uppercase tracking-wide">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-2">{feature.desc1}</p>
                  <p className="text-gray-500 text-xs">{feature.desc2}</p>

                  {/* Hover glow */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, ${feature.color}10, transparent 70%)`,
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Community Section - E PLAY "Join Community" style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="relative"
        >
          {/* Big Banner Card */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900 via-fuchsia-900 to-pink-900 border-2 border-purple-500/30">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            
            <div className="relative p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                
                {/* Left - Content */}
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                    <Users className="w-4 h-4 text-purple-300" />
                    <span className="text-sm font-bold uppercase tracking-wider text-purple-200">
                      Присоединяйся
                    </span>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase">
                    {t("about.carousel_title") || "Больше чем игры"}
                  </h3>
                  <p className="text-purple-100 text-lg mb-6 leading-relaxed">
                    {t("about.carousel_desc") || "Становись частью нашего сообщества. Участвуй в турнирах, находи новых друзей и наслаждайся атмосферой настоящего киберспорта."}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <motion.a
                      href="/register"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 rounded-xl bg-white text-purple-900 font-black uppercase tracking-wider hover:shadow-2xl transition-all"
                    >
                      Регистрация
                    </motion.a>
                    <motion.a
                      href="#contacts"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm text-white font-bold uppercase tracking-wider border-2 border-white/30 hover:bg-white/20 transition-all"
                    >
                      Узнать больше
                    </motion.a>
                  </div>
                </div>

                {/* Right - Community Features */}
                <div className="grid grid-cols-2 gap-4">
                  {communityFeatures.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all group"
                      >
                        <Icon className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" style={{ color: item.color }} />
                        <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                        <p className="text-purple-200 text-xs">{item.desc}</p>
                      </motion.div>
                    );
                  })}
                </div>

              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500 rounded-full blur-3xl opacity-20" />
          </div>
        </motion.div>

        {/* Bottom tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <span className="text-sm font-bold uppercase tracking-widest text-purple-400/50">
            {t("about.tagline")}
          </span>
        </motion.div>

      </div>
    </section>
  );
}
