import React from 'react';
import type { SimulationRun } from '../types';
import { CheckCircle2, Activity, Play, Pause, RotateCcw, FastForward } from 'lucide-react';

interface PlaybackHeaderProps {
  run: SimulationRun;
  isPlaying: boolean;
  speed: 1 | 2 | 5;
  isComplete: boolean;
  onTogglePlay: () => void;
  onRestart: () => void;
  onSkip: () => void;
  onChangeSpeed: (speed: 1 | 2 | 5) => void;
}

export const PlaybackHeader: React.FC<PlaybackHeaderProps> = ({
  run,
  isPlaying,
  speed,
  isComplete,
  onTogglePlay,
  onRestart,
  onSkip,
  onChangeSpeed
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#0B2B26]/90 border border-[#8EB69B]/20 shadow-card-depth flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left side: Status indicators & Title */}
      <div className="flex items-start sm:items-center space-x-3.5 min-w-0">
        <div className="p-2 rounded-xl bg-[#163832] border border-[#8EB69B]/25 text-[#5eead4] flex-shrink-0">
          {isComplete ? (
            <CheckCircle2 size={20} className="text-[#5eead4]" />
          ) : (
            <Activity size={20} className="text-[#5eead4] animate-pulse" />
          )}
        </div>

        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono font-bold tracking-wider text-[#8EB69B] uppercase flex items-center gap-1.5">
              {isComplete ? '✓ SIMULATION COMPLETED' : 'PROPAGATION PLAYBACK ACTIVE'}
            </span>
            {run.mitigatedProfileActive && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#235347] text-[#5eead4] border border-[#8EB69B]/30">
                MITIGATED PROFILE ACTIVE
              </span>
            )}
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#DAF1DE] truncate">
            {run.label}
          </h2>
        </div>
      </div>

      {/* Right side: Playback controls & Speed */}
      <div className="flex items-center flex-wrap gap-2 sm:gap-2.5 flex-shrink-0">
        {/* Speed Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-[#163832] border border-[#8EB69B]/20 font-mono text-xs">
          {([1, 2, 5] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChangeSpeed(s)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                speed === s
                  ? 'bg-[#235347] text-[#5eead4] shadow-sm'
                  : 'text-[#8EB69B] hover:text-[#DAF1DE]'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Play / Pause */}
        <button
          type="button"
          onClick={onTogglePlay}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#235347] hover:bg-[#1e4840] text-[#DAF1DE] font-mono text-xs font-bold border border-[#5eead4]/40 hover:border-[#5eead4] transition-all cursor-pointer shadow-sm active:scale-95"
        >
          {isPlaying ? (
            <>
              <Pause size={14} className="fill-[#DAF1DE]" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play size={14} className="fill-[#DAF1DE]" />
              <span>Resume</span>
            </>
          )}
        </button>

        {/* Restart */}
        <button
          type="button"
          onClick={onRestart}
          className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-[#163832] hover:bg-[#235347] text-[#8EB69B] hover:text-[#DAF1DE] font-mono text-xs font-semibold border border-[#8EB69B]/20 transition-colors cursor-pointer"
          title="Restart Simulation"
        >
          <RotateCcw size={13} />
          <span className="hidden sm:inline">Restart</span>
        </button>

        {/* Skip */}
        <button
          type="button"
          onClick={onSkip}
          className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-[#163832] hover:bg-[#235347] text-[#8EB69B] hover:text-[#DAF1DE] font-mono text-xs font-semibold border border-[#8EB69B]/20 transition-colors cursor-pointer"
          title="Skip to End"
        >
          <FastForward size={13} />
          <span className="hidden sm:inline">Skip</span>
        </button>
      </div>
    </div>
  );
};
