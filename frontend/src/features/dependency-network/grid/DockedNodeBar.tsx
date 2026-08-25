import React from 'react';
import type { InfraNode } from '../types';
import {
  Zap,
  Droplets,
  Radio,
  Hospital,
  Train,
  Shield,
  GraduationCap,
  Factory,
  Play,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  power: Zap,
  water: Droplets,
  telecom: Radio,
  healthcare: Hospital,
  transport: Train,
  emergency: Shield,
  schools: GraduationCap,
  residential: GraduationCap,
  industrial: Factory
};

interface DockedNodeBarProps {
  node: InfraNode;
  onSimulateFailure: (nodeId: string) => void;
  onOpenDetail?: (nodeId: string) => void;
}

export const DockedNodeBar: React.FC<DockedNodeBarProps> = ({
  node,
  onSimulateFailure,
  onOpenDetail
}) => {
  const Icon = CATEGORY_ICONS[node.type] || Zap;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="p-3.5 px-4 md:px-5 rounded-2xl bg-[#0B2B26]/95 backdrop-blur-xl border border-[#8EB69B]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xl z-20 mt-4"
    >
      <div
        onClick={() => onOpenDetail && onOpenDetail(node.id)}
        className="flex items-center space-x-3.5 min-w-0 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-[#163832] border border-[#5eead4]/40 flex items-center justify-center text-[#5eead4] shadow-sm flex-shrink-0 group-hover:bg-[#235347] transition-colors">
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-[#DAF1DE] truncate group-hover:text-[#5eead4] transition-colors">
            {node.name}
          </h4>
          <p className="text-xs text-[#8EB69B] truncate">
            Type: <span className="uppercase text-[#DAF1DE]">{node.type}</span> • Criticality: <span className="text-[#DAF1DE] font-mono font-semibold">{node.score}/100</span> • Impact: <span className="text-[#DAF1DE] font-mono font-semibold">{node.populationServed.toLocaleString()}</span> pop
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2.5 self-end sm:self-center flex-shrink-0">
        {onOpenDetail && (
          <button
            type="button"
            onClick={() => onOpenDetail(node.id)}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-[#163832] hover:bg-[#235347] text-[#DAF1DE] border border-[#8EB69B]/25 text-xs font-medium transition-colors cursor-pointer"
          >
            <span>Details</span>
            <ArrowRight size={13} className="text-[#5eead4]" />
          </button>
        )}

        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onSimulateFailure(node.id)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#235347] hover:bg-[#2d695a] text-[#DAF1DE] border border-[#5eead4]/40 text-xs font-bold transition-all shadow-[0_0_15px_rgba(94,234,212,0.25)] cursor-pointer"
        >
          <Play size={13} className="fill-[#DAF1DE]" />
          <span>Simulate Failure</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
