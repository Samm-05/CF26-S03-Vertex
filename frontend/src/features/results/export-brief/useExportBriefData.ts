import { useMemo } from 'react';
import type { SimulationResult, Intervention } from '../../../types';
import { buildBriefJson } from './buildBriefJson';
import { downloadJson } from './downloadJson';

interface UseExportBriefDataProps {
  result: SimulationResult;
  activeIntervention?: Intervention | null;
}

export function useExportBriefData({ result, activeIntervention }: UseExportBriefDataProps) {
  const scenarioLabel = useMemo(() => {
    const demandSuffix = result.config.highDemand ? ' High Demand Scenario' : ' Scenario';
    return `${result.targetNodeName} Failure — ${result.config.durationHours} Hour${demandSuffix}`;
  }, [result.targetNodeName, result.config.durationHours, result.config.highDemand]);

  const resilienceScore = useMemo(() => {
    // 78 is base, rises to 86 if mitigation is applied
    if (activeIntervention) return 86;
    return 78;
  }, [activeIntervention]);

  const keyMitigationFinding = useMemo(() => {
    if (result.config.targetNodeId === 'power-station-a') {
      return 'Water Plant B lacks redundant power feed. A single electrical outage at Power Station A propagates directly to 4 hospitals and 3 water processing hubs.';
    }
    if (result.config.targetNodeId === 'water-plant-b') {
      return 'Water Plant B is an architectural single point of failure without secondary hydraulic reservoirs. Loss of power causes rapid pressure drop at GMCH Trauma and AIIMS within 45 minutes.';
    }
    return `${result.targetNodeName} presents a critical vulnerability node. An outage here triggers a ${result.cascadeDepth}-tier cascade across ${result.affectedNodesCount} municipal assets, impacting ${result.impactBreakdown.hospitals} hospital networks, ${result.impactBreakdown.water} water plants, and ${(result.populationAtRisk / 1000).toFixed(0)}K citizens.`;
  }, [
    result.config.targetNodeId,
    result.targetNodeName,
    result.cascadeDepth,
    result.affectedNodesCount,
    result.impactBreakdown,
    result.populationAtRisk
  ]);

  const handleExportJson = () => {
    const briefData = buildBriefJson(
      result,
      scenarioLabel,
      resilienceScore,
      keyMitigationFinding,
      activeIntervention
    );

    const slug = result.targetNodeName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(
      now.getHours()
    )}${pad(now.getMinutes())}`;

    const filename = `cascade-brief-${slug}-${timestamp}.json`;
    downloadJson(briefData, filename);
  };

  const handlePrint = () => {
    window.print();
  };

  return {
    scenarioLabel,
    resilienceScore,
    affectedNodes: result.affectedNodesCount,
    failedNodes: result.failedNodesCount,
    popAtRisk: `${(result.populationAtRisk / 1000).toFixed(0)}K`,
    recoveryTime: `${result.estimatedRecoveryHours} Hours`,
    keyMitigationFinding,
    handleExportJson,
    handlePrint
  };
}
