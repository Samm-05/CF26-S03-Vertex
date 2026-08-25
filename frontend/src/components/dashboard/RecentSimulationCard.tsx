import React from 'react';
import { ArrowRight, Users, Clock, Network } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface RecentSimulationCardProps {
  onViewSimulation: () => void;
}

export const RecentSimulationCard: React.FC<RecentSimulationCardProps> = ({
  onViewSimulation
}) => {
  return (
    <div className="p-5 rounded-card bg-[#0B2B26] border border-[#8EB69B]/15 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8EB69B]">
            Recent Simulation Run
          </span>
          <StatusBadge status="failed" size="sm" />
        </div>

        <h3 className="text-lg font-bold text-[#DAF1DE] mb-1">
          Power Station A Failure
        </h3>
        <p className="text-xs text-[#8EB69B] mb-4">
          Simulated under 70% severity and High Demand conditions.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-[#163832]/60 border border-[#8EB69B]/15">
            <div className="flex items-center space-x-1 text-[#8EB69B] mb-0.5">
              <Network size={13} />
              <span className="text-[10px] uppercase font-semibold">Affected</span>
            </div>
            <p className="text-base font-bold font-mono text-[#DAF1DE]">37 nodes</p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#163832]/60 border border-[#8EB69B]/15">
            <div className="flex items-center space-x-1 text-[#8EB69B] mb-0.5">
              <Users size={13} />
              <span className="text-[10px] uppercase font-semibold">Pop. Risk</span>
            </div>
            <p className="text-base font-bold font-mono text-[#DAF1DE]">240K</p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#163832]/60 border border-[#8EB69B]/15">
            <div className="flex items-center space-x-1 text-[#8EB69B] mb-0.5">
              <Clock size={13} />
              <span className="text-[10px] uppercase font-semibold">Recovery</span>
            </div>
            <p className="text-base font-bold font-mono text-[#DAF1DE]">16 hours</p>
          </div>
        </div>
      </div>

      <button
        onClick={onViewSimulation}
        className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[#235347] text-[#DAF1DE] hover:bg-[#1e4840] border border-[#8EB69B]/30 font-semibold text-xs transition-colors"
      >
        <span>View Simulation Results</span>
        <ArrowRight size={15} />
      </button>
    </div>
  );
};
