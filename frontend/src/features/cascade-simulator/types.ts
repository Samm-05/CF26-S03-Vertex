export interface SimulationConditions {
  highDemandSurge: boolean;
  extremeWeatherEvent: boolean;
  backupSystemsOffline: boolean;
  scadaTelemetryJam: boolean;
}

export interface SimulationConfig {
  targetNodeId: string;
  severityPercent: number; // 0 - 100
  durationHours: number;
  conditions: SimulationConditions;
}

export type CascadeSeverity = 'failed' | 'degraded' | 'at_risk';

export interface CascadePreviewStep {
  offsetMinutes: number;
  nodeId: string;
  nodeName: string;
  effectDescription: string;
  severity: CascadeSeverity;
}

export type TimelineEventStatus = 'failed' | 'degraded' | 'healthy_active' | 'operational' | 'at_risk';

export interface CascadeTimelineStep {
  id: string;
  offsetMinutes: number;
  timeLabel: string;
  nodeId: string;
  nodeName: string;
  eventTitle: string;
  status: TimelineEventStatus;
  note?: string;
  description?: string;
  impactSummary?: string;
  impactedPopChange?: number;
  strainedNodesDelta?: number;
}

export interface SimulationRun {
  id: string;
  label: string;
  config: SimulationConfig;
  mitigatedProfileActive: boolean;
  totalDurationHours: number;
  steps: CascadeTimelineStep[];
  impactedPopulation: number;
  strainedNodeCount: number;
  rootCauseNodeId: string;
  rootCauseName: string;
  recoveryClockLabel: string;
}

export interface PlaybackState {
  isPlaying: boolean;
  speed: 1 | 2 | 5;
  currentOffsetMinutes: number;
  currentStepIndex: number;
}
