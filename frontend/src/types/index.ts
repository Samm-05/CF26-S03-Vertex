export type InfrastructureCategory =
  | 'power'
  | 'water'
  | 'healthcare'
  | 'emergency'
  | 'transport'
  | 'telecom'
  | 'schools'
  | 'industrial';

export type InfrastructureStatus =
  | 'operational'
  | 'healthy'
  | 'at_risk'
  | 'degraded'
  | 'failed';

export interface InfrastructureNode {
  id: string;
  name: string;
  category: InfrastructureCategory;
  type?: InfrastructureCategory; // alias for compatibility
  lat: number;
  lng: number;
  criticality: number; // 0 - 100
  capacity: string;
  capacityNumeric?: number;
  currentLoad?: number;
  status: InfrastructureStatus;
  connectedSystemsCount: number;
  dependentSystemsCount: number;
  backupAvailable: boolean;
  backupDetails?: string;
  redundancySources?: string[];
  failureProbability: number; // percentage
  populationImpact: number;
  coordinates: {
    x: number; // relative map x % (0 - 100)
    y: number; // relative map y % (0 - 100)
    lat?: number;
    lng?: number;
    district: string;
  };
  level: number; // Cascade tier level 1..5
  dependencies: string[]; // Node IDs this relies on
  dependents: string[]; // Node IDs that rely on this
  description: string;
}

export interface DependencyLink {
  id?: string;
  source: string;
  target: string;
  type: string;
  critical: boolean;
  strength?: number; // 0..1 critical strength
}

export interface DependencyEdge {
  id: string;
  source: string;
  target: string;
  strength: number;
  type?: string;
  critical?: boolean;
}

export interface SimulationConfig {
  targetNodeId: string;
  severity: number; // 0 - 100
  durationHours: number;
  extremeWeather: boolean;
  highDemand: boolean;
  backupUnavailable: boolean;
}

export interface SimulationStep {
  stepIndex: number;
  timeMinutes: number;
  timeLabel: string;
  nodeId: string;
  nodeName: string;
  category: InfrastructureCategory;
  previousStatus: InfrastructureStatus;
  newStatus: InfrastructureStatus;
  description: string;
  impactSummary: string;
}

export interface SimulationResult {
  config: SimulationConfig;
  targetNodeName: string;
  affectedNodesCount: number;
  failedNodesCount: number;
  criticalNodesAffected: number;
  populationAtRisk: number;
  estimatedRecoveryHours: number;
  impactBreakdown: {
    hospitals: number;
    water: number;
    transport: number;
    telecom: number;
  };
  cascadeDepth: number;
  timeline: SimulationStep[];
  rootCauseNodeId: string;
  rootCauseName: string;
  propagationPathNames: string[];
  mainVulnerability: string;
}

export interface Intervention {
  id: string;
  title: string;
  targetNodeId: string;
  targetNodeName: string;
  category: InfrastructureCategory;
  estimatedCost: string;
  riskReductionPercent: number;
  populationProtected: number;
  recoveryImprovementPercent: number;
  description: string;
}

export interface ComparisonMetrics {
  populationAffected: number;
  infrastructureAffected: number;
  hospitalsAffected: number;
  recoveryHours: number;
}

export interface ComparisonResult {
  withoutIntervention: ComparisonMetrics;
  withIntervention: ComparisonMetrics;
  improvements: {
    populationReductionPercent: number;
    infrastructureReductionPercent: number;
    hospitalsReductionPercent: number;
    recoveryImprovementPercent: number;
  };
  appliedIntervention: Intervention;
}

export interface NavigationTab {
  id: 'dashboard' | 'map' | 'network' | 'simulator' | 'results';
  label: string;
  iconName: string;
}
