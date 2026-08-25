import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  trend?: {
    label: string;
    positive?: boolean;
  };
  highlight?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  subValue,
  icon: Icon,
  trend,
  highlight = false
}) => {
  return (
    <div
      className={`p-5 rounded-card transition-all duration-200 border ${
        highlight
          ? 'bg-[#163832] border-[#8EB69B]/40 shadow-glow-sm'
          : 'bg-[#0B2B26] border-[#8EB69B]/15 hover:border-[#8EB69B]/30'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8EB69B]">
          {label}
        </span>
        <div className="w-9 h-9 rounded-xl bg-[#163832] border border-[#8EB69B]/20 flex items-center justify-center">
          <Icon size={18} className="text-[#DAF1DE]" />
        </div>
      </div>

      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-bold text-[#DAF1DE] tracking-tight font-sans">
          {value}
        </span>
        {subValue && (
          <span className="text-sm font-medium text-[#8EB69B] font-mono">
            {subValue}
          </span>
        )}
      </div>

      {trend && (
        <div className="mt-2.5 flex items-center space-x-1.5 text-xs font-medium">
          <span
            className={`px-1.5 py-0.5 rounded text-[11px] font-mono ${
              trend.positive !== false
                ? 'bg-[#8EB69B]/20 text-[#DAF1DE]'
                : 'bg-[#C95C5C]/20 text-[#C95C5C]'
            }`}
          >
            {trend.label}
          </span>
          <span className="text-[#8EB69B]/70 text-[11px]">vs city baseline</span>
        </div>
      )}
    </div>
  );
};
