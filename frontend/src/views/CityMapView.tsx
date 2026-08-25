import React, { useState } from 'react';
import type { InfrastructureNode, InfrastructureStatus } from '../types';
import { LeafletCityMap } from '../components/map/LeafletCityMap';
import { InfrastructureDetailPanel } from '../components/map/InfrastructureDetailPanel';
import { Map } from 'lucide-react';

interface CityMapViewProps {
  nodes: InfrastructureNode[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  traceTargetNodeId?: string | null;
  onSelectTraceTarget?: (nodeId: string | null) => void;
  onSimulateFailure: (nodeId: string) => void;
  onViewDependencies: (nodeId: string) => void;
  simulatedStatuses?: Record<string, InfrastructureStatus>;
}

export const CityMapView: React.FC<CityMapViewProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  traceTargetNodeId = null,
  onSelectTraceTarget,
  onSimulateFailure,
  onViewDependencies,
  simulatedStatuses = {}
}) => {
  const [filteredCount, setFilteredCount] = useState<number>(nodes.length);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden relative">
      {/* Main Interactive Map Viewport */}
      <div className="flex-1 p-4 md:p-6 flex flex-col h-full overflow-hidden min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#8EB69B] uppercase tracking-wider mb-0.5">
              <Map size={14} className="text-[#5eead4]" />
              <span>Interactive Spatial Grid</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-[#DAF1DE]">City Infrastructure Map</h1>
          </div>
          <div className="text-xs text-[#8EB69B] bg-[#0B2B26] px-3.5 py-1.5 rounded-xl border border-[#8EB69B]/20 font-mono shadow-sm flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#5eead4] animate-pulse" />
            <span>{filteredCount} Live Asset Markers</span>
          </div>
        </div>

        {/* Real Geographic Map Canvas */}
        <div className="flex-1 w-full relative overflow-hidden rounded-card">
          <LeafletCityMap
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onSelectNode={(id) => onSelectNode(id)}
            traceTargetNodeId={traceTargetNodeId}
            onSelectTraceTarget={onSelectTraceTarget}
            onSimulateFailure={onSimulateFailure}
            onViewDependencies={onViewDependencies}
            simulatedStatuses={simulatedStatuses}
            onFilteredCountChange={setFilteredCount}
          />
        </div>
      </div>

      {/* Right Infrastructure Detail / Prompt Panel */}
      <InfrastructureDetailPanel
        node={selectedNode}
        allNodes={nodes}
        traceTargetNodeId={traceTargetNodeId}
        onSelectTraceTarget={onSelectTraceTarget}
        onClose={() => onSelectNode(null)}
        onSimulateFailure={onSimulateFailure}
        onViewDependencies={onViewDependencies}
      />
    </div>
  );
};
export default CityMapView;
