'use client';

import { WifiOff, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OfflinePage() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-purple-950/20 px-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500/30 blur-3xl rounded-full" />
            <WifiOff className="w-24 h-24 text-purple-400 relative z-10" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-black text-white mb-4"
        >
          Нет подключения
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 mb-8"
        >
          Проверьте интернет-соединение и попробуйте снова
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={handleReload}
          className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white uppercase tracking-wider overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center gap-2 justify-center">
            <RefreshCw className="w-5 h-5" />
            Обновить
          </div>
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 glass-card p-6 rounded-xl"
        >
          <h2 className="text-white font-bold mb-2">💡 Совет</h2>
          <p className="text-sm text-gray-400">
            Некоторые страницы доступны офлайн. Попробуйте перейти на главную страницу или в профиль.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
