import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeTypes,
  type EdgeTypes
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { InfraNode, DependencyEdge as AppDependencyEdge, HighlightMode } from '../types';
import { TIERS_META } from '../data/dependencyNetworkData';
import { NodeCard } from './NodeCard';
import { DependencyEdge } from './DependencyEdge';
import { computeTieredNodePositions, TIER_Y_POSITIONS, TIER_BAND_HEIGHT } from './layout';

const nodeTypes: NodeTypes = {
  nodeCard: NodeCard
};

const edgeTypes: EdgeTypes = {
  dependencyEdge: DependencyEdge
};

interface GraphViewProps {
  nodes: InfraNode[];
  edges: AppDependencyEdge[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  highlightMode: HighlightMode;
  cascadeActiveNodeIds?: string[];
  cascadeActiveEdgeIds?: string[];
}

export const GraphView: React.FC<GraphViewProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  highlightMode,
  cascadeActiveNodeIds = [],
  cascadeActiveEdgeIds = []
}) => {
  // Compute upstream dependencies and downstream dependents of the selected node
  const { upstreamIds, downstreamIds, connectedEdgeIds } = useMemo(() => {
    if (!selectedNodeId) {
      return { upstreamIds: new Set<string>(), downstreamIds: new Set<string>(), connectedEdgeIds: new Set<string>() };
    }

    const up = new Set<string>();
    const down = new Set<string>();
    const connEdges = new Set<string>();

    // BFS Upstream (Dependencies)
    const queueUp = [selectedNodeId];
    while (queueUp.length > 0) {
      const current = queueUp.shift()!;
      edges.forEach((edge) => {
        if (edge.target === current && !up.has(edge.source)) {
          up.add(edge.source);
          connEdges.add(edge.id);
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
          connEdges.add(edge.id);
          queueDown.push(edge.target);
        }
      });
    }

    return { upstreamIds: up, downstreamIds: down, connectedEdgeIds: connEdges };
  }, [selectedNodeId, edges]);

  // Node highlight / dim logic
  const isNodeHighlighted = useCallback(
    (nodeId: string) => {
      if (cascadeActiveNodeIds.includes(nodeId)) return true;
      if (!selectedNodeId) return true;
      if (nodeId === selectedNodeId) return true;
      if (highlightMode === 'dependencies') return upstreamIds.has(nodeId);
      if (highlightMode === 'dependents') return downstreamIds.has(nodeId);
      return upstreamIds.has(nodeId) || downstreamIds.has(nodeId);
    },
    [selectedNodeId, highlightMode, upstreamIds, downstreamIds, cascadeActiveNodeIds]
  );

  const isNodeDimmed = useCallback(
    (nodeId: string) => {
      if (cascadeActiveNodeIds.length > 0 && !cascadeActiveNodeIds.includes(nodeId)) return true;
      if (!selectedNodeId) return false;
      return !isNodeHighlighted(nodeId);
    },
    [selectedNodeId, isNodeHighlighted, cascadeActiveNodeIds]
  );

  // Compute fixed positions
  const nodePositions = useMemo(() => computeTieredNodePositions(nodes), [nodes]);

  // ReactFlow Nodes
  const rfNodes: Node[] = useMemo(() => {
    return nodes.map((node) => {
      const pos = nodePositions[node.id] || { x: 100, y: 100 };
      const isSelected = node.id === selectedNodeId;
      const isHighlighted = isNodeHighlighted(node.id);
      const isDimmed = isNodeDimmed(node.id);

      return {
        id: node.id,
        type: 'nodeCard',
        position: pos,
        data: {
          node,
          isSelected,
          isHighlighted,
          isDimmed,
          onSelect: onSelectNode
        },
        draggable: true
      };
    });
  }, [nodes, nodePositions, selectedNodeId, isNodeHighlighted, isNodeDimmed, onSelectNode]);

  // ReactFlow Edges
  const rfEdges: Edge[] = useMemo(() => {
    return edges.map((edge) => {
      const isCascade = cascadeActiveEdgeIds.includes(edge.id);
      const isConnected = connectedEdgeIds.has(edge.id);

      let isHighlighted = false;
      if (isCascade) {
        isHighlighted = true;
      } else if (selectedNodeId) {
        if (highlightMode === 'dependencies') {
          isHighlighted = upstreamIds.has(edge.source) && (upstreamIds.has(edge.target) || edge.target === selectedNodeId);
        } else if (highlightMode === 'dependents') {
          isHighlighted = (downstreamIds.has(edge.source) || edge.source === selectedNodeId) && downstreamIds.has(edge.target);
        } else {
          isHighlighted = isConnected;
        }
      }

      const isDimmed = selectedNodeId !== null && !isHighlighted;

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: 'dependencyEdge',
        data: {
          kind: edge.kind,
          isHighlighted,
          isDimmed,
          isCascadeActive: isCascade
        }
      };
    });
  }, [edges, selectedNodeId, highlightMode, connectedEdgeIds, upstreamIds, downstreamIds, cascadeActiveEdgeIds]);

  return (
    <div className="relative w-full h-full min-h-[650px] bg-[#051F20] rounded-2xl border border-[#8EB69B]/20 overflow-hidden flex flex-col">
      {/* Background Tier Row Bands & Labels */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {TIERS_META.map((tierMeta) => {
          const y = TIER_Y_POSITIONS[tierMeta.tier] || 0;
          return (
            <div
              key={tierMeta.tier}
              className="absolute left-0 right-0 border-b border-[#8EB69B]/10 flex items-start px-6 pt-3"
              style={{ top: `${y - 25}px`, height: `${TIER_BAND_HEIGHT}px` }}
            >
              <div className="flex items-center space-x-2 text-[10px] font-mono font-semibold uppercase tracking-widest text-[#8EB69B]/60 bg-[#051F20]/80 px-2.5 py-1 rounded-md border border-[#8EB69B]/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5eead4]/60" />
                <span>{tierMeta.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ReactFlow Interactive Canvas */}
      <div className="relative flex-1 w-full h-full z-10">
        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView={true}
          fitViewOptions={{ padding: 0.12 }}
          minZoom={0.3}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
          className="bg-transparent"
        >
          <Background color="#163832" gap={20} size={1} />
          <Controls
            className="!bg-[#0B2B26] !border !border-[#8EB69B]/25 !rounded-xl !shadow-card-depth overflow-hidden [&>button]:!bg-[#0B2B26] [&>button]:!border-b [&>button]:!border-[#8EB69B]/20 [&>button]:!fill-[#DAF1DE] [&>button:hover]:!bg-[#163832]"
            showInteractive={false}
          />
        </ReactFlow>
      </div>
    </div>
  );
};
