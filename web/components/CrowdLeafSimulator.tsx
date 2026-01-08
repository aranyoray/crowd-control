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
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw divider with gradient
      const gradient = ctx.createLinearGradient(canvas.width / 2 - 2, 0, canvas.width / 2 + 2, 0);
      gradient.addColorStop(0, 'rgba(200, 200, 200, 0.5)');
      gradient.addColorStop(0.5, 'rgba(100, 100, 100, 0.8)');
      gradient.addColorStop(1, 'rgba(200, 200, 200, 0.5)');
      ctx.fillStyle = gradient;
      ctx.fillRect(canvas.width / 2 - 2, 0, 4, canvas.height);

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
    // Draw floor (open space) - lighter background
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(offsetX, 0, layout.width, layout.height);

    // Draw gate areas (light blue with gradient)
    layout.gates.forEach(gate => {
      const gateGradient = ctx.createLinearGradient(
        offsetX + gate.x, gate.y,
        offsetX + gate.x, gate.y + gate.height
      );
      gateGradient.addColorStop(0, '#dbeafe');
      gateGradient.addColorStop(1, '#bfdbfe');
      ctx.fillStyle = gateGradient;
      ctx.fillRect(offsetX + gate.x, gate.y, gate.width, gate.height);

      // Gate border
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 1;
      ctx.strokeRect(offsetX + gate.x, gate.y, gate.width, gate.height);
    });

    // Draw security checkpoints (orange/amber areas)
    if (layout.securityCheckpoints) {
      layout.securityCheckpoints.forEach(checkpoint => {
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(offsetX + checkpoint.x, checkpoint.y, checkpoint.width, checkpoint.height);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1;
        ctx.strokeRect(offsetX + checkpoint.x, checkpoint.y, checkpoint.width, checkpoint.height);
      });
    }

    // Draw shops (purple/lavender areas)
    if (layout.shops) {
      layout.shops.forEach(shop => {
        ctx.fillStyle = '#e9d5ff';
        ctx.fillRect(offsetX + shop.x, shop.y, shop.width, shop.height);
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 1;
        ctx.strokeRect(offsetX + shop.x, shop.y, shop.width, shop.height);
      });
    }

    // Draw baggage claim areas (brown/tan)
    if (layout.baggageClaims) {
      layout.baggageClaims.forEach(baggage => {
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(offsetX + baggage.x, baggage.y, baggage.width, baggage.height);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1;
        ctx.strokeRect(offsetX + baggage.x, baggage.y, baggage.width, baggage.height);
      });
    }

    // Draw exit areas (light green with gradient)
    layout.exits.forEach(exit => {
      const exitGradient = ctx.createLinearGradient(
        offsetX + exit.x, exit.y,
        offsetX + exit.x, exit.y + exit.height
      );
      exitGradient.addColorStop(0, '#d1fae5');
      exitGradient.addColorStop(1, '#a7f3d0');
      ctx.fillStyle = exitGradient;
      ctx.fillRect(offsetX + exit.x, exit.y, exit.width, exit.height);

      // Exit border
      ctx.strokeStyle = '#6ee7b7';
      ctx.lineWidth = 2;
      ctx.strokeRect(offsetX + exit.x, exit.y, exit.width, exit.height);
    });

    // Draw walls (dark gray with shadow effect)
    ctx.fillStyle = '#374151';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    layout.walls.forEach(wall => {
      ctx.fillRect(offsetX + wall.x, wall.y, wall.width, wall.height);
    });
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw gate labels
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    layout.gates.forEach(gate => {
      ctx.fillText(
        gate.label,
        offsetX + gate.x + gate.width / 2,
        gate.y + gate.height / 2 + 3
      );
    });

    // Draw security checkpoint labels
    if (layout.securityCheckpoints) {
      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 9px sans-serif';
      layout.securityCheckpoints.forEach(checkpoint => {
        ctx.fillText(
          checkpoint.label,
          offsetX + checkpoint.x + checkpoint.width / 2,
          checkpoint.y + checkpoint.height / 2 + 3
        );
      });
    }

    // Draw shop labels
    if (layout.shops) {
      ctx.fillStyle = '#7c3aed';
      ctx.font = 'bold 9px sans-serif';
      layout.shops.forEach(shop => {
        ctx.fillText(
          shop.label,
          offsetX + shop.x + shop.width / 2,
          shop.y + shop.height / 2 + 3
        );
      });
    }

    // Draw baggage claim labels
    if (layout.baggageClaims) {
      ctx.fillStyle = '#c2410c';
      ctx.font = 'bold 9px sans-serif';
      layout.baggageClaims.forEach(baggage => {
        ctx.fillText(
          baggage.label,
          offsetX + baggage.x + baggage.width / 2,
          baggage.y + baggage.height / 2 + 3
        );
      });
    }

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

    // Draw crowding visualization (density heatmap with gradient: white -> yellow -> orange -> red)
    const gridSize = 35;
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

    // Helper function to get heatmap color based on density
    const getHeatmapColor = (count: number): string => {
      if (count === 0) return 'rgba(255, 255, 255, 0)'; // White (transparent) - no crowd
      if (count <= 3) return `rgba(255, 255, 255, ${0.1 + count * 0.1})`; // Very light (almost white)
      if (count <= 6) return `rgba(255, 255, 200, ${0.3 + (count - 3) * 0.1})`; // Light yellow
      if (count <= 10) return `rgba(255, 235, 59, ${0.4 + (count - 6) * 0.08})`; // Yellow
      if (count <= 15) return `rgba(255, 193, 7, ${0.5 + (count - 10) * 0.06})`; // Amber/Orange-yellow
      if (count <= 20) return `rgba(255, 152, 0, ${0.6 + (count - 15) * 0.05})`; // Orange
      if (count <= 25) return `rgba(255, 87, 34, ${0.7 + (count - 20) * 0.04})`; // Deep Orange
      return `rgba(244, 67, 54, ${0.8 + Math.min((count - 25) * 0.02, 0.2)})`; // Red (max density)
    };

    // Draw crowding overlay with smooth gradient
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const count = densityGrid[row][col];
        if (count > 0) {
          ctx.fillStyle = getHeatmapColor(count);
          ctx.fillRect(
            offsetX + col * gridSize,
            row * gridSize,
            gridSize,
            gridSize
          );
        }
      }
    }

    // Add heatmap legend in corner
    const legendX = offsetX + layout.width - 120;
    const legendY = 50;
    const legendWidth = 100;
    const legendHeight = 15;

    // Draw legend background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(legendX - 5, legendY - 20, legendWidth + 10, legendHeight + 35);
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1;
    ctx.strokeRect(legendX - 5, legendY - 20, legendWidth + 10, legendHeight + 35);

    // Draw legend title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Crowd Density', legendX, legendY - 5);

    // Draw gradient bar
    const gradient = ctx.createLinearGradient(legendX, 0, legendX + legendWidth, 0);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');     // White
    gradient.addColorStop(0.25, 'rgba(255, 255, 200, 0.8)');  // Light Yellow
    gradient.addColorStop(0.5, 'rgba(255, 235, 59, 0.8)');    // Yellow
    gradient.addColorStop(0.75, 'rgba(255, 152, 0, 0.8)');    // Orange
    gradient.addColorStop(1, 'rgba(244, 67, 54, 0.9)');       // Red

    ctx.fillStyle = gradient;
    ctx.fillRect(legendX, legendY, legendWidth, legendHeight);

    // Draw legend border
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.strokeRect(legendX, legendY, legendWidth, legendHeight);

    // Draw legend labels
    ctx.fillStyle = '#333';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Low', legendX, legendY + legendHeight + 12);
    ctx.textAlign = 'right';
    ctx.fillText('High', legendX + legendWidth, legendY + legendHeight + 12);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <canvas
          ref={canvasRef}
          width={2200}
          height={400}
          className="w-full border-2 border-gray-300 rounded-lg"
        />
      </div>

      {/* Metrics Display */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Without CrowdLeaf */}
        <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
          <h3 className="font-bold text-red-800 mb-3 text-lg">❌ Without CrowdLeaf</h3>
          {metricsWithout && (
            <div className="space-y-2 text-sm text-gray-800">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Time:</span>
                <span className="font-bold text-gray-900">{metricsWithout.time.toFixed(1)}s</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Injuries:</span>
                <span className="font-bold text-orange-700">{metricsWithout.injuries}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Deaths:</span>
                <span className="font-bold text-red-700">{metricsWithout.deaths}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Avg Density:</span>
                <span className="font-bold text-gray-900">{metricsWithout.avgDensity.toFixed(2)} p/m²</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Evacuated:</span>
                <span className="font-bold text-green-700">{metricsWithout.agentsEvacuated}</span>
              </div>
            </div>
          )}
        </div>

        {/* With CrowdLeaf */}
        <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
          <h3 className="font-bold text-green-800 mb-3 text-lg">✅ With CrowdLeaf</h3>
          {metricsWith && (
            <div className="space-y-2 text-sm text-gray-800">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Time:</span>
                <span className="font-bold text-gray-900">{metricsWith.time.toFixed(1)}s</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Injuries:</span>
                <span className="font-bold text-orange-700">{metricsWith.injuries}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Deaths:</span>
                <span className="font-bold text-red-700">{metricsWith.deaths}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Avg Density:</span>
                <span className="font-bold text-gray-900">{metricsWith.avgDensity.toFixed(2)} p/m²</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Evacuated:</span>
                <span className="font-bold text-green-700">{metricsWith.agentsEvacuated}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
