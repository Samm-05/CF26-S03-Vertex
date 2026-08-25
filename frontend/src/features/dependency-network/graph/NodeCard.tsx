import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { InfraNode } from '../types';
import {
  Zap,
  Droplets,
  Radio,
  Hospital,
  Train,
  Shield,
  GraduationCap,
  Factory
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

const STATUS_COLORS: Record<string, { dot: string; glow: string }> = {
  operational: { dot: 'bg-[#8EB69B]', glow: 'rgba(142,182,155,0.4)' },
  healthy: { dot: 'bg-[#8EB69B]', glow: 'rgba(142,182,155,0.4)' },
  at_risk: { dot: 'bg-[#D9A441]', glow: 'rgba(217,164,65,0.6)' },
  degraded: { dot: 'bg-[#C97A4A]', glow: 'rgba(201,122,74,0.6)' },
  failed: { dot: 'bg-[#C95C5C]', glow: 'rgba(201,92,92,0.8)' }
};

export interface NodeCardData {
  node: InfraNode;
  isSelected: boolean;
  isHighlighted: boolean;
  isDimmed: boolean;
  onSelect: (nodeId: string) => void;
}

export const NodeCard: React.FC<{ data: NodeCardData }> = ({ data }) => {
  const { node, isSelected, isHighlighted, isDimmed, onSelect } = data;
  const Icon = CATEGORY_ICONS[node.type] || Zap;
  const statusCfg = STATUS_COLORS[node.status] || STATUS_COLORS.operational;
  const isFailed = node.status === 'failed';
  const isAtRisk = node.status === 'at_risk';

  return (
    <div className="relative group">
      {/* Top Handle for incoming upstream dependencies */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-[#5eead4] !border-none opacity-0 group-hover:opacity-100 transition-opacity"
      />

      <motion.div
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        onClick={() => onSelect(node.id)}
        className={`w-56 p-3 rounded-2xl border transition-all duration-250 cursor-pointer select-none relative ${
          isSelected
            ? 'bg-[#163832] border-[#5eead4] shadow-[0_0_20px_rgba(94,234,212,0.35)] ring-2 ring-[#5eead4]/40 z-30'
            : isHighlighted
            ? 'bg-[#12312C] border-[#8EB69B]/60 shadow-[0_0_12px_rgba(142,182,155,0.25)] hover:border-[#5eead4]'
            : isDimmed
            ? 'bg-[#0B2B26]/40 border-[#8EB69B]/10 opacity-30 hover:opacity-80'
            : 'bg-[#0B2B26]/90 backdrop-blur-md border-[#8EB69B]/25 hover:border-[#8EB69B]/60 hover:bg-[#12312C]'
        }`}
      >
        {/* Pulse ring for failed or at-risk state */}
        {(isFailed || isAtRisk) && (
          <span
            className="absolute -inset-1 rounded-2xl animate-pulse-ring pointer-events-none"
            style={{ backgroundColor: statusCfg.glow }}
          />
        )}

        {/* Top row: Icon Chip + Status Dot */}
        <div className="flex items-center justify-between mb-2">
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center border transition-colors ${
              isSelected
                ? 'bg-[#235347] border-[#5eead4] text-[#5eead4]'
                : 'bg-[#07211D] border-[#8EB69B]/30 text-[#8EB69B]'
            }`}
          >
            <Icon size={14} />
          </div>

          <div className="flex items-center space-x-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${statusCfg.dot} ${
                isFailed ? 'animate-pulse shadow-[0_0_8px_rgba(201,92,92,0.9)]' : ''
              }`}
            />
          </div>
        </div>

        {/* Name */}
        <h4 className="text-xs font-bold text-[#DAF1DE] truncate leading-tight mb-1">
          {node.shortName || node.name}
        </h4>

        {/* Meta Line */}
        <div className="flex items-center justify-between text-[10px] font-mono text-[#8EB69B]">
          <span>Score: <strong className="text-[#DAF1DE]">{node.score}/100</strong></span>
          <span>{node.directDependents} dep</span>
        </div>
      </motion.div>

      {/* Bottom Handle for outgoing downstream dependencies */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-[#5eead4] !border-none opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  );
};
