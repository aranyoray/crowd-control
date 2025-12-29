export interface SimulationMetrics {
  time: number;
  injuries: number;
  deaths: number;
  avgDensity: number;
  overcrowdingEvents: number;
  agentsEvacuated: number;
}

interface SimulationState {
  time: number;
  without: SimulationMetrics;
  with: SimulationMetrics;
}

// Simplified simulation logic
export function runSimulation(
  airport: string,
  agentCount: number,
  currentTime: number = 0
): SimulationState {
  const time = currentTime;
  
  // Simplified metrics calculation
  const progressRatio = Math.min(time / 30, 1);
  
  // Without CrowdLeaf - higher injury/death rates
  const withoutMetrics: SimulationMetrics = {
    time,
    injuries: Math.floor(agentCount * 0.02 * progressRatio + Math.random() * 2),
    deaths: Math.floor(agentCount * 0.005 * progressRatio),
    avgDensity: 4.5 + Math.random() * 2,
    overcrowdingEvents: Math.floor(5 * progressRatio),
    agentsEvacuated: Math.floor(agentCount * progressRatio * 0.85),
  };

  // With CrowdLeaf - lower injury/death rates, better evacuation
  const withMetrics: SimulationMetrics = {
    time,
    injuries: Math.floor(agentCount * 0.008 * progressRatio + Math.random()),
    deaths: Math.floor(agentCount * 0.002 * progressRatio),
    avgDensity: 3.2 + Math.random() * 1.5,
    overcrowdingEvents: Math.floor(2 * progressRatio),
    agentsEvacuated: Math.floor(agentCount * progressRatio * 0.95),
  };

  return {
    time,
    without: withoutMetrics,
    with: withMetrics,
  };
}
