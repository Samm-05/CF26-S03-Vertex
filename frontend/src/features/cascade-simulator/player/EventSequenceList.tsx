import React from 'react';
import type { CascadeTimelineStep } from '../types';

interface EventSequenceListProps {
  steps: CascadeTimelineStep[];
  currentStepIndex: number;
  currentOffsetMinutes: number;
  onSelectStep: (stepIndex: number) => void;
}

const STATUS_ROW_STYLES = {
  operational: { pill: 'bg-[#235347]/50 border-[#5eead4]/40 text-[#5eead4]', label: 'OPERATIONAL' },
  healthy_active: { pill: 'bg-[#235347]/50 border-[#5eead4]/40 text-[#5eead4]', label: 'HEALTHY / ACTIVE' },
  at_risk: { pill: 'bg-[#875317]/40 border-[#D9A441]/40 text-[#facc15]', label: 'AT RISK' },
  degraded: { pill: 'bg-[#803417]/40 border-[#C97A4A]/40 text-[#fb923c]', label: 'DEGRADED' },
  failed: { pill: 'bg-[#701E1E]/40 border-[#C95C5C]/40 text-[#f87171]', label: 'FAILED' }
};

export const EventSequenceList: React.FC<EventSequenceListProps> = ({
  steps,
  currentStepIndex,
  onSelectStep
}) => {
  return (
    <div className="p-5 rounded-2xl bg-[#0B2B26]/90 border border-[#8EB69B]/20 shadow-card-depth space-y-3 flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#8EB69B]/15">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#DAF1DE]">
          Chronological Event Sequence
        </h3>
        <span className="text-[11px] font-mono text-[#8EB69B]">
          Click any step to scrub
        </span>
      </div>

      {/* Scrollable list */}
      <div className="space-y-2.5 overflow-y-auto max-h-[260px] pr-1">
        {steps.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const statusStyle = STATUS_ROW_STYLES[step.status] || STATUS_ROW_STYLES.operational;

          return (
            <div
              key={step.id}
              onClick={() => onSelectStep(idx)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 select-none ${
                isActive
                  ? 'bg-[#163832] border-[#5eead4] shadow-[0_0_12px_rgba(94,234,212,0.15)] ring-1 ring-[#5eead4]/40'
                  : 'bg-[#163832]/40 border-[#8EB69B]/15 hover:bg-[#163832]/70 hover:border-[#8EB69B]/35'
              }`}
            >
              {/* Left: Time Offset Pill + Node & Event */}
              <div className="flex items-center space-x-3 min-w-0">
                <span className="px-2.5 py-1 rounded-lg bg-[#051F20]/80 font-mono text-[11px] font-bold text-[#DAF1DE] flex-shrink-0 border border-[#8EB69B]/20">
                  {step.timeLabel}
                </span>

                <div className="min-w-0 space-y-0.5">
                  <h4 className="text-xs font-bold text-[#DAF1DE] truncate">
                    {step.nodeName}
                  </h4>
                  <p className="text-[11px] text-[#8EB69B] truncate max-w-[280px]">
                    {step.note || step.eventTitle.split(': ')[1] || step.eventTitle}
                  </p>
                </div>
              </div>

              {/* Right: Status Pill */}
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border flex items-center gap-1.5 flex-shrink-0 ${statusStyle.pill}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                <span>{statusStyle.label}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
