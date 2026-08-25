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
  GraduationCap,
  Factory,
  Play,
  Network,
  CheckCircle2,
  AlertOctagon,
  MapPin,
  RefreshCw,
  Gauge,
  MousePointerClick,
  GitCommit,
  Check
} from 'lucide-react';

interface InfrastructureDetailPanelProps {
  node: InfrastructureNode | null;
  allNodes?: InfrastructureNode[];
  traceTargetNodeId?: string | null;
  onSelectTraceTarget?: (nodeId: string | null) => void;
  onClose: () => void;
  onSimulateFailure: (nodeId: string) => void;
  onViewDependencies: (nodeId: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  power: Zap,
  water: Droplets,
  telecom: Radio,
  healthcare: Hospital,
  transport: Train,
  emergency: Shield,
  schools: GraduationCap,
  residential: GraduationCap,
  industrial: Factory
};

export const InfrastructureDetailPanel: React.FC<InfrastructureDetailPanelProps> = ({
  node,
  allNodes = [],
  traceTargetNodeId = null,
  onSelectTraceTarget,
  onClose,
  onSimulateFailure,
  onViewDependencies
}) => {
  // Empty / Prompt state when no node is selected
  if (!node) {
    return (
      <div className="w-full md:w-96 bg-[#0B2B26]/98 backdrop-blur-xl border-l border-[#8EB69B]/20 flex flex-col justify-between h-full z-30 shadow-card-depth animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-[#8EB69B]/15 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#163832] border border-[#8EB69B]/30 flex items-center justify-center text-[#8EB69B] shadow-sm">
            <MousePointerClick size={20} className="text-[#5eead4] animate-bounce" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8EB69B]">
              Command Inspector
            </span>
            <h2 className="text-base font-bold text-[#DAF1DE]">No Asset Selected</h2>
          </div>
        </div>

        {/* Body Prompt Message */}
        <div className="p-6 flex flex-col items-center justify-center text-center space-y-4 my-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#163832]/60 border border-[#8EB69B]/20 flex items-center justify-center text-[#5eead4] shadow-inner">
            <Shield size={32} className="opacity-80" />
          </div>
          <div className="space-y-1.5 max-w-[260px]">
            <h3 className="text-sm font-bold text-[#DAF1DE]">
              Select a Node on the Map
            </h3>
            <p className="text-xs text-[#8EB69B] leading-relaxed">
              Click any infrastructure marker across the city to view live telemetry, evaluate single-point vulnerabilities, and arm for cascade failure simulation.
            </p>
          </div>
        </div>

        {/* Disabled CTA Footer */}
        <div className="p-5 border-t border-[#8EB69B]/20 bg-[#07211D] space-y-2">
          <button
            type="button"
            disabled={true}
            className="w-full flex items-center justify-center space-x-2 py-3 px-3 rounded-xl bg-[#163832]/50 text-[#8EB69B]/40 border border-[#8EB69B]/10 font-semibold text-xs transition-all cursor-not-allowed select-none"
          >
            <Play size={14} className="opacity-40" />
            <span>Simulate Failure (Select Node)</span>
          </button>
        </div>
      </div>
    );
  }

  const CategoryIcon = CATEGORY_ICONS[node.category] || Shield;

  // Compute load percentage if numeric values exist
  const loadPercentage =
    node.capacityNumeric && node.currentLoad
      ? Math.min(100, Math.round((node.currentLoad / node.capacityNumeric) * 100))
      : null;

  // Downstream dependent nodes available for multi-select trace
  const downstreamCandidates = allNodes.filter(
    (n) => n.id !== node.id && (node.dependents?.includes(n.id) || node.level < n.level)
  );

  const traceTargetNode = allNodes.find((n) => n.id === traceTargetNodeId);

  return (
    <div className="w-full md:w-96 bg-[#0B2B26]/98 backdrop-blur-xl border-l border-[#8EB69B]/20 flex flex-col h-full z-30 shadow-card-depth animate-in slide-in-from-right duration-300">
      {/* 1. Fixed Header */}
      <div className="p-4 md:p-5 pb-3 border-b border-[#8EB69B]/15 flex-shrink-0 flex items-start justify-between">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#163832] border border-[#8EB69B]/30 flex items-center justify-center text-[#5eead4] shadow-sm flex-shrink-0">
            <CategoryIcon size={20} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8EB69B] truncate block">
              {node.category} Infrastructure
            </span>
            <h2 className="text-base md:text-lg font-bold text-[#DAF1DE] leading-tight truncate">
              {node.name}
            </h2>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg bg-[#163832] text-[#8EB69B] hover:text-[#DAF1DE] hover:bg-[#235347] border border-[#8EB69B]/20 transition-colors cursor-pointer flex-shrink-0 ml-2"
          title="Deselect Node"
        >
          <X size={16} />
        </button>
      </div>

      {/* 2. Scrollable Body Content */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4 md:p-5 space-y-4">
        {/* Status, District & Coordinates */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <StatusBadge status={node.status} size="md" />
            <span className="text-xs font-mono text-[#8EB69B] px-2.5 py-1 bg-[#163832] rounded-lg border border-[#8EB69B]/20">
              {node.coordinates.district}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 text-[11px] font-mono text-[#8EB69B]/90 bg-[#051F20]/70 px-2.5 py-1 rounded-lg border border-[#8EB69B]/15">
            <MapPin size={12} className="text-[#5eead4] flex-shrink-0" />
            <span>GPS: {node.lat.toFixed(4)}° N, {node.lng.toFixed(4)}° E</span>
          </div>
        </div>

        {/* Multi-Select Cascade Path Trace Box */}
        {onSelectTraceTarget && (
          <div className="p-3.5 rounded-xl bg-[#163832]/70 border border-[#8EB69B]/25 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-[#DAF1DE] flex items-center space-x-1.5">
                <GitCommit size={13} className="text-[#5eead4]" />
                <span>Cascade Path Trace</span>
              </span>
              {traceTargetNodeId && (
                <button
                  type="button"
                  onClick={() => onSelectTraceTarget(null)}
                  className="text-[10px] font-mono text-[#f87171] hover:underline cursor-pointer"
                >
                  Clear Target
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-[#8EB69B] block">
                Trace propagation toward downstream asset:
              </label>
              <select
                value={traceTargetNodeId || ''}
                onChange={(e) => onSelectTraceTarget(e.target.value || null)}
                className="w-full bg-[#0B2B26] text-[#DAF1DE] font-semibold text-xs p-2.5 rounded-lg border border-[#8EB69B]/30 focus:border-[#5eead4] focus:outline-none cursor-pointer"
              >
                <option value="">-- Direct Dependencies Only --</option>
                {downstreamCandidates.map((cand) => (
                  <option key={cand.id} value={cand.id}>
                    Target: {cand.name.split(' (')[0]} ({cand.coordinates.district})
                  </option>
                ))}
              </select>
            </div>

            {traceTargetNode && (
              <div className="p-2 rounded-lg bg-[#051F20]/90 border border-[#5eead4]/40 text-[11px] font-mono text-[#DAF1DE] flex items-center justify-between">
                <span>
                  <strong className="text-[#f87171]">Origin:</strong> {node.name.split(' (')[0]}
                  {' ➔ '}
                  <strong className="text-[#5eead4]">Target:</strong> {traceTargetNode.name.split(' (')[0]}
                </span>
                <Check size={13} className="text-[#5eead4]" />
              </div>
            )}
          </div>
        )}

        {/* Core Specs Grid */}
        <div className="space-y-2.5">
          {/* Criticality Score */}
          <div className="p-3 rounded-xl bg-[#163832]/60 border border-[#8EB69B]/15 flex items-center justify-between">
            <span className="text-xs text-[#8EB69B]">Criticality Score</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm md:text-base font-bold font-mono text-[#DAF1DE]">
                {node.criticality} / 100
              </span>
              <div className="w-12 h-2 rounded-full bg-[#051F20] overflow-hidden">
                <div
                  className="h-full bg-[#5eead4] rounded-full transition-all"
                  style={{ width: `${node.criticality}%` }}
                />
              </div>
            </div>
          </div>

          {/* Operational Capacity vs Load */}
          <div className="p-3 rounded-xl bg-[#163832]/60 border border-[#8EB69B]/15 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8EB69B] flex items-center space-x-1">
                <Gauge size={13} className="text-[#8EB69B]" />
                <span>Operational Capacity</span>
              </span>
              <span className="text-xs font-semibold text-[#DAF1DE] font-mono">{node.capacity}</span>
            </div>

            {loadPercentage !== null && (
              <div className="space-y-1 pt-1 border-t border-[#8EB69B]/10">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#8EB69B]/80">Current Load Usage</span>
                  <span className="font-mono font-medium text-[#DAF1DE]">
                    {node.currentLoad} ({loadPercentage}%)
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#051F20] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      loadPercentage > 90
                        ? 'bg-[#C95C5C]'
                        : loadPercentage > 75
                        ? 'bg-[#D9A441]'
                        : 'bg-[#5eead4]'
                    }`}
                    style={{ width: `${loadPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Failure Probability */}
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

          {/* Population At Risk */}
          <div className="p-3 rounded-xl bg-[#163832]/60 border border-[#8EB69B]/15 flex items-center justify-between">
            <span className="text-xs text-[#8EB69B]">Population At Risk</span>
            <span className="text-xs font-bold font-mono text-[#DAF1DE]">
              {node.populationImpact.toLocaleString()} residents
            </span>
          </div>
        </div>

        {/* Connected & Dependent Systems */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8EB69B]">
            Interconnection Network
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-[#163832]/40 border border-[#8EB69B]/15">
              <span className="text-[11px] text-[#8EB69B] block">Feeds Outward To</span>
              <span className="text-base font-bold font-mono text-[#DAF1DE]">
                {node.dependentSystemsCount} systems
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#163832]/40 border border-[#8EB69B]/15">
              <span className="text-[11px] text-[#8EB69B] block">Depends On</span>
              <span className="text-base font-bold font-mono text-[#DAF1DE]">
                {node.dependencies.length} sources
              </span>
            </div>
          </div>
        </div>

        {/* Redundancy & Backup Systems Availability */}
        <div className="p-3 rounded-xl bg-[#163832]/40 border border-[#8EB69B]/15 space-y-2">
          <div className="flex items-center space-x-2">
            {node.backupAvailable ? (
              <CheckCircle2 size={15} className="text-[#5eead4]" />
            ) : (
              <AlertOctagon size={15} className="text-[#C95C5C]" />
            )}
            <span className="text-xs font-semibold text-[#DAF1DE]">
              Auxiliary Backup: {node.backupAvailable ? 'ACTIVE' : 'UNAVAILABLE'}
            </span>
          </div>
          <p className="text-xs text-[#8EB69B]/90 pl-5">
            {node.backupDetails || 'No auxiliary backup power or reservoir installed.'}
          </p>

          {node.redundancySources && node.redundancySources.length > 0 && (
            <div className="pt-1.5 pl-5 border-t border-[#8EB69B]/10 flex items-center space-x-1.5 text-[11px] text-[#8EB69B]">
              <RefreshCw size={12} className="text-[#5eead4]" />
              <span>Failover: <strong className="text-[#DAF1DE]">{node.redundancySources.join(', ')}</strong></span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="p-3 rounded-xl bg-[#051F20]/50 border border-[#8EB69B]/10">
          <span className="text-[10px] font-mono text-[#8EB69B] uppercase block mb-1">System Overview</span>
          <p className="text-xs text-[#8EB69B] leading-relaxed">{node.description}</p>
        </div>
      </div>

      {/* 3. Fixed Sticky Action Buttons Footer */}
      <div className="p-4 md:p-5 pt-3 border-t border-[#8EB69B]/20 bg-[#07211D] flex-shrink-0 space-y-2 z-20 shadow-lg">
        <button
          type="button"
          onClick={() => onSimulateFailure(node.id)}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-[#235347] text-[#DAF1DE] hover:bg-[#2d695a] border border-[#5eead4]/40 font-semibold text-xs md:text-sm transition-all shadow-glow-sm cursor-pointer active:scale-[0.98]"
        >
          <Play size={15} className="fill-[#DAF1DE]" />
          <span>Simulate Failure on {node.name.split(' (')[0]}</span>
        </button>

        <button
          type="button"
          onClick={() => onViewDependencies(node.id)}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-[#163832] text-[#8EB69B] hover:text-[#DAF1DE] hover:bg-[#1a453e] border border-[#8EB69B]/20 font-medium text-xs transition-colors cursor-pointer active:scale-[0.98]"
        >
          <Network size={14} />
          <span>View Dependency Path in Network</span>
        </button>
      </div>
    </div>
  );
};
