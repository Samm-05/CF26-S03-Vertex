import React from 'react';
import type { Intervention } from '../../types';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface RecommendationEngineCardProps {
  recommendedIntervention: Intervention;
  onApplyRecommendation: (intervention: Intervention) => void;
}

export const RecommendationEngineCard: React.FC<RecommendationEngineCardProps> = ({
  recommendedIntervention,
  onApplyRecommendation
}) => {
  const reasonings = [
    'Reduces overall cascade failure propagation depth from Level 5 to Level 2.',
    'Protects 4 critical regional hospitals from sterile water loss.',
    'Shields approximately 180K population from multi-service outages.',
    'Reduces grid recovery time from 16 hours down to 7 hours (-56%).',
    'Provides the highest resilience score improvement per ₹ Crore invested.'
  ];

  return (
    <div className="p-6 rounded-card bg-gradient-to-br from-[#163832] to-[#0B2B26] border border-[#8EB69B]/40 shadow-glow-lg space-y-4">
      <div className="flex items-center space-x-2 border-b border-[#8EB69B]/20 pb-3">
        <Sparkles size={20} className="text-[#DAF1DE]" />
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8EB69B] font-bold">
            EXPLAINABLE DECISION ENGINE RECOMMENDATION
          </span>
          <h3 className="text-xl font-bold text-[#DAF1DE]">
            Recommended Intervention: {recommendedIntervention.title}
          </h3>
        </div>
      </div>

      <p className="text-xs text-[#DAF1DE]/90 font-medium">
        Recommended because it provides the highest citywide resilience improvement relative to implementation cost (₹10 Crore budget ratio).
      </p>

      {/* Rationale Checklist */}
      <div className="space-y-2 py-2">
        {reasonings.map((reason, idx) => (
          <div key={idx} className="flex items-start space-x-2.5 text-xs text-[#DAF1DE]">
            <CheckCircle2 size={16} className="text-[#8EB69B] shrink-0 mt-0.5" />
            <span>{reason}</span>
          </div>
        ))}
      </div>

      {/* Primary Action Button */}
      <button
        onClick={() => onApplyRecommendation(recommendedIntervention)}
        className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl bg-[#235347] text-[#DAF1DE] hover:bg-[#1e4840] border border-[#8EB69B]/50 font-bold text-sm transition-all shadow-glow-sm tracking-wider uppercase group"
      >
        <span>APPLY OPTIMAL RECOMMENDATION</span>
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
