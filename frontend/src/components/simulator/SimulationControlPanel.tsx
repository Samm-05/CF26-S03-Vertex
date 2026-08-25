import React from 'react';
import type { SimulationConfig, InfrastructureNode } from '../../types';
import { Play, Clock, Cpu } from 'lucide-react';

interface SimulationControlPanelProps {
  nodes: InfrastructureNode[];
  config: SimulationConfig;
  onChangeConfig: (newConfig: SimulationConfig) => void;
  onRunSimulation: () => void;
}

export const SimulationControlPanel: React.FC<SimulationControlPanelProps> = ({
  nodes,
  config,
  onChangeConfig,
  onRunSimulation
}) => {
  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8 rounded-card bg-[#0B2B26] border border-[#8EB69B]/20 shadow-card-depth space-y-6">
      {/* Step Header */}
      <div className="border-b border-[#8EB69B]/15 pb-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-[#8EB69B] uppercase tracking-wider mb-1">
          <Cpu size={16} />
          <span>Simulation Configuration Parameters</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-[#DAF1DE]">Configure Failure Scenario</h2>
        <p className="text-xs md:text-sm text-[#8EB69B]">
          Set failure triggers and environmental stress conditions to simulate cascade propagation.
        </p>
      </div>

      {/* STEP 1: Select Target Infrastructure */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#8EB69B] flex items-center justify-between">
          <span>STEP 1: Select Infrastructure Trigger</span>
          <span className="text-[11px] font-mono text-[#DAF1DE]">Target Node</span>
        </label>
        <select
          value={config.targetNodeId}
          onChange={(e) => onChangeConfig({ ...config, targetNodeId: e.target.value })}
          className="w-full bg-[#163832] text-[#DAF1DE] font-semibold text-sm p-3.5 rounded-xl border border-[#8EB69B]/30 focus:outline-none focus:border-[#8EB69B]"
        >
          {nodes.map((node) => (
            <option key={node.id} value={node.id} className="bg-[#0B2B26] text-[#DAF1DE]">
              {node.name} ({node.category.toUpperCase()}) — Criticality: {node.criticality}/100
            </option>
          ))}
        </select>
      </div>

      {/* STEP 2: Failure Severity Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[#8EB69B]">
          <span>STEP 2: Failure Severity Level</span>
          <span className="text-sm font-mono font-extrabold text-[#DAF1DE] bg-[#163832] px-2.5 py-0.5 rounded border border-[#8EB69B]/20">
            {config.severity}%
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          step="5"
          value={config.severity}
          onChange={(e) => onChangeConfig({ ...config, severity: Number(e.target.value) })}
          className="w-full h-2 rounded-lg bg-[#051F20] appearance-none cursor-pointer accent-[#235347]"
        />
        <div className="flex justify-between text-[11px] text-[#8EB69B] font-mono">
          <span>0% (Minor Disturbance)</span>
          <span>50% (Partial Outage)</span>
          <span>100% (Total Collapse)</span>
        </div>
      </div>

      {/* STEP 3: Failure Duration Input */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#8EB69B] block">
          STEP 3: Expected Failure Duration (Hours)
        </label>
        <div className="relative">
          <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8EB69B]" />
          <input
            type="number"
            min="1"
            max="72"
            value={config.durationHours}
            onChange={(e) => onChangeConfig({ ...config, durationHours: Number(e.target.value) })}
            className="w-full bg-[#163832] text-[#DAF1DE] font-semibold text-sm pl-10 pr-4 py-3 rounded-xl border border-[#8EB69B]/30 focus:outline-none focus:border-[#8EB69B]"
          />
        </div>
      </div>

      {/* STEP 4: Optional Stress Conditions Checkboxes */}
      <div className="space-y-3 pt-2 border-t border-[#8EB69B]/15">
        <label className="text-xs font-bold uppercase tracking-wider text-[#8EB69B] block">
          STEP 4: Stress Conditions & Environmental Constraints
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-[#163832]/60 border border-[#8EB69B]/15 hover:border-[#8EB69B]/30 cursor-pointer">
            <input
              type="checkbox"
              checked={config.extremeWeather}
              onChange={(e) => onChangeConfig({ ...config, extremeWeather: e.target.checked })}
              className="w-4 h-4 rounded bg-[#051F20] border-[#8EB69B] text-[#235347] focus:ring-0"
            />
            <span className="text-xs font-medium text-[#DAF1DE]">Extreme Weather</span>
          </label>

          <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-[#163832]/60 border border-[#8EB69B]/15 hover:border-[#8EB69B]/30 cursor-pointer">
            <input
              type="checkbox"
              checked={config.highDemand}
              onChange={(e) => onChangeConfig({ ...config, highDemand: e.target.checked })}
              className="w-4 h-4 rounded bg-[#051F20] border-[#8EB69B] text-[#235347] focus:ring-0"
            />
            <span className="text-xs font-medium text-[#DAF1DE]">High Demand</span>
          </label>

          <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-[#163832]/60 border border-[#8EB69B]/15 hover:border-[#8EB69B]/30 cursor-pointer">
            <input
              type="checkbox"
              checked={config.backupUnavailable}
              onChange={(e) => onChangeConfig({ ...config, backupUnavailable: e.target.checked })}
              className="w-4 h-4 rounded bg-[#051F20] border-[#8EB69B] text-[#235347] focus:ring-0"
            />
            <span className="text-xs font-medium text-[#DAF1DE]">Backup Unavailable</span>
          </label>
        </div>
      </div>

      {/* PRIMARY ACTION BUTTON */}
      <button
        onClick={onRunSimulation}
        className="w-full flex items-center justify-center space-x-2 py-4 rounded-xl bg-[#235347] text-[#DAF1DE] hover:bg-[#1e4840] border border-[#8EB69B]/40 font-bold text-base transition-all duration-200 shadow-glow-sm tracking-wider uppercase group"
      >
        <Play size={18} className="fill-[#DAF1DE] group-hover:scale-110 transition-transform" />
        <span>▶ RUN CASCADE SIMULATION</span>
      </button>
    </div>
  );
};
