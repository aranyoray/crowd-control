'use client';

import { useState } from 'react';
import CrowdLeafSimulator from '@/components/CrowdLeafSimulator';

export default function Home() {
  const [selectedAirport, setSelectedAirport] = useState('ATL');
  const [agentCount, setAgentCount] = useState(650);
  const [isRunning, setIsRunning] = useState(false);

  const airports = [
    { id: 'ATL', name: 'Atlanta (ATL) Concourse T - International', agents: 650 },
    { id: 'ORD', name: 'Chicago O\'Hare (ORD) Terminal 5', agents: 700 },
    { id: 'DXB', name: 'Dubai (DXB) Terminal 3 Concourse A', agents: 900 },
    { id: 'IAH', name: 'Houston (IAH) Terminal E - International', agents: 600 },
    { id: 'IAD', name: 'Washington Dulles (IAD) Concourse C', agents: 500 },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-md border-b-4 border-green-500">
        <div className="container mx-auto px-6 py-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🌿 CrowdLeaf: Airport Crowd Simulator
          </h1>
          <p className="text-lg text-gray-600">
            Biomimetic Algorithm Inspired by Mimosa Pudica Touch-Me-Not Plant
          </p>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="container mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Airport Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Airport
              </label>
              <select
                value={selectedAirport}
                onChange={(e) => {
                  setSelectedAirport(e.target.value);
                  const airport = airports.find(a => a.id === e.target.value);
                  if (airport) setAgentCount(airport.agents);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {airports.map((airport) => (
                  <option key={airport.id} value={airport.id}>
                    {airport.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Agent Count Slider */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Passengers: {agentCount}
              </label>
              <input
                type="range"
                min="100"
                max="1500"
                step="50"
                value={agentCount}
                onChange={(e) => setAgentCount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>100</span>
                <span>1500</span>
              </div>
            </div>

            {/* Start Button */}
            <div className="flex items-end">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`w-full px-6 py-3 rounded-lg font-semibold text-white transition-all ${
                  isRunning
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isRunning ? '⏸ Pause Simulation' : '▶ Start Simulation'}
              </button>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-4 shadow">
            <h3 className="font-bold text-green-800 mb-2">✅ With CrowdLeaf</h3>
            <p className="text-sm text-green-700">
              Biomimetic adaptive routing with timed gate control
            </p>
          </div>
          <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-lg p-4 shadow">
            <h3 className="font-bold text-red-800 mb-2">❌ Without CrowdLeaf</h3>
            <p className="text-sm text-red-700">
              Standard nearest-exit evacuation heuristic
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-4 shadow">
            <h3 className="font-bold text-blue-800 mb-2">📊 Real-Time Metrics</h3>
            <p className="text-sm text-blue-700">
              Track injuries, deaths, density, and evacuation progress
            </p>
          </div>
        </div>

        {/* Simulator Component */}
        <CrowdLeafSimulator
          airport={selectedAirport}
          agentCount={agentCount}
          isRunning={isRunning}
        />

        {/* Research Info */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🔬 Scientific Background & Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-green-700 mb-2">
                Mathematical Models
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <strong>Sigmoidal Activation:</strong> Ant colony threshold response (PNAS 2022)
                </li>
                <li>
                  <strong>Crowdedness Formula:</strong> F_i = (F_i,r + F_i,w + F_i,in)/F_i,max × T_i
                </li>
                <li>
                  <strong>Boolean Propagation:</strong> Action potential logic (2011 model)
                </li>
                <li>
                  <strong>Timed Gate Control:</strong> 3-phase open/redirect/closed states
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-700 mb-2">
                Real Terminal Layouts
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✈️ <strong>DFW Terminal D:</strong> 14 international gates, 5 exits</li>
                <li>✈️ <strong>ATL Concourse T:</strong> 20 gates, dual-row layout</li>
                <li>✈️ <strong>DXB Terminal 3:</strong> 22 gates, massive duty-free area</li>
                <li>✈️ <strong>DEL Terminal 3:</strong> 18 gates, multi-security layout</li>
                <li>✈️ <strong>IAD Concourse C/D:</strong> 10 gates, AeroTrain station</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-purple-700 mb-2">
                Visualization Features
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>🌡️ <strong>Heatmap:</strong> White → Yellow → Orange → Red density gradient</li>
                <li>🏢 <strong>Terminal Features:</strong> Gates, security, shops, baggage claims</li>
                <li>👥 <strong>Crowd Flow:</strong> Real-time agent-based simulation</li>
                <li>📊 <strong>Data-Driven:</strong> Based on actual airport layouts</li>
                <li>🎯 <strong>CrowdLeaf Control:</strong> Adaptive exit management</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">
            CrowdLeaf - Biomimetic Crowd Control Algorithm | Research-Based Implementation
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Based on Mimosa pudica thigmonasty, ant colony sensing, and AI passenger flow research
          </p>
        </div>
      </footer>
    </main>
  );
}
