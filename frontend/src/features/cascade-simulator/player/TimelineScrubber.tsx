import React, { useRef } from 'react';
import type { CascadeTimelineStep } from '../types';

interface TimelineScrubberProps {
  steps: CascadeTimelineStep[];
  currentOffsetMinutes: number;
  maxOffsetMinutes: number;
  onScrubToOffset: (minutes: number) => void;
  onScrubToStep: (stepIndex: number) => void;
}

export const TimelineScrubber: React.FC<TimelineScrubberProps> = ({
  steps,
  currentOffsetMinutes,
  maxOffsetMinutes,
  onScrubToOffset,
  onScrubToStep
}) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current || maxOffsetMinutes <= 0) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const ratio = clickX / rect.width;
    const targetOffset = ratio * maxOffsetMinutes;
    onScrubToOffset(targetOffset);
  };

  const progressPercent = Math.min(100, Math.max(0, (currentOffsetMinutes / (maxOffsetMinutes || 1)) * 100));

  return (
    <div className="p-4 rounded-2xl bg-[#0B2B26]/90 border border-[#8EB69B]/20 shadow-card-depth space-y-2.5">
      {/* Scrubber Milestone Labels */}
      <div className="flex justify-between items-center text-[10px] font-mono text-[#8EB69B] px-1 select-none">
        <span>0m (Outage)</span>
        <span>Propagation Wave</span>
        <span>{steps[steps.length - 1]?.timeLabel || 'Recovery'} (Recovery)</span>
      </div>

      {/* Progress Track & Milestone Dots */}
      <div
        ref={trackRef}
        onClick={handleTrackClick}
        className="relative h-3 w-full rounded-full bg-[#051F20] border border-[#8EB69B]/25 cursor-pointer flex items-center select-none"
      >
        {/* Filled Progress Bar */}
        <div
          className="absolute left-0 top-0 bottom-0 rounded-full bg-gradient-to-r from-[#235347] to-[#5eead4] opacity-85 transition-all duration-75"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Milestone Dots */}
        {steps.map((step, idx) => {
          const stepPercent = (step.offsetMinutes / (maxOffsetMinutes || 1)) * 100;
          const isPassed = currentOffsetMinutes >= step.offsetMinutes;

          return (
            <button
              key={step.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onScrubToStep(idx);
              }}
              style={{ left: `${stepPercent}%` }}
              title={`Jump to T=${step.timeLabel}: ${step.eventTitle}`}
              className={`absolute -translate-x-1/2 w-4 h-4 rounded-full border-2 transition-all transform hover:scale-125 z-10 flex items-center justify-center cursor-pointer ${
                isPassed
                  ? 'bg-[#5eead4] border-[#051F20] shadow-[0_0_8px_rgba(94,234,212,0.8)]'
                  : 'bg-[#163832] border-[#8EB69B]/40 hover:border-[#5eead4]'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
