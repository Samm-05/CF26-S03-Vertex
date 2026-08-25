export type NodeType =
  | 'power'
  | 'water'
  | 'telecom'
  | 'healthcare'
  | 'transport'
  | 'emergency'
  | 'residential'
  | 'industrial'
  | 'schools';

export type NodeStatus = 'operational' | 'at_risk' | 'degraded' | 'failed';

export interface InfraNode {
  id: string;
  name: string;
  shortName: string;
  type: NodeType;
  tier: 1 | 2 | 3 | 4 | 5;
  score: number; // 0 - 100
  status: NodeStatus;
  directDependents: number;
  ratedCapacity: string;
  populationServed: number;
  failureProbabilityPerYear: number;
  description: string;
  vulnerability?: string;
  district: string;
  dependencies: string[];
  dependents: string[];
}

export interface DependencyEdge {
  id: string;
  source: string;
  target: string;
  kind: 'direct' | 'indirect';
  criticalPath?: boolean;
}

export interface TierMeta {
  tier: 1 | 2 | 3 | 4 | 5;
  label: string;
  sublabel: string;
}

export type HighlightMode = 'all' | 'dependencies' | 'dependents';

export type ViewMode = 'graph' | 'grid';
