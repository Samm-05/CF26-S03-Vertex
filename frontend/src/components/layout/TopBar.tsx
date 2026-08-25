import React from 'react';
import {
  Bell,
  Play,
  Building2,
  Menu,
  X
} from 'lucide-react';
import type { NavigationTab } from '../../types';

interface TopBarProps {
  onRunPrimaryDemo: () => void;
  onOpenAlerts: () => void;
  alertsCount: number;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  activeTab: NavigationTab['id'];
  onTabChange: (tab: NavigationTab['id']) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onRunPrimaryDemo,
  onOpenAlerts,
  alertsCount,
  mobileMenuOpen,
  setMobileMenuOpen,
  activeTab,
  onTabChange
}) => {
  return (
    <header className="h-16 bg-[#0B2B26]/90 backdrop-blur-md border-b border-[#8EB69B]/15 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Mobile hamburger & City Context */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-[#163832] text-[#DAF1DE] md:hidden border border-[#8EB69B]/20"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="flex items-center space-x-2 bg-[#163832] px-3 py-1.5 rounded-xl border border-[#8EB69B]/20">
          <Building2 size={16} className="text-[#8EB69B]" />
          <span className="text-xs md:text-sm font-semibold text-[#DAF1DE]">Verdant Metropolis</span>
          <span className="text-[10px] text-[#8EB69B] px-1.5 py-0.5 rounded bg-[#051F20] font-mono">
            Aethelgard Bay
          </span>
        </div>
      </div>

      {/* Center/Right Actions */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Primary Demo Scenario Trigger Button */}
        <button
          onClick={onRunPrimaryDemo}
          className="flex items-center space-x-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-gradient-to-r from-[#235347] to-[#163832] text-[#DAF1DE] text-xs md:text-sm font-semibold border border-[#8EB69B]/30 hover:border-[#8EB69B]/60 transition-all duration-200 shadow-glow-sm group"
        >
          <Play size={14} className="fill-[#DAF1DE] group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Run Primary Demo Scenario</span>
          <span className="sm:hidden">Demo</span>
        </button>

        {/* Alerts Trigger */}
        <button
          onClick={onOpenAlerts}
          className="relative p-2 rounded-xl bg-[#163832] text-[#8EB69B] hover:text-[#DAF1DE] border border-[#8EB69B]/20 transition-colors"
          title="Active Infrastructure Alerts"
        >
          <Bell size={18} />
          {alertsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#C95C5C] text-[#DAF1DE] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#051F20]">
              {alertsCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[#0B2B26] border-b border-[#8EB69B]/20 p-4 space-y-2 md:hidden z-40 shadow-card-depth">
          <div className="text-[11px] font-medium text-[#8EB69B] uppercase tracking-wider mb-2">
            Navigation Menu
          </div>
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'map', label: 'City Map' },
            { id: 'network', label: 'Infrastructure Network' },
            { id: 'simulator', label: 'Cascade Simulator' },
            { id: 'results', label: 'Results & Intervention' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id as NavigationTab['id']);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === item.id
                  ? 'bg-[#235347] text-[#DAF1DE]'
                  : 'text-[#8EB69B] hover:bg-[#163832]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
