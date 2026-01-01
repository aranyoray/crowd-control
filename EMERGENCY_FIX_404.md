# 🚨 EMERGENCY FIX: Vercel 404 Error

Your site `http://crowd-control.vercel.app/` is showing 404 because the deployment settings aren't properly applied. Here's how to fix it:

---

## ✅ SOLUTION 1: Force Redeploy (Try This First)

### Step 1: Verify Settings
1. Go to https://vercel.com/dashboard
2. Click on your **crowd-control** project
3. Click **Settings**
4. Click **General** (left sidebar)
5. Verify **Root Directory** shows: `web`

### Step 2: Clear and Redeploy
1. Click **Deployments** tab (top menu)
2. Click on the **LATEST** deployment
3. Click **⋮** (three dots) in top right
4. Select **Redeploy**
5. **IMPORTANT**: Check ☑️ **"Use existing Build Cache"** - UNCHECK THIS!
6. Click **Redeploy**

### Step 3: Wait and Check
- Wait 2-3 minutes
- Go to http://crowd-control.vercel.app/
- Should work now! ✅

---

## ✅ SOLUTION 2: Delete & Recreate (If Solution 1 Fails)

### Step 1: Delete Old Project
1. Go to **Settings** → **General**
2. Scroll to **Delete Project** (bottom)
3. Type project name to confirm
4. Click **Delete**

### Step 2: Create New Deployment

**Option A: Use This Direct Link (Easiest)**

Click here: [Deploy CrowdLeaf](https://vercel.com/new/clone?repository-url=https://github.com/aranyoray/crowd-control&project-name=crowdleaf&root-directory=web)

This automatically sets:
- ✅ Root Directory = `web`
- ✅ Project Name = `crowdleaf`
- ✅ Framework = Next.js

Just click **Deploy** and wait!

**Option B: Manual Import**
1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Select `aranyoray/crowd-control`
4. **BEFORE DEPLOYING**:
   - Find **Root Directory**
   - Click **Edit**
   - Type: `web`
   - Click **Save**
5. Click **Deploy**
6. Wait 2-3 minutes

---

## 🔍 How to Verify It's Fixed

After deployment, check:

1. **Build Logs** (should show):
   ```
   ✓ Compiled successfully
   ✓ Route (app): /
   ✓ Exporting (1/1)
   ```

2. **Visit your site**: Should show:
   - Header: 🌿 CrowdLeaf: Airport Crowd Simulator
   - Controls: Airport dropdown, agent slider, start button
   - NO 404!

---

## 🐛 Troubleshooting

### Still Getting 404?

**Check Deployment Logs:**
1. Click **Deployments** tab
2. Click latest deployment
3. Look for errors in **Build Logs**

**Common Issues:**

| Error in Logs | Solution |
|---------------|----------|
| "Could not read package.json" | Root Directory not set to `web` |
| "Build failed" | Check if Node.js version is 18.x+ |
| No errors but 404 | Clear browser cache, try incognito |
| Build succeeds but blank page | Check browser console (F12) |

### Force Clear Everything

If nothing works:
1. Delete project from Vercel
2. Clear your browser cache
3. Use the direct deployment link above
4. Deploy fresh

---

## 📊 Expected After Fix

Your site should show:

```
┌─────────────────────────────────────────┐
│ 🌿 CrowdLeaf: Airport Crowd Simulator  │
│ Biomimetic Algorithm Inspired by...     │
├─────────────────────────────────────────┤
│ [Select Airport ▼] [Agents: 300] [▶]   │
├─────────────────────────────────────────┤
│  ✅ With CrowdLeaf  │  ❌ Without       │
├─────────────────────────────────────────┤
│        [Visualization Canvas]           │
└─────────────────────────────────────────┘
```

---

## 💡 Why This Happened

When you changed settings in Vercel, the **deployment didn't automatically rebuild**. You need to:

1. Change settings
2. **THEN** manually trigger a redeploy
3. **AND** clear the build cache

That's why using the direct deployment link (Option A) is easiest - it starts fresh!

---

## 🚀 Quick Commands (If Using Vercel CLI)

```bash
cd /home/user/crowd-control/web

# Delete old deployment
vercel remove crowd-control --yes

# Deploy fresh
vercel --prod

# Follow prompts, confirm settings:
# - Directory: ./ (current - already in web/)
# - Settings: Accept defaults
```

---

## ✅ Checklist Before Contacting Support

- [ ] Root Directory is set to `web`
- [ ] Redeployed without build cache
- [ ] Checked deployment logs for errors
- [ ] Tried in incognito/different browser
- [ ] Waited at least 5 minutes after deploy
- [ ] Tried deleting and recreating project

---

**Try Solution 1 first (Force Redeploy). If that doesn't work in 5 minutes, use Solution 2 (Delete & Recreate).** 🎯

The direct deployment link in Solution 2 should work 100%!
