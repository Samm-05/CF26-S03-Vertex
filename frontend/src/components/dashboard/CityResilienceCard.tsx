import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { CITY_RESILIENCE_METRICS } from '../../data/infrastructureData';

export const CityResilienceCard: React.FC = () => {
  const { overallScore, breakdown } = CITY_RESILIENCE_METRICS;

  const items = [
    { label: 'Redundancy', score: breakdown.redundancy },
    { label: 'Connectivity', score: breakdown.connectivity },
    { label: 'Recovery Capability', score: breakdown.recovery },
    { label: 'Infrastructure Health', score: breakdown.infrastructure },
    { label: 'Critical Services Protection', score: breakdown.criticalServices }
  ];

  return (
    <div className="p-5 rounded-card bg-[#0B2B26] border border-[#8EB69B]/15">
      <div className="flex items-center justify-between mb-4 border-b border-[#8EB69B]/10 pb-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck size={20} className="text-[#8EB69B]" />
          <h3 className="text-base font-semibold text-[#DAF1DE]">City Resilience Score</h3>
        </div>
        <span className="text-xs font-mono text-[#8EB69B] px-2 py-0.5 bg-[#163832] rounded border border-[#8EB69B]/20">
          ISO 22301 Index
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Main Circular Score Display */}
        <div className="flex flex-col items-center justify-center p-4 bg-[#163832]/50 rounded-xl border border-[#8EB69B]/20">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="46"
                className="text-[#051F20]"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r="46"
                className="text-[#8EB69B]"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 46}
                strokeDashoffset={2 * Math.PI * 46 * (1 - overallScore / 100)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-[#DAF1DE] font-mono">{overallScore}</span>
              <span className="text-[10px] text-[#8EB69B] font-semibold uppercase">out of 100</span>
            </div>
          </div>
          <span className="mt-3 text-xs font-semibold text-[#DAF1DE] uppercase tracking-wider text-center">
            MODERATE RESILIENT CITY
          </span>
        </div>

        {/* Breakdown Progress Bars */}
        <div className="md:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-[#DAF1DE]">{item.label}</span>
                <span className="text-[#8EB69B] font-mono">{item.score} / 100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#051F20] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#235347] to-[#8EB69B] rounded-full transition-all duration-500"
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
