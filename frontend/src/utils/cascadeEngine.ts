import type {
  InfrastructureNode,
  SimulationConfig,
  SimulationResult,
  SimulationStep,
  Intervention,
  ComparisonResult
} from '../types';
import { INITIAL_NODES } from '../data/infrastructureData';

/**
 * Executes a cascade failure simulation starting from a target node.
 */
export function runCascadeSimulation(
  config: SimulationConfig,
  activeIntervention: Intervention | null = null,
  nodesList: InfrastructureNode[] = INITIAL_NODES
): SimulationResult {
  const targetNode = nodesList.find((n) => n.id === config.targetNodeId) || nodesList[0];

  // Check if active intervention mitigates this target or direct cascade node
  const isInterventionApplied = activeIntervention !== null;
  const isMitigatedWaterPlant =
    isInterventionApplied && activeIntervention.targetNodeId === 'water-plant-b';

  // Base metrics multiplier according to severity and conditions
  const severityRatio = config.severity / 100;
  const conditionMultiplier =
    (config.extremeWeather ? 1.15 : 1) *
    (config.highDemand ? 1.2 : 1) *
    (config.backupUnavailable ? 1.25 : 1);

  const effectiveSeverity = Math.min(1.5, severityRatio * conditionMultiplier);

  // Timeline events generation
  const timeline: SimulationStep[] = [];
  let stepIdx = 0;

  // Step 0: Initial Failure (T = 0 min)
  timeline.push({
    stepIndex: stepIdx++,
    timeMinutes: 0,
    timeLabel: '0 min',
    nodeId: targetNode.id,
    nodeName: targetNode.name,
    category: targetNode.category,
    previousStatus: 'operational',
    newStatus: 'failed',
    description: `Primary trigger failure at ${targetNode.name}. ${config.severity}% outage initiated under ${
      config.highDemand ? 'High Demand' : 'Standard'
    } conditions.`,
    impactSummary: `${targetNode.name} capacity dropped by ${config.severity}%. Primary grid blackout in target grid.`
  });

  // Step 1: Direct dependent level 2 propagation (T = 10 min)
  // Water Plant B
  if (isMitigatedWaterPlant) {
    timeline.push({
      stepIndex: stepIdx++,
      timeMinutes: 10,
      timeLabel: '10 min',
      nodeId: 'water-plant-b',
      nodeName: 'Water Plant B',
      category: 'water',
      previousStatus: 'operational',
      newStatus: 'at_risk',
      description: 'Power loss detected at Water Plant B. Intervention ACTIVE: Automated diesel generators kicked in within 45 seconds.',
      impactSummary: 'Water pressure maintained via backup power generator intervention. Secondary cascade halted.'
    });
  } else {
    timeline.push({
      stepIndex: stepIdx++,
      timeMinutes: 10,
      timeLabel: '10 min',
      nodeId: 'water-plant-b',
      nodeName: 'Water Plant B',
      category: 'water',
      previousStatus: 'operational',
      newStatus: 'at_risk',
      description: 'Grid voltage collapse detected at Water Plant B. No backup power installed; auxiliary pumps running on battery reserve.',
      impactSummary: 'Pumping capacity reduced to 20%. Pressure dropping across Central & North districts.'
    });
  }

  // Step 2: Telecom Hub C (T = 20 min)
  timeline.push({
    stepIndex: stepIdx++,
    timeMinutes: 20,
    timeLabel: '20 min',
    nodeId: 'telecom-hub-c',
    nodeName: 'Telecom Hub C',
    category: 'telecom',
    previousStatus: 'operational',
    newStatus: config.backupUnavailable ? 'degraded' : 'at_risk',
    description: 'Telecom Hub C switched to battery reserve power. Fiber optic routing operating on emergency throttle.',
    impactSummary: 'SCADA telemetry latency increased by 340ms. 4G/5G mobile tower capacity throttled.'
  });

  // Step 3: Water Supply Degradation & Transport (T = 30 min)
  if (isMitigatedWaterPlant) {
    timeline.push({
      stepIndex: stepIdx++,
      timeMinutes: 30,
      timeLabel: '30 min',
      nodeId: 'transport-hub-d',
      nodeName: 'Transport Hub D',
      category: 'transport',
      previousStatus: 'operational',
      newStatus: 'degraded',
      description: 'Substation transfer switch isolated Transport Hub D to backup sub-feed.',
      impactSummary: 'Metro lines operating at 50% speed. Commuter delays localized.'
    });
  } else {
    timeline.push({
      stepIndex: stepIdx++,
      timeMinutes: 30,
      timeLabel: '30 min',
      nodeId: 'water-plant-b',
      nodeName: 'Water Plant B',
      category: 'water',
      previousStatus: 'at_risk',
      newStatus: 'degraded',
      description: 'Water Plant B battery reserve depleted. Main filtration pumps shut down.',
      impactSummary: 'Water pressure lost completely in North District. Sterile water reserves in hospitals depleted to 4-hour supply.'
    });
  }

  // Step 4: Hospital Network A (T = 45 min)
  if (isMitigatedWaterPlant) {
    timeline.push({
      stepIndex: stepIdx++,
      timeMinutes: 45,
      timeLabel: '45 min',
      nodeId: 'hospital-network-a',
      nodeName: 'Hospital Network A',
      category: 'healthcare',
      previousStatus: 'operational',
      newStatus: 'at_risk',
      description: 'Hospital Network A operating on primary generator. Water supply remains STABLE due to Water Plant B intervention.',
      impactSummary: 'ICU and ventilator operations unaffected. Non-emergency surgeries rescheduled as precaution.'
    });
  } else {
    timeline.push({
      stepIndex: stepIdx++,
      timeMinutes: 45,
      timeLabel: '45 min',
      nodeId: 'hospital-network-a',
      nodeName: 'Hospital Network A',
      category: 'healthcare',
      previousStatus: 'operational',
      newStatus: 'degraded',
      description: 'Hospital Network A lost municipal water pressure & grid power simultaneously. Generators running, but sterilizer HVAC units forced off.',
      impactSummary: '4 critical hospitals forced to divert incoming trauma ambulances. Sterile water emergency triggered.'
    });
  }

  // Step 5: Emergency Dispatch (T = 60 min)
  if (isMitigatedWaterPlant) {
    timeline.push({
      stepIndex: stepIdx++,
      timeMinutes: 60,
      timeLabel: '60 min',
      nodeId: 'emergency-center-a',
      nodeName: 'Emergency Center A',
      category: 'emergency',
      previousStatus: 'operational',
      newStatus: 'at_risk',
      description: 'Emergency Center A handling elevated dispatch volume with stable triage back-channel.',
      impactSummary: 'Response time elevated by 3 minutes. System remains functional.'
    });
  } else {
    timeline.push({
      stepIndex: stepIdx++,
      timeMinutes: 60,
      timeLabel: '60 min',
      nodeId: 'emergency-center-a',
      nodeName: 'Emergency Center A',
      category: 'emergency',
      previousStatus: 'operational',
      newStatus: 'failed',
      description: 'Emergency Dispatch overwhelmed by simultaneous hospital diversion requests, transit signals failure, and population panic calls.',
      impactSummary: '911 call wait times exceed 12 minutes. Ambulance fleet routing disrupted across 3 sectors.'
    });
  }

  // Calculate final impact metrics based on intervention
  let affectedNodesCount = 37;
  let failedNodesCount = 12;
  let criticalNodesAffected = 8;
  let populationAtRisk = 240000;
  let estimatedRecoveryHours = 16;

  let impactBreakdown = {
    hospitals: 4,
    water: 3,
    transport: 12,
    telecom: 7
  };

  if (isMitigatedWaterPlant) {
    affectedNodesCount = Math.round(37 * (1 - activeIntervention.riskReductionPercent / 100)); // 15
    failedNodesCount = 3;
    criticalNodesAffected = 2;
    populationAtRisk = 90000;
    estimatedRecoveryHours = Math.round(16 * (1 - activeIntervention.recoveryImprovementPercent / 100)); // 7 hours
    impactBreakdown = {
      hospitals: 1,
      water: 0,
      transport: 5,
      telecom: 3
    };
  } else {
    // Scale by severity
    affectedNodesCount = Math.min(48, Math.round(37 * effectiveSeverity));
    populationAtRisk = Math.min(320000, Math.round(240000 * effectiveSeverity));
    estimatedRecoveryHours = Math.round(16 * (effectiveSeverity > 1 ? 1.2 : 1));
  }

  return {
    config,
    targetNodeName: targetNode.name,
    affectedNodesCount,
    failedNodesCount,
    criticalNodesAffected,
    populationAtRisk,
    estimatedRecoveryHours,
    impactBreakdown,
    cascadeDepth: isMitigatedWaterPlant ? 2 : 5,
    timeline,
    rootCauseNodeId: targetNode.id,
    rootCauseName: targetNode.name,
    propagationPathNames: isMitigatedWaterPlant
      ? [targetNode.name, 'Water Plant B (Intervention Active)']
      : [
          targetNode.name,
          'Water Plant B',
          'Telecom Hub C',
          'Hospital Network A',
          'Emergency Center A',
          'Residential Zone A'
        ],
    mainVulnerability: isMitigatedWaterPlant
      ? 'Intervention applied: Backup Power at Water Plant B prevents municipal water loss and isolates healthcare cascade.'
      : 'Water Plant B has no redundant power supply and serves as a single point of failure between Power Generation and Public Healthcare.'
  };
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

  const popRed = Math.round(
    ((withoutRes.populationAtRisk - withRes.populationAtRisk) / withoutRes.populationAtRisk) * 100
  );
  const infraRed = Math.round(
    ((withoutRes.affectedNodesCount - withRes.affectedNodesCount) / withoutRes.affectedNodesCount) * 100
  );
  const hospRed = Math.round(
    ((withoutRes.impactBreakdown.hospitals - withRes.impactBreakdown.hospitals) /
      withoutRes.impactBreakdown.hospitals) *
      100
  );
  const recImp = Math.round(
    ((withoutRes.estimatedRecoveryHours - withRes.estimatedRecoveryHours) /
      withoutRes.estimatedRecoveryHours) *
      100
  );

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
      populationReductionPercent: popRed,
      infrastructureReductionPercent: infraRed,
      hospitalsReductionPercent: hospRed,
      recoveryImprovementPercent: recImp
    },
    appliedIntervention: intervention
  };
}
