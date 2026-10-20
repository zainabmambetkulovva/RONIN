"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Clock, Zap, ArrowRight, CheckCircle2, Trophy, ChevronLeft, ChevronRight } from "lucide-react";

export function CyberTariffs() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const tariffs = [
    {
      nameKey: "tariffs.morning.name",
      timeFrom: "09:00",
      timeTo: "13:00",
      price: "95",
      priceUnitKey: "tariffs.priceUnit",
      descriptionKey: "tariffs.morning.description",
      featuresKeys: ["tariffs.morning.feature1", "tariffs.morning.feature2", "tariffs.morning.feature3"],
      tag: null,
      gradient: "from-blue-600 to-cyan-600",
      icon: Clock,
    },
    {
      nameKey: "tariffs.standard.name",
      timeFrom: "13:00",
      timeTo: "23:00",
      price: "120",
      priceUnitKey: "tariffs.priceUnit",
      descriptionKey: "tariffs.standard.description",
      featuresKeys: ["tariffs.standard.feature1", "tariffs.standard.feature2", "tariffs.standard.feature3"],
      tagKey: "tariffs.mostPopular",
      tag: "MOST POPULAR",
      gradient: "from-purple-600 via-pink-600 to-blue-600",
      icon: Trophy,
    },
    {
      nameKey: "tariffs.night.name",
      timeFrom: "23:00",
      timeTo: "09:00",
      price: "100",
      priceUnitKey: "tariffs.priceUnit",
      descriptionKey: "tariffs.night.description",
      featuresKeys: ["tariffs.night.feature1", "tariffs.night.feature2", "tariffs.night.feature3"],
      tag: null,
      gradient: "from-indigo-600 to-purple-600",
      icon: Zap,
    },
  ];

  const itemsPerView = isMobile ? 1 : 3;
  const maxIndex = Math.max(0, tariffs.length - itemsPerView);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (!isMobile) return; // Auto-scroll only on mobile
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [maxIndex, isMobile]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  if (!mounted) {
    return null;
  }

  return (
    <section 
      id="tariffs" 
      className="py-12 relative overflow-hidden" 
      ref={ref}
    >
      {/* Gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-6">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-bold uppercase tracking-wider text-purple-300">
              {t("tariffs.tag") || "Pricing"}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase mb-6 px-4">
            <span className="block text-white break-words">{t("tariffs.title1") || "Выгодные"}</span>
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent break-words">
              {t("tariffs.title") || "Тарифы"}
            </span>
          </h2>

          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            {t("tariffs.description") || "Выберите удобное время и начните играть"}
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative mb-12">
          {/* Navigation Arrows */}
          {!isMobile && (
            <>
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-20 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === maxIndex}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-20 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          {/* Pricing Cards - Carousel */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{
                x: isMobile 
                  ? `calc(-${currentIndex * 100}% - ${currentIndex * 24}px)`
                  : `calc(-${currentIndex * 33.333}% - ${currentIndex * 16}px)`
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {tariffs.map((tariff, i) => {
            const Icon = tariff.icon;
            const isPopular = tariff.tag === "MOST POPULAR";
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                whileHover={{ scale: 1.05, y: -8 }}
                className={`relative group flex-shrink-0 ${isMobile ? 'w-full' : 'w-[calc(33.333%-16px)]'} ${isPopular ? 'md:scale-105' : ''}`}
              >
                <div className={`relative h-full rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-950 border-2 ${isPopular ? 'border-purple-500' : 'border-gray-800'} transition-all duration-300 hover:border-purple-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]`}>
                  
                  {/* Popular badge */}
                  {isPopular && (
                    <div className="absolute top-0 left-0 right-0 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-center">
                      <span className="text-xs font-black uppercase tracking-widest text-white">
                        {t(tariff.tagKey || "tariffs.mostPopular")}
                      </span>
                    </div>
                  )}

                  <div className={`p-6 ${isPopular ? 'pt-12' : ''}`}>
                    
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${tariff.gradient} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Name */}
                    <h3 className="text-3xl font-black text-white mb-2 uppercase">
                      {t(tariff.nameKey)}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-sm mb-6">
                      {t(tariff.descriptionKey)}
                    </p>

                    {/* Time */}
                    <div className="flex items-center gap-2 mb-6 p-3 rounded-xl bg-white/5 border border-white/10">
                      <Clock className="w-5 h-5 text-purple-400" />
                      <span className="text-white font-bold">
                        {tariff.timeFrom} - {tariff.timeTo}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mb-6 pb-6 border-b border-gray-800">
                      <div className="flex items-baseline gap-2">
                        <span className={`text-5xl font-black bg-gradient-to-r ${tariff.gradient} bg-clip-text text-transparent`}>
                          {tariff.price}
                        </span>
                        <span className="text-gray-400 text-lg">
                          {t(tariff.priceUnitKey)}
                        </span>
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {tariff.featuresKeys.map((featureKey, j) => (
                        <li key={j} className="flex items-center gap-3">
                          <CheckCircle2 className={`w-5 h-5 text-purple-400 shrink-0`} />
                          <span className="text-gray-300 text-sm">{t(featureKey)}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Book button */}
                    <motion.a
                      href="#booking-flow"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full px-6 py-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                        isPopular
                          ? `bg-gradient-to-r ${tariff.gradient} text-white shadow-lg shadow-purple-500/50`
                          : 'bg-white/5 text-white border-2 border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500'
                      }`}
                    >
                      {t("tariffs.button") || "Забронировать"}
                      <ArrowRight className="w-5 h-5" />
                    </motion.a>

                  </div>

                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
                </div>
              </motion.div>
            );
          })}
            </motion.div>
          </div>

          {/* Mobile Dots Indicator */}
          {isMobile && (
            <div className="flex justify-center gap-2 mt-6">
              {tariffs.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentIndex === i 
                      ? 'bg-purple-500 w-8' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <p className="text-gray-400 text-sm">
            {t("tariffs.note") || "Все цены указаны за один час игры. Бронирование обязательно."}
          </p>
        </motion.div>

      </div>
    </section>
  );
}
