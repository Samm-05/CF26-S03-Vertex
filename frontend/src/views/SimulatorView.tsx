import React from 'react';
import type { SimulationConfig, SimulationResult, InfrastructureNode } from '../types';
import { CascadeSimulatorScreen } from '../features/cascade-simulator/CascadeSimulatorScreen';

interface SimulatorViewProps {
  nodes: InfrastructureNode[];
  config: SimulationConfig;
  onChangeConfig: (config: SimulationConfig) => void;
  onSimulationComplete: (result: SimulationResult) => void;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({
  nodes,
  config,
  onSimulationComplete
}) => {
  return (
    <CascadeSimulatorScreen
      nodes={nodes}
      initialConfig={config}
      onSimulationComplete={onSimulationComplete}
    />
  );
};

