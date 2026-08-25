import React from 'react';
import type { InfraNode } from '../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import {
  X,
  Zap,
  Droplets,
  Radio,
  Hospital,
  Train,
  Shield,
  GraduationCap,
  Factory,
  AlertTriangle,
  Play,
  Network,
  Users,
  Activity,
  Gauge,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface NodeDetailDrawerProps {
  node: InfraNode | null;
  onClose: () => void;
  onSimulateFailure: (nodeId: string) => void;
  onViewDependencies?: (nodeId: string) => void;
}

export const NodeDetailDrawer: React.FC<NodeDetailDrawerProps> = ({
  node,
  onClose,
  onSimulateFailure,
  onViewDependencies
}) => {
  if (!node) return null;

  const Icon = CATEGORY_ICONS[node.type] || Zap;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end pointer-events-auto">
        {/* Backdrop Scrim */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#051F20]/75 backdrop-blur-sm"
        />

        {/* Slide-in Drawer Container */}
        <motion.div
          initial={{ x: 420, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 420, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="relative w-full max-w-[430px] h-full bg-[#0B2B26]/98 backdrop-blur-xl border-l border-[#8EB69B]/25 flex flex-col justify-between shadow-2xl z-10"
        >
          {/* 1. Header */}
          <div className="p-5 pb-4 border-b border-[#8EB69B]/15 flex items-start justify-between flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-xl bg-[#163832] border border-[#5eead4]/40 flex items-center justify-center text-[#5eead4] shadow-sm flex-shrink-0">
                <Icon size={22} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#8EB69B] flex items-center space-x-1.5 truncate">
                  <span>{node.type.toUpperCase()} GRID</span>
                  <span>•</span>
                  <span>{node.district}</span>
                </div>
                <h3 className="text-lg font-bold text-[#DAF1DE] leading-tight truncate">{node.name}</h3>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#163832] text-[#8EB69B] hover:text-[#DAF1DE] hover:bg-[#235347] border border-[#8EB69B]/20 transition-colors cursor-pointer flex-shrink-0"
              title="Close Drawer"
            >
              <X size={16} />
            </button>
          </div>

          {/* 2. Scrollable Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">
            {/* Status & Criticality Stat Blocks (Side by Side) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#163832]/60 border border-[#8EB69B]/15 flex flex-col justify-between">
                <span className="text-[10px] font-mono text-[#8EB69B] uppercase tracking-wider">
                  Operational Status
                </span>
                <div className="mt-1.5">
                  <StatusBadge status={node.status} size="md" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#163832]/60 border border-[#8EB69B]/15 flex flex-col justify-between">
                <span className="text-[10px] font-mono text-[#8EB69B] uppercase tracking-wider">
                  Criticality Score
                </span>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-lg font-mono font-bold text-[#DAF1DE]">
                    {node.score} <span className="text-xs text-[#8EB69B] font-normal">/ 100</span>
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-[#051F20] overflow-hidden">
                    <div
                      className="h-full bg-[#5eead4] rounded-full transition-all"
                      style={{ width: `${node.score}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-3.5 rounded-xl bg-[#163832]/30 border border-[#8EB69B]/10 text-xs text-[#DAF1DE]/90 leading-relaxed">
              {node.description}
            </div>

            {/* Identified Architectural Vulnerability Callout Box (Amber) */}
            {node.vulnerability && (
              <div className="p-3.5 rounded-xl bg-[#D9A441]/10 border border-[#D9A441]/30 flex items-start space-x-2.5">
                <AlertTriangle size={16} className="text-[#D9A441] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-[#D9A441] tracking-wider block mb-0.5">
                    Identified Architectural Vulnerability:
                  </span>
                  <p className="text-xs text-[#FFF0D4] leading-snug">{node.vulnerability}</p>
                </div>
              </div>
            )}

            {/* Infrastructure Telemetry 2x2 Grid */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8EB69B] block font-semibold">
                Infrastructure Telemetry
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-[#163832]/40 border border-[#8EB69B]/15">
                  <div className="flex items-center space-x-1.5 text-[10px] font-mono text-[#8EB69B] mb-1">
                    <Gauge size={12} className="text-[#5eead4]" />
                    <span>Rated Capacity</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-[#DAF1DE]">{node.ratedCapacity}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#163832]/40 border border-[#8EB69B]/15">
                  <div className="flex items-center space-x-1.5 text-[10px] font-mono text-[#8EB69B] mb-1">
                    <Users size={12} className="text-[#5eead4]" />
                    <span>Population Served</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-[#DAF1DE]">
                    {node.populationServed.toLocaleString()} Citizens
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#163832]/40 border border-[#8EB69B]/15">
                  <div className="flex items-center space-x-1.5 text-[10px] font-mono text-[#8EB69B] mb-1">
                    <Activity size={12} className="text-[#5eead4]" />
                    <span>Failure Probability</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-[#DAF1DE]">
                    {node.failureProbabilityPerYear}% / yr
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#163832]/40 border border-[#8EB69B]/15">
                  <div className="flex items-center space-x-1.5 text-[10px] font-mono text-[#8EB69B] mb-1">
                    <Layers size={12} className="text-[#5eead4]" />
                    <span>Dependency Tier</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-[#DAF1DE]">Tier {node.tier}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Sticky Action Footer */}
          <div className="p-5 pt-3 border-t border-[#8EB69B]/20 bg-[#07211D] flex items-center space-x-3 flex-shrink-0 shadow-lg">
            {onViewDependencies && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onViewDependencies(node.id)}
                className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-[#163832] text-[#DAF1DE] hover:bg-[#1f4a41] border border-[#8EB69B]/25 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Network size={14} className="text-[#5eead4]" />
                <span>View Dependencies</span>
              </motion.button>
            )}

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSimulateFailure(node.id)}
              className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-[#235347] text-[#DAF1DE] hover:bg-[#2d695a] border border-[#5eead4]/40 text-xs font-bold transition-all shadow-[0_0_15px_rgba(94,234,212,0.25)] cursor-pointer"
            >
              <Play size={14} className="fill-[#DAF1DE]" />
              <span>Simulate Failure</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
