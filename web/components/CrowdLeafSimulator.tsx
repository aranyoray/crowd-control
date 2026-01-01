'use client';

import { useEffect, useRef, useState } from 'react';
import { runSimulation, SimulationMetrics, Agent, AirportLayout, Node } from '@/lib/simulation';

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

  const drawNode = (
    ctx: CanvasRenderingContext2D,
    node: Node,
    offsetX: number
  ) => {
    const x = offsetX + node.x;
    const y = node.y;

    // Node colors based on type
    switch (node.type) {
      case 'gate':
        ctx.fillStyle = '#3b82f6'; // Blue
        ctx.strokeStyle = '#1d4ed8';
        break;
      case 'corridor':
        ctx.fillStyle = '#d1d5db'; // Gray
        ctx.strokeStyle = '#9ca3af';
        break;
      case 'checkpoint':
        ctx.fillStyle = '#f59e0b'; // Orange
        ctx.strokeStyle = '#d97706';
        break;
      case 'exit':
        ctx.fillStyle = '#10b981'; // Green
        ctx.strokeStyle = '#059669';
        break;
    }

    // Draw node
    ctx.beginPath();
    if (node.type === 'exit') {
      // Exits are larger rectangles
      ctx.fillRect(x - 15, y - 10, 30, 20);
      ctx.strokeRect(x - 15, y - 10, 30, 20);
    } else if (node.type === 'gate') {
      // Gates are small squares
      ctx.fillRect(x - 8, y - 8, 16, 16);
      ctx.strokeRect(x - 8, y - 8, 16, 16);
    } else {
      // Corridors and checkpoints are circles
      ctx.arc(x, y, node.type === 'checkpoint' ? 12 : 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Label
    ctx.fillStyle = '#000';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(node.id, x, y + 25);
  };

  const drawSimulation = (
    ctx: CanvasRenderingContext2D,
    layout: AirportLayout,
    agents: Agent[],
    offsetX: number,
    isCrowdLeaf: boolean
  ) => {
    // Draw edges (pathways)
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    layout.edges.forEach(edge => {
      const fromNode = layout.nodes.find(n => n.id === edge.from);
      const toNode = layout.nodes.find(n => n.id === edge.to);
      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(offsetX + fromNode.x, fromNode.y);
        ctx.lineTo(offsetX + toNode.x, toNode.y);
        ctx.stroke();
      }
    });

    // Draw nodes (gates, corridors, checkpoints, exits)
    layout.nodes.forEach(node => {
      drawNode(ctx, node, offsetX);
    });

    // Draw agents
    const agentColor = isCrowdLeaf ? '#22c55e' : '#ef4444';
    const injuredColor = '#f97316'; // Orange

    agents.forEach(agent => {
      if (agent.isEvacuated) return; // Don't draw evacuated agents

      const x = offsetX + agent.x;
      const y = agent.y;

      ctx.fillStyle = agent.isInjured ? injuredColor : agentColor;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Add outline for visibility
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw legend
    const legendY = 50;
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';

    // Gates
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(offsetX + 10, legendY, 12, 12);
    ctx.fillStyle = '#000';
    ctx.fillText('Gates', offsetX + 26, legendY + 10);

    // Exits
    ctx.fillStyle = '#10b981';
    ctx.fillRect(offsetX + 10, legendY + 20, 12, 12);
    ctx.fillStyle = '#000';
    ctx.fillText('Exits', offsetX + 26, legendY + 30);

    // Checkpoints
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(offsetX + 16, legendY + 46, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.fillText('Security', offsetX + 26, legendY + 50);
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
