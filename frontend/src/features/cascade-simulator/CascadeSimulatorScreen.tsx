import React, { useState } from 'react';
import type { InfrastructureNode, SimulationConfig as LegacySimulationConfig, SimulationResult } from '../../types';
import type { SimulationConfig, SimulationRun } from './types';
import { ConfigureParametersPanel } from './configure/ConfigureParametersPanel';
import { PropagationPlayerLayout } from './player/PropagationPlayerLayout';
import { buildSimulationRun } from './simulationEngine';
import { Sparkles, Sliders, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CascadeSimulatorScreenProps {
  nodes: InfrastructureNode[];
  initialConfig?: LegacySimulationConfig;
  onSimulationComplete: (result: SimulationResult) => void;
}

export const CascadeSimulatorScreen: React.FC<CascadeSimulatorScreenProps> = ({
  nodes,
  initialConfig,
  onSimulationComplete
}) => {
  const [mode, setMode] = useState<'configure' | 'player'>('configure');

  const [config, setConfig] = useState<SimulationConfig>(() => ({
    targetNodeId: initialConfig?.targetNodeId || 'power-station-a',
    severityPercent: initialConfig?.severity || 70,
    durationHours: initialConfig?.durationHours || 12,
    conditions: {
      highDemandSurge: initialConfig?.highDemand ?? true,
      extremeWeatherEvent: initialConfig?.extremeWeather ?? false,
      backupSystemsOffline: initialConfig?.backupUnavailable ?? false,
      scadaTelemetryJam: false
    }
  }));

  const [activeRun, setActiveRun] = useState<SimulationRun | null>(null);
  const [currentResult, setCurrentResult] = useState<SimulationResult | null>(null);

  // Trigger running the simulation
  const handleRunSimulation = (overrideConfig?: SimulationConfig) => {
    const activeCfg = overrideConfig || config;
    const { run, result } = buildSimulationRun(activeCfg, null, nodes);
    setActiveRun(run);
    setCurrentResult(result);
    setMode('player');
  };

  // Preset demo trigger
  const handleLoadPrimaryDemo = () => {
    const demoConfig: SimulationConfig = {
      targetNodeId: 'power-station-a',
      severityPercent: 70,
      durationHours: 12,
      conditions: {
        highDemandSurge: true,
        extremeWeatherEvent: false,
        backupSystemsOffline: false,
        scadaTelemetryJam: false
      }
    };
    setConfig(demoConfig);
    handleRunSimulation(demoConfig);
  };

  // Inspect results action
  const handleInspectResults = (run: SimulationRun) => {
    if (currentResult) {
      onSimulationComplete(currentResult);
    } else {
      const { result } = buildSimulationRun(run.config, null, nodes);
      onSimulationComplete(result);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#8EB69B]/15">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#DAF1DE] tracking-tight">
            Cascade Failure Simulator
          </h1>
          <p className="text-xs sm:text-sm text-[#8EB69B]">
            Model the impact of an infrastructure failure across the city's dependency network in real time.
          </p>
        </div>

        {/* Top Controls: Mode Switcher & Primary Demo */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Segmented Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-[#0B2B26] border border-[#8EB69B]/25">
            <button
              type="button"
              onClick={() => setMode('configure')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg font-mono text-xs font-semibold transition-all cursor-pointer ${
                mode === 'configure'
                  ? 'bg-[#235347] text-[#5eead4] shadow-sm'
                  : 'text-[#8EB69B] hover:text-[#DAF1DE]'
              }`}
            >
              <Sliders size={13} />
              <span>Configure Parameters</span>
            </button>

            <button
              type="button"
              disabled={!activeRun}
              onClick={() => activeRun && setMode('player')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
                !activeRun
                  ? 'opacity-40 cursor-not-allowed text-[#8EB69B]'
                  : mode === 'player'
                  ? 'bg-[#235347] text-[#5eead4] shadow-sm cursor-pointer'
                  : 'text-[#8EB69B] hover:text-[#DAF1DE] cursor-pointer'
              }`}
            >
              <PlayCircle size={13} />
              <span>Propagation Player</span>
            </button>
          </div>

          {/* Load Primary Demo */}
          <button
            type="button"
            onClick={handleLoadPrimaryDemo}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#163832] hover:bg-[#235347] text-[#5eead4] font-mono text-xs font-bold border border-[#5eead4]/30 hover:border-[#5eead4] transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Sparkles size={14} className="text-[#5eead4]" />
            <span>Load Primary Demo</span>
          </button>
        </div>
      </div>

      {/* Screen Mode Content with Motion */}
      <AnimatePresence mode="wait">
        {mode === 'configure' ? (
          <motion.div
            key="configure-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ConfigureParametersPanel
              nodes={nodes}
              config={config}
              onChangeConfig={setConfig}
              onRunSimulation={() => handleRunSimulation()}
            />
          </motion.div>
        ) : activeRun ? (
          <motion.div
            key="player-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <PropagationPlayerLayout
              run={activeRun}
              nodes={nodes}
              onInspectResults={handleInspectResults}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
