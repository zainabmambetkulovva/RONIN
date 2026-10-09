# ✅ ШАГ 3: GOOGLE OAUTH - ПОЧТИ ГОТОВО!

## 🎯 ЧТО СДЕЛАНО:

1. ✅ Создан файл NextAuth конфигурации
   - `src/app/api/auth/[...nextauth]/route.ts`
   - Добавлен Google Provider
   - Добавлен Credentials Provider
   - Настроены callbacks для работы с ролями

2. ✅ Созданы TypeScript типы
   - `src/types/next-auth.d.ts`
   - Добавлены поля: id, role, avatar, status

3. ✅ Обновлен NEXTAUTH_SECRET
   - Сгенерирован криптографически стойкий ключ
   - Обновлен в `.env`

4. ✅ Google OAuth кнопка уже добавлена
   - В LoginForm.tsx
   - В RegisterForm.tsx

---

## 📦 ОСТАЛОСЬ СДЕЛАТЬ:

### Установить недостающий пакет:

Откройте PowerShell в папке проекта и выполните:

```powershell
cd "c:\Users\Dell\OneDrive\Desktop\Новая папка\ronin"
npm install @next-auth/prisma-adapter
```

**ИЛИ** если npm не работает:

```powershell
pnpm add @next-auth/prisma-adapter
```

---

## ✅ ПОСЛЕ УСТАНОВКИ:

1. Перезапустите dev сервер:
   ```powershell
   npm run dev
   ```

2. Откройте http://localhost:3000/login

3. Нажмите "Войти через Google"

4. Должен открыться Google OAuth экран

---

## 🔍 ПРОВЕРКА:

### Credentials в .env правильные:
```
GOOGLE_CLIENT_ID="4993317352-llih20bl4v59kdjp3q5ffrbk889k3lt2.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="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"
```

### NextAuth URL:
```
NEXTAUTH_URL="http://localhost:3000"
```

### В Google Console должен быть добавлен Redirect URI:
```
http://localhost:3000/api/auth/callback/google
```

---

## ⚠️ ЕСЛИ GOOGLE OAUTH НЕ РАБОТАЕТ:

1. **Проверьте Google Console:**
   - Зайдите на https://console.cloud.google.com
   - Выберите ваш проект
   - APIs & Services → Credentials
   - Найдите OAuth 2.0 Client ID
   - В "Authorized redirect URIs" должно быть:
     ```
     http://localhost:3000/api/auth/callback/google
     ```

2. **Если credentials неверные:**
   - Создайте новые в Google Console
   - Обновите в `.env`

---

## 🎉 ГОТОВО!

После установки `@next-auth/prisma-adapter` Google OAuth будет работать!

**Скажите "установил" когда выполните команду, и я продолжу дальше!**
