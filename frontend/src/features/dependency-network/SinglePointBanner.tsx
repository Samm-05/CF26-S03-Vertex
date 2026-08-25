import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface SinglePointBannerProps {
  onInspectNode: () => void;
}

export const SinglePointBanner: React.FC<SinglePointBannerProps> = ({ onInspectNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="p-3.5 px-4 md:px-5 rounded-2xl bg-[#0B2B26]/80 backdrop-blur-md border border-[#8EB69B]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-card-depth mb-4"
    >
      <div className="flex items-start sm:items-center space-x-3.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-[#163832] border border-[#5eead4]/40 flex items-center justify-center flex-shrink-0 text-[#5eead4] shadow-sm mt-0.5 sm:mt-0">
          <CheckCircle2 size={18} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-[#5eead4]">
              Single Point of Failure Resolved
            </span>
          </div>
          <p className="text-xs text-[#8EB69B] leading-relaxed truncate md:whitespace-normal">
            Water Plant B is now safeguarded with 25 MW automated backup power. Cross-sector cascade propagation mitigated.
          </p>
        </div>
      </div>

      <motion.button
        type="button"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={onInspectNode}
        className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#163832] hover:bg-[#235347] text-[#DAF1DE] border border-[#8EB69B]/30 hover:border-[#5eead4]/50 text-xs font-semibold transition-all flex-shrink-0 cursor-pointer shadow-sm self-end sm:self-center"
      >
        <span>Inspect Node</span>
        <ArrowRight size={13} className="text-[#5eead4]" />
      </motion.button>
    </motion.div>
  );
};
