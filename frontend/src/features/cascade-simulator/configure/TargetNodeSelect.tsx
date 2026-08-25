import React from 'react';
import type { InfrastructureNode } from '../../../types';
import { ChevronDown, Network } from 'lucide-react';

interface TargetNodeSelectProps {
  nodes: InfrastructureNode[];
  selectedNodeId: string;
  onChangeNodeId: (nodeId: string) => void;
}

export const TargetNodeSelect: React.FC<TargetNodeSelectProps> = ({
  nodes,
  selectedNodeId,
  onChangeNodeId
}) => {
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];
  const downstreamCount = selectedNode?.dependents?.length ?? 4;

  return (
    <div className="p-5 rounded-2xl bg-[#0B2B26]/90 border border-[#8EB69B]/20 shadow-card-depth space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <span className="w-5 h-5 rounded-full bg-[#163832] text-[#DAF1DE] flex items-center justify-center text-xs font-bold font-mono border border-[#8EB69B]/30">
            1
          </span>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#DAF1DE]">
            Select Target Infrastructure Node
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#8EB69B] uppercase tracking-wide">
          Source of Failure
        </span>
      </div>

      {/* Select Dropdown */}
      <div className="relative">
        <select
          value={selectedNodeId}
          onChange={(e) => onChangeNodeId(e.target.value)}
          className="w-full appearance-none bg-[#163832] text-[#DAF1DE] font-semibold text-sm px-4 py-3.5 pr-10 rounded-xl border border-[#8EB69B]/30 hover:border-[#8EB69B]/50 focus:border-[#5eead4] focus:outline-none transition-all cursor-pointer shadow-inner"
        >
          {nodes.map((node) => (
            <option key={node.id} value={node.id} className="bg-[#0B2B26] text-[#DAF1DE] py-1">
              {node.name} (Criticality {node.criticality})
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8EB69B] pointer-events-none"
        />
      </div>

      {/* Node Summary Chip */}
      {selectedNode && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-[#051F20]/70 border border-[#8EB69B]/15 text-xs">
          <div className="flex items-center space-x-2 text-[#DAF1DE]">
            <span className="font-semibold">{selectedNode.name.split(' (')[0]}</span>
            <span className="text-[#8EB69B]">•</span>
            <span className="text-[#8EB69B] font-mono">{selectedNode.coordinates.district}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-[#8EB69B] font-mono text-[11px]">
            <Network size={13} className="text-[#5eead4]" />
            <span>{downstreamCount} direct downstream systems</span>
          </div>
        </div>
      )}
    </div>
  );
};
