# 🔍 Google OAuth Debug Guide

## ❌ Көйгөй: "Войти через Google" иштебей жатат

---

## 🛠️ ДИАГНОСТИКА КАДАМДАРЫ:

### 1️⃣ **Vercel Logs текшерүү:**

```bash
# Vercel dashboard га кириңиз:
https://vercel.com/dashboard

# Жакында сыз проект: ronin
# Deployments -> Latest -> View Function Logs
```

**Караганда:**
- `[Google OAuth Init]` - Redirect иштеби?
- `[Google OAuth Callback]` - Callback келдиби?
- Error messages бар бекен?

---

### 2️⃣ **Browser Console текшерүү:**

1. F12 басыңыз (Developer Tools)
2. Console tab
3. "Войти через Google" басыңыз
4. Кандай errors көрүнөт?

**Ожидается:**
```
Navigating to /api/auth/google
Redirecting to accounts.google.com...
```

**Эгер ката болсо:**
```
Error: Failed to fetch
Network error
CORS error
```

---

### 3️⃣ **Test Endpoint колдонуу:**

Production дагы тест кылыңыз:
```
https://ronin-mjlm.vercel.app/api/auth/google/test
```

**Көрүнүшү керек:**
```json
{
  "status": "OK",
  "config": {
    "hasClientId": true,
    "hasClientSecret": true,
    "hasNextAuthUrl": true,
    "hasNextAuthSecret": true,
    "clientIdLength": 72,
    "clientSecretLength": 35,
    "nextAuthUrl": "https://ronin-mjlm.vercel.app",
    "redirectUri": "https://ronin-mjlm.vercel.app/api/auth/google/callback"
  }
}
```

**Эгер `false` болсо:**
- Vercel Environment Variables текшерүү керек!

---

### 4️⃣ **Vercel Environment Variables:**

1. Vercel Dashboard → Settings → Environment Variables
2. Текшерүү керек:

```env
GOOGLE_CLIENT_ID = 499331f352-7dvmjumliopcicmdi0inv15t6udigmn.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = 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
NEXTAUTH_URL = https://ronin-mjlm.vercel.app
NEXTAUTH_SECRET = 2a3/JO8FlzMH7txi7s4tPOFQ7wX5inZ6eoZqQG1Qcsk=
```

**Маанилүү:**
- Environment: Production, Preview, Development - БААРЫНА кошуңуз
- Spaces жок болушу керек
- Trailing newlines жок болушу керек

**Эгер жок болсо:**
- Add environment variable
- Redeploy кылыңыз!

---

### 5️⃣ **Google Console Redirect URI:**

1. https://console.cloud.google.com
2. APIs & Services → Credentials
3. OAuth 2.0 Client ID → Edit

**Authorized Redirect URIs:**
```
https://ronin-mjlm.vercel.app/api/auth/google/callback
```

**Текшерүү:**
- ✅ Exact match (trailing slash жок)
- ✅ HTTPS
- ✅ Saved

---

### 6️⃣ **Manual Test:**

**Direct URL:**
```
https://ronin-mjlm.vercel.app/api/auth/google
```

**Күтүлгөн:**
1. Redirect to `accounts.google.com`
2. Google login/select account
3. Redirect to `/api/auth/google/callback?code=...`
4. Redirect to home `/`

**Эгер иштебесе:**
- Кайсы этапта токтоду?
- Browser Network tab караңыз (F12 → Network)

---

## 🐛 КОКУСТУК КАТЛАР:

### ❌ Error: "no_code"
**Причина:** Google код бербеди  
**Чечүү:** Google Console credentials текшерңиз

### ❌ Error: "token_exchange"
**Причина:** Google token алмашууда ката  
**Чечүү:** 
- `GOOGLE_CLIENT_SECRET` туурабы?
- Vercel logs караңыз (толук error message)

### ❌ Error: "user_info"
**Причина:** Google user data алуу ката  
**Чечүү:** OAuth scopes туурабы? (openid email profile)

### ❌ Error: "config"
**Причина:** `GOOGLE_CLIENT_ID` жок  
**Чечүү:** Vercel environment variables кошуңуз

### ❌ Error: "access_denied"
**Причина:** Колдонуучу access denial басты  
**Чечүү:** Кайра аракет кылыңыз

---

## ✅ ЧЕЧҮҮЛӨР:

### Чечүү 1: Vercel Env Variables кошуу
```bash
# Vercel Dashboard:
Settings → Environment Variables → Add

GOOGLE_CLIENT_ID = <your-client-id>
GOOGLE_CLIENT_SECRET = <your-secret>
NEXTAUTH_URL = https://ronin-mjlm.vercel.app
NEXTAUTH_SECRET = <your-secret-32-chars>

# Save → Redeploy
```

### Чечүү 2: Google Console Redirect URI
```
1. Google Console → Credentials
2. OAuth Client → Edit
3. Authorized redirect URIs → Add:
   https://ronin-mjlm.vercel.app/api/auth/google/callback
4. Save
```

### Чечүү 3: Hard refresh
```
Browser: Ctrl + Shift + R
Clear cache and reload
```

### Чечүү 4: Check logs
```bash
# Vercel CLI:
vercel logs --follow

# Or Dashboard:
Deployments → Latest → View Logs
```

---

## 📊 DEBUG CHECKLIST:

- [ ] Vercel env variables бар
- [ ] Google Console redirect URI туура
- [ ] Test endpoint иштейт (/api/auth/google/test)
- [ ] Browser console таза (errors жок)
- [ ] Vercel logs караганбыз
- [ ] Hard refresh кылдык
- [ ] Manual URL test кылдык

---

## 🚀 WORKING EXAMPLE:

**URL flow:**
```
1. Click button
   → /api/auth/google

2. Server redirect
   → https://accounts.google.com/o/oauth2/v2/auth?...

3. Google auth
   → User selects account

4. Google callback
   → /api/auth/google/callback?code=...

5. Server creates session
   → Redirect to /

6. Home page
   → Logged in ✅
```

---

## 📞 ЖАРДАМ:

**Эгер дагы эле иштебесе:**

1. **Vercel logs жиберңиз:**
   - Screenshot of error logs
   - `/api/auth/google/test` response

2. **Browser console:**
   - Network tab (failed requests)
   - Console errors

3. **Google Console:**
   - Screenshot of Redirect URIs
   - OAuth consent screen settings

---

**Updated:** 2026-10-21  
**Status:** Diagnostic tools added
