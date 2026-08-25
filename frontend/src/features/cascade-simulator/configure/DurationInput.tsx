import React from 'react';

interface DurationInputProps {
  durationHours: number;
  onChangeDuration: (hours: number) => void;
}

const QUICK_CHIPS = [6, 12, 24, 48];

export const DurationInput: React.FC<DurationInputProps> = ({
  durationHours,
  onChangeDuration
}) => {
  return (
    <div className="p-5 rounded-2xl bg-[#0B2B26]/90 border border-[#8EB69B]/20 shadow-card-depth space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <span className="w-5 h-5 rounded-full bg-[#163832] text-[#DAF1DE] flex items-center justify-center text-xs font-bold font-mono border border-[#8EB69B]/30">
            3
          </span>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#DAF1DE]">
            Failure Duration
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#8EB69B] uppercase tracking-wide">
          Estimated Repair Window
        </span>
      </div>

      {/* Input row + Quick select chips */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[140px]">
          <input
            type="number"
            min="1"
            max="96"
            value={durationHours}
            onChange={(e) => onChangeDuration(Math.max(1, Number(e.target.value)))}
            className="w-full bg-[#163832] text-[#DAF1DE] font-mono font-bold text-sm px-4 py-3 pr-14 rounded-xl border border-[#8EB69B]/30 focus:border-[#5eead4] focus:outline-none shadow-inner"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#8EB69B] uppercase pointer-events-none">
            Hours
          </span>
        </div>

        <div className="flex items-center gap-2">
          {QUICK_CHIPS.map((chip) => {
            const isSelected = durationHours === chip;
            return (
              <button
                key={chip}
                type="button"
                onClick={() => onChangeDuration(chip)}
                className={`px-3.5 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all border ${
                  isSelected
                    ? 'bg-[#235347] text-[#DAF1DE] border-[#5eead4] shadow-sm'
                    : 'bg-[#163832]/80 text-[#8EB69B] border-[#8EB69B]/20 hover:text-[#DAF1DE] hover:bg-[#163832]'
                }`}
              >
                {chip}h
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
