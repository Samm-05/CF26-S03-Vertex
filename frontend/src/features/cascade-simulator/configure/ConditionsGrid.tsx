import React from 'react';
import type { SimulationConditions } from '../types';
import { Check } from 'lucide-react';

interface ConditionsGridProps {
  conditions: SimulationConditions;
  onChangeConditions: (conditions: SimulationConditions) => void;
}

interface ConditionItem {
  key: keyof SimulationConditions;
  title: string;
  description: string;
}

const CONDITIONS_CONFIG: ConditionItem[] = [
  {
    key: 'highDemandSurge',
    title: 'High Demand Surge',
    description: 'Peak summer air-con and commercial loads (+30%)'
  },
  {
    key: 'extremeWeatherEvent',
    title: 'Extreme Weather Event',
    description: 'Flash flooding and gale force winds in river basin'
  },
  {
    key: 'backupSystemsOffline',
    title: 'Backup Systems Offline',
    description: 'Simulates secondary battery/diesel starter failures'
  },
  {
    key: 'scadaTelemetryJam',
    title: 'SCADA Telemetry Jam',
    description: 'Delayed sensor feedback throttles emergency response'
  }
];

export const ConditionsGrid: React.FC<ConditionsGridProps> = ({
  conditions,
  onChangeConditions
}) => {
  const toggleCondition = (key: keyof SimulationConditions) => {
    onChangeConditions({
      ...conditions,
      [key]: !conditions[key]
    });
  };

  return (
    <div className="p-5 rounded-2xl bg-[#0B2B26]/90 border border-[#8EB69B]/20 shadow-card-depth space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <span className="w-5 h-5 rounded-full bg-[#163832] text-[#DAF1DE] flex items-center justify-center text-xs font-bold font-mono border border-[#8EB69B]/30">
            4
          </span>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#DAF1DE]">
            Environmental & Demand Conditions
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#8EB69B] uppercase tracking-wide">
          External Multipliers
        </span>
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {CONDITIONS_CONFIG.map((item) => {
          const isChecked = conditions[item.key];
          return (
            <div
              key={item.key}
              onClick={() => toggleCondition(item.key)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 select-none ${
                isChecked
                  ? 'bg-[#163832]/90 border-[#5eead4] shadow-[0_0_12px_rgba(94,234,212,0.15)]'
                  : 'bg-[#163832]/40 border-[#8EB69B]/15 hover:border-[#8EB69B]/40 hover:bg-[#163832]/60'
              }`}
            >
              {/* Checkbox box */}
              <div
                className={`w-4 h-4 mt-0.5 rounded flex items-center justify-center flex-shrink-0 transition-colors border ${
                  isChecked
                    ? 'bg-[#5eead4] border-[#5eead4] text-[#051F20]'
                    : 'bg-[#051F20] border-[#8EB69B]/40 text-transparent'
                }`}
              >
                <Check size={12} strokeWidth={3} />
              </div>

              {/* Title & Description */}
              <div className="space-y-0.5 min-w-0">
                <h4 className={`text-xs font-bold leading-tight ${isChecked ? 'text-[#DAF1DE]' : 'text-[#DAF1DE]/85'}`}>
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#8EB69B] leading-tight">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
