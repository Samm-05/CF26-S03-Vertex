import React from 'react';
import type { InfraNode, HighlightMode, DependencyEdge } from '../types';
import { TIERS_META } from '../data/dependencyNetworkData';
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

const STATUS_DOT_COLORS: Record<string, string> = {
  operational: 'bg-[#8EB69B]',
  healthy: 'bg-[#8EB69B]',
  at_risk: 'bg-[#D9A441]',
  degraded: 'bg-[#C97A4A]',
  failed: 'bg-[#C95C5C]'
};

interface GridViewProps {
  nodes: InfraNode[];
  edges: DependencyEdge[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  highlightMode: HighlightMode;
  cascadeActiveNodeIds?: string[];
}

export const GridView: React.FC<GridViewProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  highlightMode,
  cascadeActiveNodeIds = []
}) => {
  // Compute upstream dependencies and downstream dependents of the selected node
  const { upstreamIds, downstreamIds } = React.useMemo(() => {
    if (!selectedNodeId) {
      return { upstreamIds: new Set<string>(), downstreamIds: new Set<string>() };
    }

    const up = new Set<string>();
    const down = new Set<string>();

    // BFS Upstream (Dependencies)
    const queueUp = [selectedNodeId];
    while (queueUp.length > 0) {
      const current = queueUp.shift()!;
      edges.forEach((edge) => {
        if (edge.target === current && !up.has(edge.source)) {
          up.add(edge.source);
          queueUp.push(edge.source);
        }
      });
    }

    // BFS Downstream (Dependents)
    const queueDown = [selectedNodeId];
    while (queueDown.length > 0) {
      const current = queueDown.shift()!;
      edges.forEach((edge) => {
        if (edge.source === current && !down.has(edge.target)) {
          down.add(edge.target);
          queueDown.push(edge.target);
        }
      });
    }

    return { upstreamIds: up, downstreamIds: down };
  }, [selectedNodeId, edges]);

  const isNodeHighlighted = (nodeId: string) => {
    if (cascadeActiveNodeIds.includes(nodeId)) return true;
    if (!selectedNodeId) return true;
    if (nodeId === selectedNodeId) return true;
    if (highlightMode === 'dependencies') return upstreamIds.has(nodeId);
    if (highlightMode === 'dependents') return downstreamIds.has(nodeId);
    return upstreamIds.has(nodeId) || downstreamIds.has(nodeId);
  };

  const isNodeDimmed = (nodeId: string) => {
    if (cascadeActiveNodeIds.length > 0 && !cascadeActiveNodeIds.includes(nodeId)) return true;
    if (!selectedNodeId) return false;
    return !isNodeHighlighted(nodeId);
  };

  return (
    <div className="flex-1 overflow-y-auto pr-1 space-y-7 min-h-0">
      {TIERS_META.map((tierMeta, tierIdx) => {
        const tierNodes = nodes.filter((n) => n.tier === tierMeta.tier);
        if (tierNodes.length === 0) return null;

        return (
          <motion.div
            key={tierMeta.tier}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: tierIdx * 0.08 }}
            className="space-y-3"
          >
            {/* Tier Section Title */}
            <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-[#8EB69B] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#5eead4]" />
              <span>{tierMeta.label} — {tierMeta.sublabel}</span>
            </div>

            {/* Nodes Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
              {tierNodes.map((node) => {
                const Icon = CATEGORY_ICONS[node.type] || Zap;
                const isSelected = node.id === selectedNodeId;
                const isHighlighted = isNodeHighlighted(node.id);
                const isDimmed = isNodeDimmed(node.id);
                const dotColor = STATUS_DOT_COLORS[node.status] || 'bg-[#8EB69B]';
                const isFailed = node.status === 'failed';

                return (
                  <motion.div
                    key={node.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onSelectNode(node.id)}
                    className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none relative ${
                      isSelected
                        ? 'bg-[#163832] border-[#5eead4] shadow-[0_0_20px_rgba(94,234,212,0.35)] ring-2 ring-[#5eead4]/40 z-10'
                        : isHighlighted
                        ? 'bg-[#0B2B26]/90 border-[#8EB69B]/30 hover:border-[#5eead4] hover:bg-[#12312C]'
                        : isDimmed
                        ? 'bg-[#0B2B26]/40 border-[#8EB69B]/10 opacity-35 hover:opacity-80'
                        : 'bg-[#0B2B26]/80 border-[#8EB69B]/20 hover:border-[#8EB69B]/50 hover:bg-[#12312C]'
                    }`}
                  >
                    {/* Header: Type icon + Score/Status */}
                    <div className="flex items-start justify-between mb-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${
                          isSelected
                            ? 'bg-[#235347] border-[#5eead4] text-[#5eead4]'
                            : 'bg-[#163832] border-[#8EB69B]/30 text-[#8EB69B]'
                        }`}
                      >
                        <Icon size={18} />
                      </div>

                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${
                            isSelected
                              ? 'bg-[#235347] border-[#5eead4]/50 text-[#DAF1DE]'
                              : 'bg-[#163832]/60 border-[#8EB69B]/20 text-[#8EB69B]'
                          }`}
                        >
                          {node.score}/100
                        </span>
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${dotColor} ${
                            isFailed ? 'animate-pulse shadow-[0_0_8px_rgba(201,92,92,0.9)]' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* Name */}
                    <h4 className="text-sm font-bold text-[#DAF1DE] truncate leading-tight mb-1">
                      {node.shortName || node.name}
                    </h4>

                    {/* Meta */}
                    <p className="text-xs text-[#8EB69B] truncate">
                      {node.directDependents} direct dependents
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
