import React from 'react';
import type { InfrastructureNode } from '../types';
import { KpiCard } from '../components/dashboard/KpiCard';
import { CityResilienceCard } from '../components/dashboard/CityResilienceCard';
import { CriticalInfrastructureRanking } from '../components/dashboard/CriticalInfrastructureRanking';
import { RecentSimulationCard } from '../components/dashboard/RecentSimulationCard';
import { ActiveAlertsCard } from '../components/dashboard/ActiveAlertsCard';
import { MiniMapOverview } from '../components/dashboard/MiniMapOverview';
import { ShieldCheck, Network, AlertOctagon, Users } from 'lucide-react';

interface DashboardViewProps {
  nodes: InfrastructureNode[];
  onSelectNode: (nodeId: string) => void;
  onNavigateToMap: () => void;
  onNavigateToSimulator: () => void;
  onNavigateToResults: () => void;
  onOpenAlertsDrawer: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  nodes,
  onSelectNode,
  onNavigateToMap,
  onNavigateToSimulator,
  onNavigateToResults,
  onOpenAlertsDrawer
}) => {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#8EB69B]/15 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#8EB69B] uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#8EB69B] inline-block animate-pulse" />
            Command Center Dashboard
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-[#DAF1DE] tracking-tight">
            CASCADE-X
          </h1>
          <p className="text-sm md:text-base text-[#8EB69B] mt-1 max-w-2xl">
            Monitor infrastructure dependencies, simulate cascading failures, and improve urban resilience.
          </p>
        </div>

        <button
          onClick={onNavigateToSimulator}
          className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-[#235347] text-[#DAF1DE] hover:bg-[#1e4840] border border-[#8EB69B]/30 shadow-glow-sm font-semibold text-sm transition-all"
        >
          Launch Cascade Simulator →
        </button>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="City Resilience"
          value="78"
          subValue="/ 100"
          icon={ShieldCheck}
          trend={{ label: 'Stable', positive: true }}
          highlight
        />
        <KpiCard
          label="Infrastructure Nodes"
          value="150"
          subValue="Active"
          icon={Network}
          trend={{ label: '+12 interconnected', positive: true }}
        />
        <KpiCard
          label="Critical Nodes"
          value="18"
          subValue="High Tier"
          icon={AlertOctagon}
          trend={{ label: 'High Severity', positive: false }}
        />
        <KpiCard
          label="Population at Risk"
          value="240K"
          subValue="Baseline"
          icon={Users}
          trend={{ label: 'Peak Capacity', positive: false }}
        />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: City Map Preview */}
        <div className="lg:col-span-2 min-h-[420px]">
          <MiniMapOverview
            nodes={nodes}
            onOpenFullMap={onNavigateToMap}
            onSelectNode={(nodeId) => {
              onSelectNode(nodeId);
              onNavigateToMap();
            }}
          />
        </div>

        {/* Right 1 Col: Critical Infrastructure Ranking */}
        <div className="lg:col-span-1">
          <CriticalInfrastructureRanking
            nodes={nodes}
            onSelectNode={(nodeId) => {
              onSelectNode(nodeId);
              onNavigateToMap();
            }}
          />
        </div>
      </div>

      {/* Resilience Score Breakdown */}
      <CityResilienceCard />

      {/* Bottom Grid: Recent Simulation & Active Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentSimulationCard onViewSimulation={onNavigateToResults} />
        <ActiveAlertsCard onOpenAlertsDrawer={onOpenAlertsDrawer} />
      </div>
    </div>
  );
};
