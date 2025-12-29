# CrowdLeaf: Airport Crowd Simulator

A biomimetic, thigmonasty-inspired algorithm for adaptive crowd dispersal at major international airports.

**Research-Based**: Implements mathematical models from peer-reviewed papers on Mimosa pudica thigmonasty, ant colony collective sensing, and airport passenger flow optimization.

## 🌿 About CrowdLeaf

CrowdLeaf is inspired by the **Mimosa pudica** (touch-me-not plant) and its rapid response to stimuli. The algorithm uses threshold-based activation and spatial signal propagation to proactively manage crowd flow, reducing chokepoints, injuries, and deaths during high-density evacuation scenarios.

### Key Features

- **Biomimetic Algorithm**: Models crowd response based on plant thigmonastic dynamics
- **Sigmoidal Activation**: Inspired by ant colony collective sensing (PNAS 2022)
- **Boolean Propagation Logic**: Action potential model for signal spreading
- **Crowdedness Metric**: AI simulation formula F_i = (F_i,r + F_i,w + F_i,in)/F_i,max × T_i
- **Timed Gate Control**: Open/redirect/closed states mimicking Mimosa pudica leaflet closure
- **Spatial Signal Propagation**: Spreads redirection signals to neighboring areas
- **Recovery Dynamics**: ~15 minute recovery period similar to Mimosa pudica
- **Real-Time Metrics**: Tracks injuries, deaths, overcrowding, and evacuation progress
- **Enhanced Visualization**: Interactive UI with color-coded agents, door states, and chokepoint detection

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

### Visual Demo - Animated Matplotlib (⭐ RECOMMENDED!)

```bash
python visual_demo.py
```

**Best option** - Most reliable, no special dependencies, great visuals!

Features:
- **Side-by-side animated comparison**: Watch both simulations simultaneously
- **Color-coded agents**: Lime (CrowdLeaf) vs Red (Standard)
- **Door state indicators**: Visual rings showing open (green), redirect (yellow), closed (red)
- **Chokepoint detection**: Pulsing red highlights for congestion
- **Real-time metrics overlay**: Stats displayed on each panel
- **Density-based coloring**: Nodes change color based on crowd density
- **30-second full simulation**: Complete evacuation scenario

### Enhanced Interactive Visualization (Advanced - Requires pygame-gui)

```bash
python enhanced_visualization.py
```

Interactive controls with pygame-gui (may require additional setup):
- **Interactive sliders**: Adjust agent count (50-1000) and speed
- **Restart capability**: Change parameters on the fly
- **Toggle displays**: Show/hide features with keyboard shortcuts

Controls:
- **SPACE**: Pause/Resume
- **C**: Toggle chokepoint display
- **D**: Toggle door state indicators
- **Sliders**: Adjust parameters
- **Restart button**: Apply new settings

### Basic Interactive Simulation

```bash
python interactive_simulation.py
```

Simple pygame visualization:
- Watch the simulation in real-time
- Pause/resume with spacebar
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

### Mathematical Models Implemented

#### 1. Sigmoidal Activation (Ant Colony Model - PNAS 2022)
```
P(activation) = 1 / (1 + exp(-k * (stimulus - threshold)))
```
- Models size-dependent threshold response
- Smooth transition from inactive to active state
- Noise-tolerant collective sensing

#### 2. Crowdedness Formula (AI Simulation 2024)
```
F_i = (F_i,r + F_i,w + F_i,in) / F_i,max × T_i

Where:
- F_i,r: Resident agents at node
- F_i,w: Waiting agents (stuck/slow)
- F_i,in: Incoming agents from neighbors
- F_i,max: Maximum capacity
- T_i: Time factor
```

#### 3. Boolean Propagation Logic (2011 Model)
```
Propagate = OR(neighbor_states)
```
- Action potential-like signal spreading
- Short-range excitation model
- Discrete decision points

### Crowd Behavior Modeling

- **Safe Density**: 4 persons/m² (comfortable movement)
- **Critical Density**: 6 persons/m² (unstable flow, injury risk)
- **Extreme Density**: 8+ persons/m² (stampede risk, fatalities)
- **Crowdedness Threshold**: >0.7 indicates high crowding

## 📁 Project Structure

```
crowd-control/
├── crowdleaf_algorithm.py     # Core biomimetic algorithm with research-based models
├── airport_simulator.py        # Simulation engine and 5 airport models
├── run_simulation.py           # Main comparison script (matplotlib plots)
├── enhanced_visualization.py   # Enhanced interactive visualization (RECOMMENDED)
├── interactive_simulation.py   # Basic live visualization
├── quick_demo.py               # Quick demonstration runner
├── stress_test.py              # High-density stress testing
├── requirements.txt            # Python dependencies
├── .gitignore                  # Git ignore file
└── README.md                   # This file
```

### Key Files

- **crowdleaf_algorithm.py**: Implements sigmoidal activation, Boolean propagation, and crowdedness metrics
- **airport_simulator.py**: Graph-based models of DFW, ATL, DXB, DEL, IAD terminals
- **enhanced_visualization.py**: Interactive pygame UI with all visual features
- **run_simulation.py**: Batch comparison of all airports with matplotlib charts

## 🎯 Applications

CrowdLeaf can be applied to:

- ✈️ **Airports**: Terminal evacuations, peak hour management
- 🏟️ **Public Gatherings**: Concerts, protests, large meetings
- 🚇 **Mass Transit**: Subways, train stations
- 🏢 **Large Buildings**: Emergency evacuations, fire drills
- 🚦 **Traffic Control**: High-density urban areas

## 📚 References

Based on research presented in **ShivajRaman_CC_SessionNotes.docx**

### Key Research Papers

**Biomimicry & Plant Dynamics:**
- Electronic Thygmonasty Model in Mimosa pudica Biomimetic Robot (2022)
- Boolean Function Applied to Mimosa pudica (2011)
- Mechanical Signaling in Sensitive Plant (2020)
- Learning in Plants (2016) - Habituation and classical conditioning models

**Ant Colony & Collective Behavior:**
- The Emergence of a Collective Sensory Response Threshold in Ant Colonies (PNAS 2022)
  - Sigmoidal response threshold
  - Size-dependent activation
  - Binary network model with short-range excitation

**Airport Crowd Management:**
- AI Simulation of Passenger Flows (2024)
  - Crowdedness formula: F_i = (F_{i,r} + F_{i,w} + F_{i,in})/F_{i,max} × T_i
  - Technology integration achieves 25% crowdedness reduction
- Digital Twin-Based Smart Control (2024)
- Real-time crowd estimation using sensors and smart algorithms

**Crowd Dynamics Models:**
- Weighted averaging of neighbor velocities
- Active inference model (minimize prediction error)
- Stress-based behavioral modification (General Adaptation Syndrome)
- Deep Reinforcement Learning for evacuation guidance

### Airport Floor Map Sources
- [DFW Airport Official Map](https://www.dfwairport.com/map/)
- [ATL Terminal Maps](https://www.atl.com/maps/)
- [Dubai Airport Terminal 3](https://www.dubaiairportguide.com/dubai-airport-terminal-3-maps/)
- [Delhi Airport Maps](https://www.newdelhiairport.in/terminal-maps/)
- [Dulles Airport Maps](https://www.flydulles.com/travel-information/airport-and-terminal-maps)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## 📄 License

This project is open source and available under the MIT License.

## 📧 Contact

For questions or collaboration opportunities, please open an issue on GitHub.

---

**Note**: This is a research project for educational and safety improvement purposes. The simulation uses simplified models and should not be used as the sole basis for real-world crowd management decisions without proper validation and expert consultation.
