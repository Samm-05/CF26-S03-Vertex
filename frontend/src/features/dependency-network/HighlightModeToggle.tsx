import React from 'react';
import type { HighlightMode } from './types';
import { motion } from 'framer-motion';

interface HighlightModeToggleProps {
  mode: HighlightMode;
  onChange: (mode: HighlightMode) => void;
  disabled?: boolean;
}

export const HighlightModeToggle: React.FC<HighlightModeToggleProps> = ({
  mode,
  onChange,
  disabled = false
}) => {
  const options: { id: HighlightMode; label: string }[] = [
    { id: 'all', label: 'All Connected' },
    { id: 'dependencies', label: 'Highlight Dependencies' },
    { id: 'dependents', label: 'Highlight Dependents' }
  ];

  return (
    <div className="flex items-center bg-[#07211D] p-1 rounded-xl border border-[#8EB69B]/20 shadow-inner">
      {options.map((opt) => {
        const isActive = mode === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            disabled={disabled && opt.id !== 'all'}
            onClick={() => onChange(opt.id)}
            className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
              disabled && opt.id !== 'all'
                ? 'opacity-40 cursor-not-allowed text-[#8EB69B]/40'
                : isActive
                ? 'text-[#DAF1DE] font-semibold'
                : 'text-[#8EB69B] hover:text-[#DAF1DE]'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="highlight-pill"
                className="absolute inset-0 bg-[#235347] rounded-lg border border-[#5eead4]/40 shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
