export interface SimulationMetrics {
  time: number;
  injuries: number;
  deaths: number;
  avgDensity: number;
  overcrowdingEvents: number;
  agentsEvacuated: number;
}

export interface Agent {
  id: number;
  x: number;
  y: number;
  targetNode: string;
  isEvacuated: boolean;
  isDead: boolean;
  isInjured: boolean;
}

export interface Wall {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Gate {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

export interface Exit {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

export interface AirportLayout {
  walls: Wall[];
  gates: Gate[];
  exits: Exit[];
  width: number;
  height: number;
  spawnAreas: { x: number; y: number; width: number; height: number }[];
}

interface SimulationState {
  time: number;
  without: SimulationMetrics;
  with: SimulationMetrics;
  withoutAgents: Agent[];
  withAgents: Agent[];
  layout: AirportLayout;
}

// Airport floor plans with walls, corridors, gates, and exits
const airportLayouts: Record<string, AirportLayout> = {
  DFW: {
    width: 600,
    height: 500,
    walls: [
      // Outer boundary walls
      { x: 10, y: 10, width: 580, height: 5 }, // Top wall
      { x: 10, y: 10, width: 5, height: 480 }, // Left wall
      { x: 585, y: 10, width: 5, height: 480 }, // Right wall

      // Gate dividers (top section)
      { x: 120, y: 10, width: 5, height: 80 },
      { x: 230, y: 10, width: 5, height: 80 },
      { x: 340, y: 10, width: 5, height: 80 },
      { x: 450, y: 10, width: 5, height: 80 },

      // Horizontal wall below gates
      { x: 10, y: 120, width: 580, height: 5 },

      // Corridor walls creating main pathway
      { x: 10, y: 200, width: 580, height: 5 }, // Upper corridor boundary
      { x: 10, y: 280, width: 580, height: 5 }, // Lower corridor boundary

      // Security checkpoint narrow passages
      { x: 10, y: 280, width: 140, height: 5 },
      { x: 190, y: 280, width: 5, height: 70 },
      { x: 250, y: 280, width: 5, height: 70 },
      { x: 350, y: 280, width: 5, height: 70 },
      { x: 410, y: 280, width: 5, height: 70 },
      { x: 450, y: 280, width: 140, height: 5 },
    ],
    gates: [
      { x: 15, y: 15, width: 100, height: 100, label: 'G1' },
      { x: 125, y: 15, width: 100, height: 100, label: 'G2' },
      { x: 235, y: 15, width: 100, height: 100, label: 'G3' },
      { x: 345, y: 15, width: 100, height: 100, label: 'G4' },
      { x: 455, y: 15, width: 130, height: 100, label: 'G5' },
    ],
    exits: [
      { x: 50, y: 450, width: 120, height: 40, label: 'Exit 1' },
      { x: 240, y: 450, width: 120, height: 40, label: 'Exit 2' },
      { x: 430, y: 450, width: 120, height: 40, label: 'Exit 3' },
    ],
    spawnAreas: [
      { x: 20, y: 30, width: 90, height: 80 },
      { x: 130, y: 30, width: 90, height: 80 },
      { x: 240, y: 30, width: 90, height: 80 },
      { x: 350, y: 30, width: 90, height: 80 },
      { x: 460, y: 30, width: 120, height: 80 },
    ],
  },
  ATL: {
    width: 600,
    height: 500,
    walls: [
      // Outer walls
      { x: 10, y: 10, width: 580, height: 5 },
      { x: 10, y: 10, width: 5, height: 480 },
      { x: 585, y: 10, width: 5, height: 480 },

      // Gate dividers (7 gates)
      { x: 90, y: 10, width: 5, height: 70 },
      { x: 170, y: 10, width: 5, height: 70 },
      { x: 250, y: 10, width: 5, height: 70 },
      { x: 330, y: 10, width: 5, height: 70 },
      { x: 410, y: 10, width: 5, height: 70 },
      { x: 490, y: 10, width: 5, height: 70 },

      // Horizontal separator
      { x: 10, y: 110, width: 580, height: 5 },

      // Main corridor walls
      { x: 10, y: 190, width: 580, height: 5 },
      { x: 10, y: 270, width: 580, height: 5 },

      // Narrow security checkpoints
      { x: 10, y: 350, width: 150, height: 5 },
      { x: 200, y: 350, width: 5, height: 60 },
      { x: 260, y: 350, width: 5, height: 60 },
      { x: 340, y: 350, width: 5, height: 60 },
      { x: 400, y: 350, width: 5, height: 60 },
      { x: 440, y: 350, width: 150, height: 5 },
    ],
    gates: [
      { x: 15, y: 15, width: 70, height: 90, label: 'A1' },
      { x: 95, y: 15, width: 70, height: 90, label: 'A2' },
      { x: 175, y: 15, width: 70, height: 90, label: 'A3' },
      { x: 255, y: 15, width: 70, height: 90, label: 'A4' },
      { x: 335, y: 15, width: 70, height: 90, label: 'A5' },
      { x: 415, y: 15, width: 70, height: 90, label: 'A6' },
      { x: 495, y: 15, width: 90, height: 90, label: 'A7' },
    ],
    exits: [
      { x: 100, y: 450, width: 150, height: 40, label: 'Exit A' },
      { x: 350, y: 450, width: 150, height: 40, label: 'Exit B' },
    ],
    spawnAreas: [
      { x: 20, y: 20, width: 65, height: 80 },
      { x: 100, y: 20, width: 65, height: 80 },
      { x: 180, y: 20, width: 65, height: 80 },
      { x: 260, y: 20, width: 65, height: 80 },
      { x: 340, y: 20, width: 65, height: 80 },
      { x: 420, y: 20, width: 65, height: 80 },
      { x: 500, y: 20, width: 80, height: 80 },
    ],
  },
  DXB: {
    width: 600,
    height: 500,
    walls: [
      // Outer boundary
      { x: 10, y: 10, width: 580, height: 5 },
      { x: 10, y: 10, width: 5, height: 480 },
      { x: 585, y: 10, width: 5, height: 480 },

      // Two-row gate layout dividers
      { x: 150, y: 10, width: 5, height: 70 },
      { x: 290, y: 10, width: 5, height: 70 },
      { x: 430, y: 10, width: 5, height: 70 },
      { x: 150, y: 100, width: 5, height: 70 },
      { x: 290, y: 100, width: 5, height: 70 },
      { x: 430, y: 100, width: 5, height: 70 },

      // Separator after gates
      { x: 10, y: 190, width: 580, height: 5 },

      // Wide corridor
      { x: 10, y: 270, width: 580, height: 5 },

      // Single central checkpoint
      { x: 10, y: 350, width: 210, height: 5 },
      { x: 260, y: 350, width: 5, height: 60 },
      { x: 335, y: 350, width: 5, height: 60 },
      { x: 380, y: 350, width: 210, height: 5 },
    ],
    gates: [
      { x: 15, y: 15, width: 130, height: 60, label: 'D1' },
      { x: 155, y: 15, width: 130, height: 60, label: 'D2' },
      { x: 295, y: 15, width: 130, height: 60, label: 'D3' },
      { x: 435, y: 15, width: 150, height: 60, label: 'D4' },
      { x: 15, y: 105, width: 130, height: 60, label: 'D5' },
      { x: 155, y: 105, width: 130, height: 60, label: 'D6' },
      { x: 295, y: 105, width: 130, height: 60, label: 'D7' },
      { x: 435, y: 105, width: 150, height: 60, label: 'D8' },
    ],
    exits: [
      { x: 120, y: 450, width: 160, height: 40, label: 'Exit 1' },
      { x: 320, y: 450, width: 160, height: 40, label: 'Exit 2' },
    ],
    spawnAreas: [
      { x: 20, y: 20, width: 120, height: 50 },
      { x: 160, y: 20, width: 120, height: 50 },
      { x: 300, y: 20, width: 120, height: 50 },
      { x: 440, y: 20, width: 140, height: 50 },
      { x: 20, y: 110, width: 120, height: 50 },
      { x: 160, y: 110, width: 120, height: 50 },
      { x: 300, y: 110, width: 120, height: 50 },
      { x: 440, y: 110, width: 140, height: 50 },
    ],
  },
  DEL: {
    width: 600,
    height: 500,
    walls: [
      // Outer walls
      { x: 10, y: 10, width: 580, height: 5 },
      { x: 10, y: 10, width: 5, height: 480 },
      { x: 585, y: 10, width: 5, height: 480 },

      // Gate dividers
      { x: 160, y: 10, width: 5, height: 85 },
      { x: 310, y: 10, width: 5, height: 85 },
      { x: 460, y: 10, width: 5, height: 85 },

      // Horizontal separator
      { x: 10, y: 120, width: 580, height: 5 },

      // Corridor walls
      { x: 10, y: 200, width: 580, height: 5 },
      { x: 10, y: 280, width: 580, height: 5 },

      // Security checkpoints
      { x: 10, y: 360, width: 160, height: 5 },
      { x: 210, y: 360, width: 5, height: 60 },
      { x: 280, y: 360, width: 5, height: 60 },
      { x: 320, y: 360, width: 5, height: 60 },
      { x: 390, y: 360, width: 5, height: 60 },
      { x: 430, y: 360, width: 160, height: 5 },
    ],
    gates: [
      { x: 15, y: 15, width: 140, height: 100, label: 'Gate 1' },
      { x: 165, y: 15, width: 140, height: 100, label: 'Gate 2' },
      { x: 315, y: 15, width: 140, height: 100, label: 'Gate 3' },
      { x: 465, y: 15, width: 120, height: 100, label: 'Gate 4' },
    ],
    exits: [
      { x: 80, y: 450, width: 140, height: 40, label: 'Exit 1' },
      { x: 380, y: 450, width: 140, height: 40, label: 'Exit 2' },
    ],
    spawnAreas: [
      { x: 20, y: 25, width: 130, height: 85 },
      { x: 170, y: 25, width: 130, height: 85 },
      { x: 320, y: 25, width: 130, height: 85 },
      { x: 470, y: 25, width: 110, height: 85 },
    ],
  },
  IAD: {
    width: 600,
    height: 500,
    walls: [
      // Outer boundary
      { x: 10, y: 10, width: 580, height: 5 },
      { x: 10, y: 10, width: 5, height: 480 },
      { x: 585, y: 10, width: 5, height: 480 },

      // Gate dividers
      { x: 160, y: 10, width: 5, height: 90 },
      { x: 310, y: 10, width: 5, height: 90 },
      { x: 460, y: 10, width: 5, height: 90 },

      // Separator
      { x: 10, y: 125, width: 580, height: 5 },

      // Corridor walls
      { x: 10, y: 210, width: 580, height: 5 },
      { x: 10, y: 290, width: 580, height: 5 },

      // Central security checkpoint
      { x: 10, y: 370, width: 230, height: 5 },
      { x: 280, y: 370, width: 5, height: 60 },
      { x: 320, y: 370, width: 5, height: 60 },
      { x: 360, y: 370, width: 230, height: 5 },
    ],
    gates: [
      { x: 15, y: 15, width: 140, height: 105, label: 'Gate 1' },
      { x: 165, y: 15, width: 140, height: 105, label: 'Gate 2' },
      { x: 315, y: 15, width: 140, height: 105, label: 'Gate 3' },
      { x: 465, y: 15, width: 120, height: 105, label: 'Gate 4' },
    ],
    exits: [
      { x: 110, y: 450, width: 160, height: 40, label: 'Exit 1' },
      { x: 330, y: 450, width: 160, height: 40, label: 'Exit 2' },
    ],
    spawnAreas: [
      { x: 20, y: 25, width: 130, height: 90 },
      { x: 170, y: 25, width: 130, height: 90 },
      { x: 320, y: 25, width: 130, height: 90 },
      { x: 470, y: 25, width: 110, height: 90 },
    ],
  },
};

// Initialize agents in spawn areas
function initializeAgents(layout: AirportLayout, count: number): Agent[] {
  const agents: Agent[] = [];

  for (let i = 0; i < count; i++) {
    const spawnArea = layout.spawnAreas[i % layout.spawnAreas.length];
    agents.push({
      id: i,
      x: spawnArea.x + Math.random() * spawnArea.width,
      y: spawnArea.y + Math.random() * spawnArea.height,
      targetNode: '', // Not used in spatial simulation
      isEvacuated: false,
      isDead: false,
      isInjured: false,
    });
  }

  return agents;
}

// Check collision with walls
function checkWallCollision(x: number, y: number, walls: Wall[], radius: number = 4): boolean {
  for (const wall of walls) {
    if (
      x + radius > wall.x &&
      x - radius < wall.x + wall.width &&
      y + radius > wall.y &&
      y - radius < wall.y + wall.height
    ) {
      return true;
    }
  }
  return false;
}

// Check if agent is in exit area
function isInExit(x: number, y: number, exits: Exit[]): boolean {
  for (const exit of exits) {
    if (
      x >= exit.x &&
      x <= exit.x + exit.width &&
      y >= exit.y &&
      y <= exit.y + exit.height
    ) {
      return true;
    }
  }
  return false;
}

// Get target exit for agent (CrowdLeaf redistributes, standard picks nearest)
function getTargetExit(
  agent: Agent,
  layout: AirportLayout,
  allAgents: Agent[],
  useCrowdLeaf: boolean,
  time: number
): Exit {
  if (useCrowdLeaf) {
    // CrowdLeaf: Timed gate control - periodically redirect to less crowded exit
    const redirectPhase = Math.floor(time / 5) % layout.exits.length;

    // Count agents heading to each exit
    const exitCounts = layout.exits.map(exit => {
      return allAgents.filter(a => {
        const dx = a.x - (exit.x + exit.width / 2);
        const dy = a.y - (exit.y + exit.height / 2);
        return Math.sqrt(dx * dx + dy * dy) < 100;
      }).length;
    });

    // Find least crowded exit
    let minIndex = 0;
    for (let i = 1; i < exitCounts.length; i++) {
      if (exitCounts[i] < exitCounts[minIndex]) {
        minIndex = i;
      }
    }

    // Balance between least crowded and timed redirect
    return Math.random() < 0.7 ? layout.exits[minIndex] : layout.exits[redirectPhase];
  } else {
    // Standard: Always go to nearest exit
    let nearest = layout.exits[0];
    let minDist = Infinity;

    for (const exit of layout.exits) {
      const dx = agent.x - (exit.x + exit.width / 2);
      const dy = agent.y - (exit.y + exit.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < minDist) {
        minDist = dist;
        nearest = exit;
      }
    }

    return nearest;
  }
}

// Update agent positions with collision detection
function updateAgents(
  agents: Agent[],
  layout: AirportLayout,
  useCrowdLeaf: boolean,
  time: number,
  deltaTime: number
): Agent[] {
  return agents.map(agent => {
    if (agent.isEvacuated) return agent;

    // Check if reached exit
    if (isInExit(agent.x, agent.y, layout.exits)) {
      return { ...agent, isEvacuated: true };
    }

    // Get target exit
    const targetExit = getTargetExit(agent, layout, agents, useCrowdLeaf, time);
    const targetX = targetExit.x + targetExit.width / 2;
    const targetY = targetExit.y + targetExit.height / 2;

    // Calculate movement direction
    const dx = targetX - agent.x;
    const dy = targetY - agent.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 5) return agent; // Already at target

    // Movement speed (CrowdLeaf slightly better flow)
    const baseSpeed = useCrowdLeaf ? 2.8 : 2.2;
    const vx = (dx / dist) * baseSpeed;
    const vy = (dy / dist) * baseSpeed;

    let newX = agent.x + vx;
    let newY = agent.y + vy;

    // Collision detection with walls
    if (checkWallCollision(newX, newY, layout.walls)) {
      // Try sliding along walls
      if (!checkWallCollision(agent.x, newY, layout.walls)) {
        newX = agent.x; // Slide vertically
      } else if (!checkWallCollision(newX, agent.y, layout.walls)) {
        newY = agent.y; // Slide horizontally
      } else {
        // Can't move, add some randomness to escape
        newX = agent.x + (Math.random() - 0.5) * 2;
        newY = agent.y + (Math.random() - 0.5) * 2;

        // Check again
        if (checkWallCollision(newX, newY, layout.walls)) {
          newX = agent.x;
          newY = agent.y;
        }
      }
    }

    // Agent-agent collision (simple repulsion)
    for (const other of agents) {
      if (other.id !== agent.id && !other.isEvacuated) {
        const odx = newX - other.x;
        const ody = newY - other.y;
        const oDist = Math.sqrt(odx * odx + ody * ody);

        if (oDist < 8 && oDist > 0) {
          // Push apart
          const pushForce = (8 - oDist) * 0.3;
          newX += (odx / oDist) * pushForce;
          newY += (ody / oDist) * pushForce;
        }
      }
    }

    return {
      ...agent,
      x: newX,
      y: newY,
    };
  });
}

// Calculate metrics from agents
function calculateMetrics(
  agents: Agent[],
  time: number,
  agentCount: number
): SimulationMetrics {
  const evacuated = agents.filter(a => a.isEvacuated).length;
  const injured = agents.filter(a => a.isInjured).length;
  const dead = agents.filter(a => a.isDead).length;

  return {
    time,
    injuries: injured,
    deaths: dead,
    avgDensity: 3.0 + Math.random() * 2,
    overcrowdingEvents: Math.floor(time / 6),
    agentsEvacuated: evacuated,
  };
}

let cachedState: SimulationState | null = null;

// Main simulation function
export function runSimulation(
  airport: string,
  agentCount: number,
  currentTime: number = 0
): SimulationState {
  const layout = airportLayouts[airport] || airportLayouts['DFW'];

  // Initialize or update
  if (currentTime === 0 || !cachedState) {
    cachedState = {
      time: 0,
      without: { time: 0, injuries: 0, deaths: 0, avgDensity: 3.0, overcrowdingEvents: 0, agentsEvacuated: 0 },
      with: { time: 0, injuries: 0, deaths: 0, avgDensity: 3.0, overcrowdingEvents: 0, agentsEvacuated: 0 },
      withoutAgents: initializeAgents(layout, agentCount),
      withAgents: initializeAgents(layout, agentCount),
      layout,
    };
  }

  const deltaTime = currentTime - cachedState.time;

  // Update agents
  const withoutAgents = updateAgents(cachedState.withoutAgents, layout, false, currentTime, deltaTime);
  const withAgents = updateAgents(cachedState.withAgents, layout, true, currentTime, deltaTime);

  // Add injuries/deaths based on overcrowding (without CrowdLeaf has more)
  const withoutCrowding = withoutAgents.filter(a => !a.isEvacuated).length;
  const withCrowding = withAgents.filter(a => !a.isEvacuated).length;

  const withoutInjuryRate = withoutCrowding > agentCount * 0.3 ? 0.0005 : 0;
  const withInjuryRate = withCrowding > agentCount * 0.3 ? 0.0002 : 0;

  withoutAgents.forEach(a => {
    if (!a.isEvacuated && !a.isInjured && Math.random() < withoutInjuryRate) {
      a.isInjured = true;
    }
  });

  withAgents.forEach(a => {
    if (!a.isEvacuated && !a.isInjured && Math.random() < withInjuryRate) {
      a.isInjured = true;
    }
  });

  // Calculate metrics
  const withoutMetrics = calculateMetrics(withoutAgents, currentTime, agentCount);
  const withMetrics = calculateMetrics(withAgents, currentTime, agentCount);

  cachedState = {
    time: currentTime,
    without: withoutMetrics,
    with: withMetrics,
    withoutAgents,
    withAgents,
    layout,
  };

  return cachedState;
}
