import React from 'react';
import type { InfrastructureNode } from '../../types';
import { Zap, Droplets, Radio, Hospital, Train, ChevronRight } from 'lucide-react';

interface CriticalInfrastructureRankingProps {
  nodes: InfrastructureNode[];
  onSelectNode: (nodeId: string) => void;
}

export const CriticalInfrastructureRanking: React.FC<CriticalInfrastructureRankingProps> = ({
  nodes,
  onSelectNode
}) => {
  // Sort nodes by criticality descending and take top 5
  const topCriticalNodes = [...nodes]
    .sort((a, b) => b.criticality - a.criticality)
    .slice(0, 5);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'power':
        return Zap;
      case 'water':
        return Droplets;
      case 'telecom':
        return Radio;
      case 'healthcare':
        return Hospital;
      case 'transport':
        return Train;
      default:
        return Zap;
    }
  };

  return (
    <div className="p-5 rounded-card bg-[#0B2B26] border border-[#8EB69B]/15">
      <div className="flex items-center justify-between mb-4 border-b border-[#8EB69B]/10 pb-3">
        <div>
          <h3 className="text-base font-semibold text-[#DAF1DE]">Critical Infrastructure</h3>
          <p className="text-xs text-[#8EB69B]">Ranked by systemic cascade criticality impact</p>
        </div>
        <span className="text-xs font-mono text-[#8EB69B] px-2 py-0.5 bg-[#163832] rounded">
          Top 5 Vulnerable
        </span>
      </div>

      <div className="space-y-3">
        {topCriticalNodes.map((node, index) => {
          const Icon = getCategoryIcon(node.category);
          const rankLabel = String(index + 1).padStart(2, '0');

          return (
            <div
              key={node.id}
              onClick={() => onSelectNode(node.id)}
              className="p-3 rounded-xl bg-[#163832]/60 hover:bg-[#163832] border border-[#8EB69B]/15 hover:border-[#8EB69B]/40 transition-all duration-200 cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3.5 min-w-0">
                <span className="text-xs font-bold font-mono text-[#8EB69B] group-hover:text-[#DAF1DE]">
                  {rankLabel}
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#051F20] border border-[#8EB69B]/20 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-[#8EB69B]" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-[#DAF1DE] truncate group-hover:text-[#DAF1DE]">
                    {node.name}
                  </h4>
                  <p className="text-xs text-[#8EB69B]/80 truncate">
                    {node.dependentSystemsCount} dependent systems • {node.coordinates.district}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0 ml-3">
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-[#DAF1DE]">
                    {node.criticality}
                  </span>
                  <span className="text-[10px] text-[#8EB69B] block font-mono">/ 100</span>
                </div>
                <div className="w-16 h-2 rounded-full bg-[#051F20] overflow-hidden hidden sm:block">
                  <div
                    className="h-full bg-[#8EB69B] rounded-full"
                    style={{ width: `${node.criticality}%` }}
                  />
                </div>
                <ChevronRight size={16} className="text-[#8EB69B] group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
