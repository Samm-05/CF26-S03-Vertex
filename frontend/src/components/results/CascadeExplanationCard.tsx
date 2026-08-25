import React from 'react';
import type { SimulationResult } from '../../types';
import { HelpCircle, ArrowDown } from 'lucide-react';

interface CascadeExplanationCardProps {
  result: SimulationResult;
}

export const CascadeExplanationCard: React.FC<CascadeExplanationCardProps> = ({ result }) => {
  return (
    <div className="p-6 rounded-card bg-[#0B2B26] border border-[#8EB69B]/20 space-y-4">
      <div className="flex items-center space-x-2 border-b border-[#8EB69B]/15 pb-3">
        <HelpCircle size={20} className="text-[#8EB69B]" />
        <div>
          <h3 className="text-base font-bold text-[#DAF1DE]">Why did this cascade happen?</h3>
          <p className="text-xs text-[#8EB69B]">Explainable root cause & system vulnerability analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ROOT CAUSE */}
        <div className="p-4 rounded-xl bg-[#163832]/60 border border-[#8EB69B]/20">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#C95C5C] font-bold block mb-1">
            01. ROOT CAUSE TRIGGER
          </span>
          <h4 className="text-base font-bold text-[#DAF1DE] mb-1">{result.rootCauseName}</h4>
          <p className="text-xs text-[#8EB69B]">
            Primary failure initiated under high severity conditions, interrupting grid power transmission.
          </p>
        </div>

        {/* PROPAGATION PATH */}
        <div className="p-4 rounded-xl bg-[#163832]/60 border border-[#8EB69B]/20">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#D9A441] font-bold block mb-1">
            02. PROPAGATION VECTOR
          </span>
          <div className="flex flex-wrap items-center gap-1 text-xs font-semibold text-[#DAF1DE] mt-1">
            <span>Power</span>
            <ArrowDown size={12} className="text-[#8EB69B]" />
            <span>Water</span>
            <ArrowDown size={12} className="text-[#8EB69B]" />
            <span>Healthcare</span>
            <ArrowDown size={12} className="text-[#8EB69B]" />
            <span>Emergency Services</span>
          </div>
        </div>

        {/* MAIN VULNERABILITY */}
        <div className="p-4 rounded-xl bg-[#C95C5C]/10 border border-[#C95C5C]/30">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#C95C5C] font-bold block mb-1">
            03. MAIN CRITICAL VULNERABILITY
          </span>
          <p className="text-xs font-semibold text-[#DAF1DE] leading-relaxed">
            "{result.mainVulnerability}"
          </p>
        </div>
      </div>
    </div>
  );
};
