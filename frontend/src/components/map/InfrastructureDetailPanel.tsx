import React from 'react';
import type { InfrastructureNode } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  X,
  Zap,
  Droplets,
  Hospital,
  Radio,
  Train,
  Shield,
  Play,
  Network,
  CheckCircle2,
  AlertOctagon
} from 'lucide-react';

interface InfrastructureDetailPanelProps {
  node: InfrastructureNode | null;
  onClose: () => void;
  onSimulateFailure: (nodeId: string) => void;
  onViewDependencies: (nodeId: string) => void;
}

export const InfrastructureDetailPanel: React.FC<InfrastructureDetailPanelProps> = ({
  node,
  onClose,
  onSimulateFailure,
  onViewDependencies
}) => {
  if (!node) return null;

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
        return Shield;
    }
  };

  const CategoryIcon = getCategoryIcon(node.category);

  return (
    <div className="w-full md:w-96 bg-[#0B2B26]/95 backdrop-blur-xl border-l border-[#8EB69B]/20 p-5 flex flex-col justify-between h-full overflow-y-auto z-20 shadow-card-depth animate-in slide-in-from-right duration-300">
      <div>
        {/* Header with Close */}
        <div className="flex items-start justify-between mb-4 pb-3 border-b border-[#8EB69B]/15">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#163832] border border-[#8EB69B]/30 flex items-center justify-center">
              <CategoryIcon size={20} className="text-[#DAF1DE]" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8EB69B]">
                {node.category} Infrastructure
              </span>
              <h2 className="text-lg font-bold text-[#DAF1DE] leading-tight">{node.name}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#163832] text-[#8EB69B] hover:text-[#DAF1DE] border border-[#8EB69B]/20 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Status & District */}
        <div className="flex items-center justify-between mb-5">
          <StatusBadge status={node.status} size="md" />
          <span className="text-xs font-mono text-[#8EB69B] px-2.5 py-1 bg-[#163832] rounded-lg border border-[#8EB69B]/20">
            {node.coordinates.district}
          </span>
        </div>

        {/* Core Specs Grid */}
        <div className="space-y-3 mb-6">
          <div className="p-3 rounded-xl bg-[#163832]/60 border border-[#8EB69B]/15 flex items-center justify-between">
            <span className="text-xs text-[#8EB69B]">Criticality Score</span>
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold font-mono text-[#DAF1DE]">
                {node.criticality} / 100
              </span>
              <div className="w-12 h-2 rounded-full bg-[#051F20] overflow-hidden">
                <div
                  className="h-full bg-[#8EB69B] rounded-full"
                  style={{ width: `${node.criticality}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#163832]/60 border border-[#8EB69B]/15 flex items-center justify-between">
            <span className="text-xs text-[#8EB69B]">Operational Capacity</span>
            <span className="text-xs font-semibold text-[#DAF1DE] font-mono">{node.capacity}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#163832]/60 border border-[#8EB69B]/15 flex items-center justify-between">
            <span className="text-xs text-[#8EB69B]">Failure Probability</span>
            <span
              className={`text-xs font-bold font-mono ${
                node.failureProbability > 15 ? 'text-[#D9A441]' : 'text-[#8EB69B]'
              }`}
            >
              {node.failureProbability}%
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#163832]/60 border border-[#8EB69B]/15 flex items-center justify-between">
            <span className="text-xs text-[#8EB69B]">Population At Risk</span>
            <span className="text-xs font-bold font-mono text-[#DAF1DE]">
              {node.populationImpact.toLocaleString()} residents
            </span>
          </div>
        </div>

        {/* Connected & Dependent Systems */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8EB69B]">
            Interconnection Network
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#163832]/40 border border-[#8EB69B]/15">
              <span className="text-[11px] text-[#8EB69B] block">Connected Systems</span>
              <span className="text-lg font-bold font-mono text-[#DAF1DE]">
                {node.connectedSystemsCount}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#163832]/40 border border-[#8EB69B]/15">
              <span className="text-[11px] text-[#8EB69B] block">Dependent Systems</span>
              <span className="text-lg font-bold font-mono text-[#DAF1DE]">
                {node.dependentSystemsCount}
              </span>
            </div>
          </div>
        </div>

        {/* Backup Systems Availability */}
        <div className="p-3 rounded-xl bg-[#163832]/40 border border-[#8EB69B]/15 mb-6">
          <div className="flex items-center space-x-2 mb-1">
            {node.backupAvailable ? (
              <CheckCircle2 size={16} className="text-[#8EB69B]" />
            ) : (
              <AlertOctagon size={16} className="text-[#C95C5C]" />
            )}
            <span className="text-xs font-semibold text-[#DAF1DE]">
              Backup Systems: {node.backupAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
            </span>
          </div>
          <p className="text-xs text-[#8EB69B]/90 pl-6">
            {node.backupDetails || 'No auxiliary backup power or reservoir installed.'}
          </p>
        </div>

        {/* Description */}
        <div className="p-3 rounded-xl bg-[#051F20]/50 border border-[#8EB69B]/10 mb-6">
          <span className="text-[10px] font-mono text-[#8EB69B] uppercase block mb-1">System Overview</span>
          <p className="text-xs text-[#8EB69B] leading-relaxed">{node.description}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-4 border-t border-[#8EB69B]/15">
        <button
          onClick={() => onSimulateFailure(node.id)}
          className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[#235347] text-[#DAF1DE] hover:bg-[#1e4840] border border-[#8EB69B]/30 font-semibold text-sm transition-all shadow-glow-sm"
        >
          <Play size={16} className="fill-[#DAF1DE]" />
          <span>Simulate Failure on Node</span>
        </button>

        <button
          onClick={() => onViewDependencies(node.id)}
          className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[#163832] text-[#8EB69B] hover:text-[#DAF1DE] border border-[#8EB69B]/20 font-medium text-xs transition-colors"
        >
          <Network size={15} />
          <span>View Dependency Path in Network</span>
        </button>
      </div>
    </div>
  );
};
