import React, { useState } from 'react';
import FleetOptimizer from './components/FleetOptimizer';
import SingleInstance from './components/SingleInstance';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'fleet' | 'single'>('fleet');

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">☁️ Cloud Cost Optimizer</h1>
          <p className="text-xl text-white/90">Find the cheapest cloud configuration for your workload</p>
        </header>

        <div className="flex justify-center mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-1 inline-flex">
            <button
              onClick={() => setActiveTab('fleet')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'fleet'
                  ? 'bg-white text-primary-600 shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Fleet Optimization
            </button>
            <button
              onClick={() => setActiveTab('single')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'single'
                  ? 'bg-white text-primary-600 shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Single Instance
            </button>
          </div>
        </div>

        {activeTab === 'fleet' ? <FleetOptimizer /> : <SingleInstance />}
      </div>
    </div>
  );
}

export default App;