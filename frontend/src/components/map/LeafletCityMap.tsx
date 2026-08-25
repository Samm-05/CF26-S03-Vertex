import React, { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import type {
  InfrastructureNode,
  DependencyLink,
  InfrastructureCategory,
  InfrastructureStatus
} from '../../types';
import { DEPENDENCY_LINKS } from '../../data/infrastructureData';
import { MapFiltersBar } from './MapFiltersBar';
import { MapLegend } from './MapLegend';
import { ZoomIn, ZoomOut, RotateCcw, Activity, Zap, Network } from 'lucide-react';

// SVG Path strings for custom divIcons
const CATEGORY_SVGS: Record<InfrastructureCategory, string> = {
  power: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="currentColor"/>',
  water: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="currentColor"/>',
  healthcare: '<path d="M12 6v12m-6-6h12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" fill="none"/>',
  emergency: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="currentColor"/>',
  transport: '<rect x="4" y="3" width="16" height="16" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M4 11h16M12 3v8m-4 8l-2 2m12-2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  telecom: '<path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5M12 18a6 6 0 0 0 0-12m4.2 1.8c2.3 2.3 2.3 6.1 0 8.5M19.1 4.9C23 8.8 23 15.2 19.1 19.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  schools: '<path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="currentColor"/><path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  industrial: '<path d="M2 20h20M4 20V10l4 4V10l4 4V4h6v16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="currentColor"/>'
};

const STATUS_COLOR_MAP: Record<InfrastructureStatus, { bg: string; border: string; text: string; label: string; glow: string }> = {
  operational: { bg: '#235347', border: '#8EB69B', text: '#DAF1DE', label: 'Operational', glow: 'rgba(142,182,155,0.4)' },
  healthy: { bg: '#235347', border: '#8EB69B', text: '#DAF1DE', label: 'Healthy', glow: 'rgba(142,182,155,0.4)' },
  at_risk: { bg: '#875317', border: '#D9A441', text: '#FFF0D4', label: 'At Risk', glow: 'rgba(217,164,65,0.7)' },
  degraded: { bg: '#803417', border: '#C97A4A', text: '#FFE4D6', label: 'Degraded', glow: 'rgba(201,122,74,0.7)' },
  failed: { bg: '#701E1E', border: '#C95C5C', text: '#FFDADA', label: 'Failed', glow: 'rgba(201,92,92,0.9)' }
};

interface LeafletCityMapProps {
  nodes: InfrastructureNode[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  traceTargetNodeId?: string | null;
  onSelectTraceTarget?: (nodeId: string | null) => void;
  onSimulateFailure?: (nodeId: string) => void;
  onViewDependencies?: (nodeId: string) => void;
  simulatedStatuses?: Record<string, InfrastructureStatus>;
  links?: DependencyLink[];
  onFilteredCountChange?: (count: number) => void;
}

// Controller component to interact with Leaflet map instance
function MapController({
  nodes,
  selectedNode,
  searchQuery,
  resetTrigger
}: {
  nodes: InfrastructureNode[];
  selectedNode: InfrastructureNode | null;
  searchQuery: string;
  resetTrigger: number;
}) {
  const map = useMap();
  const initialFitDone = useRef(false);

  // Initial fitBounds on load to frame the entire city
  useEffect(() => {
    if (nodes.length > 0 && !initialFitDone.current) {
      const bounds = L.latLngBounds(nodes.map((n) => [n.lat, n.lng]));
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 13 });
      initialFitDone.current = true;
    }
  }, [nodes, map]);

  // Reset view on trigger
  useEffect(() => {
    if (resetTrigger > 0 && nodes.length > 0) {
      const bounds = L.latLngBounds(nodes.map((n) => [n.lat, n.lng]));
      map.flyToBounds(bounds, { padding: [45, 45], maxZoom: 13, duration: 0.8 });
    }
  }, [resetTrigger, nodes, map]);

  // Pan to selected node
  useEffect(() => {
    if (selectedNode) {
      map.flyTo([selectedNode.lat, selectedNode.lng], Math.max(map.getZoom(), 14), {
        duration: 0.6
      });
    }
  }, [selectedNode, map]);

  // Pan to first matching search result
  useEffect(() => {
    if (searchQuery.trim().length >= 3) {
      const match = nodes.find(
        (n) =>
          n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.coordinates.district.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (match) {
        map.flyTo([match.lat, match.lng], 14, { duration: 0.6 });
      }
    }
  }, [searchQuery, nodes, map]);

  return null;
}

// Custom Zoom Controls Component
function CustomMapControls({ onResetView }: { onResetView: () => void }) {
  const map = useMap();

  return (
    <div className="absolute bottom-4 right-4 flex flex-col space-y-1.5 z-[1000]">
      <button
        type="button"
        onClick={() => map.zoomIn()}
        className="p-2.5 rounded-xl bg-[#0B2B26]/95 text-[#DAF1DE] hover:bg-[#163832] border border-[#8EB69B]/25 hover:border-[#5eead4]/50 transition-all shadow-card-depth active:scale-95 cursor-pointer"
        title="Zoom In"
        aria-label="Zoom In"
      >
        <ZoomIn size={16} />
      </button>
      <button
        type="button"
        onClick={() => map.zoomOut()}
        className="p-2.5 rounded-xl bg-[#0B2B26]/95 text-[#DAF1DE] hover:bg-[#163832] border border-[#8EB69B]/25 hover:border-[#5eead4]/50 transition-all shadow-card-depth active:scale-95 cursor-pointer"
        title="Zoom Out"
        aria-label="Zoom Out"
      >
        <ZoomOut size={16} />
      </button>
      <button
        type="button"
        onClick={onResetView}
        className="p-2.5 rounded-xl bg-[#0B2B26]/95 text-[#DAF1DE] hover:bg-[#163832] border border-[#8EB69B]/25 hover:border-[#5eead4]/50 transition-all shadow-card-depth active:scale-95 cursor-pointer"
        title="Reset Map to Full City View"
        aria-label="Reset Map View"
      >
        <RotateCcw size={16} />
      </button>
    </div>
  );
}

export const LeafletCityMap: React.FC<LeafletCityMapProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  traceTargetNodeId = null,
  onSimulateFailure,
  onViewDependencies,
  simulatedStatuses = {},
  links = DEPENDENCY_LINKS,
  onFilteredCountChange
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [resetTrigger, setResetTrigger] = React.useState(0);
  const [activeCategories, setActiveCategories] = React.useState<Record<InfrastructureCategory, boolean>>({
    power: true,
    water: true,
    healthcare: true,
    emergency: true,
    transport: true,
    telecom: true,
    schools: true,
    industrial: true
  });

  const toggleCategory = (cat: InfrastructureCategory) => {
    setActiveCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const selectAllCategories = () => {
    const allActive = Object.values(activeCategories).every(Boolean);
    setActiveCategories({
      power: !allActive,
      water: !allActive,
      healthcare: !allActive,
      emergency: !allActive,
      transport: !allActive,
      telecom: !allActive,
      schools: !allActive,
      industrial: !allActive
    });
  };

  // Helper to determine effective status
  const getNodeEffectiveStatus = (node: InfrastructureNode): InfrastructureStatus => {
    if (simulatedStatuses[node.id]) {
      return simulatedStatuses[node.id];
    }
    return node.status;
  };

  // Filter nodes based on category pills and search
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      if (!activeCategories[node.category]) return false;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        return (
          node.name.toLowerCase().includes(query) ||
          node.coordinates.district.toLowerCase().includes(query) ||
          node.category.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [nodes, activeCategories, searchQuery]);

  // Update parent with visible count
  useEffect(() => {
    if (onFilteredCountChange) {
      onFilteredCountChange(filteredNodes.length);
    }
  }, [filteredNodes.length, onFilteredCountChange]);

  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  // Filter and compute dependency edges across city
  const visibleEdges = useMemo(() => {
    const visibleNodeIds = new Set(filteredNodes.map((n) => n.id));
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    return links
      .filter((edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target))
      .map((edge) => {
        const sourceNode = nodeMap.get(edge.source);
        const targetNode = nodeMap.get(edge.target);
        if (!sourceNode || !targetNode) return null;

        const sourceStatus = getNodeEffectiveStatus(sourceNode);
        const targetStatus = getNodeEffectiveStatus(targetNode);
        const isCascadeAffected =
          sourceStatus === 'failed' ||
          targetStatus === 'failed' ||
          sourceStatus === 'degraded' ||
          targetStatus === 'degraded';

        const isSourceFailed = sourceStatus === 'failed';

        // Check if edge is part of multi-select cascade trace
        const isDirectTraceEdge =
          selectedNodeId && traceTargetNodeId
            ? (edge.source === selectedNodeId && edge.target === traceTargetNodeId) ||
              (edge.source === selectedNodeId) ||
              (edge.target === traceTargetNodeId)
            : false;

        return {
          id: edge.id || `${edge.source}-${edge.target}`,
          sourceNode,
          targetNode,
          positions: [
            [sourceNode.lat, sourceNode.lng] as [number, number],
            [targetNode.lat, targetNode.lng] as [number, number]
          ],
          type: edge.type,
          critical: edge.critical,
          strength: edge.strength ?? (edge.critical ? 0.9 : 0.6),
          isCascadeAffected,
          isSourceFailed,
          isDirectTraceEdge
        };
      })
      .filter((e): e is NonNullable<typeof e> => e !== null);
  }, [links, filteredNodes, nodes, simulatedStatuses, selectedNodeId, traceTargetNodeId]);

  // Create custom HTML DivIcon for each node
  const createNodeDivIcon = (node: InfrastructureNode, isSelected: boolean, isTraceTarget: boolean) => {
    const effectiveStatus = getNodeEffectiveStatus(node);
    const statusCfg = STATUS_COLOR_MAP[effectiveStatus] || STATUS_COLOR_MAP.operational;
    const svgIcon = CATEGORY_SVGS[node.category] || CATEGORY_SVGS.power;
    const isPulsing = effectiveStatus === 'failed' || effectiveStatus === 'at_risk' || isSelected || isTraceTarget;

    const pulseHtml = isPulsing
      ? `<span class="absolute -inset-2 rounded-full animate-pulse-ring pointer-events-none" style="background-color: ${
          isSelected && traceTargetNodeId ? '#C95C5C' : isTraceTarget ? '#5eead4' : statusCfg.border
        };"></span>`
      : '';

    let ringHtml = '';
    if (isSelected) {
      ringHtml = traceTargetNodeId
        ? `<span class="absolute -inset-1 rounded-full ring-2 ring-[#f87171] ring-offset-2 ring-offset-[#051F20]"></span>`
        : `<span class="absolute -inset-1 rounded-full ring-2 ring-[#5eead4] ring-offset-2 ring-offset-[#051F20]"></span>`;
    } else if (isTraceTarget) {
      ringHtml = `<span class="absolute -inset-1 rounded-full ring-2 ring-[#38bdf8] ring-offset-2 ring-offset-[#051F20]"></span>`;
    }

    const html = `
      <div class="relative w-8 h-8 flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-115">
        ${pulseHtml}
        ${ringHtml}
        <div class="w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-lg transition-all"
             style="background-color: ${statusCfg.bg}; border-color: ${statusCfg.border}; color: ${statusCfg.text}; box-shadow: 0 0 12px ${statusCfg.glow};">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
            ${svgIcon}
          </svg>
        </div>
      </div>
    `;

    return L.divIcon({
      className: 'custom-leaflet-marker',
      html,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -18]
    });
  };

  // Center coordinate of Nagpur city
  const defaultCenter: [number, number] = [21.1450, 79.0850];

  return (
    <div className="relative w-full h-full min-h-[500px] bg-[#051F20] rounded-card border border-[#8EB69B]/20 overflow-hidden flex flex-col">
      {/* Top Filter Bar & Search */}
      <MapFiltersBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategories={activeCategories}
        onToggleCategory={toggleCategory}
        onSelectAllCategories={selectAllCategories}
      />

      {/* Main Map Canvas Area */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <MapContainer
          center={defaultCenter}
          zoom={12}
          zoomControl={false}
          className="w-full h-full"
          attributionControl={true}
        >
          {/* CartoDB Dark Matter Basemap */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noreferrer">CARTO</a>'
            maxZoom={19}
            subdomains="abcd"
          />

          {/* Map controller for smooth interactions */}
          <MapController
            nodes={filteredNodes}
            selectedNode={selectedNode}
            searchQuery={searchQuery}
            resetTrigger={resetTrigger}
          />

          {/* Dependency Polyline Edges across city */}
          {visibleEdges.map((edge) => {
            const isTraceActive = selectedNodeId && traceTargetNodeId;
            const isDirectConnection = selectedNodeId
              ? edge.sourceNode.id === selectedNodeId || edge.targetNode.id === selectedNodeId
              : false;

            let color = '#8EB69B';
            let opacity = 0.15;
            let weight = 1.2;
            let dashArray: string | undefined = '4, 8';

            if (edge.isCascadeAffected) {
              color = '#C95C5C';
              opacity = 0.95;
              weight = 2.8;
              dashArray = '6, 6';
            } else if (isTraceActive && edge.isDirectTraceEdge) {
              color = '#5eead4';
              opacity = 1;
              weight = 3.2;
              dashArray = '6, 4';
            } else if (isDirectConnection) {
              color = '#5eead4';
              opacity = 0.85;
              weight = 2.5;
              dashArray = undefined;
            }

            return (
              <Polyline
                key={edge.id}
                positions={edge.positions}
                pathOptions={{
                  color,
                  weight,
                  opacity,
                  dashArray,
                  className: edge.isCascadeAffected || (isTraceActive && edge.isDirectTraceEdge) ? 'cascade-active-edge' : undefined
                }}
              />
            );
          })}

          {/* Infrastructure Asset Markers across city */}
          {filteredNodes.map((node) => {
            const isSelected = node.id === selectedNodeId;
            const isTraceTarget = node.id === traceTargetNodeId;
            const effectiveStatus = getNodeEffectiveStatus(node);
            const statusCfg = STATUS_COLOR_MAP[effectiveStatus] || STATUS_COLOR_MAP.operational;
            const icon = createNodeDivIcon(node, isSelected, isTraceTarget);

            return (
              <Marker
                key={node.id}
                position={[node.lat, node.lng]}
                icon={icon}
                eventHandlers={{
                  click: () => onSelectNode(node.id)
                }}
              >
                <Popup className="custom-dark-popup" closeButton={true}>
                  <div className="p-3.5 min-w-[240px] text-xs font-sans">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[#8EB69B]/20">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#8EB69B]">
                          {node.category}
                        </span>
                        <h4 className="font-bold text-[#DAF1DE] text-sm leading-tight">{node.name}</h4>
                      </div>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border"
                        style={{
                          backgroundColor: statusCfg.bg,
                          borderColor: statusCfg.border,
                          color: statusCfg.text
                        }}
                      >
                        {statusCfg.label}
                      </span>
                    </div>

                    {/* District & Location */}
                    <div className="text-[11px] text-[#8EB69B] mb-2 font-mono flex items-center justify-between">
                      <span>{node.coordinates.district}</span>
                      <span className="text-[10px] opacity-75">
                        {node.lat.toFixed(4)}, {node.lng.toFixed(4)}
                      </span>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-2 my-2.5 p-2 rounded-lg bg-[#051F20]/70 border border-[#8EB69B]/15">
                      <div>
                        <span className="text-[10px] text-[#8EB69B] block">Criticality</span>
                        <span className="font-mono font-bold text-[#DAF1DE] text-xs">
                          {node.criticality}/100
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8EB69B] block">Current Load</span>
                        <span className="font-mono font-semibold text-[#DAF1DE] text-xs">
                          {node.currentLoad ? `${node.currentLoad}` : node.capacity}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-[#8EB69B]/15">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectNode(node.id);
                        }}
                        className="flex-1 flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg bg-[#163832] text-[#DAF1DE] hover:bg-[#235347] border border-[#8EB69B]/30 text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        <Activity size={12} className="text-[#5eead4]" />
                        <span>Inspect</span>
                      </button>

                      {onViewDependencies && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDependencies(node.id);
                          }}
                          className="flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg bg-[#163832] text-[#8EB69B] hover:text-[#DAF1DE] hover:bg-[#235347] border border-[#8EB69B]/20 text-[11px] font-medium transition-colors cursor-pointer"
                          title="View Dependency Path"
                        >
                          <Network size={12} />
                          <span>Network</span>
                        </button>
                      )}

                      {onSimulateFailure && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSimulateFailure(node.id);
                          }}
                          className="flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg bg-[#701E1E]/80 text-[#FFDADA] hover:bg-[#701E1E] border border-[#C95C5C]/40 text-[11px] font-medium transition-colors cursor-pointer"
                          title="Simulate Outage"
                        >
                          <Zap size={12} />
                          <span>Simulate</span>
                        </button>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Custom Dark Zoom Controls */}
          <CustomMapControls onResetView={() => setResetTrigger((t) => t + 1)} />
        </MapContainer>

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-[1000] hidden sm:block">
          <MapLegend />
        </div>
      </div>
    </div>
  );
};
export default LeafletCityMap;
