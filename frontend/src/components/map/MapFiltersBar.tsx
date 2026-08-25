import React from 'react';
import type { InfrastructureCategory } from '../../types';
import {
  Search,
  Zap,
  Droplets,
  Hospital,
  Shield,
  Train,
  Radio,
  GraduationCap,
  Factory,
  X,
  Layers
} from 'lucide-react';

export const CATEGORY_ICONS: Record<InfrastructureCategory, React.ElementType> = {
  power: Zap,
  water: Droplets,
  healthcare: Hospital,
  emergency: Shield,
  transport: Train,
  telecom: Radio,
  schools: GraduationCap,
  industrial: Factory
};

export const CATEGORY_LABELS: Record<InfrastructureCategory, string> = {
  power: 'Power',
  water: 'Water',
  healthcare: 'Healthcare',
  emergency: 'Emergency',
  transport: 'Transport',
  telecom: 'Telecom',
  schools: 'Schools',
  industrial: 'Industrial'
};

interface MapFiltersBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategories: Record<InfrastructureCategory, boolean>;
  onToggleCategory: (category: InfrastructureCategory) => void;
  onSelectAllCategories: () => void;
}

export const MapFiltersBar: React.FC<MapFiltersBarProps> = ({
  searchQuery,
  onSearchChange,
  activeCategories,
  onToggleCategory,
  onSelectAllCategories
}) => {
  const categories = Object.keys(activeCategories) as InfrastructureCategory[];
  const allActive = categories.every((cat) => activeCategories[cat]);

  return (
    <div className="p-3 bg-[#0B2B26]/95 backdrop-blur-md border-b border-[#8EB69B]/20 flex flex-wrap items-center justify-between gap-2.5 z-20 relative">
      {/* Search Bar */}
      <div className="relative flex-1 min-w-[200px] max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8EB69B]" />
        <input
          type="text"
          placeholder="Search infrastructure or district..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[#163832] text-[#DAF1DE] placeholder-[#8EB69B]/60 text-xs pl-8 pr-8 py-2 rounded-xl border border-[#8EB69B]/20 focus:outline-none focus:border-[#5eead4] focus:ring-1 focus:ring-[#5eead4] transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8EB69B] hover:text-[#DAF1DE] cursor-pointer"
            title="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category Filter Pills + All Toggle */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* All Layers Toggle */}
        <button
          type="button"
          onClick={onSelectAllCategories}
          className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border cursor-pointer ${
            allActive
              ? 'bg-[#163832] text-[#5eead4] border-[#5eead4]/30'
              : 'bg-[#0B2B26] text-[#8EB69B]/60 border-[#8EB69B]/15 hover:text-[#DAF1DE]'
          }`}
          title={allActive ? 'All categories active' : 'Select all categories'}
        >
          <Layers size={12} />
          <span>All</span>
        </button>

        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat];
          const isActive = activeCategories[cat];
          const label = CATEGORY_LABELS[cat];

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onToggleCategory(cat)}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border cursor-pointer select-none ${
                isActive
                  ? 'bg-[#235347] text-[#DAF1DE] border-[#5eead4]/40 shadow-sm'
                  : 'bg-[#163832]/40 text-[#8EB69B]/40 border-transparent hover:text-[#8EB69B] hover:bg-[#163832]/70'
              }`}
            >
              <Icon size={12} className={isActive ? 'text-[#5eead4]' : 'opacity-60'} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
