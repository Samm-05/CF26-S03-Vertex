import { useState, useRef, useCallback } from 'react';
import type { InfraNode, DependencyEdge, NodeStatus } from '../types';

export interface CascadeStep {
  hop: number;
  nodeIds: string[];
  edgeIds: string[];
  status: NodeStatus;
}

export interface CascadeSummary {
  rootNodeName: string;
  affectedNodesCount: number;
  totalPopulationImpact: number;
  criticalNodesAffected: number;
}

export function useFailurePropagation(
  initialNodes: InfraNode[],
  edges: DependencyEdge[],
  onSimulationDone?: (summary: CascadeSummary) => void
) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [nodeStatuses, setNodeStatuses] = useState<Record<string, NodeStatus>>({});
  const [activeCascadeNodeIds, setActiveCascadeNodeIds] = useState<string[]>([]);
  const [activeCascadeEdgeIds, setActiveCascadeEdgeIds] = useState<string[]>([]);
  const [cascadeSummary, setCascadeSummary] = useState<CascadeSummary | null>(null);

  const timeoutRefs = useRef<number[]>([]);

  const clearAllTimeouts = () => {
    timeoutRefs.current.forEach((t) => clearTimeout(t));
    timeoutRefs.current = [];
  };

  const startPropagation = useCallback(
    (rootNodeId: string) => {
      clearAllTimeouts();
      setIsSimulating(true);
      setCascadeSummary(null);

      const rootNode = initialNodes.find((n) => n.id === rootNodeId);
      if (!rootNode) return;

      // Build adjacency list for downstream propagation
      const adj: Record<string, { target: string; edgeId: string }[]> = {};
      edges.forEach((e) => {
        if (!adj[e.source]) adj[e.source] = [];
        adj[e.source].push({ target: e.target, edgeId: e.id });
      });

      // BFS layered traversal
      const layers: { nodes: string[]; edges: string[] }[] = [];
      const visited = new Set<string>([rootNodeId]);
      let currentLayer = [rootNodeId];

      while (currentLayer.length > 0) {
        const nextLayer: string[] = [];
        const layerEdges: string[] = [];

        currentLayer.forEach((u) => {
          (adj[u] || []).forEach(({ target, edgeId }) => {
            if (!visited.has(target)) {
              visited.add(target);
              nextLayer.push(target);
              layerEdges.push(edgeId);
            }
          });
        });

        if (nextLayer.length > 0) {
          layers.push({ nodes: nextLayer, edges: layerEdges });
        }
        currentLayer = nextLayer;
      }

      // Step 0: Root node fails immediately
      const initialMap: Record<string, NodeStatus> = { [rootNodeId]: 'failed' };
      setNodeStatuses(initialMap);
      setActiveCascadeNodeIds([rootNodeId]);
      setActiveCascadeEdgeIds([]);

      let accumulatedNodes = [rootNodeId];
      let accumulatedEdges: string[] = [];

      // Stagger subsequent wave layers
      layers.forEach((layer, layerIdx) => {
        const delay = (layerIdx + 1) * 450;
        const timer = window.setTimeout(() => {
          accumulatedNodes = [...accumulatedNodes, ...layer.nodes];
          accumulatedEdges = [...accumulatedEdges, ...layer.edges];

          setActiveCascadeNodeIds([...accumulatedNodes]);
          setActiveCascadeEdgeIds([...accumulatedEdges]);

          setNodeStatuses((prev) => {
            const next = { ...prev };
            layer.nodes.forEach((nid) => {
              next[nid] = layerIdx === 0 ? 'at_risk' : layerIdx === 1 ? 'degraded' : 'failed';
            });
            return next;
          });
        }, delay);

        timeoutRefs.current.push(timer);
      });

      // Finish simulation
      const totalDuration = (layers.length + 1) * 450 + 200;
      const finishTimer = window.setTimeout(() => {
        setIsSimulating(false);

        // Compute summary metrics
        const affectedNodes = initialNodes.filter((n) => visited.has(n.id));
        const totalPop = affectedNodes.reduce((acc, curr) => acc + curr.populationServed, 0);
        const criticalCount = affectedNodes.filter((n) => n.score >= 80).length;

        const summary: CascadeSummary = {
          rootNodeName: rootNode.name,
          affectedNodesCount: affectedNodes.length,
          totalPopulationImpact: totalPop,
          criticalNodesAffected: criticalCount
        };

        setCascadeSummary(summary);
        if (onSimulationDone) {
          onSimulationDone(summary);
        }
      }, totalDuration);

      timeoutRefs.current.push(finishTimer);
    },
    [initialNodes, edges, onSimulationDone]
  );

  const resetPropagation = useCallback(() => {
    clearAllTimeouts();
    setIsSimulating(false);
    setNodeStatuses({});
    setActiveCascadeNodeIds([]);
    setActiveCascadeEdgeIds([]);
    setCascadeSummary(null);
  }, []);

  return {
    isSimulating,
    nodeStatuses,
    activeCascadeNodeIds,
    activeCascadeEdgeIds,
    cascadeSummary,
    startPropagation,
    resetPropagation
  };
}
