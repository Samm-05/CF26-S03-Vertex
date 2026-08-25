import { useState, useEffect, useCallback, useMemo } from 'react';
import type { CascadeTimelineStep, PlaybackState } from '../types';

export function usePlaybackClock(steps: CascadeTimelineStep[]) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 2 | 5>(1);
  const [currentOffsetMinutes, setCurrentOffsetMinutes] = useState(0);

  const maxOffsetMinutes = useMemo(() => {
    if (!steps || steps.length === 0) return 60;
    return steps[steps.length - 1].offsetMinutes;
  }, [steps]);

  // Compute active step index from current offset
  const currentStepIndex = useMemo(() => {
    if (!steps || steps.length === 0) return 0;
    let idx = 0;
    for (let i = 0; i < steps.length; i++) {
      if (steps[i].offsetMinutes <= currentOffsetMinutes) {
        idx = i;
      }
    }
    return idx;
  }, [steps, currentOffsetMinutes]);

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = 100; // 100ms ticks
    // Scaling: at 1x speed, 1 second real time advances ~10 simulated minutes
    const stepAdvancePerTick = (10 / (1000 / intervalMs)) * speed;

    const timer = setInterval(() => {
      setCurrentOffsetMinutes((prev) => {
        const next = prev + stepAdvancePerTick;
        if (next >= maxOffsetMinutes) {
          setIsPlaying(false);
          return maxOffsetMinutes;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, speed, maxOffsetMinutes]);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);

  const restart = useCallback(() => {
    setCurrentOffsetMinutes(0);
    setIsPlaying(true);
  }, []);

  const skip = useCallback(() => {
    setCurrentOffsetMinutes(maxOffsetMinutes);
    setIsPlaying(false);
  }, [maxOffsetMinutes]);

  const scrubToOffset = useCallback((offsetMinutes: number) => {
    setCurrentOffsetMinutes(Math.max(0, Math.min(maxOffsetMinutes, offsetMinutes)));
  }, [maxOffsetMinutes]);

  const scrubToStep = useCallback((stepIndex: number) => {
    if (steps && steps[stepIndex]) {
      setCurrentOffsetMinutes(steps[stepIndex].offsetMinutes);
    }
  }, [steps]);

  const playbackState: PlaybackState = {
    isPlaying,
    speed,
    currentOffsetMinutes,
    currentStepIndex
  };

  return {
    playbackState,
    currentStepIndex,
    currentOffsetMinutes,
    isPlaying,
    speed,
    maxOffsetMinutes,
    play,
    pause,
    togglePlay,
    restart,
    skip,
    setSpeed,
    scrubToOffset,
    scrubToStep
  };
}
