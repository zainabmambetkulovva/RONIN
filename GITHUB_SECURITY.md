# 🔐 GitHub & Vercel Security Guidelines

## Важно! ⚠️

Этот проект содержит конфиденциальную информацию. Убедитесь, что **никогда** не коммитить:

- 🔴 Database credentials (passwords, connection strings)
- 🔴 API keys (Stripe, PayPal, etc.)
- 🔴 JWT secrets
- 🔴 OAuth tokens
- 🔴 Private keys (.pem files)
- 🔴 Configuration files с passwords

## ✅ Что защищено?

### .gitignore

Все файлы с префиксом `.env` **автоматически игнорируются**:

```
.env
.env.local
.env.*.local
.env.production.local
```

Проверить что защищено:
```bash
git check-ignore .env.local
# Output: .env.local
```

## 📋 Как использовать локально

1. **Скопируй пример конфига:**
```bash
cp .env.example .env.local
```

2. **Заполни реальные значения** в `.env.local`:
```env
DATABASE_URL="your_real_connection_string"
JWT_SECRET="your_secret_key"
# ... остальное
```

3. **Никогда не коммитить `.env.local`!**

## 🚀 Развертывание на Vercel

### Метод 1: Dashboard UI

1. Перейди на [vercel.com](https://vercel.com)
2. Импортируй GitHub репозиторий
3. В настройках проекта → **Environment Variables** → добавь переменные:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - ... остальное

### Метод 2: Команда (CLI)

```bash
# Установи Vercel CLI
npm i -g vercel

# Логин в Vercel
vercel login

# Добавь env переменные для Production
vercel env add DATABASE_URL
# Введи значение...

vercel env add JWT_SECRET
# Введи значение...

# Разверни
vercel --prod
```

## 🔒 Проверка перед Push

Перед тем как запушить, убедись:

```bash
# Проверь что .env.local в gitignore
cat .gitignore | grep "\.env"

# Посмотри что будет коммититься
git status

# Если случайно добавил .env.local:
git reset HEAD .env.local
git rm --cached .env.local
```

## 🚨 Если секрет был запушен случайно

### Срочно!

1. **Измени пароли** немедленно
2. **Ротейте токены** на GitHub, Vercel, etc.
3. **Удали из истории Git:**

```bash
# Способ 1: BFG Repo-Cleaner (проще)
brew install bfg  # или скачай с github.com/rtyley/bfg-repo-cleaner
bfg --delete-files .env.local

# Способ 2: git filter-branch
git filter-branch --tree-filter 'rm -f .env.local' HEAD
```

4. **Force push:**
```bash
git push --force-with-lease origin main
```

5. **Создай новые секреты** на сервисах

## 📚 Recommended Reading

- [GitHub: Removing sensitive data from a repository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [Vercel: Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Node.js dotenv best practices](https://12factor.net/config)

## ✔️ Чек-лист перед публикацией

- [ ] Все .env файлы в .gitignore
- [ ] .env.example создан и задокументирован
- [ ] Нет credentials в коде (git history clean)
- [ ] Vercel environment variables настроены
- [ ] Database access из Vercel работает
- [ ] Нет логов с secrets в консоли
- [ ] package-lock.json НЕ содержит credentials

## 🤝 Для контрибьюторов

Если хочешь помочь с проектом:

1. Клонируй репозиторий:
```bash
git clone https://github.com/username/artexx.git
cd artexx
```

2. Установи зависимости:
```bash
npm install
```

3. Создай `.env.local` из примера:
```bash
cp .env.example .env.local
# Заполни свои значения
```

4. Разработка как обычно:
```bash
npm run dev
```

5. Коммитте и push ТОЛЬКО публичного кода
