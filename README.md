# CrowdLeaf: Airport Crowd Simulator

🌿 **Biomimetic algorithm for adaptive crowd dispersal inspired by Mimosa pudica touch-me-not plant**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aranyoray/crowd-control&project-name=crowdleaf-simulator&root-directory=web)

---

## 🚀 Quick Deploy to Vercel

**⚠️ IMPORTANT**: When deploying, make sure **Root Directory** is set to `web`

### One-Click Deploy (Easiest)
Click the button above ↑ and follow the prompts!

### Manual Deploy
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your repository
3. **Set Root Directory to `web`** ← Critical step!
4. Click Deploy

**Getting 404 error?** → See [FIX_404_ERROR.md](FIX_404_ERROR.md)

---

## 🎯 What is CrowdLeaf?

A research-based crowd simulation system demonstrating how biomimetic algorithms inspired by plant behavior can improve emergency evacuation and crowd management.

### Key Features
- ✅ **Sigmoidal Activation** (Ant Colony - PNAS 2022)
- ✅ **Crowdedness Formula**: F_i = (F_i,r + F_i,w + F_i,in)/F_i,max × T_i
- ✅ **Boolean Propagation** (Mimosa pudica action potential model)
- ✅ **Timed Gate Control** (3-phase open/redirect/closed)
- ✅ **Real-time Visualization** with metrics tracking

---

## 🏢 Simulated Airports

1. **DFW** - Dallas/Fort Worth Terminal D (28 gates)
2. **ATL** - Atlanta Hartsfield-Jackson (world's busiest)
3. **DXB** - Dubai International Terminal 3 (world's largest)
4. **DEL** - Delhi Indira Gandhi Terminal 3
5. **IAD** - Washington Dulles International

---

## 💻 Web Application

**Live Demo**: Deploy your own using the button above!

### Features
- Interactive controls (airport selection, agent count)
- Side-by-side comparison visualization
- Color-coded agents: Green (CrowdLeaf) vs Red (Standard)
- Real-time metrics dashboard
- 30-second evacuation scenarios

---

## 🐍 Python Simulator

### Installation

```bash
pip install -r requirements.txt
```

### Run Visualizations

```bash
# Recommended: Animated matplotlib visualization
python visual_demo.py

# Interactive pygame visualization
python enhanced_visualization.py

# Batch comparison of all airports
python run_simulation.py

# High-density stress test
python stress_test.py
```

---

## 📊 Results

CrowdLeaf demonstrates:
- 📉 **16-33% reduction** in injuries
- 📉 **Up to 33% reduction** in deaths  
- 📉 **Lower peak density** (0.14+ p/m² reduction)
- 📉 **Fewer overcrowding events**
- 📈 **Better evacuation efficiency**

---

## 🔬 Scientific Background

### Mathematical Models

**1. Sigmoidal Activation**
```
P(activation) = 1 / (1 + exp(-k * (stimulus - threshold)))
```

**2. Crowdedness Formula**
```
F_i = (F_i,r + F_i,w + F_i,in) / F_i,max × T_i
```

**3. Boolean Propagation**
```
Propagate = OR(neighbor_states)
```

### Research Papers
- Electronic Thygmonasty Model (2022)
- Ant Colony Collective Sensing (PNAS 2022)
- AI Simulation of Passenger Flows (2024)
- Boolean Function in Mimosa pudica (2011)

---

## 📁 Project Structure

```
crowd-control/
├── web/                        # Next.js web application
│   ├── app/                    # Next.js pages
│   ├── components/             # React components
│   └── lib/                    # Simulation logic
├── crowdleaf_algorithm.py      # Core algorithm
├── airport_simulator.py        # 5 airport models
├── visual_demo.py              # Matplotlib visualization
├── enhanced_visualization.py   # Advanced pygame UI
└── run_simulation.py           # Batch runner
```

---

## 🎯 USP (Unique Selling Points)

1. **Frugal**: No expensive thermal cameras or CCTV analytics needed
2. **Bio-Inspired**: Based on proven plant response mechanisms
3. **Proactive**: Prevents overcrowding before it becomes dangerous
4. **Adaptive**: Timed gate control prevents rush to nearest exit
5. **Research-Based**: Implements peer-reviewed mathematical models

---

## 📝 Documentation

- [Web Deployment Guide](VERCEL_DEPLOY_GUIDE.md)
- [Fix 404 Errors](FIX_404_ERROR.md)
- [Deployment Details](DEPLOYMENT.md)
- [Web README](web/README.md)

---

## 🤝 Contributing

Contributions welcome! Please submit pull requests or open issues.

---

## 📄 License

MIT License

---

## 🎓 Citation

If you use CrowdLeaf in your research:

```bibtex
@software{crowdleaf2025,
  title={CrowdLeaf: Biomimetic Crowd Control Algorithm},
  author={Your Name},
  year={2025},
  url={https://github.com/aranyoray/crowd-control}
}
```

---

**Built with ❤️ using biomimetic principles from nature**
