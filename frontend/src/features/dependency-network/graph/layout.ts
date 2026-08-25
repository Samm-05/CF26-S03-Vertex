import type { InfraNode } from '../types';

export interface TierLayoutConfig {
  tierY: Record<number, number>;
  totalWidth: number;
}

export const TIER_Y_POSITIONS: Record<number, number> = {
  1: 40,
  2: 210,
  3: 400,
  4: 590,
  5: 770
};

export const TIER_BAND_HEIGHT = 170;

/**
 * Computes deterministic, beautifully balanced X and Y coordinates for each node
 * matching the 5-tiered layout in the reference design.
 */
export function computeTieredNodePositions(nodes: InfraNode[]): Record<string, { x: number; y: number }> {
  const positions: Record<string, { x: number; y: number }> = {};
  const cardWidth = 224; // 56 * 4 px

  // Group nodes by tier
  const tierGroups: Record<number, InfraNode[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] };
  nodes.forEach((node) => {
    if (tierGroups[node.tier]) {
      tierGroups[node.tier].push(node);
    }
  });

  const canvasWidth = 1200;

  // Compute horizontal spacing per tier
  Object.entries(tierGroups).forEach(([tierStr, tierNodes]) => {
    const tier = Number(tierStr);
    const count = tierNodes.length;
    const y = TIER_Y_POSITIONS[tier] || 50;

    if (count === 0) return;

    if (count === 1) {
      positions[tierNodes[0].id] = { x: (canvasWidth - cardWidth) / 2, y };
    } else {
      const margin = 50;
      const availableWidth = canvasWidth - 2 * margin - cardWidth;
      const step = availableWidth / (count - 1);

      tierNodes.forEach((node, index) => {
        const x = margin + index * step;
        positions[node.id] = { x, y };
      });
    }
  });

  return positions;
}
