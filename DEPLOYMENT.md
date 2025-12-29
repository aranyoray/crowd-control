# CrowdLeaf Web Deployment Guide

## ✅ Build Status: SUCCESS

The Next.js application has been successfully built and is ready for deployment to Vercel!

## Quick Deploy to Vercel

### Method 1: Using Vercel CLI (Fastest)

```bash
# Navigate to web directory
cd web

# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Method 2: Using Vercel Dashboard (Recommended)

1. **Push to GitHub**:
   ```bash
   cd /home/user/crowd-control
   git add web/
   git commit -m "Add web deployment for CrowdLeaf simulator"
   git push
   ```

2. **Import to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your `crowd-control` repository
   - **Root Directory**: Set to `web`
   - **Framework Preset**: Next.js (auto-detected)
   - Click "Deploy"

3. **Done!** Your app will be live at `https://your-project.vercel.app`

## Environment Setup

No environment variables needed! The simulator runs entirely client-side.

## Custom Domain (Optional)

1. Go to your project dashboard on Vercel
2. Navigate to "Settings" → "Domains"
3. Add your custom domain (e.g., `crowdleaf.yoursite.com`)
4. Follow DNS configuration instructions

## Features Deployed

✅ **Interactive Simulator**: Real-time visualization
✅ **5 Major Airports**: DFW, ATL, DXB, DEL, IAD
✅ **Side-by-Side Comparison**: WITH vs WITHOUT CrowdLeaf
✅ **Live Metrics**: Injuries, deaths, density tracking
✅ **Responsive Design**: Mobile-friendly
✅ **30-Second Simulations**: Full evacuation scenarios

## Testing Locally

```bash
cd web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build Verification

```bash
cd web
npm run build
npm run start
```

## Tech Stack

- **Framework**: Next.js 15.1.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Turbopack
- **Deployment**: Vercel

## Performance

- ⚡ **Fast**: Static generation with client-side interactivity
- 📱 **Responsive**: Works on all devices
- 🎨 **Beautiful**: Tailwind CSS styling
- 🚀 **Optimized**: Next.js automatic optimizations

## Support

For issues or questions:
- Check the web/README.md
- Review Next.js docs: https://nextjs.org/docs
- Vercel support: https://vercel.com/support

---

**Ready to deploy!** 🚀
