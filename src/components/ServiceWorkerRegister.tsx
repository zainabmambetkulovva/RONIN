"use client";

import { useEffect } from "react";

/** Регистрация Service Worker для PWA (раньше была прямо в корневом layout). */
export function ServiceWorkerRegister() {
  // Регистрация Service Worker для PWA
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker зарегистрирован:', registration);
          
          // Проверка обновлений каждые 5 минут
          setInterval(() => {
            registration.update().then(() => {
              console.log('🔄 Проверка обновлений Service Worker...');
            }).catch(err => {
              console.error('Ошибка проверки обновлений:', err);
            });
          }, 5 * 60 * 1000);
          
          // Обновление Service Worker
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Новая версия доступна
                  console.log('🔄 Новая версия приложения доступна');
                  // Автоматически обновляем без подтверждения
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('❌ Ошибка регистрации Service Worker:', error);
        });
    }
  }, []);

  return null;
}
