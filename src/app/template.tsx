"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Плавное появление каждой страницы при переходе.
 * Только прозрачность: transform у обёртки сломал бы fixed-элементы (шапка, нижнее меню, кнопка ИИ).
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}
