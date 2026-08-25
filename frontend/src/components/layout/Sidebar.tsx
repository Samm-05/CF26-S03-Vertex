import React from 'react';
import {
  LayoutDashboard,
  Map,
  Network,
  Cpu,
  BarChart3,
  ShieldCheck,
  Radio,
  ChevronRight
} from 'lucide-react';
import type { NavigationTab } from '../../types';

interface SidebarProps {
  activeTab: NavigationTab['id'];
  onTabChange: (tab: NavigationTab['id']) => void;
  activeScenarioName?: string;
  isSimulating?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  activeScenarioName = 'Power Station A Failure',
  isSimulating = false
}) => {
  const navItems: { id: NavigationTab['id']; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'City Map', icon: Map },
    { id: 'network', label: 'Infrastructure Network', icon: Network },
    { id: 'simulator', label: 'Cascade Simulator', icon: Cpu },
    { id: 'results', label: 'Results & Intervention', icon: BarChart3 }
  ];

  return (
    <aside className="w-64 bg-[#0B2B26] border-r border-[#8EB69B]/15 flex flex-col justify-between h-screen sticky top-0 z-30 shrink-0 hidden md:flex">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-[#8EB69B]/15 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#235347] to-[#163832] border border-[#8EB69B]/30 flex items-center justify-center shadow-glow-sm">
            <Radio size={22} className="text-[#DAF1DE] animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider text-[#DAF1DE] flex items-center gap-1.5">
              CASCADE<span className="text-[#8EB69B] font-mono text-sm uppercase px-1.5 py-0.5 rounded bg-[#163832] border border-[#8EB69B]/20">-X</span>
            </h1>
            <p className="text-[11px] text-[#8EB69B] font-medium tracking-tight">
              Urban Infrastructure Cascade Simulator
            </p>
          </div>
        </div>

        {/* Live Active Command Scenario Card */}
        <div className="mx-4 my-4 p-3 rounded-card bg-[#163832]/60 border border-[#8EB69B]/20">
          <div className="flex items-center justify-between text-[11px] text-[#8EB69B] uppercase tracking-wider font-medium mb-1">
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-[#D9A441] animate-ping' : 'bg-[#8EB69B]'}`} />
              {isSimulating ? 'SIMULATION RUNNING' : 'ACTIVE SCENARIO'}
            </span>
            <span className="text-xs text-[#DAF1DE] font-mono">v3.4</span>
          </div>
          <p className="text-xs font-semibold text-[#DAF1DE] truncate">{activeScenarioName}</p>
        </div>

        {/* Primary Navigation */}
        <nav className="px-3 space-y-1">
          <div className="px-3 pt-2 pb-1 text-[10px] font-semibold tracking-wider text-[#8EB69B]/70 uppercase">
            Command Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#235347] text-[#DAF1DE] shadow-glow-sm border border-[#8EB69B]/30'
                    : 'text-[#8EB69B] hover:bg-[#163832] hover:text-[#DAF1DE]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    size={18}
                    className={`transition-colors ${
                      isActive ? 'text-[#DAF1DE]' : 'text-[#8EB69B] group-hover:text-[#DAF1DE]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight size={14} className="text-[#DAF1DE]" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status */}
      <div className="p-4 border-t border-[#8EB69B]/15 bg-[#051F20]/50">
        <div className="flex items-center space-x-3 text-xs text-[#8EB69B]">
          <ShieldCheck size={16} className="text-[#8EB69B] shrink-0" />
          <div className="truncate">
            <p className="text-[#DAF1DE] font-medium truncate">Verdant Metro Grid</p>
            <p className="text-[11px] text-[#8EB69B]/80 truncate">150 Nodes • 18 Critical</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
