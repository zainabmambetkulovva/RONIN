# 🚀 Deployment Guide - GitHub & Vercel

## Step 1: Prepare for GitHub

### 1.1 Verify Security

```bash
# Make sure .env.local is NOT tracked
git check-ignore .env.local
# Should output: .env.local

# Check git status before push
git status
# Should NOT show .env.local or .env files
```

### 1.2 Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `ronin-club` (or your choice)
3. Description: `Premium Gaming Club Management System`
4. Choose: Public (for portfolio) or Private
5. **DO NOT** initialize with README (you have one)
6. Click "Create repository"

### 1.3 Initial Push to GitHub

```bash
# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/ronin-club.git

# Verify remote
git remote -v
# Should show origin URLs

# Push to GitHub
git branch -M main
git push -u origin main
```

### 1.4 Add GitHub Description

Go to your repository on GitHub:
1. Click "About" (gear icon on right)
2. Add description: "Premium Gaming Club Management System with Client Portal, Manager Dashboard, Admin Panel, and AI Chat"
3. Add topics: `nextjs`, `gaming`, `typescript`, `tailwind`, `framer-motion`
4. Save

## Step 2: Deploy to Vercel

### 2.1 Connect Vercel to GitHub

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub (or create account)
3. Click "Import Project"
4. Select "Import Git Repository"
5. Paste: `https://github.com/YOUR_USERNAME/ronin-club`
6. Click "Continue"

### 2.2 Configure Project

**Project Settings:**
- Project Name: `ronin-club`
- Framework Preset: `Next.js`
- Root Directory: `./` (default)

**Build & Output:**
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)

### 2.3 Add Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables

Add these variables for **Production**:

```
NEXT_PUBLIC_APP_URL=https://ronin-club.vercel.app
```

(For now, since we use mock data, only NEXT_PUBLIC_APP_URL is needed)

**If you add database later**, also add:
```
DATABASE_URL=your_production_database_url
JWT_SECRET=your_production_jwt_secret
# ... other secrets
```

### 2.4 Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Get your production URL: `https://ronin-club.vercel.app`
4. Visit and test!

## Step 3: GitHub Pages (Optional)

If you want GitHub Pages as backup:

1. Go to repository Settings → Pages
2. Source: `Deploy from a branch`
3. Branch: `gh-pages` (will be auto-created)
4. Wait for deployment

## Step 4: Actions & Automation (Optional)

### Create GitHub Actions for CI/CD

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

To get Vercel tokens:
1. Vercel Dashboard → Settings → Tokens
2. Create new token
3. Add to GitHub Secrets

## Step 5: Custom Domain (Optional)

### 5.1 Connect Domain to Vercel

1. Vercel Dashboard → Project Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `roninclub.com`)
4. Vercel will show DNS records to add

### 5.2 Update DNS

Add these DNS records to your domain registrar:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: CNAME
Name: @ (or leave blank)
Value: alias.vercel-dns.com
```

Wait for DNS propagation (5-30 minutes).

## Step 6: Monitoring & Analytics

### Vercel Analytics

1. Vercel Dashboard → Project Settings → Analytics
2. Enable Web Analytics
3. Add to your code: `<AnalyticsComponent />`

### GitHub Insights

GitHub automatically tracks:
- Commits
- Contributors
- Network graph
- Issues & Pull Requests

## Troubleshooting

### Build Fails on Vercel

**Common issues:**

1. **Missing dependencies**
   ```bash
   npm install
   npm run build
   # Test locally first
   ```

2. **Environment variables missing**
   - Check Vercel Dashboard → Environment Variables
   - Redeploy after adding variables

3. **TypeScript errors**
   ```bash
   npm run type-check
   # Fix any errors locally
   ```

### Environment Variables Not Working

```bash
# In Vercel Dashboard:
1. Go to Settings → Environment Variables
2. Check that variables are added for "Production"
3. Redeploy: go to Deployments → redeploy latest

# In your code:
# NEXT_PUBLIC_* variables are exposed to browser
# Others are server-only
```

### Can't Push to GitHub

```bash
# Check remote
git remote -v

# If wrong, remove and re-add
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/ronin-club.git

# Push
git push -u origin main
```

## Post-Deployment Checklist

- [ ] GitHub repository created and public
- [ ] Vercel deployment successful
- [ ] Production URL works
- [ ] Environment variables set in Vercel
- [ ] No `.env.local` in git history
- [ ] README visible on GitHub
- [ ] GitHub description updated
- [ ] Topics/tags added
- [ ] All three roles work (Client/Manager/Admin)
- [ ] Responsive design works on mobile
- [ ] Analytics enabled (optional)

## Next: Promote Your Project

### Social Media

```
🎮 Just launched RONIN Computer Club Management System!

📊 Features:
- Client portal for booking gaming sessions
- Manager dashboard for real-time tracking
- Admin panel with Computer Map visualization
- AI Chat assistant
- Dark Neon Gaming UI
- Fully responsive design

🔗 GitHub: github.com/YOUR_USERNAME/ronin-club
🚀 Live: ronin-club.vercel.app

#NextJS #TypeScript #Gaming #OpenSource
```

### Add to Portfolio

- Add to your personal website/portfolio
- Highlight in resume projects section
- Link to GitHub & Vercel deployments
- Show screenshots/GIF demo

### Make it README-stand-out

Add badges to README:

```markdown
[![GitHub](https://img.shields.io/badge/GitHub-ronin--club-black?style=flat-square&logo=github)](https://github.com/YOUR_USERNAME/ronin-club)
[![Vercel](https://img.shields.io/badge/Vercel-Live-success?style=flat-square&logo=vercel)](https://ronin-club.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

# RONIN Computer Club
```

## Support

If you have issues:

1. Check Vercel logs: Dashboard → Deployments → View Logs
2. Check GitHub Actions: Repository → Actions
3. Local test: `npm run dev` → `npm run build`
4. Check `.env` setup: Compare with `.env.example`

---

**Deployment Status**: Ready to deploy! 🚀
