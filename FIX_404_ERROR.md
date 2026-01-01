# 🚨 FIX 404 ERROR - VERCEL DEPLOYMENT

## The Problem
You're seeing a **404 error** because Vercel is looking in the wrong directory!

---

## ✅ SOLUTION (3 Steps - Takes 2 Minutes)

### Step 1: Open Vercel Project Settings

1. Go to [vercel.com](https://vercel.com) and login
2. Find your **crowd-control** project
3. Click on the project name
4. Click **Settings** (top navigation)

### Step 2: Set Root Directory to `web`

**THIS IS THE CRITICAL STEP:**

1. In Settings, click **General** (left sidebar)
2. Scroll down to **Root Directory** section
3. Click **Edit** button
4. Type: `web`
5. Click **Save**

**Screenshot Guide:**
```
Root Directory
┌─────────────────────────┐
│ web                     │  ← Type this!
└─────────────────────────┘
[Save] [Cancel]
```

### Step 3: Redeploy

1. Click **Deployments** tab (top)
2. Click on the **latest deployment**
3. Click **⋮** (three dots) in top right
4. Click **Redeploy**
5. ✅ Wait ~2 minutes - DONE!

---

## 🔍 How to Verify It Worked

After redeployment:
1. Open your Vercel URL: `https://your-project.vercel.app`
2. You should see: 🌿 **CrowdLeaf: Airport Crowd Simulator**
3. No more 404!

---

## Alternative: Deploy Fresh (If Above Doesn't Work)

### Delete Old Project
1. Go to Settings → General
2. Scroll to bottom
3. Click **Delete Project**
4. Confirm deletion

### Create New Deployment
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select `aranyoray/crowd-control`
4. **⚠️ BEFORE CLICKING DEPLOY:**
   - Find **Root Directory** (should show "." or be empty)
   - Click **Edit**
   - Type: `web`
   - Click **Save**
5. Click **Deploy**
6. ✅ Success in ~2 minutes!

---

## 🎯 Why This Happens

Your GitHub repo structure:
```
crowd-control/
├── web/              ← Next.js app is HERE
│   ├── package.json  ← Vercel needs this
│   ├── app/
│   └── ...
├── crowdleaf_algorithm.py  ← Python (not for web)
└── README.md
```

**By default**, Vercel looks in root (`/`)
**But we need**, Vercel to look in `web/`

**Solution**: Set Root Directory = `web`

---

## 📱 Quick Checklist

Before deploying, verify these settings in Vercel:

- [ ] **Root Directory**: `web` ← **MOST IMPORTANT!**
- [ ] **Framework Preset**: Next.js
- [ ] **Build Command**: `npm run build`
- [ ] **Output Directory**: `.next`
- [ ] **Install Command**: `npm install`
- [ ] **Node.js Version**: 18.x or 20.x

---

## 🐛 Still Getting 404?

### Check Deployment Logs:
1. Go to **Deployments** tab
2. Click on the deployment
3. Click **Building** or **Deployment Details**
4. Check for errors in logs

### Look for these success messages:
```
✓ Installing dependencies
✓ Building application
✓ Route (app): /
✓ Exporting (0/1)
✓ Deployment ready
```

### Common Issues:

| Issue | Solution |
|-------|----------|
| "Could not read package.json" | Root Directory not set to `web` |
| Build fails | Check Node.js version (18.x+) |
| 404 after successful build | Clear browser cache, try incognito |
| Blank page | Check browser console for errors |

---

## 🎉 Expected Result

After fixing, your site should show:

**Header**: 🌿 CrowdLeaf: Airport Crowd Simulator
**Subtitle**: Biomimetic Algorithm Inspired by Mimosa Pudica Touch-Me-Not Plant

**Controls**:
- Airport dropdown (DFW, ATL, DXB, DEL, IAD)
- Agent count slider (50-1000)
- Start/Pause button

**Visualization**:
- Left side: WITHOUT CrowdLeaf (red agents)
- Right side: WITH CrowdLeaf (green agents)
- Real-time metrics below

---

## 🚀 Test Your Deployment

Once deployed, test these:
1. ✅ Select different airports
2. ✅ Adjust agent count slider
3. ✅ Click "Start Simulation"
4. ✅ Watch agents move
5. ✅ See metrics update in real-time

---

## 📞 Need More Help?

If you're still stuck:

1. **Share your Vercel deployment URL** (so I can see the error)
2. **Share deployment logs** (from Deployments tab)
3. **Screenshot** of your Root Directory setting

---

**The fix is simple: Set Root Directory to `web` in Vercel! 🎯**
