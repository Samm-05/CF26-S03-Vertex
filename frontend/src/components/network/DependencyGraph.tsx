import React, { useState } from 'react';
import type { InfrastructureNode, DependencyLink } from '../../types';
import {
  Zap,
  Droplets,
  Hospital,
  Radio,
  Train,
  Shield,
  School,
  Factory,
  Layers,
  Play
} from 'lucide-react';

interface DependencyGraphProps {
  nodes: InfrastructureNode[];
  links: DependencyLink[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  onSimulateFailure: (nodeId: string) => void;
}

export const DependencyGraph: React.FC<DependencyGraphProps> = ({
  nodes,
  links: _links,
  selectedNodeId,
  onSelectNode,
  onSimulateFailure
}) => {
  const [highlightMode, setHighlightMode] = useState<'all' | 'dependencies' | 'dependents'>('all');

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  // Group nodes by cascade tier levels (Level 1 to Level 5)
  const tiers = [1, 2, 3, 4, 5];

  const getNodesForTier = (lvl: number) => nodes.filter((n) => n.level === lvl);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'power':
        return Zap;
      case 'water':
        return Droplets;
      case 'telecom':
        return Radio;
      case 'healthcare':
        return Hospital;
      case 'transport':
        return Train;
      case 'emergency':
        return Shield;
      case 'schools':
        return School;
      default:
        return Factory;
    }
  };

  // Determine node active/dimmed status based on selected node & mode
  const isNodeHighlighted = (nodeId: string) => {
    if (!selectedNodeId) return true;
    if (nodeId === selectedNodeId) return true;

    if (highlightMode === 'dependencies' && selectedNode) {
      return selectedNode.dependencies.includes(nodeId);
    }
    if (highlightMode === 'dependents' && selectedNode) {
      return selectedNode.dependents.includes(nodeId);
    }

    return (
      selectedNode?.dependencies.includes(nodeId) ||
      selectedNode?.dependents.includes(nodeId)
    );
  };

  return (
    <div className="flex-1 bg-[#051F20] rounded-card border border-[#8EB69B]/20 p-4 md:p-6 flex flex-col h-full overflow-hidden relative">
      {/* Network Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#8EB69B]/15 z-10">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#8EB69B] uppercase tracking-wider mb-0.5">
            <Layers size={14} />
            <span>Interactive Topological Dependency Graph</span>
          </div>
          <h2 className="text-xl font-bold text-[#DAF1DE]">Cascade Vulnerability Graph</h2>
        </div>

        {/* Path Highlight Toggle Buttons */}
        {selectedNodeId && (
          <div className="flex items-center space-x-2 bg-[#0B2B26] p-1 rounded-xl border border-[#8EB69B]/20">
            <button
              onClick={() => setHighlightMode('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                highlightMode === 'all' ? 'bg-[#235347] text-[#DAF1DE]' : 'text-[#8EB69B]'
              }`}
            >
              All Connected
            </button>
            <button
              onClick={() => setHighlightMode('dependencies')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                highlightMode === 'dependencies' ? 'bg-[#235347] text-[#DAF1DE]' : 'text-[#8EB69B]'
              }`}
            >
              Highlight Dependencies
            </button>
            <button
              onClick={() => setHighlightMode('dependents')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                highlightMode === 'dependents' ? 'bg-[#235347] text-[#DAF1DE]' : 'text-[#8EB69B]'
              }`}
            >
              Highlight Dependents
            </button>
          </div>
        )}
      </div>

      {/* Main Tiered Graph Container */}
      <div className="flex-1 overflow-x-auto overflow-y-auto relative p-4">
        <div className="min-w-[900px] space-y-8">
          {tiers.map((tierLvl) => {
            const tierNodes = getNodesForTier(tierLvl);
            if (tierNodes.length === 0) return null;

            const tierNames = [
              'Tier 1 — Power Generation Backbone',
              'Tier 2 — Water Treatment & Primary Telecom',
              'Tier 3 — Healthcare & Regional Transport',
              'Tier 4 — Emergency Dispatch & Industrial Facilities',
              'Tier 5 — Residential Neighborhoods & Public Schools'
            ];

            return (
              <div key={tierLvl} className="relative">
                {/* Tier Label */}
                <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-[#8EB69B] uppercase tracking-wider mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#8EB69B]" />
                  <span>{tierNames[tierLvl - 1]}</span>
                </div>

                {/* Nodes row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {tierNodes.map((node) => {
                    const isSelected = node.id === selectedNodeId;
                    const isHighlighted = isNodeHighlighted(node.id);
                    const Icon = getCategoryIcon(node.category);

                    return (
                      <div
                        key={node.id}
                        onClick={() => onSelectNode(node.id)}
                        className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer relative group ${
                          isSelected
                            ? 'bg-[#163832] border-[#DAF1DE] shadow-glow-lg ring-2 ring-[#DAF1DE]/40 translate-y-[-2px]'
                            : isHighlighted
                            ? 'bg-[#163832]/80 border-[#235347] shadow-glow-sm hover:border-[#8EB69B]'
                            : 'bg-[#0B2B26]/40 border-[#8EB69B]/10 opacity-35 hover:opacity-80'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                              isSelected
                                ? 'bg-[#235347] border-[#DAF1DE] text-[#DAF1DE]'
                                : 'bg-[#051F20] border-[#8EB69B]/30 text-[#8EB69B]'
                            }`}
                          >
                            <Icon size={18} />
                          </div>
                          <span
                            className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                              isSelected
                                ? 'bg-[#235347] text-[#DAF1DE]'
                                : 'bg-[#051F20] text-[#8EB69B]'
                            }`}
                          >
                            {node.criticality}/100
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-[#DAF1DE] truncate mb-1">
                          {node.name}
                        </h3>
                        <p className="text-[11px] text-[#8EB69B] truncate">
                          {node.dependentSystemsCount} direct dependents
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Selected Node Quick Detail Bar */}
      {selectedNode && (
        <div className="mt-4 p-4 rounded-xl bg-[#0B2B26]/95 border border-[#8EB69B]/30 flex flex-col md:flex-row items-center justify-between gap-4 z-10 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center space-x-4 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#163832] border border-[#8EB69B]/40 flex items-center justify-center shrink-0">
              <Zap size={20} className="text-[#DAF1DE]" />
            </div>
            <div className="min-w-0">
              <h4 className="text-base font-bold text-[#DAF1DE] truncate">{selectedNode.name}</h4>
              <p className="text-xs text-[#8EB69B]">
                Type: {selectedNode.category.toUpperCase()} • Criticality: {selectedNode.criticality}/100 • Impact: {selectedNode.populationImpact.toLocaleString()} pop
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={() => onSimulateFailure(selectedNode.id)}
              className="flex-1 md:flex-initial flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-[#235347] text-[#DAF1DE] hover:bg-[#1e4840] border border-[#8EB69B]/30 font-semibold text-xs transition-colors"
            >
              <Play size={14} className="fill-[#DAF1DE]" />
              <span>Simulate Failure</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
