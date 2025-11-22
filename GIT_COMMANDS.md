# Git Commands to Push Changes

Run these commands in order:

```bash
# Navigate to project root
cd /Users/riyachhikara/Documents/GitHub/customer-experience-lab

# Check what changed
git status

# Add all changes
git add .

# Commit with descriptive message
git commit -m "Convert FastAPI to Vercel API routes and fix LiveKit token generation"

# Push to GitHub
git push
```

## What Will Be Pushed

- ✅ Removed `vercel.json` (fixes build error)
- ✅ New API routes in `web/app/api/` (TypeScript)
- ✅ Updated `web/package.json` (removed livekit-api, added jose)
- ✅ Updated `web/lib/api.ts` (uses relative paths)
- ✅ `web/lib/company_rag.json` (company data)
- ✅ Fixed LiveKit token generation (using jose instead of livekit-client)
- ✅ Updated documentation files

## If You Get Errors

**If git says "not a git repository":**
```bash
git init
git remote add origin https://github.com/RiyaChhikara/customer-experience-lab.git
```

**If you need to set upstream:**
```bash
git push -u origin main
```

**If you have uncommitted changes:**
```bash
git add .
git commit -m "Your message"
git push
```

