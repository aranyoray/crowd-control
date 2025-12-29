'use client';

import { useEffect, useRef, useState } from 'react';
import { runSimulation, SimulationMetrics } from '@/lib/simulation';

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let simulations = runSimulation(airport, agentCount);

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
      simulations = runSimulation(airport, agentCount, simulations.time + 0.1);
      
      setMetricsWithout(simulations.without);
      setMetricsWith(simulations.with);

      // Draw visualizations
      drawSimulation(ctx, simulations.without, 0, false);
      drawSimulation(ctx, simulations.with, canvas.width / 2, true);

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
    metrics: SimulationMetrics,
    offsetX: number,
    isCrowdLeaf: boolean
  ) => {
    const agentColor = isCrowdLeaf ? '#22c55e' : '#ef4444';
    
    // Draw agents (simplified)
    for (let i = 0; i < metrics.agentsEvacuated; i++) {
      const x = offsetX + Math.random() * (ctx.canvas.width / 2 - 40) + 20;
      const y = 100 + Math.random() * (ctx.canvas.height - 200);
      
      ctx.fillStyle = agentColor;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
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
