# 📱 NGROK Setup Guide - Телефонго тестирлөө

## 1️⃣ NGROK орнотуу

### Windows:
```bash
# Chocolatey менен
choco install ngrok

# Же скачать: https://ngrok.com/download
```

### Signup:
1. https://dashboard.ngrok.com/signup
2. Authtoken алыңыз
3. Configure:
```bash
ngrok config add-authtoken YOUR_TOKEN
```

---

## 2️⃣ Development Server башталуу

### Terminal 1 - Next.js:
```bash
cd ronin
npm run dev
```

---

## 3️⃣ NGROK туннель ачуу

### Terminal 2 - ngrok:
```bash
ngrok http 3000
```

Натыйжа:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

---

## 4️⃣ Environment variable коюу

### .env.local файлын түзүңүз:
```env
NEXT_PUBLIC_APP_URL=https://abc123.ngrok.io
```

**МААНИЛҮҮ:** ngrok URL өзгөргөндө (ар башталууда) бул variable жаңыртуу керек!

---

## 5️⃣ Dev server restart

```bash
# Ctrl+C - dev serverди токтотуу
npm run dev
```

---

## 6️⃣ Телефондо ачуу

1. Телефонуңуздун браузеринде:
   ```
   https://abc123.ngrok.io
   ```

2. WiFi же Mobile Data - бир эле эмес (ngrok remote)

3. Test:
   - ✅ Landing page
   - ✅ Login/Register
   - ✅ Google OAuth (**жакында иштейт**)
   - ✅ Booking
   - ✅ Profile
   - ✅ Admin панель

---

## 💡 КЕҢЕШТЕР:

### Түбөлүккү ngrok domain (paid):
```bash
ngrok http 3000 --domain=ronin-test.ngrok.io
```
Бул domain өзгөрбөйт!

### Google OAuth үчүн:
Google Console Redirect URI кошуу:
```
https://abc123.ngrok.io/api/auth/google/callback
```

### FINIK Pay үчүн:
FINIK webhook URL жаңыртуу:
```
https://abc123.ngrok.io/api/finik/webhook
```

---

## 🐛 Troubleshooting:

### Problem: "Invalid Host header"
**Чечүү:** Next.js автоматта ngrok менен иштейт

### Problem: "Session not working"
**Чечүү:** Cookie sameSite='lax' колдонуудабыз, иштеши керек

### Problem: "Google OAuth redirect fails"
**Чечүү:** Google Console Redirect URI дагы ngrok URL кошуңуз

### Problem: "ngrok session expired"
**Чечүү:** 
- Free plan: 2 саат максимум
- Restart: `ngrok http 3000`
- Update NEXT_PUBLIC_APP_URL
- Restart dev server

---

## 📊 PRODUCTION vs NGROK:

| Feature | Production | ngrok |
|---------|-----------|-------|
| URL | Fixed | Changes daily |
| Speed | Fast | Slower (tunnel) |
| SSL | Yes | Yes |
| Auth | Works | Works |
| Payments | Works | Need webhook URL |

---

## ✅ CHECKLIST:

- [ ] ngrok орнотулду
- [ ] authtoken конфигурацияланды
- [ ] Dev server иштеп жатат (localhost:3000)
- [ ] ngrok туннель ачылды
- [ ] NEXT_PUBLIC_APP_URL коюлду .env.local го
- [ ] Dev server restart болду
- [ ] Телефондо ачылды
- [ ] Баары иштейт! 🎉

---

## 🚀 Кыска команда:

```bash
# 1 терминал
cd ronin && npm run dev

# 2 терминал  
ngrok http 3000

# URL алып, .env.local го кошуңуз, restart
```

Даяр! 📱✨
