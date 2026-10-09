"use client";

import { motion } from "framer-motion";
import { CyberNavbar } from "@/components/layout/CyberNavbar";
import { CyberFooter } from "@/components/layout/CyberFooter";
import { BottomNav } from "@/components/layout/BottomNav";

export default function ReceiptsPage() {
  return (
    <div className="min-h-screen pb-20 md:pb-0" style={{ background: "#03030a" }}>
      <CyberNavbar />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase mb-4">
              Мои чеки
            </h1>
            <p className="text-gray-400 text-lg">
              Здесь будут отображаться ваши электронные чеки после оплаты
            </p>
          </motion.div>
        </div>
      </main>

      <CyberFooter />
      <BottomNav />
    </div>
  );
}
