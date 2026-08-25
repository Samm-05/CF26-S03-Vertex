import React, { useState } from 'react';
import type { InfrastructureNode, InfrastructureCategory } from '../../types';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  Zap,
  Droplets,
  Hospital,
  Radio,
  Train,
  Shield,
  School,
  Factory
} from 'lucide-react';

interface InfrastructureMapProps {
  nodes: InfrastructureNode[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  simulatedFailedNodeIds?: string[];
  simulatedRiskNodeIds?: string[];
  simulatedDegradedNodeIds?: string[];
}

export const InfrastructureMap: React.FC<InfrastructureMapProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  simulatedFailedNodeIds = [],
  simulatedRiskNodeIds = [],
  simulatedDegradedNodeIds = []
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilters, setActiveCategoryFilters] = useState<Record<InfrastructureCategory, boolean>>({
    power: true,
    water: true,
    healthcare: true,
    emergency: true,
    transport: true,
    telecom: true,
    schools: true,
    industrial: true
  });

  const categoryIcons: Record<InfrastructureCategory, React.ElementType> = {
    power: Zap,
    water: Droplets,
    healthcare: Hospital,
    emergency: Shield,
    transport: Train,
    telecom: Radio,
    schools: School,
    industrial: Factory
  };

  const toggleCategory = (cat: InfrastructureCategory) => {
    setActiveCategoryFilters((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Filter nodes based on active layer toggles and search query
  const filteredNodes = nodes.filter((node) => {
    if (!activeCategoryFilters[node.category]) return false;
    if (searchQuery.trim() !== '') {
      return (
        node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.coordinates.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  // Calculate node status colors according to exact prompt rules
  const getNodeStateColors = (node: InfrastructureNode) => {
    const isSelected = node.id === selectedNodeId;
    const isFailed = simulatedFailedNodeIds.includes(node.id) || node.status === 'failed';
    const isDegraded = simulatedDegradedNodeIds.includes(node.id) || node.status === 'degraded';
    const isAtRisk = simulatedRiskNodeIds.includes(node.id) || node.status === 'at_risk';

    if (isSelected) return { bg: '#DAF1DE', border: '#DAF1DE', text: '#051F20', label: 'Selected' };
    if (isFailed) return { bg: '#C95C5C', border: '#DAF1DE', text: '#DAF1DE', label: 'Failed' };
    if (isDegraded) return { bg: '#C97A4A', border: '#DAF1DE', text: '#DAF1DE', label: 'Degraded' };
    if (isAtRisk) return { bg: '#D9A441', border: '#DAF1DE', text: '#051F20', label: 'At Risk' };
    if (node.status === 'healthy') return { bg: '#235347', border: '#8EB69B', text: '#DAF1DE', label: 'Healthy' };

    // Default Normal / Operational
    return { bg: '#8EB69B', border: '#DAF1DE', text: '#051F20', label: 'Operational' };
  };

  return (
    <div className="relative w-full h-full min-h-[500px] bg-[#051F20] rounded-card border border-[#8EB69B]/20 overflow-hidden flex flex-col">
      {/* Top Filter Bar & Search */}
      <div className="p-3 bg-[#0B2B26]/90 backdrop-blur-md border-b border-[#8EB69B]/15 flex flex-wrap items-center justify-between gap-3 z-10">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8EB69B]" />
          <input
            type="text"
            placeholder="Search infrastructure or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#163832] text-[#DAF1DE] placeholder-[#8EB69B]/60 text-xs pl-8 pr-3 py-1.5 rounded-xl border border-[#8EB69B]/20 focus:outline-none focus:border-[#8EB69B]"
          />
        </div>

        {/* Category Layer Toggles */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(Object.keys(activeCategoryFilters) as InfrastructureCategory[]).map((cat) => {
            const Icon = categoryIcons[cat];
            const isActive = activeCategoryFilters[cat];
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors border ${
                  isActive
                    ? 'bg-[#235347] text-[#DAF1DE] border-[#8EB69B]/30'
                    : 'bg-[#163832]/40 text-[#8EB69B]/50 border-transparent hover:text-[#8EB69B]'
                }`}
              >
                <Icon size={12} />
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <div
          className="w-full h-full transition-transform duration-300 transform origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Background District Outlines */}
            <rect x="5" y="5" width="40" height="40" fill="#0B2B26" opacity="0.3" rx="4" />
            <rect x="55" y="5" width="40" height="30" fill="#0B2B26" opacity="0.3" rx="4" />
            <rect x="15" y="50" width="35" height="42" fill="#0B2B26" opacity="0.3" rx="4" />
            <rect x="55" y="42" width="40" height="50" fill="#0B2B26" opacity="0.3" rx="4" />

            {/* River Pathway */}
            <path
              d="M 0,40 Q 30,55 60,35 T 100,25"
              fill="none"
              stroke="#0B2B26"
              strokeWidth="6"
            />
            <path
              d="M 0,40 Q 30,55 60,35 T 100,25"
              fill="none"
              stroke="#163832"
              strokeWidth="2.5"
              opacity="0.8"
            />

            {/* Arterial Road Grid */}
            <line x1="30" y1="0" x2="30" y2="100" stroke="#163832" strokeWidth="0.6" strokeDasharray="1,1" />
            <line x1="70" y1="0" x2="70" y2="100" stroke="#163832" strokeWidth="0.6" strokeDasharray="1,1" />
            <line x1="0" y1="30" x2="100" y2="30" stroke="#163832" strokeWidth="0.6" strokeDasharray="1,1" />
            <line x1="0" y1="70" x2="100" y2="70" stroke="#163832" strokeWidth="0.6" strokeDasharray="1,1" />

            {/* Inter-node Grid Lines */}
            {filteredNodes.map((node) =>
              node.dependencies.map((depId) => {
                const depNode = nodes.find((n) => n.id === depId);
                if (!depNode) return null;
                const isAffected =
                  simulatedFailedNodeIds.includes(node.id) ||
                  simulatedFailedNodeIds.includes(depId);

                return (
                  <line
                    key={`${depId}-${node.id}`}
                    x1={depNode.coordinates.x}
                    y1={depNode.coordinates.y}
                    x2={node.coordinates.x}
                    y2={node.coordinates.y}
                    stroke={isAffected ? '#C95C5C' : '#8EB69B'}
                    strokeWidth={isAffected ? '0.8' : '0.4'}
                    opacity={isAffected ? '0.9' : '0.3'}
                    strokeDasharray={isAffected ? '1,1' : undefined}
                  />
                );
              })
            )}
          </svg>

          {/* Interactive Custom Markers */}
          <div className="absolute inset-0 p-4">
            {filteredNodes.map((node) => {
              const stateColors = getNodeStateColors(node);
              const Icon = categoryIcons[node.category];
              const isSelected = node.id === selectedNodeId;

              return (
                <button
                  key={node.id}
                  onClick={() => onSelectNode(node.id)}
                  style={{ left: `${node.coordinates.x}%`, top: `${node.coordinates.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none group/node transition-transform duration-200"
                >
                  {/* Pulse ring for active or failed nodes */}
                  {(isSelected || stateColors.label === 'Failed' || stateColors.label === 'At Risk') && (
                    <span
                      className="absolute -inset-2 rounded-full opacity-60 animate-pulse-ring pointer-events-none"
                      style={{ backgroundColor: stateColors.bg }}
                    />
                  )}

                  {/* Marker Circle */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-200 shadow-card-depth ${
                      isSelected ? 'scale-125 z-30 ring-4 ring-[#8EB69B]/40' : 'group-hover/node:scale-115'
                    }`}
                    style={{
                      backgroundColor: stateColors.bg,
                      borderColor: stateColors.border,
                      color: stateColors.text
                    }}
                  >
                    <Icon size={14} />
                  </div>

                  {/* Label Tooltip */}
                  <div
                    className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-20 whitespace-nowrap bg-[#0B2B26]/95 backdrop-blur-md px-2.5 py-1 rounded-lg border text-xs font-semibold shadow-card-depth ${
                      isSelected
                        ? 'block border-[#DAF1DE] text-[#DAF1DE]'
                        : 'hidden group-hover/node:block border-[#8EB69B]/30 text-[#8EB69B]'
                    }`}
                  >
                    {node.name}
                    <span className="ml-1 text-[10px] font-mono opacity-80">({node.criticality})</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Map Control Buttons */}
        <div className="absolute bottom-4 right-4 flex flex-col space-y-1.5 z-10">
          <button
            onClick={() => setZoomLevel((z) => Math.min(2, z + 0.2))}
            className="p-2 rounded-xl bg-[#0B2B26]/90 text-[#DAF1DE] hover:bg-[#163832] border border-[#8EB69B]/20 transition-colors shadow-card-depth"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
            className="p-2 rounded-xl bg-[#0B2B26]/90 text-[#DAF1DE] hover:bg-[#163832] border border-[#8EB69B]/20 transition-colors shadow-card-depth"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-2 rounded-xl bg-[#0B2B26]/90 text-[#DAF1DE] hover:bg-[#163832] border border-[#8EB69B]/20 transition-colors shadow-card-depth"
            title="Reset Map View"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 bg-[#0B2B26]/90 backdrop-blur-md p-3 rounded-xl border border-[#8EB69B]/20 text-xs z-10 hidden sm:block">
          <div className="text-[10px] font-mono text-[#8EB69B] uppercase mb-1.5 font-semibold">
            Status Map States
          </div>
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8EB69B]" />
              <span className="text-[#DAF1DE] text-[11px]">Normal</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D9A441]" />
              <span className="text-[#DAF1DE] text-[11px]">At Risk</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C97A4A]" />
              <span className="text-[#DAF1DE] text-[11px]">Degraded</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C95C5C]" />
              <span className="text-[#DAF1DE] text-[11px]">Failed</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
