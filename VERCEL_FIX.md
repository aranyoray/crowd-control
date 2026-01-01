# 🚨 VERCEL DEPLOYMENT FIX - IMPORTANT!

## The Problem

Vercel was looking for `package.json` in the root directory, but it's actually in the `web/` subdirectory.

**Error**: `npm error enoent Could not read package.json`

## ✅ The Solution

You **MUST** set the **Root Directory** to `web` in Vercel settings.

---

## 🎯 Step-by-Step Fix

### Option 1: Vercel Dashboard (Recommended)

#### Step 1: Go to Project Settings

If you already deployed:
1. Go to your project on Vercel dashboard
2. Click **Settings** tab
3. Go to **General** section
4. Find **Root Directory**

#### Step 2: Set Root Directory

**CRITICAL**: Click **Edit** next to "Root Directory"
- Change from: ` ` (empty/root)
- Change to: `web`
- Click **Save**

#### Step 3: Redeploy

1. Go to **Deployments** tab
2. Click **⋮** (three dots) on latest deployment
3. Click **Redeploy**
4. Wait ~2 minutes
5. ✅ Success!

---

### Option 2: Deploy from Scratch (Clean Start)

1. **Delete old project** (if exists) from Vercel dashboard
2. **Go to**: [vercel.com/new](https://vercel.com/new)
3. **Import**: Select `aranyoray/crowd-control`
4. **⚠️ BEFORE clicking Deploy**:
   - Find "Root Directory" setting
   - Click **Edit**
   - Type: `web`
   - Click **Continue**
5. **Deploy**: Click "Deploy"
6. ✅ Done!

---

### Option 3: Vercel CLI

```bash
cd /home/user/crowd-control/web

# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from web directory
vercel --prod

# When prompted:
# "Set up and deploy?"          → Yes
# "Which scope?"                 → [Your account]
# "Link to existing project?"   → No
# "What's your project's name?"  → crowdleaf-simulator
# "In which directory is..."     → ./ (current directory)
# "Override settings?"           → No

# ✅ Deploy will succeed!
```

---

## 🔍 How to Verify Root Directory is Set

In Vercel dashboard:
1. Go to **Settings** → **General**
2. Look for **Root Directory**
3. Should show: `web`
4. If it says "." or is empty → **FIX IT!**

---

## 📁 Correct Directory Structure

Your repo structure:
```
crowd-control/
├── web/                    ← Vercel should build from HERE
│   ├── package.json       ← This is what Vercel needs
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── vercel.json
├── crowdleaf_algorithm.py  ← Python files (not for web)
├── airport_simulator.py
└── README.md
```

**Vercel Root Directory Setting**: `web`

---

## 🎬 What Happens After Fix

Once you set Root Directory to `web`:

1. ✅ Vercel will find `package.json`
2. ✅ `npm install` will work
3. ✅ `npm run build` will succeed
4. ✅ Site deploys successfully
5. ✅ Live at: `https://your-project.vercel.app`

---

## 🆘 Still Having Issues?

### Check Build Logs

1. Go to **Deployments** tab
2. Click on failed deployment
3. Check **Build Logs**
4. Look for:
   - ✅ "Installing dependencies" → should show Next.js packages
   - ✅ "Creating an optimized production build"
   - ✅ "Compiled successfully"

### Common Issues

| Issue | Fix |
|-------|-----|
| Can't find package.json | Set Root Directory to `web` |
| Build fails | Check Node.js version (needs 18.x+) |
| 404 on site | Ensure build completed successfully |
| Blank page | Check browser console for errors |

---

## 📝 Updated Instructions

After this fix, deployment is simple:

1. **Set Root Directory**: `web` ← **MOST IMPORTANT**
2. **Click Deploy**
3. **Wait ~2 minutes**
4. **Done!**

---

## ✅ Checklist

Before deploying, verify:

- [ ] Root Directory is set to `web`
- [ ] Framework preset is "Next.js"
- [ ] Build Command is `npm run build`
- [ ] Output Directory is `.next`
- [ ] Install Command is `npm install`

---

**Now try deploying again with Root Directory set to `web`!** 🚀
