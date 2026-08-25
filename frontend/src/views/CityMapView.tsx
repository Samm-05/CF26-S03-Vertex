import React from 'react';
import type { InfrastructureNode } from '../types';
import { InfrastructureMap } from '../components/map/InfrastructureMap';
import { InfrastructureDetailPanel } from '../components/map/InfrastructureDetailPanel';
import { Map } from 'lucide-react';

interface CityMapViewProps {
  nodes: InfrastructureNode[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  onSimulateFailure: (nodeId: string) => void;
  onViewDependencies: (nodeId: string) => void;
}

export const CityMapView: React.FC<CityMapViewProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  onSimulateFailure,
  onViewDependencies
}) => {
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden relative">
      {/* Main Interactive Map Viewport */}
      <div className="flex-1 p-4 md:p-6 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#8EB69B] uppercase tracking-wider mb-0.5">
              <Map size={14} />
              <span>Interactive Spatial Grid</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-[#DAF1DE]">City Infrastructure Map</h1>
          </div>
          <div className="text-xs text-[#8EB69B] bg-[#0B2B26] px-3 py-1.5 rounded-xl border border-[#8EB69B]/20 font-mono">
            {nodes.length} Live Asset Markers
          </div>
        </div>

        {/* Map Canvas */}
        <div className="flex-1 w-full relative overflow-hidden">
          <InfrastructureMap
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onSelectNode={(id) => onSelectNode(id)}
          />
        </div>
      </div>

      {/* Slide-over Infrastructure Detail Panel */}
      {selectedNode && (
        <InfrastructureDetailPanel
          node={selectedNode}
          onClose={() => onSelectNode(null)}
          onSimulateFailure={onSimulateFailure}
          onViewDependencies={onViewDependencies}
        />
      )}
    </div>
  );
};
