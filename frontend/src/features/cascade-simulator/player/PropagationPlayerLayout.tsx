import React from 'react';
import type { SimulationRun } from '../types';
import type { InfrastructureNode } from '../../../types';
import { PlaybackHeader } from './PlaybackHeader';
import { CurrentStepSummary } from './CurrentStepSummary';
import { TimelineScrubber } from './TimelineScrubber';
import { EventSequenceList } from './EventSequenceList';
import { LiveSimulationMap } from '../LiveSimulationMap';
import { usePlaybackClock } from './usePlaybackClock';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface PropagationPlayerLayoutProps {
  run: SimulationRun;
  nodes: InfrastructureNode[];
  onInspectResults: (run: SimulationRun) => void;
}

export const PropagationPlayerLayout: React.FC<PropagationPlayerLayoutProps> = ({
  run,
  nodes,
  onInspectResults
}) => {
  const {
    currentStepIndex,
    currentOffsetMinutes,
    maxOffsetMinutes,
    isPlaying,
    speed,
    togglePlay,
    restart,
    skip,
    setSpeed,
    scrubToOffset,
    scrubToStep
  } = usePlaybackClock(run.steps);

  const currentStep = run.steps[currentStepIndex] || run.steps[0];
  const isComplete = currentOffsetMinutes >= maxOffsetMinutes;

  return (
    <div className="space-y-4">
      {/* Top Status & Transport Header Bar */}
      <PlaybackHeader
        run={run}
        isPlaying={isPlaying}
        speed={speed}
        isComplete={isComplete}
        onTogglePlay={togglePlay}
        onRestart={restart}
        onSkip={skip}
        onChangeSpeed={setSpeed}
      />

      {/* Two-Column Side-by-Side Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch min-h-[640px]">
        {/* Left Column: Playback & Timeline Panel (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Current Step Summary Card */}
          <CurrentStepSummary
            currentStep={currentStep}
            stepIndex={currentStepIndex}
            totalSteps={run.steps.length}
            run={run}
          />

          {/* Timeline Scrubber */}
          <TimelineScrubber
            steps={run.steps}
            currentOffsetMinutes={currentOffsetMinutes}
            maxOffsetMinutes={maxOffsetMinutes}
            onScrubToOffset={scrubToOffset}
            onScrubToStep={scrubToStep}
          />

          {/* Chronological Event Sequence List */}
          <EventSequenceList
            steps={run.steps}
            currentStepIndex={currentStepIndex}
            currentOffsetMinutes={currentOffsetMinutes}
            onSelectStep={scrubToStep}
          />

          {/* Footer Bar: Inspect Results */}
          <div className="p-4 rounded-2xl bg-[#0B2B26]/95 border border-[#8EB69B]/20 shadow-card-depth flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="p-2 rounded-xl bg-[#163832] text-[#5eead4] border border-[#8EB69B]/20 flex-shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#DAF1DE] block truncate">
                  Simulation Finished
                </span>
                <span className="text-[11px] text-[#8EB69B] block truncate">
                  Evaluate cross-sector loss & mitigation
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onInspectResults(run)}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#235347] hover:bg-[#1e4840] text-[#DAF1DE] font-mono text-xs font-bold border border-[#5eead4]/40 hover:border-[#5eead4] transition-all shadow-glow-sm cursor-pointer flex-shrink-0 active:scale-95"
            >
              <span>Inspect Results</span>
              <ArrowRight size={14} className="text-[#5eead4]" />
            </button>
          </div>
        </div>

        {/* Right Column: Live Spatial Simulation Map (7 cols) */}
        <div className="lg:col-span-7 h-full min-h-[500px]">
          <LiveSimulationMap
            nodes={nodes}
            steps={run.steps}
            currentOffsetMinutes={currentOffsetMinutes}
            activeFocusNodeId={currentStep ? currentStep.nodeId : run.rootCauseNodeId}
          />
        </div>
      </div>
    </div>
  );
};
