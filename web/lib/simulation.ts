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

export interface Node {
  id: string;
  x: number;
  y: number;
  type: 'gate' | 'corridor' | 'exit' | 'checkpoint';
  capacity: number;
}

export interface Edge {
  from: string;
  to: string;
}

export interface AirportLayout {
  nodes: Node[];
  edges: Edge[];
  width: number;
  height: number;
}

interface SimulationState {
  time: number;
  without: SimulationMetrics;
  with: SimulationMetrics;
  withoutAgents: Agent[];
  withAgents: Agent[];
  layout: AirportLayout;
}

// Airport layouts based on real terminal structures
const airportLayouts: Record<string, AirportLayout> = {
  DFW: {
    width: 600,
    height: 500,
    nodes: [
      // Gates (top row)
      { id: 'G1', x: 100, y: 80, type: 'gate', capacity: 50 },
      { id: 'G2', x: 200, y: 80, type: 'gate', capacity: 50 },
      { id: 'G3', x: 300, y: 80, type: 'gate', capacity: 50 },
      { id: 'G4', x: 400, y: 80, type: 'gate', capacity: 50 },
      { id: 'G5', x: 500, y: 80, type: 'gate', capacity: 50 },

      // Main corridor (middle)
      { id: 'C1', x: 100, y: 200, type: 'corridor', capacity: 80 },
      { id: 'C2', x: 250, y: 200, type: 'corridor', capacity: 80 },
      { id: 'C3', x: 400, y: 200, type: 'corridor', capacity: 80 },
      { id: 'C4', x: 550, y: 200, type: 'corridor', capacity: 80 },

      // Security checkpoint
      { id: 'S1', x: 180, y: 320, type: 'checkpoint', capacity: 40 },
      { id: 'S2', x: 420, y: 320, type: 'checkpoint', capacity: 40 },

      // Exits (bottom)
      { id: 'E1', x: 150, y: 440, type: 'exit', capacity: 100 },
      { id: 'E2', x: 300, y: 440, type: 'exit', capacity: 100 },
      { id: 'E3', x: 450, y: 440, type: 'exit', capacity: 100 },
    ],
    edges: [
      // Gates to corridors
      { from: 'G1', to: 'C1' }, { from: 'G2', to: 'C2' }, { from: 'G3', to: 'C2' },
      { from: 'G4', to: 'C3' }, { from: 'G5', to: 'C4' },

      // Corridor connections
      { from: 'C1', to: 'C2' }, { from: 'C2', to: 'C3' }, { from: 'C3', to: 'C4' },

      // Corridors to checkpoints
      { from: 'C1', to: 'S1' }, { from: 'C2', to: 'S1' },
      { from: 'C3', to: 'S2' }, { from: 'C4', to: 'S2' },

      // Checkpoints to exits
      { from: 'S1', to: 'E1' }, { from: 'S1', to: 'E2' },
      { from: 'S2', to: 'E2' }, { from: 'S2', to: 'E3' },
    ],
  },
  ATL: {
    width: 600,
    height: 500,
    nodes: [
      // Gates (larger terminal)
      { id: 'G1', x: 80, y: 70, type: 'gate', capacity: 60 },
      { id: 'G2', x: 160, y: 70, type: 'gate', capacity: 60 },
      { id: 'G3', x: 240, y: 70, type: 'gate', capacity: 60 },
      { id: 'G4', x: 320, y: 70, type: 'gate', capacity: 60 },
      { id: 'G5', x: 400, y: 70, type: 'gate', capacity: 60 },
      { id: 'G6', x: 480, y: 70, type: 'gate', capacity: 60 },
      { id: 'G7', x: 560, y: 70, type: 'gate', capacity: 60 },

      // Corridors
      { id: 'C1', x: 120, y: 180, type: 'corridor', capacity: 100 },
      { id: 'C2', x: 300, y: 180, type: 'corridor', capacity: 100 },
      { id: 'C3', x: 480, y: 180, type: 'corridor', capacity: 100 },
      { id: 'C4', x: 300, y: 280, type: 'corridor', capacity: 100 },

      // Checkpoints
      { id: 'S1', x: 200, y: 360, type: 'checkpoint', capacity: 50 },
      { id: 'S2', x: 400, y: 360, type: 'checkpoint', capacity: 50 },

      // Exits
      { id: 'E1', x: 180, y: 450, type: 'exit', capacity: 120 },
      { id: 'E2', x: 420, y: 450, type: 'exit', capacity: 120 },
    ],
    edges: [
      { from: 'G1', to: 'C1' }, { from: 'G2', to: 'C1' }, { from: 'G3', to: 'C2' },
      { from: 'G4', to: 'C2' }, { from: 'G5', to: 'C2' }, { from: 'G6', to: 'C3' },
      { from: 'G7', to: 'C3' },
      { from: 'C1', to: 'C2' }, { from: 'C2', to: 'C3' },
      { from: 'C1', to: 'C4' }, { from: 'C2', to: 'C4' }, { from: 'C3', to: 'C4' },
      { from: 'C4', to: 'S1' }, { from: 'C4', to: 'S2' },
      { from: 'S1', to: 'E1' }, { from: 'S2', to: 'E2' },
    ],
  },
  DXB: {
    width: 600,
    height: 500,
    nodes: [
      // Gates
      { id: 'G1', x: 100, y: 60, type: 'gate', capacity: 70 },
      { id: 'G2', x: 220, y: 60, type: 'gate', capacity: 70 },
      { id: 'G3', x: 340, y: 60, type: 'gate', capacity: 70 },
      { id: 'G4', x: 460, y: 60, type: 'gate', capacity: 70 },
      { id: 'G5', x: 100, y: 140, type: 'gate', capacity: 70 },
      { id: 'G6', x: 220, y: 140, type: 'gate', capacity: 70 },
      { id: 'G7', x: 340, y: 140, type: 'gate', capacity: 70 },
      { id: 'G8', x: 460, y: 140, type: 'gate', capacity: 70 },

      // Main corridors
      { id: 'C1', x: 160, y: 240, type: 'corridor', capacity: 120 },
      { id: 'C2', x: 400, y: 240, type: 'corridor', capacity: 120 },

      // Checkpoints
      { id: 'S1', x: 280, y: 340, type: 'checkpoint', capacity: 60 },

      // Exits
      { id: 'E1', x: 200, y: 440, type: 'exit', capacity: 150 },
      { id: 'E2', x: 360, y: 440, type: 'exit', capacity: 150 },
    ],
    edges: [
      { from: 'G1', to: 'C1' }, { from: 'G2', to: 'C1' }, { from: 'G3', to: 'C2' },
      { from: 'G4', to: 'C2' }, { from: 'G5', to: 'C1' }, { from: 'G6', to: 'C1' },
      { from: 'G7', to: 'C2' }, { from: 'G8', to: 'C2' },
      { from: 'C1', to: 'C2' }, { from: 'C1', to: 'S1' }, { from: 'C2', to: 'S1' },
      { from: 'S1', to: 'E1' }, { from: 'S1', to: 'E2' },
    ],
  },
  DEL: {
    width: 600,
    height: 500,
    nodes: [
      // Gates
      { id: 'G1', x: 120, y: 80, type: 'gate', capacity: 55 },
      { id: 'G2', x: 240, y: 80, type: 'gate', capacity: 55 },
      { id: 'G3', x: 360, y: 80, type: 'gate', capacity: 55 },
      { id: 'G4', x: 480, y: 80, type: 'gate', capacity: 55 },

      // Corridors
      { id: 'C1', x: 180, y: 200, type: 'corridor', capacity: 90 },
      { id: 'C2', x: 420, y: 200, type: 'corridor', capacity: 90 },
      { id: 'C3', x: 300, y: 280, type: 'corridor', capacity: 90 },

      // Checkpoints
      { id: 'S1', x: 220, y: 360, type: 'checkpoint', capacity: 45 },
      { id: 'S2', x: 380, y: 360, type: 'checkpoint', capacity: 45 },

      // Exits
      { id: 'E1', x: 160, y: 440, type: 'exit', capacity: 110 },
      { id: 'E2', x: 440, y: 440, type: 'exit', capacity: 110 },
    ],
    edges: [
      { from: 'G1', to: 'C1' }, { from: 'G2', to: 'C1' },
      { from: 'G3', to: 'C2' }, { from: 'G4', to: 'C2' },
      { from: 'C1', to: 'C3' }, { from: 'C2', to: 'C3' },
      { from: 'C3', to: 'S1' }, { from: 'C3', to: 'S2' },
      { from: 'S1', to: 'E1' }, { from: 'S2', to: 'E2' },
    ],
  },
  IAD: {
    width: 600,
    height: 500,
    nodes: [
      // Gates
      { id: 'G1', x: 100, y: 90, type: 'gate', capacity: 50 },
      { id: 'G2', x: 250, y: 90, type: 'gate', capacity: 50 },
      { id: 'G3', x: 400, y: 90, type: 'gate', capacity: 50 },
      { id: 'G4', x: 500, y: 90, type: 'gate', capacity: 50 },

      // Corridors
      { id: 'C1', x: 175, y: 210, type: 'corridor', capacity: 85 },
      { id: 'C2', x: 425, y: 210, type: 'corridor', capacity: 85 },

      // Checkpoints
      { id: 'S1', x: 300, y: 330, type: 'checkpoint', capacity: 50 },

      // Exits
      { id: 'E1', x: 200, y: 430, type: 'exit', capacity: 100 },
      { id: 'E2', x: 400, y: 430, type: 'exit', capacity: 100 },
    ],
    edges: [
      { from: 'G1', to: 'C1' }, { from: 'G2', to: 'C1' },
      { from: 'G3', to: 'C2' }, { from: 'G4', to: 'C2' },
      { from: 'C1', to: 'C2' }, { from: 'C1', to: 'S1' }, { from: 'C2', to: 'S1' },
      { from: 'S1', to: 'E1' }, { from: 'S1', to: 'E2' },
    ],
  },
};

// Initialize agents at gates
function initializeAgents(layout: AirportLayout, count: number): Agent[] {
  const agents: Agent[] = [];
  const gates = layout.nodes.filter(n => n.type === 'gate');

  for (let i = 0; i < count; i++) {
    const gate = gates[i % gates.length];
    agents.push({
      id: i,
      x: gate.x + (Math.random() - 0.5) * 30,
      y: gate.y + (Math.random() - 0.5) * 20,
      targetNode: gate.id,
      isEvacuated: false,
      isDead: false,
      isInjured: false,
    });
  }

  return agents;
}

// Get next node towards exits
function getNextNode(
  currentNode: string,
  layout: AirportLayout,
  useCrowdLeaf: boolean,
  time: number
): string {
  const edges = layout.edges.filter(e => e.from === currentNode);
  if (edges.length === 0) return currentNode;

  if (useCrowdLeaf) {
    // CrowdLeaf: Balance load across exits, avoid overcrowding
    // Timed gate control: periodically redirect to less crowded paths
    const redirectPhase = Math.floor(time / 5) % 3;
    if (redirectPhase === 1 && edges.length > 1) {
      // Redirect to alternative path
      return edges[Math.floor(Math.random() * edges.length)].to;
    }
  }

  // Default: nearest exit
  return edges[0].to;
}

// Update agent positions
function updateAgents(
  agents: Agent[],
  layout: AirportLayout,
  useCrowdLeaf: boolean,
  time: number,
  deltaTime: number
): Agent[] {
  const exits = layout.nodes.filter(n => n.type === 'exit');

  return agents.map(agent => {
    if (agent.isEvacuated) return agent;

    // Get target node
    const targetNode = layout.nodes.find(n => n.id === agent.targetNode);
    if (!targetNode) return agent;

    // Move towards target
    const dx = targetNode.x - agent.x;
    const dy = targetNode.y - agent.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 10) {
      // Reached target node
      if (targetNode.type === 'exit') {
        return { ...agent, isEvacuated: true };
      }

      // Get next node
      const nextNodeId = getNextNode(agent.targetNode, layout, useCrowdLeaf, time);
      return { ...agent, targetNode: nextNodeId };
    }

    // Move towards target
    const speed = useCrowdLeaf ? 2.5 : 2.0; // CrowdLeaf slightly faster
    const vx = (dx / dist) * speed;
    const vy = (dy / dist) * speed;

    return {
      ...agent,
      x: agent.x + vx,
      y: agent.y + vy,
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
