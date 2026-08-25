import React from 'react';
import type { ComparisonResult } from '../../types';
import { ShieldCheck, Users, Network, Hospital, Clock } from 'lucide-react';

interface BeforeAfterComparisonProps {
  comparison: ComparisonResult;
}

export const BeforeAfterComparison: React.FC<BeforeAfterComparisonProps> = ({ comparison }) => {
  const { withoutIntervention, withIntervention, improvements, appliedIntervention } = comparison;

  return (
    <div className="p-6 rounded-card bg-[#0B2B26] border border-[#8EB69B]/20 space-y-6">
      <div className="flex items-center justify-between border-b border-[#8EB69B]/15 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#8EB69B] uppercase tracking-wider mb-1">
            <ShieldCheck size={16} />
            <span>Comparative Resilience Evaluation</span>
          </div>
          <h3 className="text-xl font-bold text-[#DAF1DE]">Before / After Intervention Comparison</h3>
          <p className="text-xs text-[#8EB69B]">
            Applied Mitigation: <span className="text-[#DAF1DE] font-semibold">{appliedIntervention.title}</span>
          </p>
        </div>
        <span className="text-xs font-mono text-[#DAF1DE] px-3 py-1 bg-[#235347] rounded-full border border-[#8EB69B]/30 font-bold">
          -{(improvements.populationReductionPercent).toFixed(1)}% Pop Risk Reduction
        </span>
      </div>

      {/* Side-by-side comparative panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WITHOUT INTERVENTION */}
        <div className="p-5 rounded-xl bg-[#C95C5C]/10 border border-[#C95C5C]/30 space-y-4">
          <div className="flex items-center justify-between border-b border-[#C95C5C]/20 pb-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#C95C5C]">
              WITHOUT INTERVENTION
            </h4>
            <span className="text-[10px] font-mono text-[#C95C5C] px-2 py-0.5 bg-[#C95C5C]/20 rounded">
              Baseline Outage
            </span>
          </div>

          <div className="space-y-3 font-mono text-sm">
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#051F20]/60 border border-[#C95C5C]/20">
              <span className="text-[#8EB69B] text-xs flex items-center gap-1.5 font-sans">
                <Users size={14} className="text-[#C95C5C]" /> Population Affected
              </span>
              <span className="font-bold text-[#DAF1DE]">
                {(withoutIntervention.populationAffected / 1000).toFixed(0)}K
              </span>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#051F20]/60 border border-[#C95C5C]/20">
              <span className="text-[#8EB69B] text-xs flex items-center gap-1.5 font-sans">
                <Network size={14} className="text-[#C95C5C]" /> Infrastructure Affected
              </span>
              <span className="font-bold text-[#DAF1DE]">
                {withoutIntervention.infrastructureAffected} nodes
              </span>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#051F20]/60 border border-[#C95C5C]/20">
              <span className="text-[#8EB69B] text-xs flex items-center gap-1.5 font-sans">
                <Hospital size={14} className="text-[#C95C5C]" /> Hospitals Affected
              </span>
              <span className="font-bold text-[#DAF1DE]">
                {withoutIntervention.hospitalsAffected} facilities
              </span>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#051F20]/60 border border-[#C95C5C]/20">
              <span className="text-[#8EB69B] text-xs flex items-center gap-1.5 font-sans">
                <Clock size={14} className="text-[#C95C5C]" /> Recovery Time
              </span>
              <span className="font-bold text-[#DAF1DE]">
                {withoutIntervention.recoveryHours} hours
              </span>
            </div>
          </div>
        </div>

        {/* WITH INTERVENTION */}
        <div className="p-5 rounded-xl bg-[#235347]/30 border border-[#8EB69B]/40 space-y-4 shadow-glow-sm">
          <div className="flex items-center justify-between border-b border-[#8EB69B]/30 pb-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#DAF1DE]">
              WITH INTERVENTION
            </h4>
            <span className="text-[10px] font-mono text-[#DAF1DE] px-2 py-0.5 bg-[#235347] rounded border border-[#8EB69B]/40">
              Mitigated State
            </span>
          </div>

          <div className="space-y-3 font-mono text-sm">
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#163832] border border-[#8EB69B]/30">
              <span className="text-[#8EB69B] text-xs flex items-center gap-1.5 font-sans">
                <Users size={14} className="text-[#8EB69B]" /> Population Affected
              </span>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-[#DAF1DE]">
                  {(withIntervention.populationAffected / 1000).toFixed(0)}K
                </span>
                <span className="text-xs text-[#DAF1DE] font-semibold px-1.5 py-0.5 rounded bg-[#235347]">
                  -{improvements.populationReductionPercent}%
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#163832] border border-[#8EB69B]/30">
              <span className="text-[#8EB69B] text-xs flex items-center gap-1.5 font-sans">
                <Network size={14} className="text-[#8EB69B]" /> Infrastructure Affected
              </span>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-[#DAF1DE]">
                  {withIntervention.infrastructureAffected} nodes
                </span>
                <span className="text-xs text-[#DAF1DE] font-semibold px-1.5 py-0.5 rounded bg-[#235347]">
                  -{improvements.infrastructureReductionPercent}%
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#163832] border border-[#8EB69B]/30">
              <span className="text-[#8EB69B] text-xs flex items-center gap-1.5 font-sans">
                <Hospital size={14} className="text-[#8EB69B]" /> Hospitals Affected
              </span>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-[#DAF1DE]">
                  {withIntervention.hospitalsAffected} facility
                </span>
                <span className="text-xs text-[#DAF1DE] font-semibold px-1.5 py-0.5 rounded bg-[#235347]">
                  -{improvements.hospitalsReductionPercent}%
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#163832] border border-[#8EB69B]/30">
              <span className="text-[#8EB69B] text-xs flex items-center gap-1.5 font-sans">
                <Clock size={14} className="text-[#8EB69B]" /> Recovery Time
              </span>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-[#DAF1DE]">
                  {withIntervention.recoveryHours} hours
                </span>
                <span className="text-xs text-[#DAF1DE] font-semibold px-1.5 py-0.5 rounded bg-[#235347]">
                  -{improvements.recoveryImprovementPercent}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
