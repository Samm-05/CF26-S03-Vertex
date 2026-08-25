import React from 'react';

export const MapLegend: React.FC = () => {
  return (
    <div className="bg-[#0B2B26]/90 backdrop-blur-md p-3 rounded-xl border border-[#8EB69B]/20 text-xs shadow-card-depth">
      <div className="text-[10px] font-mono text-[#8EB69B] uppercase mb-1.5 font-semibold tracking-wider flex items-center justify-between">
        <span>Asset Status</span>
        <span className="text-[#8EB69B]/50 font-normal">CASCADE-X</span>
      </div>
      <div className="flex items-center space-x-3 flex-wrap gap-y-1">
        <span className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#8EB69B] shadow-[0_0_8px_rgba(142,182,155,0.6)]" />
          <span className="text-[#DAF1DE] text-[11px]">Normal</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D9A441] shadow-[0_0_8px_rgba(217,164,65,0.6)]" />
          <span className="text-[#DAF1DE] text-[11px]">At Risk</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C97A4A] shadow-[0_0_8px_rgba(201,122,74,0.6)]" />
          <span className="text-[#DAF1DE] text-[11px]">Degraded</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C95C5C] shadow-[0_0_8px_rgba(201,92,92,0.8)] animate-pulse" />
          <span className="text-[#DAF1DE] text-[11px]">Failed</span>
        </span>
      </div>
    </div>
  );
};
