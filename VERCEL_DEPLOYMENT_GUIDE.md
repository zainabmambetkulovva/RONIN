# Vercel Deployment Guide

## Problem
URLs showing "404 DEPLOYMENT_NOT_FOUND" error because deployments don't exist or have errors.

## Current Status
- Project "ronin" exists on Vercel under team "prrojectt"
- Last 2 deployments (6 days ago) have "Error" status
- Need fresh deployment with correct configuration

## Solution Steps

### 1. Login to Vercel CLI

```bash
cd ronin
vercel login
```

Follow the prompts to authenticate.

### 2. Link to Existing Project

```bash
vercel link
```

When prompted:
- **Set up and deploy?** → Yes
- **Which scope?** → prrojectt
- **Link to existing project?** → Yes
- **What's the name?** → ronin

### 3. Set Environment Variables

You need to add all environment variables from `.env` to Vercel:

```bash
# Add database URLs
vercel env add DATABASE_URL production
# Paste: postgresql://neondb_owner:npg_WdI8regtZC2G@ep-billowing-bird-b5l08v6w-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

vercel env add DIRECT_URL production
# Paste: postgresql://neondb_owner:npg_WdI8regtZC2G@ep-billowing-bird-b5l08v6w.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require

# Add NextAuth (IMPORTANT: Update NEXTAUTH_URL to your Vercel URL)
vercel env add NEXTAUTH_URL production
# Paste: https://ronin.vercel.app (or your custom domain)

vercel env add NEXTAUTH_SECRET production
# Paste: 2a3/JO8FlzMH7txi7s4tPOFQ7wX5inZ6eoZqQG1Qcsk=

# Add Google OAuth
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production

# Add Resend Email
vercel env add RESEND_API_KEY production
vercel env add EMAIL_FROM production

# Add Telegram
vercel env add TELEGRAM_BOT_TOKEN production
vercel env add TELEGRAM_ADMIN_CHAT_ID production

# Add Contact Info
vercel env add CONTACT_PHONE production
vercel env add CONTACT_EMAIL production
vercel env add CONTACT_ADDRESS production
vercel env add INSTAGRAM_URL production
vercel env add TELEGRAM_URL production
vercel env add WHATSAPP_URL production
vercel env add GIS_2_URL production

# Add Gemini AI
vercel env add GEMINI_API_KEY production

# Add FINIK Payment
vercel env add FINIK_ENV production
vercel env add FINIK_API_KEY production
vercel env add FINIK_ACCOUNT_ID production
vercel env add FINIK_PRIVATE_KEY production
```

**OR** use the Vercel Dashboard (easier):
1. Go to https://vercel.com/prrojectt/ronin/settings/environment-variables
2. Add each variable from `.env` file
3. Select "Production" environment

### 4. Deploy to Production

```bash
vercel --prod
```

This will:
- Build your Next.js app
- Run Prisma generate
- Deploy to production
- Assign production URL

### 5. Verify Deployment

After successful deployment, you'll get a URL like:
```
https://ronin-abc123.vercel.app
```

Visit the URL and check:
- ✅ Homepage loads
- ✅ No 404 errors
- ✅ Database connections work
- ✅ Authentication works

### 6. Set Custom Domain (Optional)

If you have a custom domain (e.g., ronin.kg):

1. Go to https://vercel.com/prrojectt/ronin/settings/domains
2. Add your domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` environment variable to use custom domain

## Quick Deploy (All-in-One)

If you've already set environment variables:

```bash
cd ronin
vercel login
vercel link
vercel --prod
```

## Troubleshooting

### "Not authorized" error
Run `vercel login` and authenticate with your Vercel account.

### Build fails with Prisma error
Make sure `DATABASE_URL` and `DIRECT_URL` are set in Vercel environment variables.

### "DEPLOYMENT_NOT_FOUND" after deploy
- Wait 1-2 minutes for DNS propagation
- Clear browser cache
- Try the new deployment URL from terminal output

### Build fails with "Module not found"
Run locally first to ensure build works:
```bash
npm run build
```

### NextAuth callback URL mismatch
Update `NEXTAUTH_URL` to match your Vercel deployment URL (including https://).

## Environment Variables Checklist

- [ ] DATABASE_URL
- [ ] DIRECT_URL
- [ ] NEXTAUTH_URL (update to Vercel URL!)
- [ ] NEXTAUTH_SECRET
- [ ] GOOGLE_CLIENT_ID
- [ ] GOOGLE_CLIENT_SECRET
- [ ] RESEND_API_KEY
- [ ] EMAIL_FROM
- [ ] TELEGRAM_BOT_TOKEN
- [ ] TELEGRAM_ADMIN_CHAT_ID
- [ ] CONTACT_PHONE
- [ ] CONTACT_EMAIL
- [ ] CONTACT_ADDRESS
- [ ] INSTAGRAM_URL
- [ ] TELEGRAM_URL
- [ ] WHATSAPP_URL
- [ ] GIS_2_URL
- [ ] GEMINI_API_KEY
- [ ] FINIK_ENV
- [ ] FINIK_API_KEY
- [ ] FINIK_ACCOUNT_ID
- [ ] FINIK_PRIVATE_KEY

## Notes

- Vercel builds are cached - if you have issues, try `vercel --prod --force`
- Environment variables are encrypted and secure on Vercel
- You can update environment variables anytime in the Vercel dashboard
- Each deploy creates a unique preview URL - production URL stays the same
- Database migrations should be run separately (Vercel builds are read-only)

## After Successful Deployment

1. Test all features:
   - [ ] Registration/Login
   - [ ] Profile setup with avatar
   - [ ] Computer browsing
   - [ ] Booking flow
   - [ ] Payment (FINIK)
   - [ ] Receipt generation
   - [ ] AI chat

2. Update production URLs in:
   - Google OAuth callback URLs
   - FINIK webhook URLs (if any)
   - Telegram bot webhook (if used)

3. Monitor:
   - Vercel dashboard for errors
   - Application logs
   - Database usage
