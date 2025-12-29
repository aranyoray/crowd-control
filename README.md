# CrowdLeaf: Airport Crowd Simulator

A biomimetic, thigmonasty-inspired algorithm for adaptive crowd dispersal at major international airports.

## 🌿 About CrowdLeaf

CrowdLeaf is inspired by the **Mimosa pudica** (touch-me-not plant) and its rapid response to stimuli. The algorithm uses threshold-based activation and spatial signal propagation to proactively manage crowd flow, reducing chokepoints, injuries, and deaths during high-density evacuation scenarios.

### Key Features

- **Biomimetic Algorithm**: Models crowd response based on plant thigmonastic dynamics
- **Threshold-Based Activation**: Activates crowd redirection at critical density levels (4-6 persons/m²)
- **Spatial Signal Propagation**: Spreads redirection signals to neighboring areas
- **Recovery Dynamics**: Implements ~15 minute recovery period similar to Mimosa pudica
- **Real-Time Metrics**: Tracks injuries, deaths, overcrowding, and evacuation progress

## 🏢 Airports Simulated

The simulator includes detailed graph-based models of five of the world's busiest airports:

1. **DFW** - Dallas/Fort Worth International, Terminal D (28 gates)
2. **ATL** - Atlanta Hartsfield-Jackson International (world's busiest, 192 gates)
3. **DXB** - Dubai International, Terminal 3 (world's largest terminal)
4. **DEL** - Delhi Indira Gandhi International, Terminal 3 (78 aerobridges)
5. **IAD** - Washington Dulles International (5 concourses)

## 📊 Metrics Tracked

The simulation monitors critical safety metrics in real-time:

- **Injuries**: Caused by overcrowding (density > 6.0 persons/m²)
- **Deaths**: Occurs at extreme densities (> 8.0 persons/m²)
- **Overcrowding Events**: Number of locations exceeding safe thresholds
- **Average Density**: Real-time crowd density across all nodes
- **Evacuation Progress**: Number of agents successfully evacuated

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/crowd-control.git
cd crowd-control

# Install dependencies
pip install -r requirements.txt
```

## 💻 Usage

### Run All Airports

```bash
python run_simulation.py
```

### Run Specific Airport

```bash
python run_simulation.py DFW  # Dallas/Fort Worth
python run_simulation.py ATL  # Atlanta
python run_simulation.py DXB  # Dubai
python run_simulation.py DEL  # Delhi
python run_simulation.py IAD  # Washington Dulles
```

### Interactive Live Simulation

```bash
python interactive_simulation.py
```

Use the interactive mode to:
- Watch the simulation in real-time
- Toggle CrowdLeaf on/off
- Adjust simulation speed
- View live metrics

## 📈 Results

The simulator runs two scenarios for each airport:

1. **Without CrowdLeaf**: Standard nearest-exit evacuation heuristic
2. **With CrowdLeaf**: Biomimetic adaptive redirection algorithm

### Expected Improvements with CrowdLeaf

Based on validation studies, CrowdLeaf demonstrates:

- ✅ **Reduced chokepoint formation** in 3 out of 5 high-density scenarios
- ✅ **Decreased evacuation times** compared to static routing
- ✅ **Lower injury and death rates** through proactive crowd management
- ✅ **Better density distribution** across available paths

## 🔬 Scientific Background

### Mimosa Pudica Response Dynamics

The algorithm is based on 80 minutes of Mimosa pudica response data analyzed using YOLOv8:

- **Activation Timing**: Threshold-based trigger at critical stimulus levels
- **Spatial Propagation**: Signal spreads to neighboring leaflets
- **Recovery Curves**: ~15 minute equilibration period

### Crowd Behavior Modeling

- **Safe Density**: 4 persons/m² (comfortable movement)
- **Critical Density**: 6 persons/m² (unstable flow, injury risk)
- **Extreme Density**: 8+ persons/m² (stampede risk, fatalities)

## 📁 Project Structure

```
crowd-control/
├── crowdleaf_algorithm.py    # Core biomimetic algorithm
├── airport_simulator.py       # Simulation engine and airport models
├── run_simulation.py          # Main comparison script
├── interactive_simulation.py  # Live visualization (optional)
├── requirements.txt           # Python dependencies
└── README.md                  # This file
```

## 🎯 Applications

CrowdLeaf can be applied to:

- ✈️ **Airports**: Terminal evacuations, peak hour management
- 🏟️ **Public Gatherings**: Concerts, protests, large meetings
- 🚇 **Mass Transit**: Subways, train stations
- 🏢 **Large Buildings**: Emergency evacuations, fire drills
- 🚦 **Traffic Control**: High-density urban areas

## 📚 References

Based on research presented in **ShivajRaman_CC_SessionNotes.docx**

Key inspiration from:
- Mimosa pudica thigmonastic response dynamics
- Ant colony collective sensing thresholds (PNAS 2022)
- Crowd dynamics and social force models
- Action potential Boolean logic for discrete choice points

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## 📄 License

This project is open source and available under the MIT License.

## 📧 Contact

For questions or collaboration opportunities, please open an issue on GitHub.

---

**Note**: This is a research project for educational and safety improvement purposes. The simulation uses simplified models and should not be used as the sole basis for real-world crowd management decisions without proper validation and expert consultation.
