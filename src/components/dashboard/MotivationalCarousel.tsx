"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MOTIVATIONAL_QUOTES = [
  {
    text: "Победа начинается с первого клика.",
    author: "RONIN",
    color: "#3b82f6",
  },
  {
    text: "Не сдавайся. Каждая игра — это новый шанс.",
    author: "RONIN",
    color: "#8b5cf6",
  },
  {
    text: "Твой лимит — это только твоё воображение.",
    author: "RONIN",
    color: "#06b6d4",
  },
  {
    text: "Играй умнее, не сложнее.",
    author: "RONIN",
    color: "#ec4899",
  },
  {
    text: "Чемпионы создаются из тысячи попыток.",
    author: "RONIN",
    color: "#f59e0b",
  },
  {
    text: "В каждом поражении скрыта следующая победа.",
    author: "RONIN",
    color: "#10b981",
  },
  {
    text: "Легенды не рождаются. Их создают.",
    author: "RONIN",
    color: "#6366f1",
  },
];

const INTERVAL_MS = 120000; // 2 минуты = 120000ms

export function MotivationalCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Auto-advance carousel every 2 minutes
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
      setProgress(0);
    }, INTERVAL_MS);

    // Update progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + (100 / (INTERVAL_MS / 100));
      });
    }, 100);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + MOTIVATIONAL_QUOTES.length) % MOTIVATIONAL_QUOTES.length);
    setProgress(0);
  };

  const currentQuote = MOTIVATIONAL_QUOTES[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="relative rounded-3xl overflow-hidden mb-8 sm:mb-12"
      style={{
        background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))",
        border: "1px solid rgba(59,130,246,0.3)",
      }}
    >
      {/* Content */}
      <div className="relative z-10 p-8 sm:p-12 md:p-16">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-6 sm:mb-8"
            style={{
              background: `linear-gradient(135deg, ${currentQuote.color}, ${currentQuote.color}dd)`,
              boxShadow: `0 0 40px ${currentQuote.color}66`,
            }}
          >
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </motion.div>

          {/* Quote text with AnimatePresence for smooth transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <p
                className="font-black leading-tight tracking-tight mb-4 sm:mb-6"
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                  color: currentQuote.color,
                  textShadow: `0 0 30px ${currentQuote.color}44`,
                }}
              >
                {currentQuote.text}
              </p>
              <p className="text-gray-400 text-sm sm:text-base font-medium uppercase tracking-wider">
                — {currentQuote.author}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation dots */}
          <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10">
            {MOTIVATIONAL_QUOTES.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setProgress(0);
                }}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? "w-8 sm:w-12" : "w-2"
                }`}
                style={{
                  background: index === currentIndex ? currentQuote.color : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={handlePrev}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.3)",
              }}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.3)",
              }}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <motion.div
          className="h-full"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${currentQuote.color}, ${currentQuote.color}88)`,
            transition: "width 0.1s linear",
          }}
        />
      </div>

      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 blur-3xl"
        style={{ background: currentQuote.color }}
      />
    </motion.div>
  );
}
