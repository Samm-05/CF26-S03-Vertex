import React from 'react';
import type { Intervention } from '../../types';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

interface InterventionSimulatorProps {
  interventions: Intervention[];
  selectedIntervention: Intervention;
  onSelectIntervention: (intervention: Intervention) => void;
  onApplyIntervention: () => void;
  isInterventionApplied: boolean;
}

export const InterventionSimulator: React.FC<InterventionSimulatorProps> = ({
  interventions,
  selectedIntervention,
  onSelectIntervention,
  onApplyIntervention,
  isInterventionApplied
}) => {
  return (
    <div className="p-6 rounded-card bg-[#0B2B26] border border-[#8EB69B]/20 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#8EB69B]/15 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#8EB69B] uppercase tracking-wider mb-1">
            <ShieldCheck size={16} />
            <span>Resilience Optimization Module</span>
          </div>
          <h3 className="text-xl font-bold text-[#DAF1DE]">Mitigate Cascade Risk</h3>
          <p className="text-xs text-[#8EB69B]">
            Test interventions and determine how much cascade damage can be prevented.
          </p>
        </div>

        {isInterventionApplied && (
          <span className="self-start sm:self-auto text-xs font-semibold px-3 py-1 bg-[#8EB69B]/20 text-[#DAF1DE] rounded-full border border-[#8EB69B]/40 flex items-center space-x-1">
            <CheckCircle2 size={14} className="text-[#8EB69B]" />
            <span>INTERVENTION APPLIED IN MODEL</span>
          </span>
        )}
      </div>

      {/* Intervention Selector List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {interventions.map((item) => {
          const isSelected = item.id === selectedIntervention.id;
          return (
            <div
              key={item.id}
              onClick={() => onSelectIntervention(item)}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-[#163832] border-[#DAF1DE] shadow-glow-sm ring-1 ring-[#DAF1DE]/30'
                  : 'bg-[#163832]/40 border-[#8EB69B]/15 hover:border-[#8EB69B]/30'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-bold text-[#DAF1DE]">{item.title}</h4>
                <span className="text-xs font-mono font-bold text-[#8EB69B] px-2 py-0.5 bg-[#051F20] rounded">
                  {item.estimatedCost}
                </span>
              </div>
              <p className="text-xs text-[#8EB69B] leading-relaxed mb-3">{item.description}</p>
              <div className="flex items-center space-x-4 text-[11px] font-mono text-[#DAF1DE]">
                <span>Risk Red.: <strong className="text-[#8EB69B]">{item.riskReductionPercent}%</strong></span>
                <span>Protected: <strong className="text-[#8EB69B]">{(item.populationProtected / 1000).toFixed(0)}K</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Intervention Stats Card */}
      <div className="p-4 rounded-xl bg-[#163832]/80 border border-[#8EB69B]/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-[#8EB69B] uppercase font-bold">Selected Intervention</span>
          <h4 className="text-base font-bold text-[#DAF1DE]">{selectedIntervention.title}</h4>
          <p className="text-xs text-[#8EB69B] font-mono">
            Cost: {selectedIntervention.estimatedCost} • Risk Reduction: {selectedIntervention.riskReductionPercent}% • Pop Protected: {selectedIntervention.populationProtected.toLocaleString()}
          </p>
        </div>

        <button
          onClick={onApplyIntervention}
          className="w-full md:w-auto px-6 py-3 rounded-xl bg-[#235347] text-[#DAF1DE] hover:bg-[#1e4840] border border-[#8EB69B]/40 font-bold text-sm transition-all shadow-glow-sm tracking-wider uppercase whitespace-nowrap"
        >
          {isInterventionApplied ? 'RE-RUN SIMULATION WITH INTERVENTION' : 'APPLY INTERVENTION & RUN SIMULATION'}
        </button>
      </div>
    </div>
  );
};
