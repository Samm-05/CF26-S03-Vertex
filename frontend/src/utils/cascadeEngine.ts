import type {
  InfrastructureNode,
  SimulationConfig,
  SimulationResult,
  Intervention,
  ComparisonResult
} from '../types';
import { INITIAL_NODES } from '../data/infrastructureData';
import { buildSimulationRun } from '../features/cascade-simulator/simulationEngine';

/**
 * Executes a fully dynamic cascade failure simulation starting from ANY target node.
 */
export function runCascadeSimulation(
  config: SimulationConfig,
  activeIntervention: Intervention | null = null,
  nodesList: InfrastructureNode[] = INITIAL_NODES
): SimulationResult {
  const simConfig = {
    targetNodeId: config.targetNodeId || 'power-station-a',
    severityPercent: config.severity ?? 70,
    durationHours: config.durationHours ?? 12,
    conditions: {
      highDemandSurge: config.highDemand ?? false,
      extremeWeatherEvent: config.extremeWeather ?? false,
      backupSystemsOffline: config.backupUnavailable ?? false,
      scadaTelemetryJam: false
    }
  };

  const { result } = buildSimulationRun(simConfig, activeIntervention, nodesList);
  return result;
}

/**
 * Computes comparative metrics between baseline (without intervention) and mitigated state (with intervention).
 */
export function calculateBeforeAfterComparison(
  config: SimulationConfig,
  intervention: Intervention
): ComparisonResult {
  const withoutRes = runCascadeSimulation(config, null);
  const withRes = runCascadeSimulation(config, intervention);

  const popRed = withoutRes.populationAtRisk > 0
    ? Math.round(((withoutRes.populationAtRisk - withRes.populationAtRisk) / withoutRes.populationAtRisk) * 100)
    : 0;

  const infraRed = withoutRes.affectedNodesCount > 0
    ? Math.round(((withoutRes.affectedNodesCount - withRes.affectedNodesCount) / withoutRes.affectedNodesCount) * 100)
    : 0;

  const hospRed = withoutRes.impactBreakdown.hospitals > 0
    ? Math.round(((withoutRes.impactBreakdown.hospitals - withRes.impactBreakdown.hospitals) / withoutRes.impactBreakdown.hospitals) * 100)
    : 0;

  const recImp = withoutRes.estimatedRecoveryHours > 0
    ? Math.round(((withoutRes.estimatedRecoveryHours - withRes.estimatedRecoveryHours) / withoutRes.estimatedRecoveryHours) * 100)
    : 0;

  return {
    withoutIntervention: {
      populationAffected: withoutRes.populationAtRisk,
      infrastructureAffected: withoutRes.affectedNodesCount,
      hospitalsAffected: withoutRes.impactBreakdown.hospitals,
      recoveryHours: withoutRes.estimatedRecoveryHours
    },
    withIntervention: {
      populationAffected: withRes.populationAtRisk,
      infrastructureAffected: withRes.affectedNodesCount,
      hospitalsAffected: withRes.impactBreakdown.hospitals,
      recoveryHours: withRes.estimatedRecoveryHours
    },
    improvements: {
      populationReductionPercent: Math.max(0, popRed),
      infrastructureReductionPercent: Math.max(0, infraRed),
      hospitalsReductionPercent: Math.max(0, hospRed),
      recoveryImprovementPercent: Math.max(0, recImp)
    },
    appliedIntervention: intervention
  };
}
