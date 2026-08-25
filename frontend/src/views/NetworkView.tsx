import React from 'react';
import type { InfrastructureNode, DependencyLink } from '../types';
import { DependencyNetworkScreen } from '../features/dependency-network/DependencyNetworkScreen';

interface NetworkViewProps {
  nodes: InfrastructureNode[];
  links: DependencyLink[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  onSimulateFailure: (nodeId: string) => void;
  onNavigateToResults?: () => void;
  simulatedStatuses?: Record<string, string>;
}

export const NetworkView: React.FC<NetworkViewProps> = ({
  selectedNodeId,
  onSelectNode,
  onSimulateFailure,
  onNavigateToResults,
  simulatedStatuses
}) => {
  return (
    <DependencyNetworkScreen
      selectedNodeId={selectedNodeId}
      onSelectNode={onSelectNode}
      onSimulateFailure={onSimulateFailure}
      onNavigateToResults={onNavigateToResults}
      simulatedStatuses={simulatedStatuses}
    />
  );
};
export default NetworkView;
