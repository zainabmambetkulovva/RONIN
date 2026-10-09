"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ComputerGrid } from "@/components/booking/ComputerGrid";
import { BookingModal } from "@/components/booking/BookingModal";
import { CyberNavbar } from "@/components/layout/CyberNavbar";
import { CyberFooter } from "@/components/layout/CyberFooter";
import { BottomNav } from "@/components/layout/BottomNav";

interface Computer {
  id: string;
  number: number;
  categoryId: string;
  category: {
    id: string;
    name: string;
    description: string;
  };
  specifications: any;
  status: "available" | "maintenance";
}

interface Category {
  id: string;
  name: string;
  description: string;
  _count: {
    computers: number;
  };
}

export default function BookingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [computers, setComputers] = useState<Computer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedComputer, setSelectedComputer] = useState<Computer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка данных
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Загружаем компьютеры
      const computersRes = await fetch("/api/computers");
      const computersData = await computersRes.json();
      setComputers(computersData.computers || []);

      // Загружаем категории
      const categoriesRes = await fetch("/api/categories");
      const categoriesData = await categoriesRes.json();
      setCategories(categoriesData.categories || []);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Фильтрация компьютеров
  const filteredComputers = selectedCategory === "all"
    ? computers
    : computers.filter(c => c.categoryId === selectedCategory);

  const handleComputerClick = (computer: Computer) => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/booking");
      return;
    }
    setSelectedComputer(computer);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0" style={{ background: "#03030a" }}>
      <CyberNavbar />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12" style={{ background: "linear-gradient(90deg, transparent, #3b82f6)" }} />
              <span className="text-sm font-bold uppercase tracking-[0.3em] text-blue-400">
                БРОНИРОВАНИЕ
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase mb-4">
              Выберите компьютер
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              93 станции с различными характеристиками. Выберите подходящий компьютер, выберите время и оплатите онлайн.
            </p>
          </motion.div>

          {/* Фильтры по категориям */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-all ${
                  selectedCategory === "all"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                Все ({computers.length})
              </button>
              
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-all ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {category.name} ({category._count?.computers || 0})
                </button>
              ))}
            </div>
          </motion.div>

          {/* Сетка компьютеров */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Загрузка компьютеров...</p>
              </div>
            </div>
          ) : filteredComputers.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">Компьютеры не найдены</p>
            </div>
          ) : (
            <ComputerGrid
              computers={filteredComputers}
              onComputerClick={handleComputerClick}
            />
          )}

        </div>
      </main>

      {/* Модальное окно бронирования */}
      <AnimatePresence>
        {isModalOpen && selectedComputer && (
          <BookingModal
            computer={selectedComputer}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedComputer(null);
            }}
          />
        )}
      </AnimatePresence>

      <CyberFooter />
      
      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
