import React from 'react';
import type { CascadeTimelineStep, SimulationRun } from '../types';
import { Clock } from 'lucide-react';

interface CurrentStepSummaryProps {
  currentStep: CascadeTimelineStep;
  stepIndex: number;
  totalSteps: number;
  run: SimulationRun;
}

const STATUS_PILLS = {
  operational: { bg: 'bg-[#235347]/60', border: 'border-[#5eead4]/40', text: 'text-[#5eead4]', label: 'OPERATIONAL' },
  healthy_active: { bg: 'bg-[#235347]/60', border: 'border-[#5eead4]/40', text: 'text-[#5eead4]', label: 'HEALTHY / ACTIVE' },
  at_risk: { bg: 'bg-[#875317]/50', border: 'border-[#D9A441]/50', text: 'text-[#facc15]', label: 'AT RISK' },
  degraded: { bg: 'bg-[#803417]/50', border: 'border-[#C97A4A]/50', text: 'text-[#fb923c]', label: 'DEGRADED' },
  failed: { bg: 'bg-[#701E1E]/50', border: 'border-[#C95C5C]/50', text: 'text-[#f87171]', label: 'FAILED' }
};

export const CurrentStepSummary: React.FC<CurrentStepSummaryProps> = ({
  currentStep,
  stepIndex,
  totalSteps,
  run
}) => {
  const statusCfg = STATUS_PILLS[currentStep.status] || STATUS_PILLS.operational;

  // Format impacted pop for display
  const popDisplay =
    run.mitigatedProfileActive && stepIndex === totalSteps - 1
      ? '0K Citizens'
      : `${Math.round(run.impactedPopulation / 1000)}K Citizens`;

  const strainedDisplay =
    run.mitigatedProfileActive && stepIndex === totalSteps - 1
      ? '1 Systems'
      : `${run.strainedNodeCount} Systems`;

  return (
    <div className="p-5 rounded-2xl bg-[#0B2B26]/90 border border-[#8EB69B]/20 shadow-card-depth space-y-4">
      {/* Top row: Time, Status Badge, Step indicator */}
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#163832] border border-[#8EB69B]/30 text-[#DAF1DE] font-bold">
            <Clock size={13} className="text-[#5eead4]" />
            <span>T = {currentStep.timeLabel}</span>
          </div>

          <span
            className={`px-3 py-1 rounded-lg font-bold uppercase tracking-wider text-[10px] border flex items-center gap-1.5 ${statusCfg.bg} ${statusCfg.border} ${statusCfg.text}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            <span>{statusCfg.label}</span>
          </span>
        </div>

        <span className="text-[#8EB69B] text-xs font-semibold">
          Step {stepIndex + 1} of {totalSteps}
        </span>
      </div>

      {/* Headline & Description */}
      <div className="space-y-1.5">
        <h3 className="text-base sm:text-lg font-bold text-[#DAF1DE] leading-snug">
          {currentStep.eventTitle}
        </h3>
        <p className="text-xs text-[#8EB69B] leading-relaxed">
          {currentStep.description || currentStep.note || currentStep.impactSummary}
        </p>
      </div>

      {/* 3 Stat Tiles */}
      <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-[#8EB69B]/15">
        {/* Stat 1 */}
        <div className="p-3 rounded-xl bg-[#163832]/60 border border-[#8EB69B]/15 space-y-0.5">
          <span className="text-[10px] font-mono text-[#8EB69B] uppercase tracking-wider block truncate">
            Impacted Pop
          </span>
          <span className="text-xs sm:text-sm font-mono font-bold text-[#DAF1DE] block">
            {popDisplay}
          </span>
        </div>

        {/* Stat 2 */}
        <div className="p-3 rounded-xl bg-[#163832]/60 border border-[#8EB69B]/15 space-y-0.5">
          <span className="text-[10px] font-mono text-[#8EB69B] uppercase tracking-wider block truncate">
            Strained Nodes
          </span>
          <span className="text-xs sm:text-sm font-mono font-bold text-[#DAF1DE] block">
            {strainedDisplay}
          </span>
        </div>

        {/* Stat 3 */}
        <div className="p-3 rounded-xl bg-[#163832]/60 border border-[#8EB69B]/15 space-y-0.5">
          <span className="text-[10px] font-mono text-[#8EB69B] uppercase tracking-wider block truncate">
            Recovery Clock
          </span>
          <span className="text-xs sm:text-sm font-mono font-bold text-[#5eead4] block truncate">
            {run.mitigatedProfileActive ? 'Active Repair' : `${run.totalDurationHours} Hours`}
          </span>
        </div>
      </div>
    </div>
  );
};
