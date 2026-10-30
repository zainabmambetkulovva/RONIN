"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useBranding } from "@/contexts/BrandingContext";
import { useEffect, useState } from "react";

/**
 * Экран загрузки. Анимации — только CSS-трансформации (вращение, лёгкая пульсация): они идут на видеокарте и не тормозят
 * на телефоне. Свечение — радиальный градиент, а не filter/drop-shadow: тяжёлый фильтр и тормозил, и обрезался квадратом.
 */
export function LoadingScreen() {
  const brand = useBranding();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: "radial-gradient(circle at center, #1a0b2e 0%, #0a0a14 100%)" }}
        >
          {/* Всё в квадрате фиксированного размера и по центру через inset-0 + m-auto */}
          <div className="relative h-56 w-56 sm:h-72 sm:w-72">
            {/* Мягкое свечение без краёв: градиент сам растворяется в прозрачность */}
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(168,85,247,0.35) 0%, rgba(236,72,153,0.12) 40%, transparent 70%)" }}
              aria-hidden
            />
            <div
              className="absolute inset-0 m-auto h-48 w-48 animate-[spin_3s_linear_infinite] rounded-full border-4 border-transparent border-r-pink-500 border-t-purple-500 will-change-transform sm:h-60 sm:w-60"
              aria-hidden
            />
            <div
              className="absolute inset-0 m-auto h-56 w-56 animate-[spin_4s_linear_infinite_reverse] rounded-full border-4 border-transparent border-b-blue-500 border-l-purple-500 will-change-transform sm:h-72 sm:w-72"
              aria-hidden
            />
            <div className="absolute inset-0 m-auto h-24 w-24 animate-[rn-logo-pulse_2s_ease-in-out_infinite] will-change-transform sm:h-28 sm:w-28">
              <Image
                src={brand.logoUrl}
                unoptimized={brand.logoUrl.startsWith("/api/")}
                alt={brand.clubName}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 96px, 112px"
                priority
              />
            </div>
          </div>
          <style>{`@keyframes rn-logo-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}`}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
