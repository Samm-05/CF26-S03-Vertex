import React, { useState } from 'react';
import type { SimulationConfig, SimulationResult, InfrastructureNode } from '../types';
import { SimulationControlPanel } from '../components/simulator/SimulationControlPanel';
import { CascadePropagationView } from '../components/simulator/CascadePropagationView';
import { runCascadeSimulation } from '../utils/cascadeEngine';
import { Cpu } from 'lucide-react';

interface SimulatorViewProps {
  nodes: InfrastructureNode[];
  config: SimulationConfig;
  onChangeConfig: (config: SimulationConfig) => void;
  onSimulationComplete: (result: SimulationResult) => void;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({
  nodes,
  config,
  onChangeConfig,
  onSimulationComplete
}) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentResult, setCurrentResult] = useState<SimulationResult | null>(null);

  const handleStartSimulation = () => {
    const res = runCascadeSimulation(config);
    setCurrentResult(res);
    setIsSimulating(true);
  };

  const handleFinishAnimation = () => {
    if (currentResult) {
      onSimulationComplete(currentResult);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#8EB69B]/15 pb-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-[#8EB69B] uppercase tracking-wider mb-1">
          <Cpu size={16} />
          <span>Cascade Failure Engine</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-[#DAF1DE] tracking-tight">
          Run Cascade Simulation
        </h1>
        <p className="text-sm md:text-base text-[#8EB69B] mt-1">
          Model the impact of an infrastructure failure across the city's dependency network.
        </p>
      </div>

      {!isSimulating || !currentResult ? (
        <SimulationControlPanel
          nodes={nodes}
          config={config}
          onChangeConfig={onChangeConfig}
          onRunSimulation={handleStartSimulation}
        />
      ) : (
        <CascadePropagationView
          result={currentResult}
          onFinishAnimation={handleFinishAnimation}
        />
      )}
    </div>
  );
};
