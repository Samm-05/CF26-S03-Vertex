import type { SimulationResult, Intervention } from '../../../types';

export interface CascadeBriefExport {
  exportedAt: string;
  scenario: {
    label: string;
    targetNodeId: string;
    targetNodeName: string;
    durationHours: number;
    severity: number;
    resilienceScore: number;
  };
  summary: {
    affectedNodes: number;
    failedNodes: number;
    criticalNodesAffected: number;
    populationAtRisk: number;
    recoveryTimeHours: number;
  };
  keyMitigationFinding: string;
  impactBreakdown: {
    hospitals: number;
    water: number;
    transport: number;
    telecom: number;
  };
  cascadeDepth: number;
  timelineStepsCount: number;
  timeline: Array<{
    minute: number;
    nodeId: string;
    nodeName: string;
    status: string;
    description: string;
  }>;
  appliedIntervention?: {
    id: string;
    title: string;
    description: string;
    cost: string;
    riskReduction: number;
  } | null;
}

export function buildBriefJson(
  result: SimulationResult,
  scenarioLabel: string,
  resilienceScore: number,
  keyMitigationFinding: string,
  activeIntervention?: Intervention | null
): CascadeBriefExport {
  return {
    exportedAt: new Date().toISOString(),
    scenario: {
      label: scenarioLabel,
      targetNodeId: result.config.targetNodeId,
      targetNodeName: result.targetNodeName,
      durationHours: result.config.durationHours,
      severity: result.config.severity,
      resilienceScore
    },
    summary: {
      affectedNodes: result.affectedNodesCount,
      failedNodes: result.failedNodesCount,
      criticalNodesAffected: result.criticalNodesAffected,
      populationAtRisk: result.populationAtRisk,
      recoveryTimeHours: result.estimatedRecoveryHours
    },
    keyMitigationFinding,
    impactBreakdown: {
      hospitals: result.impactBreakdown.hospitals,
      water: result.impactBreakdown.water,
      transport: result.impactBreakdown.transport,
      telecom: result.impactBreakdown.telecom
    },
    cascadeDepth: result.cascadeDepth,
    timelineStepsCount: result.timeline ? result.timeline.length : 0,
    timeline: result.timeline
      ? result.timeline.map((step) => ({
          minute: step.timeMinutes,
          nodeId: step.nodeId,
          nodeName: step.nodeName,
          status: step.newStatus,
          description: step.description
        }))
      : [],
    appliedIntervention: activeIntervention
      ? {
          id: activeIntervention.id,
          title: activeIntervention.title,
          description: activeIntervention.description,
          cost: activeIntervention.estimatedCost,
          riskReduction: activeIntervention.riskReductionPercent
        }
      : null
  };
}
