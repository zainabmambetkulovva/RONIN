# 📱 PWA Setup для RONIN Gaming Club

## ✅ Что сделано

### 1. Файлы PWA
- ✅ `public/manifest.json` - манифест приложения
- ✅ `public/sw.js` - Service Worker для кэширования и офлайн работы
- ✅ `src/app/offline/page.tsx` - страница для офлайн режима
- ✅ PWA мета-теги в `layout.tsx`

### 2. Функционал
- ✅ Офлайн поддержка (страницы кэшируются)
- ✅ Установка на устройство (Add to Home Screen)
- ✅ Кастомные иконки и splash screens
- ✅ Push уведомления (готово к использованию)
- ✅ Background sync (готово к использованию)
- ✅ Shortcuts в манифесте (быстрый доступ к разделам)

---

## 🚀 Генерация иконок

### Вариант 1: Автоматическая генерация (рекомендуется)

```bash
# 1. Установите sharp
npm install sharp

# 2. Запустите генератор
node generate-pwa-icons.js
```

Скрипт создаст все нужные иконки из `public/logo-new.png`

### Вариант 2: Ручная подготовка

Создайте иконки вручную в `public/icons/`:
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png` ⭐ (обязательно)
- `icon-384x384.png`
- `icon-512x512.png` ⭐ (обязательно)

**Требования к иконкам:**
- Формат: PNG с прозрачностью
- Фон: тёмный или прозрачный
- Содержание: логотип RONIN по центру
- Padding: ~10% от размера для maskable icons

---

## 🧪 Тестирование PWA

### 1. Локальное тестирование

```bash
# Production сборка (Service Worker работает только в prod)
npm run build
npm start
```

Откройте: http://localhost:3004

### 2. Проверка в Chrome DevTools

1. Откройте DevTools (F12)
2. **Application** → **Manifest**
   - Проверьте что manifest.json загружен
   - Проверьте иконки
3. **Application** → **Service Workers**
   - Должен быть зарегистрирован `/sw.js`
   - Статус: "activated and is running"
4. **Lighthouse** → **Generate report**
   - Категория: Progressive Web App
   - Цель: 100/100 баллов

### 3. Тест установки на устройство

**Desktop (Chrome/Edge):**
1. Откройте сайт
2. В адресной строке справа появится значок "Install"
3. Нажмите → установится как desktop app

**Android:**
1. Откройте в Chrome
2. Меню → "Add to Home screen"
3. Приложение появится на рабочем столе

**iOS (Safari):**
1. Откройте в Safari
2. Нажмите "Share" → "Add to Home Screen"
3. Приложение появится на рабочем столе

---

## 📦 Деплой на Vercel

PWA автоматически работает после деплоя:

```bash
git add -A
git commit -m "feat: добавлен PWA функционал"
git push origin main
```

После деплоя проверьте:
1. https://your-domain.vercel.app/manifest.json
2. https://your-domain.vercel.app/sw.js
3. Lighthouse PWA score

---

## 🎯 Чек-лист для PWA

### Обязательные требования
- ✅ HTTPS (Vercel даёт автоматически)
- ✅ manifest.json с name, icons, start_url
- ✅ Service Worker зарегистрирован
- ✅ Иконки 192x192 и 512x512
- ✅ Работает офлайн (минимум базовые страницы)

### Опциональные улучшения
- ✅ theme_color и background_color
- ✅ Shortcuts для быстрого доступа
- ✅ Кастомная offline страница
- ✅ Push notifications готовы
- ✅ Background sync готов
- ⬜ Screenshots в манифесте (добавьте скриншоты в public/screenshots/)

---

## 🔧 Настройка Push уведомлений (опционально)

### 1. Получите VAPID ключи

```bash
npx web-push generate-vapid-keys
```

### 2. Добавьте в .env

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY="your_public_key"
VAPID_PRIVATE_KEY="your_private_key"
```

### 3. Реализуйте подписку

```typescript
// В клиентском компоненте
const subscription = await navigator.serviceWorker.ready.then(reg => 
  reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  })
);

// Отправьте subscription на сервер
await fetch('/api/push/subscribe', {
  method: 'POST',
  body: JSON.stringify(subscription)
});
```

---

## 📊 Проверка PWA статуса

### Chrome DevTools Lighthouse

**Цели:**
- Progressive Web App: 100/100
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

**Типичные проблемы:**
1. ❌ "Does not register a service worker" → проверьте registration в layout.tsx
2. ❌ "No matching service worker detected" → запустите production build
3. ❌ "Manifest doesn't have icons" → добавьте иконки 192 и 512
4. ❌ "Page does not work offline" → проверьте sw.js кэширование

### Онлайн тесты
- https://www.pwabuilder.com/ - проверка и советы
- https://web.dev/measure/ - Lighthouse онлайн

---

## 🐛 Troubleshooting

### Service Worker не регистрируется

```bash
# Проверьте что файл существует
ls public/sw.js

# Проверьте production режим
npm run build
npm start
```

### Иконки не отображаются

```bash
# Проверьте путь
ls public/icons/icon-192x192.png
ls public/icons/icon-512x512.png

# Проверьте manifest.json
curl http://localhost:3004/manifest.json
```

### Приложение не устанавливается

1. Проверьте HTTPS (обязательно кроме localhost)
2. Проверьте manifest.json валидность
3. Убедитесь что Service Worker активен
4. Проверьте иконки 192x192 и 512x512

### Кэш не обновляется

```javascript
// В DevTools Console
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
});
location.reload();
```

---

## 📚 Полезные ссылки

- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [PWA Builder](https://www.pwabuilder.com/)
- [Workbox (Google's SW library)](https://developers.google.com/web/tools/workbox)

---

## ✨ Готово!

Ваше приложение RONIN теперь:
- 📱 Устанавливается на любое устройство
- 🔌 Работает офлайн
- ⚡ Быстро загружается (кэширование)
- 🔔 Готово к Push уведомлениям
- 🎯 Доступно с рабочего стола как нативное приложение

**Next steps:**
1. Сгенерируйте иконки: `node generate-pwa-icons.js`
2. Запустите production: `npm run build && npm start`
3. Проверьте Lighthouse PWA: DevTools → Lighthouse
4. Задеплойте на Vercel
5. Протестируйте установку на мобильном устройстве
