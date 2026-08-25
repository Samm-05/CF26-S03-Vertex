import type { SimulationConfig, SimulationRun, CascadeTimelineStep } from './types';
import type { InfrastructureNode, SimulationResult, Intervention, InfrastructureCategory } from '../../types';
import { INITIAL_NODES, DEPENDENCY_LINKS } from '../../data/infrastructureData';

const CATEGORY_ACTION_VERBS: Record<InfrastructureCategory, { fail: string; degrade: string; risk: string; restore: string }> = {
  power: {
    fail: 'Thermal Turbine Trip & Grid Line Severance',
    degrade: 'Voltage Instability & Automated Feeder Throttling',
    risk: 'Operating Under Heavy Thermal Capacity Surge',
    restore: 'Grid Line Re-synchronization & Full Basetime Output Restored'
  },
  water: {
    fail: 'High-Lift Intake Pumps Lost Voltage & Filtration Ceased',
    degrade: 'Pumping Flow Depleted by 55%; Pressure Dropping City-Wide',
    risk: 'Auxiliary Battery Reserves Engaged for Emergency Booster',
    restore: 'Main Water Aqueduct Pressurized & Normal Supply Restored'
  },
  healthcare: {
    fail: 'Hospital Lost Municipal Water & Main Grid; Trauma Divert Ordered',
    degrade: 'Non-Critical Surgery Theatres Suspended; Emergency Power Online',
    risk: 'Operating on On-site Emergency Generators with Critical Fuel Margin',
    restore: 'Central Medical Trauma Operations 100% Re-established'
  },
  emergency: {
    fail: '911 Dispatch & CAD Trunk Overwhelmed; Response Latency Exceeds 12m',
    degrade: 'Dispatch Operations Shifted to Satellite Backup Relay',
    risk: 'Handling Peak Emergency Call Surges Across Sectors',
    restore: 'Metropolitan Emergency Dispatch Operations Fully Stabilized'
  },
  transport: {
    fail: 'Traction Power Grid Blackout; Metro Interchange Paralyzed',
    degrade: 'Transit Signaling Operating at 50% Speed Restrictions',
    risk: 'Automated Switchgear Routing Trains to Safe Terminus',
    restore: 'Metro Corridors & Commuter Train Interchanges Fully Operational'
  },
  telecom: {
    fail: 'Core SCADA Telemetry & Fiber Optic Backbone Dropped Offline',
    degrade: 'Fiber Hub Switched to Battery Reserve; 340ms Latency Overhead',
    risk: 'Traffic Congestion on Microwave Secondary Trunk',
    restore: 'SCADA Communications & Cellular Towers Online at Full Bandwidth'
  },
  schools: {
    fail: 'District Municipal Water & Power Supply Severed; Campuses Evacuated',
    degrade: 'Low Water Pressure and Intermittent Brownout Conditions',
    risk: 'Civic Campuses Operating Under Precautionary Advisory',
    restore: 'District Schools & Civic Facilities Restored to Normal Schedule'
  },
  industrial: {
    fail: 'Industrial Park Automated Emergency Safety Shutdown Triggered',
    degrade: 'Heavy Manufacturing Cooling Systems Throttled',
    risk: 'Production Cells Operating on Secondary Auxiliary Feeds',
    restore: 'Industrial Plants Cleared for Safe Operations Restart'
  }
};

/**
 * Builds a 100% dynamic, graph-driven SimulationRun from ANY node, severity, duration, and conditions.
 */
export function buildSimulationRun(
  config: SimulationConfig,
  activeIntervention: Intervention | null = null,
  nodes: InfrastructureNode[] = INITIAL_NODES
): { run: SimulationRun; result: SimulationResult } {
  const targetNode = nodes.find((n) => n.id === config.targetNodeId) || nodes[0];
  const targetShortName = targetNode.name.split(' (')[0];

  const conditionMultiplier =
    (config.conditions.highDemandSurge ? 1.2 : 1) *
    (config.conditions.extremeWeatherEvent ? 1.15 : 1) *
    (config.conditions.backupSystemsOffline ? 1.3 : 1) *
    (config.conditions.scadaTelemetryJam ? 1.15 : 1);

  const baseSeverityRatio = config.severityPercent / 100;
  const effectiveSeverity = Math.min(1.6, baseSeverityRatio * conditionMultiplier);

  // Check if intervention mitigates
  const isInterventionApplied = activeIntervention !== null;
  const isMitigated =
    isInterventionApplied &&
    (activeIntervention.targetNodeId === targetNode.id ||
      targetNode.dependents?.includes(activeIntervention.targetNodeId) ||
      activeIntervention.targetNodeId === 'water-plant-b');

  // Adjacency graph traversal
  const nodeMap = new Map<string, InfrastructureNode>(nodes.map((n) => [n.id, n]));
  const adjacency = new Map<string, Array<{ targetId: string; strength: number; critical: boolean }>>();

  DEPENDENCY_LINKS.forEach((link) => {
    const list = adjacency.get(link.source) || [];
    list.push({
      targetId: link.target,
      strength: link.strength ?? (link.critical ? 0.9 : 0.6),
      critical: link.critical
    });
    adjacency.set(link.source, list);
  });

  const steps: CascadeTimelineStep[] = [];
  const visited = new Set<string>();
  const cascadeAffectedNodes = new Set<string>();
  const failedNodes = new Set<string>();
  const impactBreakdown = { hospitals: 0, water: 0, transport: 0, telecom: 0 };

  let cumulativePopulation = 0;

  // Step 0: Root trigger failure at T=0
  const rootLostCapacity = Math.round((targetNode.capacityNumeric || 100) * baseSeverityRatio);
  const rootPopImpact = Math.round(targetNode.populationImpact * baseSeverityRatio * (config.conditions.highDemandSurge ? 1.2 : 1));
  cumulativePopulation += rootPopImpact;
  cascadeAffectedNodes.add(targetNode.id);
  failedNodes.add(targetNode.id);

  if (targetNode.category === 'healthcare') impactBreakdown.hospitals++;
  if (targetNode.category === 'water') impactBreakdown.water++;
  if (targetNode.category === 'transport') impactBreakdown.transport++;
  if (targetNode.category === 'telecom') impactBreakdown.telecom++;

  const rootVerbs = CATEGORY_ACTION_VERBS[targetNode.category] || CATEGORY_ACTION_VERBS.power;

  steps.push({
    id: `step-0-${targetNode.id}`,
    offsetMinutes: 0,
    timeLabel: '0 min',
    nodeId: targetNode.id,
    nodeName: targetShortName,
    eventTitle: `${targetShortName}: ${rootVerbs.fail}`,
    status: config.severityPercent >= 50 ? 'failed' : 'degraded',
    note: `Primary failure trigger: -${config.severityPercent}% capacity (${rootLostCapacity} ${targetNode.capacity.split(' ')[1] || 'units'} lost).`,
    description: `Primary trigger failure at ${targetNode.name} under ${
      config.conditions.highDemandSurge ? 'High Demand Surge (+30%)' : 'Standard Demand'
    } and ${config.conditions.extremeWeatherEvent ? 'Extreme Weather Conditions' : 'Nominal Ambient Climate'}.`,
    impactSummary: `${targetShortName} lost ${config.severityPercent}% operational throughput. ${rootPopImpact.toLocaleString()} citizens directly affected.`,
    impactedPopChange: rootPopImpact,
    strainedNodesDelta: 1
  });

  visited.add(targetNode.id);

  // Queue for BFS traversal
  const queue: Array<{ nodeId: string; time: number; inheritedImpact: number; level: number }> = [
    { nodeId: targetNode.id, time: 0, inheritedImpact: effectiveSeverity, level: 1 }
  ];

  const timeSlots = [10, 20, 35, 50, 65, 80, 95];
  let timeSlotIdx = 0;

  while (queue.length > 0 && steps.length < 8) {
    const current = queue.shift()!;
    const edges = adjacency.get(current.nodeId) || [];
    const sortedEdges = [...edges].sort((a, b) => b.strength - a.strength);

    for (const edge of sortedEdges) {
      if (visited.has(edge.targetId)) continue;
      const targetObj = nodeMap.get(edge.targetId);
      if (!targetObj) continue;

      visited.add(edge.targetId);
      cascadeAffectedNodes.add(targetObj.id);

      const impactScore = current.inheritedImpact * edge.strength;
      const isThisNodeMitigated = isInterventionApplied && activeIntervention.targetNodeId === targetObj.id;

      let status: 'failed' | 'degraded' | 'at_risk' | 'healthy_active' = 'at_risk';
      if (isThisNodeMitigated) {
        status = 'healthy_active';
      } else if (impactScore >= 0.7) {
        status = 'failed';
        failedNodes.add(targetObj.id);
      } else if (impactScore >= 0.4) {
        status = 'degraded';
      }

      if (targetObj.category === 'healthcare') impactBreakdown.hospitals++;
      if (targetObj.category === 'water') impactBreakdown.water++;
      if (targetObj.category === 'transport') impactBreakdown.transport++;
      if (targetObj.category === 'telecom') impactBreakdown.telecom++;

      const stepTimeMinutes = timeSlots[timeSlotIdx] ?? (timeSlotIdx + 1) * 15;
      timeSlotIdx++;

      const nodeShort = targetObj.name.split(' (')[0];
      const verbs = CATEGORY_ACTION_VERBS[targetObj.category] || CATEGORY_ACTION_VERBS.power;
      const nodePop = Math.round(targetObj.populationImpact * (status === 'healthy_active' ? 0 : impactScore));
      cumulativePopulation += nodePop;

      let eventTitle = `${nodeShort}: ${status === 'failed' ? verbs.fail : status === 'degraded' ? verbs.degrade : status === 'healthy_active' ? 'Intervention Active — Auxiliary Backup Power Engaged' : verbs.risk}`;
      let note = isThisNodeMitigated
        ? `Intervention active: automated backup isolated failure wave.`
        : `${targetObj.coordinates.district} experiencing ${status} status via dependency on ${nodeMap.get(current.nodeId)?.name.split(' (')[0]}.`;

      steps.push({
        id: `step-${steps.length}-${targetObj.id}`,
        offsetMinutes: stepTimeMinutes,
        timeLabel: `${stepTimeMinutes} min`,
        nodeId: targetObj.id,
        nodeName: nodeShort,
        eventTitle,
        status,
        note,
        description: isThisNodeMitigated
          ? `Active intervention deployed at ${targetObj.name}. Backup diesel generators and ATS isolated this sector in 45s.`
          : `Cascade wave reached ${targetObj.name} in ${targetObj.coordinates.district} through ${edge.critical ? 'Critical' : 'Standard'} feed link.`,
        impactSummary: isThisNodeMitigated
          ? `Downstream cascade halted. ${targetObj.name} sustained 100% operational uptime.`
          : `${targetObj.name} status shifted to ${status.toUpperCase()}. Additional ${nodePop.toLocaleString()} residents affected.`,
        impactedPopChange: nodePop,
        strainedNodesDelta: cascadeAffectedNodes.size
      });

      // If not mitigated, continue propagating downstream
      if (!isThisNodeMitigated && impactScore > 0.3) {
        queue.push({
          nodeId: targetObj.id,
          time: stepTimeMinutes,
          inheritedImpact: impactScore,
          level: current.level + 1
        });
      }
    }
  }

  // Recovery Window calculation
  const calculatedRecoveryHours = isMitigated
    ? Math.max(4, Math.round(config.durationHours * 0.5))
    : Math.max(6, Math.round(config.durationHours * (config.severityPercent / 70) * conditionMultiplier));

  // Final Step: Complete Restoration
  steps.push({
    id: `step-final-${targetNode.id}`,
    offsetMinutes: calculatedRecoveryHours * 60,
    timeLabel: `${calculatedRecoveryHours} hr`,
    nodeId: targetNode.id,
    nodeName: targetShortName,
    eventTitle: `${targetShortName}: Complete Restoration & Grid Re-stabilization (${calculatedRecoveryHours} Hours)`,
    status: isMitigated ? 'operational' : 'healthy_active',
    note: isMitigated
      ? `Cascade isolated quickly. Full city stabilization achieved in ${calculatedRecoveryHours} hours.`
      : `Emergency grid reconstruction completed after ${calculatedRecoveryHours} hours.`,
    description: `Comprehensive recovery achieved across all ${cascadeAffectedNodes.size} strained infrastructure sectors.`,
    impactSummary: `All municipal services, water lines, healthcare facilities, and transit returned to nominal capacity.`,
    impactedPopChange: 0,
    strainedNodesDelta: 0
  });

  const totalImpactedPopulation = isMitigated
    ? Math.round(cumulativePopulation * 0.3)
    : cumulativePopulation;

  const totalStrained = cascadeAffectedNodes.size;

  const runLabel = isMitigated
    ? `${targetShortName} Failure (Mitigated Profile Active — ${calculatedRecoveryHours}h Recovery)`
    : `${targetShortName} Failure (${config.severityPercent}% Severity, ${config.durationHours}h Window, ${totalStrained} Systems Strained)`;

  const run: SimulationRun = {
    id: `run-${Date.now()}`,
    label: runLabel,
    config,
    mitigatedProfileActive: isMitigated,
    totalDurationHours: calculatedRecoveryHours,
    steps,
    impactedPopulation: totalImpactedPopulation,
    strainedNodeCount: totalStrained,
    rootCauseNodeId: targetNode.id,
    rootCauseName: targetNode.name,
    recoveryClockLabel: isMitigated
      ? `Active Repair (${calculatedRecoveryHours}h)`
      : `${calculatedRecoveryHours} Hours (Est. Repair)`
  };

  const result: SimulationResult = {
    config: {
      targetNodeId: config.targetNodeId,
      severity: config.severityPercent,
      durationHours: config.durationHours,
      extremeWeather: config.conditions.extremeWeatherEvent,
      highDemand: config.conditions.highDemandSurge,
      backupUnavailable: config.conditions.backupSystemsOffline
    },
    targetNodeName: targetNode.name,
    affectedNodesCount: totalStrained,
    failedNodesCount: failedNodes.size,
    criticalNodesAffected: Math.max(1, Math.round(totalStrained * 0.6)),
    populationAtRisk: totalImpactedPopulation,
    estimatedRecoveryHours: calculatedRecoveryHours,
    impactBreakdown,
    cascadeDepth: steps.length - 1,
    timeline: steps.map((s, idx) => ({
      stepIndex: idx,
      timeMinutes: s.offsetMinutes,
      timeLabel: s.timeLabel,
      nodeId: s.nodeId,
      nodeName: s.nodeName,
      category: nodeMap.get(s.nodeId)?.category || 'power',
      previousStatus: 'operational',
      newStatus: s.status === 'healthy_active' ? 'healthy' : (s.status as any),
      description: s.description || s.eventTitle,
      impactSummary: s.impactSummary || s.note || ''
    })),
    rootCauseNodeId: targetNode.id,
    rootCauseName: targetNode.name,
    propagationPathNames: steps.slice(0, -1).map((s) => s.nodeName),
    mainVulnerability: isMitigated
      ? `Mitigation active: localized backup power prevented full multi-sector cascade from ${targetShortName}.`
      : `High dependency coupling from ${targetShortName} rapidly propagates through ${targetNode.dependents.join(', ')}.`
  };

  return { run, result };
}
