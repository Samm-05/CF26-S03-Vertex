import React, { useState, useMemo } from 'react';
import type { ViewMode, HighlightMode } from './types';
import { INITIAL_NETWORK_NODES, NETWORK_EDGES } from './data/dependencyNetworkData';
import { SinglePointBanner } from './SinglePointBanner';
import { HighlightModeToggle } from './HighlightModeToggle';
import { GraphView } from './graph/GraphView';
import { GridView } from './grid/GridView';
import { DockedNodeBar } from './grid/DockedNodeBar';
import { NodeDetailDrawer } from './panel/NodeDetailDrawer';
import { useFailurePropagation } from './simulation/useFailurePropagation';
import {
  Network,
  LayoutGrid,
  GitFork,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DependencyNetworkScreenProps {
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  onSimulateFailure: (nodeId: string) => void;
  onNavigateToResults?: () => void;
  simulatedStatuses?: Record<string, string>;
}

export const DependencyNetworkScreen: React.FC<DependencyNetworkScreenProps> = ({
  selectedNodeId,
  onSelectNode,
  onSimulateFailure: _onGlobalSimulate,
  onNavigateToResults,
  simulatedStatuses = {}
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('graph');
  const [highlightMode, setHighlightMode] = useState<HighlightMode>('all');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Hook for animated failure propagation
  const {
    isSimulating,
    nodeStatuses: propagationStatuses,
    activeCascadeNodeIds,
    activeCascadeEdgeIds,
    cascadeSummary,
    startPropagation,
    resetPropagation
  } = useFailurePropagation(INITIAL_NETWORK_NODES, NETWORK_EDGES);

  // Merge nodes with live simulation statuses & local cascade statuses
  const nodes = useMemo(() => {
    return INITIAL_NETWORK_NODES.map((node) => {
      let status = node.status;
      if (propagationStatuses[node.id]) {
        status = propagationStatuses[node.id];
      } else if (simulatedStatuses[node.id]) {
        status = simulatedStatuses[node.id] as any;
      }
      return {
        ...node,
        status
      };
    });
  }, [propagationStatuses, simulatedStatuses]);

  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  const handleNodeClick = (nodeId: string) => {
    onSelectNode(nodeId);
    setIsDrawerOpen(true);
  };

  const handleStartFailureSimulation = (nodeId: string) => {
    startPropagation(nodeId);
  };

  return (
    <div className="h-[calc(100vh-4rem)] p-4 md:p-6 flex flex-col overflow-hidden relative bg-ambient-gradient">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-3 flex-shrink-0">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#8EB69B] uppercase tracking-wider mb-0.5">
            <Network size={14} className="text-[#5eead4]" />
            <span>Interactive Topological Dependency Graph</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-[#DAF1DE]">
            {viewMode === 'graph' ? 'Infrastructure Dependency Network' : 'Cascade Vulnerability Graph'}
          </h1>
          <p className="text-xs text-[#8EB69B] mt-0.5">
            Explore physical, hydraulic, electrical, and telemetry dependency chains across city systems.
          </p>
        </div>

        {/* View Mode & Highlight Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Highlight Mode Segmented Control */}
          <HighlightModeToggle
            mode={highlightMode}
            onChange={setHighlightMode}
            disabled={!selectedNodeId}
          />

          {/* View Mode Toggle Button */}
          <div className="flex items-center bg-[#07211D] p-1 rounded-xl border border-[#8EB69B]/20 shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode('graph')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                viewMode === 'graph'
                  ? 'bg-[#235347] text-[#DAF1DE] font-semibold border border-[#5eead4]/40 shadow-sm'
                  : 'text-[#8EB69B] hover:text-[#DAF1DE]'
              }`}
              title="Tiered Connected Graph View"
            >
              <GitFork size={13} className={viewMode === 'graph' ? 'text-[#5eead4]' : ''} />
              <span>Graph</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#235347] text-[#DAF1DE] font-semibold border border-[#5eead4]/40 shadow-sm'
                  : 'text-[#8EB69B] hover:text-[#DAF1DE]'
              }`}
              title="Tiered Card Grid View"
            >
              <LayoutGrid size={13} className={viewMode === 'grid' ? 'text-[#5eead4]' : ''} />
              <span>Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Status Banner */}
      <div className="flex-shrink-0">
        <SinglePointBanner
          onInspectNode={() => {
            onSelectNode('water-plant-b');
            setIsDrawerOpen(true);
          }}
        />
      </div>

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        {viewMode === 'graph' ? (
          <GraphView
            nodes={nodes}
            edges={NETWORK_EDGES}
            selectedNodeId={selectedNodeId}
            onSelectNode={handleNodeClick}
            highlightMode={highlightMode}
            cascadeActiveNodeIds={activeCascadeNodeIds}
            cascadeActiveEdgeIds={activeCascadeEdgeIds}
          />
        ) : (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <GridView
              nodes={nodes}
              edges={NETWORK_EDGES}
              selectedNodeId={selectedNodeId}
              onSelectNode={(id) => onSelectNode(id)}
              highlightMode={highlightMode}
              cascadeActiveNodeIds={activeCascadeNodeIds}
            />

            {/* Docked bottom summary bar in Grid view */}
            {selectedNode && (
              <DockedNodeBar
                node={selectedNode}
                onSimulateFailure={(id) => handleStartFailureSimulation(id)}
                onOpenDetail={() => setIsDrawerOpen(true)}
              />
            )}
          </div>
        )}
      </div>

      {/* Slide-in Node Detail Drawer */}
      {isDrawerOpen && selectedNode && (
        <NodeDetailDrawer
          node={selectedNode}
          onClose={() => setIsDrawerOpen(false)}
          onSimulateFailure={(id) => {
            setIsDrawerOpen(false);
            handleStartFailureSimulation(id);
          }}
          onViewDependencies={() => {
            setHighlightMode('dependencies');
            setIsDrawerOpen(false);
          }}
        />
      )}

      {/* Failure Propagation Active Overlay Banner */}
      <AnimatePresence>
        {isSimulating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#701E1E]/95 backdrop-blur-md border border-[#C95C5C]/60 p-3.5 px-6 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs text-[#FFDADA]"
          >
            <Zap size={18} className="text-[#FFDADA] animate-bounce" />
            <div>
              <span className="font-bold uppercase tracking-wider block">Cascade Wave Propagation Active</span>
              <span className="opacity-90">Simulating sequential dependency failure across downstream tiers...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Failure Simulation Result Summary Toast Modal */}
      <AnimatePresence>
        {cascadeSummary && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg bg-[#0B2B26]/98 backdrop-blur-xl border border-[#C95C5C]/50 p-4 md:p-5 rounded-2xl shadow-[0_0_30px_rgba(201,92,92,0.35)]"
          >
            <div className="flex items-start justify-between mb-3 pb-2 border-b border-[#8EB69B]/15">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#701E1E] border border-[#C95C5C]/60 flex items-center justify-center text-[#FFDADA]">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-[#DAF1DE] text-sm leading-tight">Cascade Impact Summary</h4>
                  <span className="text-[11px] font-mono text-[#8EB69B]">Trigger: {cascadeSummary.rootNodeName}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={resetPropagation}
                className="p-1 rounded-lg bg-[#163832] text-[#8EB69B] hover:text-[#DAF1DE] transition-colors cursor-pointer"
                title="Dismiss"
              >
                <RotateCcw size={14} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 mb-3.5 text-center">
              <div className="p-2 rounded-xl bg-[#163832]/60 border border-[#8EB69B]/15">
                <span className="text-[10px] text-[#8EB69B] block">Affected Systems</span>
                <span className="text-base font-bold font-mono text-[#DAF1DE]">
                  {cascadeSummary.affectedNodesCount}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-[#163832]/60 border border-[#8EB69B]/15">
                <span className="text-[10px] text-[#8EB69B] block">Population At Risk</span>
                <span className="text-base font-bold font-mono text-[#C95C5C]">
                  {cascadeSummary.totalPopulationImpact.toLocaleString()}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-[#163832]/60 border border-[#8EB69B]/15">
                <span className="text-[10px] text-[#8EB69B] block">Critical Nodes</span>
                <span className="text-base font-bold font-mono text-[#D9A441]">
                  {cascadeSummary.criticalNodesAffected}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={resetPropagation}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-[#163832] text-[#DAF1DE] hover:bg-[#235347] border border-[#8EB69B]/25 text-xs font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Reset Graph</span>
              </button>

              {onNavigateToResults && (
                <button
                  type="button"
                  onClick={onNavigateToResults}
                  className="flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-[#235347] text-[#DAF1DE] hover:bg-[#2d695a] border border-[#5eead4]/40 text-xs font-bold transition-all shadow-glow-sm cursor-pointer"
                >
                  <span>View Results</span>
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default DependencyNetworkScreen;
