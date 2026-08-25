import React from 'react';

interface SeveritySliderProps {
  severity: number;
  onChangeSeverity: (severity: number) => void;
}

export const SeveritySlider: React.FC<SeveritySliderProps> = ({
  severity,
  onChangeSeverity
}) => {
  return (
    <div className="p-5 rounded-2xl bg-[#0B2B26]/90 border border-[#8EB69B]/20 shadow-card-depth space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <span className="w-5 h-5 rounded-full bg-[#163832] text-[#DAF1DE] flex items-center justify-center text-xs font-bold font-mono border border-[#8EB69B]/30">
            2
          </span>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#DAF1DE]">
            Failure Severity Percentage
          </h3>
        </div>
        <span className="px-3 py-1 rounded-lg bg-[#163832] border border-[#8EB69B]/30 text-sm font-mono font-bold text-[#5eead4]">
          {severity}%
        </span>
      </div>

      {/* Slider Input */}
      <div className="space-y-3 pt-1">
        <input
          type="range"
          min="10"
          max="100"
          step="5"
          value={severity}
          onChange={(e) => onChangeSeverity(Number(e.target.value))}
          className="w-full h-2.5 rounded-lg bg-[#051F20] appearance-none cursor-pointer accent-[#5eead4] border border-[#8EB69B]/20"
        />

        {/* Labeled Ticks */}
        <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-mono text-[#8EB69B] px-1">
          <button
            type="button"
            onClick={() => onChangeSeverity(10)}
            className={`transition-colors hover:text-[#DAF1DE] ${severity === 10 ? 'text-[#5eead4] font-bold' : ''}`}
          >
            10% (Minor Trip)
          </button>
          <button
            type="button"
            onClick={() => onChangeSeverity(50)}
            className={`transition-colors hover:text-[#DAF1DE] ${severity === 50 ? 'text-[#5eead4] font-bold' : ''}`}
          >
            50% (Substation Drop)
          </button>
          <button
            type="button"
            onClick={() => onChangeSeverity(70)}
            className={`transition-colors hover:text-[#DAF1DE] ${severity === 70 ? 'text-[#5eead4] font-bold' : ''}`}
          >
            70% (Standard Demo)
          </button>
          <button
            type="button"
            onClick={() => onChangeSeverity(100)}
            className={`transition-colors hover:text-[#DAF1DE] ${severity === 100 ? 'text-[#5eead4] font-bold' : ''}`}
          >
            100% (Total Catastrophe)
          </button>
        </div>
      </div>
    </div>
  );
};
