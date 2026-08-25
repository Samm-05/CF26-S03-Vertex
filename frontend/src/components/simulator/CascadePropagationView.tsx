import React, { useState, useEffect } from 'react';
import type { SimulationResult } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Play, Pause, RotateCcw, FastForward, ArrowRight, Clock } from 'lucide-react';

interface CascadePropagationViewProps {
  result: SimulationResult;
  onFinishAnimation: () => void;
}

export const CascadePropagationView: React.FC<CascadePropagationViewProps> = ({
  result,
  onFinishAnimation
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const totalSteps = result.timeline.length;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isPlaying && currentStepIndex < totalSteps - 1) {
      timer = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, 1500); // 1.5s per propagation step
    } else if (currentStepIndex >= totalSteps - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, totalSteps]);

  const currentStep = result.timeline[currentStepIndex];

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 rounded-card bg-[#0B2B26] border border-[#8EB69B]/20 shadow-card-depth space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#8EB69B]/15 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#D9A441] uppercase tracking-wider mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D9A441] inline-block animate-ping" />
            <span>SIMULATION RUNNING — CASCADE Failure PROPAGATION</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[#DAF1DE]">
            Scenario: {result.targetNodeName} Failure
          </h2>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center space-x-2 bg-[#163832] p-1.5 rounded-xl border border-[#8EB69B]/20">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-[#235347] text-[#DAF1DE] hover:bg-[#1e4840] transition-colors"
            title={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} className="fill-[#DAF1DE]" />}
          </button>
          <button
            onClick={() => {
              setCurrentStepIndex(0);
              setIsPlaying(true);
            }}
            className="p-2 rounded-lg bg-[#0B2B26] text-[#8EB69B] hover:text-[#DAF1DE] transition-colors"
            title="Restart Animation"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={onFinishAnimation}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#163832] text-[#DAF1DE] hover:bg-[#235347] font-semibold text-xs transition-colors border border-[#8EB69B]/30"
          >
            <span>Skip Animation</span>
            <FastForward size={14} />
          </button>
        </div>
      </div>

      {/* Time Progress Scrubber */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono text-[#8EB69B]">
          <span>Timeline Step {currentStepIndex + 1} of {totalSteps}</span>
          <span>Elapsed Time: {currentStep.timeLabel}</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-[#051F20] overflow-hidden flex">
          {result.timeline.map((step, idx) => (
            <div
              key={step.stepIndex}
              onClick={() => {
                setCurrentStepIndex(idx);
                setIsPlaying(false);
              }}
              style={{ width: `${100 / totalSteps}%` }}
              className={`h-full cursor-pointer transition-colors border-r border-[#051F20] ${
                idx <= currentStepIndex ? 'bg-[#8EB69B]' : 'bg-[#163832]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Live Propagation Step Card */}
      <div className="p-5 rounded-xl bg-[#163832]/80 border border-[#8EB69B]/30 shadow-glow-sm space-y-3 animate-in fade-in duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock size={16} className="text-[#8EB69B]" />
            <span className="text-sm font-bold font-mono text-[#DAF1DE]">T = {currentStep.timeLabel}</span>
          </div>
          <StatusBadge status={currentStep.newStatus} size="md" />
        </div>

        <h3 className="text-lg font-bold text-[#DAF1DE]">{currentStep.nodeName}</h3>
        <p className="text-xs text-[#8EB69B] leading-relaxed">{currentStep.description}</p>

        <div className="p-3 rounded-lg bg-[#051F20]/60 border border-[#8EB69B]/15 text-xs text-[#DAF1DE]">
          <span className="text-[10px] font-mono text-[#8EB69B] uppercase block mb-0.5">Impact Summary</span>
          {currentStep.impactSummary}
        </div>
      </div>

      {/* Timeline Steps List */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#8EB69B]">Propagation Sequence</h4>
        <div className="space-y-2">
          {result.timeline.slice(0, currentStepIndex + 1).map((step) => (
            <div
              key={step.stepIndex}
              className="p-3 rounded-xl bg-[#163832]/40 border border-[#8EB69B]/15 flex items-center justify-between text-xs"
            >
              <div className="flex items-center space-x-3">
                <span className="w-14 font-mono font-bold text-[#DAF1DE]">{step.timeLabel}</span>
                <span className="font-semibold text-[#DAF1DE]">{step.nodeName}</span>
              </div>
              <StatusBadge status={step.newStatus} size="sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Complete Button when animation reaches end */}
      {currentStepIndex === totalSteps - 1 && (
        <button
          onClick={onFinishAnimation}
          className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-[#235347] text-[#DAF1DE] hover:bg-[#1e4840] border border-[#8EB69B]/40 font-bold text-sm transition-all shadow-glow-sm"
        >
          <span>View Comprehensive Impact & Intervention Analysis</span>
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
};
