# ⚡ Quick Start Guide

## 🚀 Get Running in 30 Seconds

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/ronin-club.git
cd ronin-club
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env.local
# No need to edit .env.local for demo (uses mock data)
```

### 3. Run
```bash
npm run dev
```

### 4. Open Browser
```
http://localhost:3000
```

## 🎮 Select Your Role

On the home page, click one of three buttons:

### 👤 **Клиент** (Client)
- Browse 30 gaming computers
- Book gaming sessions
- View real-time pricing
- Get QR code receipt
- Chat with AI

### 👨‍💼 **Менеджер** (Manager)
- Track active sessions in real-time
- Create new orders
- Manage receipts
- View session history

### 🏆 **Админ** (Admin)
- View Computer Map
- See RONIN AI Insights
- Manage all system settings
- View analytics

## 📋 What Works

✅ Full navigation between all 24+ pages  
✅ Real mock data (no database needed)  
✅ Dark Neon Gaming UI with animations  
✅ Fully responsive (mobile/tablet/desktop)  
✅ AI Chat integration  
✅ QR code receipts  
✅ Real-time session tracking  
✅ Computer Map with animations  

## 🔍 Explore Features

### Client Portal
1. Go to `/client/home`
2. Click "Browse PCs" → `/client/computers`
3. Try booking → `/client/booking`
4. View receipt → `/client/receipt`
5. Chat with AI → `/client/ai-chat`

### Manager Dashboard
1. View dashboard stats → `/manager/dashboard`
2. Check active sessions → `/manager/sessions`
3. Create order → `/manager/orders`
4. Search receipts → `/manager/receipts`

### Admin Panel
1. View dashboard → `/admin/admin-dashboard`
2. See Computer Map → Computer Map on dashboard
3. Check RONIN Insights → Insights on dashboard
4. Manage computers → `/admin/admin-computers`

## 🎨 Customization

### Change Logo/Title
Edit `app/layout.tsx`:
```tsx
export const metadata: Metadata = {
  title: "Your Gaming Club Name",
  description: "Your description here",
};
```

### Change Color Theme
Edit `app/globals.css`:
```css
:root {
  --accent-cyan: #00ffff;  /* Change this */
  --bg-dark: #0a0e27;      /* Or this */
}
```

### Add More Computers
Edit `lib/data/mock-data.ts`:
```ts
export const mockComputers: Computer[] = [
  // Add more here
]
```

## 📦 Build for Production

```bash
npm run build
npm start
# Server runs on http://localhost:3000
```

## 🚀 Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repo
4. Deploy (1-click)

See `DEPLOYMENT.md` for details.

## 🆘 Troubleshooting

### Port 3000 Already in Use
```bash
npm run dev -- -p 3001  # Use port 3001 instead
```

### Clear Cache
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

### TypeScript Errors
```bash
npm run type-check  # See errors
npm run build       # Try building
```

## 📚 Learn More

- `README.md` - Full documentation
- `GITHUB_SECURITY.md` - Security guidelines
- `DEPLOYMENT.md` - Deployment steps
- `PROJECT_SUMMARY.md` - Project overview
- `PRE_LAUNCH_CHECKLIST.md` - Launch verification

## 🎯 Common Tasks

### Add a New Page
1. Create folder: `app/(client)/new-page/`
2. Create file: `app/(client)/new-page/page.tsx`
3. Add to navigation: `app/(client)/layout.tsx`

### Add a Component
1. Create: `app/components/common/MyComponent.tsx`
2. Export in: `app/components/common/index.ts`
3. Use it: `import { MyComponent } from '@/app/components/common'`

### Change Mock Data
1. Edit: `lib/data/mock-data.ts`
2. Changes appear instantly in dev mode

### Add Environment Variable
1. Create in: `.env.local`
2. Use in code:
   ```ts
   const apiUrl = process.env.NEXT_PUBLIC_API_URL
   ```

## 💡 Pro Tips

- 🔥 Use DevTools Dark Mode (F12)
- 📱 Test responsive (F12 → Toggle device toolbar)
- 🎨 Inspect components with React DevTools
- 💻 Use VS Code for best experience
- 🚀 Enable Fast Refresh (auto-reload)

## 🎓 Next Level

Ready for more?

### Add Database
```bash
npm install @prisma/client
npx prisma init
# Edit DATABASE_URL in .env.local
```

### Add Authentication
```bash
npm install next-auth
# Configure with GitHub OAuth
```

### Add Real Payments
```bash
npm install stripe
# Add STRIPE_SECRET_KEY to .env.local
```

## ❓ FAQ

**Q: Do I need a database?**  
A: No! Mock data is included. Add one later if needed.

**Q: Can I deploy for free?**  
A: Yes! Use Vercel free tier.

**Q: How do I secure secrets?**  
A: See `GITHUB_SECURITY.md`

**Q: Can I use this for real business?**  
A: Yes! It's production-ready. Add real database & auth when needed.

**Q: Is TypeScript required?**  
A: Recommended but you can switch to JavaScript.

## 🎉 You're Ready!

That's it! You're running RONIN Computer Club.

**Next:**
- 👉 Explore all three roles
- 👉 Check out the animations
- 👉 Review the code
- 👉 Deploy to Vercel
- 👉 Add to portfolio

---

**Questions?** Check `README.md` or open an issue on GitHub.

**Ready to deploy?** See `DEPLOYMENT.md`

🚀 **Happy coding!**
