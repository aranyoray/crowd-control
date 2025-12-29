# 🚀 Deploy CrowdLeaf to Vercel - Quick Start Guide

## ✅ Status: Ready to Deploy!

Your CrowdLeaf web simulator has been successfully built and is ready for Vercel deployment!

---

## 🎯 Option 1: Vercel Dashboard (Easiest - Recommended)

### Step 1: Import Repository to Vercel

1. Go to **[vercel.com/new](https://vercel.com/new)**
2. Click **"Add New Project"**
3. Select **"Import Git Repository"**
4. Choose your `aranyoray/crowd-control` repository

### Step 2: Configure Project

**IMPORTANT Configuration:**
- **Root Directory**: `web` (click "Edit" and type `web`)
- **Framework Preset**: Next.js (auto-detected)
- **Build Command**: `npm run build` (auto-filled)
- **Output Directory**: `.next` (auto-filled)
- **Install Command**: `npm install` (auto-filled)

### Step 3: Deploy!

Click **"Deploy"** and wait ~2 minutes.

Your app will be live at: `https://your-project.vercel.app`

---

## 🎯 Option 2: Vercel CLI (For Developers)

```bash
# Install Vercel CLI globally
npm i -g vercel

# Navigate to web directory
cd /home/user/crowd-control/web

# Login to Vercel (opens browser)
vercel login

# Deploy to production
vercel --prod

# Follow prompts:
# - Project name: crowdleaf-simulator (or your choice)
# - Scope: your-username
# - Link to existing project?: N (first time)

# Done! URL will be shown in terminal
```

---

## 🎯 Option 3: One-Click Deploy (Fastest)

Add this button to your GitHub README:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aranyoray/crowd-control&project-name=crowdleaf-simulator&repository-name=crowd-control&root-directory=web)
```

Click the button → Configure → Deploy!

---

## 🌐 Your Live Web App Features

Once deployed, your simulator will have:

✅ **Interactive Controls**
- Airport selection dropdown (DFW, ATL, DXB, DEL, IAD)
- Agent count slider (50-1000)
- Start/Pause button

✅ **Real-Time Visualization**
- Side-by-side comparison canvas
- Green agents (CrowdLeaf) vs Red agents (Standard)
- 30-second simulation cycles

✅ **Live Metrics Dashboard**
- Injuries, Deaths, Density
- Overcrowding events
- Evacuation progress

✅ **Responsive Design**
- Works on desktop, tablet, mobile
- Tailwind CSS styling
- Professional UI

---

## 🔧 Custom Domain (Optional)

After deployment:

1. Go to Project Settings
2. Click "Domains"
3. Add custom domain: `crowdleaf.yoursite.com`
4. Follow DNS configuration (add CNAME record)

---

## 📊 Expected Performance

- **Build Time**: ~2 minutes
- **Page Load**: <1 second
- **Lighthouse Score**: 90+
- **Mobile Friendly**: ✅ Yes

---

## 🐛 Troubleshooting

### Build Fails?

Check that:
- Root directory is set to `web`
- Node version is 18.x or higher

### 404 Error?

- Ensure deployment completed successfully
- Check Vercel logs for errors
- Verify `web/app/page.tsx` exists

### Blank Page?

- Check browser console for errors
- Verify build logs show "Compiled successfully"

---

## 📝 What's Next?

After deployment:

1. **Share Your Link**: `https://your-project.vercel.app`
2. **Test All Features**: Try different airports and agent counts
3. **Monitor Analytics**: Vercel provides free analytics
4. **Custom Domain** (optional): Add your own domain

---

## 🎉 You're All Set!

Your biomimetic crowd simulator is now live on the web!

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Check DEPLOYMENT.md for detailed instructions

---

**Built with Next.js, TypeScript, and Tailwind CSS**
**Deployed on Vercel - The platform for frontend frameworks**
