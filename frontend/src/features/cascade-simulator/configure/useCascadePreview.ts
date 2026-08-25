import { useMemo } from 'react';
import type { SimulationConfig, CascadePreviewStep, CascadeSeverity } from '../types';
import type { InfrastructureNode, DependencyLink } from '../../../types';
import { INITIAL_NODES, DEPENDENCY_LINKS } from '../../../data/infrastructureData';

const NODE_EFFECT_DESCRIPTIONS: Record<string, { failed: string; degraded: string; at_risk: string }> = {
  'power-station-a': {
    failed: 'trips thermal baseline & triggers grid severance',
    degraded: 'drops output frequency below baseline 49.2 Hz',
    at_risk: 'surges past 92% thermal capacity margin'
  },
  'power-station-b': {
    failed: 'substation busbar trips, isolating southern sector',
    degraded: 'load shed initiates across commercial belts',
    at_risk: 'substation transformer core temperature spiking'
  },
  'water-plant-b': {
    failed: 'high-lift pumps lose voltage; zero pressure city-wide',
    degraded: 'auxiliary pressure throttled; reservoir flow drops 60%',
    at_risk: 'backup battery reserves engaged under low voltage'
  },
  'water-plant-a': {
    failed: 'water filtration shutdown in West Sector',
    degraded: 'treatment throughput degraded by 45%',
    at_risk: 'intake pumps experiencing voltage instability'
  },
  'telecom-hub-c': {
    failed: 'SCADA telemetry backbone drops offline completely',
    degraded: 'fiber optic routing throttled; 340ms latency spikes',
    at_risk: 'telemetry packet drops on transit IoT circuits'
  },
  'telecom-hub-a': {
    failed: 'MIHAN gateway loses redundant link connection',
    degraded: 'emergency dispatch backup channel restricted',
    at_risk: 'packet congestion on southern gateway'
  },
  'hospital-network-a': {
    failed: 'sterilizers & HVAC offline; trauma divert ordered',
    degraded: 'ICU generators at max load; non-critical ops halted',
    at_risk: 'auxiliary power online; sterile water reserves dwindling'
  },
  'hospital-network-b': {
    failed: 'trauma intake suspended; patient evacuations initiated',
    degraded: 'diagnostics powered down; emergency lighting active',
    at_risk: 'backup generators running with 8-hour fuel margin'
  },
  'transport-hub-d': {
    failed: 'traction power lost; metro corridor immobilized',
    degraded: 'signaling throttled; commuter throughput down 50%',
    at_risk: 'automated transfer switch rerouting railway signals'
  },
  'emergency-center-a': {
    failed: 'CAD dispatch units throttled; 911 queues surge',
    degraded: 'dispatch response delay exceeds 8 minutes',
    at_risk: 'handling 240% call volume on microwave backup link'
  },
  'industrial-alpha': {
    failed: 'automated shutdown sequence triggered across MIDC plants',
    degraded: 'cooling tower pressure loss halts precision fabrication',
    at_risk: 'voltage dip trips non-essential manufacturing cells'
  },
  'residential-zone-a': {
    failed: 'municipal water & local distribution blackouts widespread',
    degraded: 'brownout conditions and low tap water pressure',
    at_risk: 'telecom broadband degraded across 14 school zones'
  },
  'residential-zone-b': {
    failed: 'rolling blackouts and civic water cutoffs initiated',
    degraded: 'street grid and residential water throttling active',
    at_risk: 'public broadcasts notify residents of emergency rationing'
  }
};

/**
 * Traverses the dependency network using BFS starting from the target node
 * to compute the deterministic cascade pathway preview.
 */
export function computeCascadePreview(
  config: SimulationConfig,
  nodes: InfrastructureNode[] = INITIAL_NODES,
  links: DependencyLink[] = DEPENDENCY_LINKS
): CascadePreviewStep[] {
  const targetNode = nodes.find((n) => n.id === config.targetNodeId) || nodes[0];
  if (!targetNode) return [];

  const nodeMap = new Map<string, InfrastructureNode>(nodes.map((n) => [n.id, n]));
  const adjacency = new Map<string, Array<{ targetId: string; strength: number; critical: boolean }>>();

  links.forEach((link) => {
    const list = adjacency.get(link.source) || [];
    list.push({
      targetId: link.target,
      strength: link.strength ?? (link.critical ? 0.9 : 0.6),
      critical: link.critical
    });
    adjacency.set(link.source, list);
  });

  const steps: CascadePreviewStep[] = [];
  const visited = new Set<string>();
  const queue: Array<{ nodeId: string; time: number; inheritedSeverity: number }> = [];

  // Initial trigger at T=0
  const initialSeverity: CascadeSeverity = config.severityPercent >= 70 ? 'failed' : 'degraded';
  const initialEffect =
    NODE_EFFECT_DESCRIPTIONS[targetNode.id]?.[initialSeverity] ||
    `${initialSeverity === 'failed' ? 'suffers major failure' : 'experiences severe degradation'}`;

  steps.push({
    offsetMinutes: 0,
    nodeId: targetNode.id,
    nodeName: targetNode.name.split(' (')[0],
    effectDescription: `${targetNode.name.split(' (')[0]} ${initialEffect}`,
    severity: initialSeverity
  });

  visited.add(targetNode.id);
  queue.push({
    nodeId: targetNode.id,
    time: 0,
    inheritedSeverity: config.severityPercent / 100
  });

  // Multiplier for conditions
  const conditionFactor =
    (config.conditions.highDemandSurge ? 1.2 : 1) *
    (config.conditions.extremeWeatherEvent ? 1.15 : 1) *
    (config.conditions.backupSystemsOffline ? 1.3 : 1) *
    (config.conditions.scadaTelemetryJam ? 1.15 : 1);

  const timeOffsets = [10, 20, 30, 45, 60, 75, 90];
  let timeIdx = 0;

  while (queue.length > 0 && steps.length < 8) {
    const current = queue.shift()!;
    const edges = adjacency.get(current.nodeId) || [];

    // Sort edges by critical strength
    const sortedEdges = [...edges].sort((a, b) => b.strength - a.strength);

    for (const edge of sortedEdges) {
      if (visited.has(edge.targetId)) continue;
      const targetNodeObj = nodeMap.get(edge.targetId);
      if (!targetNodeObj) continue;

      visited.add(edge.targetId);

      const impactScore = current.inheritedSeverity * edge.strength * conditionFactor;
      let severity: CascadeSeverity = 'at_risk';
      if (impactScore > 0.75) {
        severity = 'failed';
      } else if (impactScore > 0.45) {
        severity = 'degraded';
      }

      const offsetMinutes = timeOffsets[timeIdx] ?? ((timeIdx + 1) * 15);
      timeIdx++;

      const shortName = targetNodeObj.name.split(' (')[0];
      const effectDesc =
        NODE_EFFECT_DESCRIPTIONS[targetNodeObj.id]?.[severity] ||
        (severity === 'failed'
          ? 'suffers critical cascade failure and halts service'
          : severity === 'degraded'
          ? 'experiences capacity throttling and system strain'
          : 'operates under elevated risk with emergency margins');

      steps.push({
        offsetMinutes,
        nodeId: targetNodeObj.id,
        nodeName: shortName,
        effectDescription: `${shortName} ${effectDesc}`,
        severity
      });

      queue.push({
        nodeId: targetNodeObj.id,
        time: offsetMinutes,
        inheritedSeverity: impactScore
      });
    }
  }

  return steps;
}

export function useCascadePreview(config: SimulationConfig) {
  return useMemo(() => {
    return computeCascadePreview(config);
  }, [
    config.targetNodeId,
    config.severityPercent,
    config.durationHours,
    config.conditions.highDemandSurge,
    config.conditions.extremeWeatherEvent,
    config.conditions.backupSystemsOffline,
    config.conditions.scadaTelemetryJam
  ]);
}
