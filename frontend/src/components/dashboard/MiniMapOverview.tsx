import React from 'react';
import type { InfrastructureNode } from '../../types';
import { Map, Maximize2 } from 'lucide-react';

interface MiniMapOverviewProps {
  nodes: InfrastructureNode[];
  onOpenFullMap: () => void;
  onSelectNode: (nodeId: string) => void;
}

export const MiniMapOverview: React.FC<MiniMapOverviewProps> = ({
  nodes,
  onOpenFullMap,
  onSelectNode
}) => {
  return (
    <div className="p-5 rounded-card bg-[#0B2B26] border border-[#8EB69B]/15 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 border-b border-[#8EB69B]/10 pb-3">
        <div className="flex items-center space-x-2">
          <Map size={18} className="text-[#8EB69B]" />
          <h3 className="text-base font-semibold text-[#DAF1DE]">City Infrastructure Overview</h3>
        </div>
        <button
          onClick={onOpenFullMap}
          className="flex items-center space-x-1 text-xs text-[#8EB69B] hover:text-[#DAF1DE] bg-[#163832] px-2.5 py-1 rounded-lg border border-[#8EB69B]/20 transition-colors"
        >
          <span>Open Full Interactive Map</span>
          <Maximize2 size={13} />
        </button>
      </div>

      {/* SVG Canvas Map Graphic */}
      <div className="relative flex-1 min-h-[300px] w-full rounded-xl bg-[#051F20] border border-[#8EB69B]/20 overflow-hidden group">
        <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Fictional City Grid Waterway & Districts */}
          <path
            d="M 0,45 Q 35,50 60,35 T 100,20"
            fill="none"
            stroke="#0B2B26"
            strokeWidth="8"
            opacity="0.8"
          />
          <path
            d="M 0,45 Q 35,50 60,35 T 100,20"
            fill="none"
            stroke="#163832"
            strokeWidth="3"
            opacity="0.6"
          />

          {/* Road Network Grid */}
          <line x1="28" y1="0" x2="28" y2="100" stroke="#163832" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="72" y1="0" x2="72" y2="100" stroke="#163832" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="0" y1="35" x2="100" y2="35" stroke="#163832" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="0" y1="65" x2="100" y2="65" stroke="#163832" strokeWidth="0.5" strokeDasharray="1,1" />

          {/* Connectors between key nodes */}
          <line x1="28" y1="32" x2="38" y2="48" stroke="#8EB69B" strokeWidth="0.8" opacity="0.4" strokeDasharray="2,2" />
          <line x1="38" y1="48" x2="48" y2="62" stroke="#8EB69B" strokeWidth="0.8" opacity="0.4" strokeDasharray="2,2" />
          <line x1="28" y1="32" x2="45" y2="28" stroke="#8EB69B" strokeWidth="0.8" opacity="0.4" strokeDasharray="2,2" />
        </svg>

        {/* Render Infrastructure Node Dots */}
        <div className="absolute inset-0 p-4">
          {nodes.map((node) => {
            const isPower = node.category === 'power';
            const isWater = node.category === 'water';
            const isCritical = node.criticality >= 85;

            return (
              <button
                key={node.id}
                onClick={() => onSelectNode(node.id)}
                style={{ left: `${node.coordinates.x}%`, top: `${node.coordinates.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group/node focus:outline-none"
                title={`${node.name} (${node.category}) • Criticality: ${node.criticality}/100`}
              >
                {/* Outer Glow Ring for Critical Nodes */}
                {isCritical && (
                  <span className="absolute -inset-1.5 rounded-full bg-[#8EB69B]/30 animate-pulse-ring pointer-events-none" />
                )}

                {/* Node Marker Dot */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-200 shadow-glow-sm ${
                    isPower
                      ? 'bg-[#235347] border-[#8EB69B] text-[#DAF1DE]'
                      : isWater
                      ? 'bg-[#163832] border-[#8EB69B] text-[#8EB69B]'
                      : 'bg-[#0B2B26] border-[#8EB69B]/60 text-[#8EB69B]'
                  } group-hover/node:scale-125 group-hover/node:border-[#DAF1DE]`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#DAF1DE]" />
                </div>

                {/* Hover Label */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/node:block z-20 whitespace-nowrap bg-[#0B2B26] text-[#DAF1DE] text-[11px] font-semibold px-2 py-1 rounded-lg border border-[#8EB69B]/40 shadow-card-depth">
                  {node.name} <span className="font-mono text-[#8EB69B]">({node.criticality})</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Overlay map details badge */}
        <div className="absolute bottom-3 left-3 bg-[#0B2B26]/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#8EB69B]/20 text-[11px] text-[#8EB69B] font-mono">
          Interactive Map Live Node Feed
        </div>
      </div>
    </div>
  );
};
