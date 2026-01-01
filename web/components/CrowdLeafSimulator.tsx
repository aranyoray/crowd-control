'use client';

import { useEffect, useRef, useState } from 'react';
import { runSimulation, SimulationMetrics, Agent, AirportLayout, Wall, Gate, Exit } from '@/lib/simulation';

interface Props {
  airport: string;
  agentCount: number;
  isRunning: boolean;
}

export default function CrowdLeafSimulator({ airport, agentCount, isRunning }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [metricsWithout, setMetricsWithout] = useState<SimulationMetrics | null>(null);
  const [metricsWith, setMetricsWith] = useState<SimulationMetrics | null>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset simulation when airport or agent count changes
    setCurrentTime(0);
    let simulations = runSimulation(airport, agentCount, 0);

    const animate = () => {
      if (!isRunning) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Clear canvas
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw divider
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();

      // Draw labels
      ctx.font = 'bold 20px sans-serif';
      ctx.fillStyle = '#dc2626';
      ctx.textAlign = 'center';
      ctx.fillText('WITHOUT CrowdLeaf', canvas.width / 4, 30);

      ctx.fillStyle = '#16a34a';
      ctx.fillText('WITH CrowdLeaf', (canvas.width * 3) / 4, 30);

      // Step simulation
      const newTime = simulations.time + 0.1;
      simulations = runSimulation(airport, agentCount, newTime);
      setCurrentTime(newTime);

      setMetricsWithout(simulations.without);
      setMetricsWith(simulations.with);

      // Draw visualizations
      drawSimulation(ctx, simulations.layout, simulations.withoutAgents, 0, false);
      drawSimulation(ctx, simulations.layout, simulations.withAgents, canvas.width / 2, true);

      if (simulations.time < 30) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [airport, agentCount, isRunning]);

  const drawSimulation = (
    ctx: CanvasRenderingContext2D,
    layout: AirportLayout,
    agents: Agent[],
    offsetX: number,
    isCrowdLeaf: boolean
  ) => {
    // Draw floor (open space)
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(offsetX, 0, layout.width, layout.height);

    // Draw gate areas (light blue)
    ctx.fillStyle = '#e0f2fe';
    layout.gates.forEach(gate => {
      ctx.fillRect(offsetX + gate.x, gate.y, gate.width, gate.height);
    });

    // Draw exit areas (light green)
    ctx.fillStyle = '#d1fae5';
    layout.exits.forEach(exit => {
      ctx.fillRect(offsetX + exit.x, exit.y, exit.width, exit.height);
    });

    // Draw walls (dark gray)
    ctx.fillStyle = '#374151';
    layout.walls.forEach(wall => {
      ctx.fillRect(offsetX + wall.x, wall.y, wall.width, wall.height);
    });

    // Draw gate labels
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    layout.gates.forEach(gate => {
      ctx.fillText(
        gate.label,
        offsetX + gate.x + gate.width / 2,
        gate.y + gate.height / 2 + 4
      );
    });

    // Draw exit labels and state indicators (Mimosa-like visual feedback)
    layout.exits.forEach(exit => {
      const centerX = offsetX + exit.x + exit.width / 2;
      const centerY = exit.y + exit.height / 2;

      // Draw state ring around exit (like Mimosa leaf closing)
      ctx.lineWidth = 4;
      switch (exit.state) {
        case 'open':
          ctx.strokeStyle = '#10b981'; // Green - fully open
          break;
        case 'closing':
          ctx.strokeStyle = '#f59e0b'; // Orange - closing response
          break;
        case 'closed':
          ctx.strokeStyle = '#ef4444'; // Red - fully closed
          break;
        case 'reopening':
          ctx.strokeStyle = '#3b82f6'; // Blue - recovering
          break;
      }

      // Pulsing effect for closing/reopening
      const pulseRadius = (exit.state === 'closing' || exit.state === 'reopening')
        ? Math.sin(Date.now() / 200) * 3 + 3
        : 0;

      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        Math.max(exit.width, exit.height) / 2 + 10 + pulseRadius,
        0,
        Math.PI * 2
      );
      ctx.stroke();

      // Draw exit label
      ctx.fillStyle = exit.state === 'closed' ? '#991b1b' : '#047857';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(exit.label, centerX, centerY + 5);

      // Show crowd count
      ctx.fillStyle = '#000';
      ctx.font = '10px sans-serif';
      ctx.fillText(`(${exit.crowdingLevel})`, centerX, centerY + 20);
    });

    // Draw agents with collision
    const agentColor = isCrowdLeaf ? '#22c55e' : '#ef4444';
    const injuredColor = '#f97316';

    agents.forEach(agent => {
      if (agent.isEvacuated) return;

      const x = offsetX + agent.x;
      const y = agent.y;

      // Draw agent circle
      ctx.fillStyle = agent.isInjured ? injuredColor : agentColor;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      // White outline for visibility
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    // Draw crowding visualization (density heatmap)
    const gridSize = 40;
    const gridCols = Math.ceil(layout.width / gridSize);
    const gridRows = Math.ceil(layout.height / gridSize);
    const densityGrid: number[][] = Array(gridRows).fill(0).map(() => Array(gridCols).fill(0));

    // Count agents in each grid cell
    agents.forEach(agent => {
      if (!agent.isEvacuated) {
        const gridX = Math.floor(agent.x / gridSize);
        const gridY = Math.floor(agent.y / gridSize);
        if (gridX >= 0 && gridX < gridCols && gridY >= 0 && gridY < gridRows) {
          densityGrid[gridY][gridX]++;
        }
      }
    });

    // Draw crowding overlay
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const count = densityGrid[row][col];
        if (count > 5) {
          const alpha = Math.min(count / 20, 0.4);
          ctx.fillStyle = `rgba(239, 68, 68, ${alpha})`;
          ctx.fillRect(
            offsetX + col * gridSize,
            row * gridSize,
            gridSize,
            gridSize
          );
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <canvas
          ref={canvasRef}
          width={1200}
          height={500}
          className="w-full border-2 border-gray-300 rounded-lg"
        />
      </div>

      {/* Metrics Display */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Without CrowdLeaf */}
        <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
          <h3 className="font-bold text-red-800 mb-3">❌ Without CrowdLeaf</h3>
          {metricsWithout && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Time:</span>
                <span className="font-semibold">{metricsWithout.time.toFixed(1)}s</span>
              </div>
              <div className="flex justify-between">
                <span>Injuries:</span>
                <span className="font-semibold text-orange-600">{metricsWithout.injuries}</span>
              </div>
              <div className="flex justify-between">
                <span>Deaths:</span>
                <span className="font-semibold text-red-600">{metricsWithout.deaths}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Density:</span>
                <span className="font-semibold">{metricsWithout.avgDensity.toFixed(2)} p/m²</span>
              </div>
              <div className="flex justify-between">
                <span>Evacuated:</span>
                <span className="font-semibold text-green-600">{metricsWithout.agentsEvacuated}</span>
              </div>
            </div>
          )}
        </div>

        {/* With CrowdLeaf */}
        <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
          <h3 className="font-bold text-green-800 mb-3">✅ With CrowdLeaf</h3>
          {metricsWith && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Time:</span>
                <span className="font-semibold">{metricsWith.time.toFixed(1)}s</span>
              </div>
              <div className="flex justify-between">
                <span>Injuries:</span>
                <span className="font-semibold text-orange-600">{metricsWith.injuries}</span>
              </div>
              <div className="flex justify-between">
                <span>Deaths:</span>
                <span className="font-semibold text-red-600">{metricsWith.deaths}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Density:</span>
                <span className="font-semibold">{metricsWith.avgDensity.toFixed(2)} p/m²</span>
              </div>
              <div className="flex justify-between">
                <span>Evacuated:</span>
                <span className="font-semibold text-green-600">{metricsWith.agentsEvacuated}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
