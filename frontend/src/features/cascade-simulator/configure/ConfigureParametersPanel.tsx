import React from 'react';
import type { SimulationConfig } from '../types';
import type { InfrastructureNode } from '../../../types';
import { TargetNodeSelect } from './TargetNodeSelect';
import { SeveritySlider } from './SeveritySlider';
import { DurationInput } from './DurationInput';
import { ConditionsGrid } from './ConditionsGrid';
import { ExpectedPathwayPanel } from './ExpectedPathwayPanel';
import { useCascadePreview } from './useCascadePreview';

interface ConfigureParametersPanelProps {
  nodes: InfrastructureNode[];
  config: SimulationConfig;
  onChangeConfig: (config: SimulationConfig) => void;
  onRunSimulation: () => void;
}

export const ConfigureParametersPanel: React.FC<ConfigureParametersPanelProps> = ({
  nodes,
  config,
  onChangeConfig,
  onRunSimulation
}) => {
  const previewSteps = useCascadePreview(config);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Left 4-section stacked form */}
      <div className="lg:col-span-7 space-y-4">
        {/* Section 1: Target Node */}
        <TargetNodeSelect
          nodes={nodes}
          selectedNodeId={config.targetNodeId}
          onChangeNodeId={(nodeId) => onChangeConfig({ ...config, targetNodeId: nodeId })}
        />

        {/* Section 2: Severity Percentage */}
        <SeveritySlider
          severity={config.severityPercent}
          onChangeSeverity={(severity) => onChangeConfig({ ...config, severityPercent: severity })}
        />

        {/* Section 3: Failure Duration */}
        <DurationInput
          durationHours={config.durationHours}
          onChangeDuration={(hours) => onChangeConfig({ ...config, durationHours: hours })}
        />

        {/* Section 4: Conditions Grid */}
        <ConditionsGrid
          conditions={config.conditions}
          onChangeConditions={(conditions) => onChangeConfig({ ...config, conditions })}
        />
      </div>

      {/* Right Expected Pathway Panel */}
      <div className="lg:col-span-5 h-full">
        <ExpectedPathwayPanel
          previewSteps={previewSteps}
          onRunSimulation={onRunSimulation}
        />
      </div>
    </div>
  );
};
