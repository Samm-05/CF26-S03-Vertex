import React from 'react';
import type { CascadePreviewStep } from '../types';
import { ShieldAlert, Network, ArrowRight } from 'lucide-react';

interface ExpectedPathwayPanelProps {
  previewSteps: CascadePreviewStep[];
  onRunSimulation: () => void;
}

const SEVERITY_STYLES = {
  failed: {
    badge: 'bg-[#701E1E]/40 border-[#C95C5C]/50 text-[#f87171]',
    nodeText: 'text-[#f87171]'
  },
  degraded: {
    badge: 'bg-[#803417]/40 border-[#C97A4A]/50 text-[#fb923c]',
    nodeText: 'text-[#fb923c]'
  },
  at_risk: {
    badge: 'bg-[#875317]/40 border-[#D9A441]/50 text-[#facc15]',
    nodeText: 'text-[#facc15]'
  }
};

export const ExpectedPathwayPanel: React.FC<ExpectedPathwayPanelProps> = ({
  previewSteps,
  onRunSimulation
}) => {
  return (
    <div className="h-full flex flex-col p-6 rounded-2xl bg-[#0B2B26]/90 border border-[#8EB69B]/20 shadow-card-depth space-y-4">
      {/* Panel Header */}
      <div className="flex items-start space-x-3 pb-3 border-b border-[#8EB69B]/15">
        <div className="p-2 rounded-xl bg-[#163832] text-[#5eead4] border border-[#8EB69B]/20">
          <ShieldAlert size={20} />
        </div>
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#DAF1DE]">
            Expected Cascade Pathway
          </h3>
          <p className="text-[11px] text-[#8EB69B]">
            Deterministic propagation modeling
          </p>
        </div>
      </div>

      {/* Pathway List */}
      <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
        {previewSteps.map((step, idx) => {
          const style = SEVERITY_STYLES[step.severity] || SEVERITY_STYLES.at_risk;
          return (
            <div
              key={`${step.nodeId}-${idx}`}
              className={`p-3.5 rounded-xl border flex items-start space-x-3 transition-all ${style.badge}`}
            >
              {/* Timestamp */}
              <div className="px-2 py-0.5 rounded bg-[#051F20]/70 font-mono text-[11px] font-bold text-[#DAF1DE] flex-shrink-0">
                T={step.offsetMinutes}m
              </div>

              {/* Description */}
              <div className="flex-1 min-w-0 text-xs leading-relaxed">
                <span className={`font-bold mr-1.5 ${style.nodeText}`}>
                  {step.nodeName}
                </span>
                <span className="text-[#DAF1DE]/90">{step.effectDescription.replace(step.nodeName, '').trim()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Run Primary Action */}
      <button
        type="button"
        onClick={onRunSimulation}
        className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-[#235347] hover:bg-[#1e4840] text-[#DAF1DE] font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-glow-sm border border-[#5eead4]/40 hover:border-[#5eead4] active:scale-[0.99] cursor-pointer"
      >
        <Network size={16} className="text-[#5eead4]" />
        <span>Run Cascade Simulation</span>
        <ArrowRight size={15} />
      </button>
    </div>
  );
};
