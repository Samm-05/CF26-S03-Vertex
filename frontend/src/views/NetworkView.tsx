import React from 'react';
import type { InfrastructureNode, DependencyLink } from '../types';
import { DependencyGraph } from '../components/network/DependencyGraph';

interface NetworkViewProps {
  nodes: InfrastructureNode[];
  links: DependencyLink[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  onSimulateFailure: (nodeId: string) => void;
}

export const NetworkView: React.FC<NetworkViewProps> = ({
  nodes,
  links,
  selectedNodeId,
  onSelectNode,
  onSimulateFailure
}) => {
  return (
    <div className="h-[calc(100vh-4rem)] p-4 md:p-6 flex flex-col overflow-hidden">
      <DependencyGraph
        nodes={nodes}
        links={links}
        selectedNodeId={selectedNodeId}
        onSelectNode={onSelectNode}
        onSimulateFailure={onSimulateFailure}
      />
    </div>
  );
};
