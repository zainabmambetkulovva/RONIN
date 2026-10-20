'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Проверяем установлено ли приложение
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Слушаем событие beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Показываем промпт через 5 секунд после загрузки
      setTimeout(() => {
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (!dismissed) {
          setShowPrompt(true);
        }
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Слушаем успешную установку
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setIsLoading(false);
      console.log('✅ PWA успешно установлен!');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    setIsLoading(true);

    try {
      // Показываем нативный промпт браузера
      await deferredPrompt.prompt();

      // Ждём выбор пользователя (с timeout 5 секунд)
      const timeoutPromise = new Promise<{ outcome: 'timeout' }>((resolve) => {
        setTimeout(() => resolve({ outcome: 'timeout' }), 5000);
      });

      const result = await Promise.race([
        deferredPrompt.userChoice,
        timeoutPromise
      ]);
      
      if (result.outcome === 'accepted') {
        console.log('✅ Пользователь принял установку');
        // Установка началась, закрываем промпт
        setShowPrompt(false);
      } else if (result.outcome === 'timeout') {
        console.log('⏱️ Timeout - закрываем промпт');
        setShowPrompt(false);
      } else {
        console.log('❌ Пользователь отклонил установку');
      }
    } catch (error) {
      console.error('Ошибка при установке PWA:', error);
    } finally {
      setIsLoading(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
    
    // Сбросим через 7 дней
    setTimeout(() => {
      localStorage.removeItem('pwa-install-dismissed');
    }, 7 * 24 * 60 * 60 * 1000);
  };

  // Не показываем если приложение уже установлено
  if (isInstalled) return null;

  return (
    <AnimatePresence>
      {showPrompt && deferredPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed bottom-20 left-4 right-4 md:left-auto md:right-8 md:max-w-sm z-50"
        >
          <div className="glass-card p-6 rounded-2xl border border-purple-500/30 shadow-2xl">
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="flex items-start gap-4 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-full" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <Download className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="flex-1 pt-1">
                <h3 className="text-white font-bold text-lg mb-1">
                  Установить RONIN
                </h3>
                <p className="text-gray-400 text-sm">
                  Получите быстрый доступ к приложению прямо с рабочего стола
                </p>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-2 mb-4 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Работает без интернета
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Быстрая загрузка
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Push уведомления
              </li>
            </ul>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleInstallClick}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white text-sm hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Установка...
                  </>
                ) : (
                  'Установить'
                )}
              </button>
              <button
                onClick={handleDismiss}
                disabled={isLoading}
                className="px-4 py-3 glass-card rounded-xl font-bold text-white text-sm hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Позже
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
