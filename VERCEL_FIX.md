# Vercel Deployment Fix

## Problem
Vercel was trying to run `cd web && npm install` but since the root directory is already set to `web`, the `cd web` command fails.

## Solution
**Removed `vercel.json`** - Vercel will auto-detect Next.js from `package.json` when root directory is set to `web`.

## What to Do

1. **Commit and push the changes:**
```bash
git add .
git commit -m "Fix Vercel deployment - remove vercel.json"
git push
```

2. **In Vercel Dashboard:**
   - Go to your project settings
   - Make sure **Root Directory** is set to `web`
   - Vercel will auto-detect Next.js (no vercel.json needed)
   - **Remove any custom build commands** - let Vercel use defaults

3. **Redeploy:**
   - Vercel should automatically redeploy on push
   - Or manually trigger a new deployment

## Expected Build Commands (Auto-detected)
- **Install**: `npm install` (runs in `web/` directory)
- **Build**: `npm run build` (runs in `web/` directory)
- **Output**: `.next` (auto-detected)

## If Still Having Issues

If Vercel still has issues, you can manually set build settings:

1. Go to **Settings** → **Build & Development Settings**
2. **Override** with:
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

But this should not be necessary - Vercel auto-detects Next.js!

