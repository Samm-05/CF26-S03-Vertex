import React, { useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { InfrastructureNode, InfrastructureStatus, InfrastructureCategory } from '../../types';
import type { CascadeTimelineStep } from './types';
import { DEPENDENCY_LINKS } from '../../data/infrastructureData';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

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

interface LiveSimulationMapProps {
  nodes: InfrastructureNode[];
  steps: CascadeTimelineStep[];
  currentOffsetMinutes: number;
  activeFocusNodeId: string;
  onSelectNode?: (nodeId: string) => void;
}

// Controller component to frame map view and expose zoom controls
function MapController({
  nodes,
  resetTrigger,
  zoomTrigger
}: {
  nodes: InfrastructureNode[];
  resetTrigger: number;
  zoomTrigger: 'in' | 'out' | null;
}) {
  const map = useMap();
  const initialFitDone = useRef(false);

  useEffect(() => {
    if (nodes.length > 0 && !initialFitDone.current) {
      const bounds = L.latLngBounds(nodes.map((n) => [n.lat, n.lng]));
      map.fitBounds(bounds, { padding: [35, 35], maxZoom: 13 });
      initialFitDone.current = true;
    }
  }, [nodes, map]);

  useEffect(() => {
    if (resetTrigger > 0 && nodes.length > 0) {
      const bounds = L.latLngBounds(nodes.map((n) => [n.lat, n.lng]));
      map.flyToBounds(bounds, { padding: [35, 35], maxZoom: 13, duration: 0.8 });
    }
  }, [resetTrigger, nodes, map]);

  useEffect(() => {
    if (zoomTrigger === 'in') {
      map.zoomIn();
    } else if (zoomTrigger === 'out') {
      map.zoomOut();
    }
  }, [zoomTrigger, map]);

  return null;
}

export const LiveSimulationMap: React.FC<LiveSimulationMapProps> = ({
  nodes,
  steps,
  currentOffsetMinutes,
  activeFocusNodeId,
  onSelectNode
}) => {
  const [resetTrigger, setResetTrigger] = React.useState(0);
  const [zoomTrigger, setZoomTrigger] = React.useState<'in' | 'out' | null>(null);

  const handleZoom = (dir: 'in' | 'out') => {
    setZoomTrigger(dir);
    setTimeout(() => setZoomTrigger(null), 50);
  };

  // Compute each node's status at the current offset time
  const nodeStatuses = useMemo(() => {
    const map: Record<string, InfrastructureStatus> = {};

    // Scan steps up to current offset
    for (const step of steps) {
      if (step.offsetMinutes <= currentOffsetMinutes) {
        if (step.status === 'healthy_active' || step.status === 'operational') {
          map[step.nodeId] = 'healthy';
        } else if (step.status === 'failed') {
          map[step.nodeId] = 'failed';
        } else if (step.status === 'degraded') {
          map[step.nodeId] = 'degraded';
        } else if (step.status === 'at_risk') {
          map[step.nodeId] = 'at_risk';
        }
      }
    }

    return map;
  }, [steps, currentOffsetMinutes]);

  const activeFocusNode = useMemo(() => {
    return nodes.find((n) => n.id === activeFocusNodeId) || nodes[0];
  }, [nodes, activeFocusNodeId]);

  // Compute dependency polylines with dynamic styling based on playback
  const visibleEdges = useMemo(() => {
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    return DEPENDENCY_LINKS.map((edge) => {
      const sourceNode = nodeMap.get(edge.source);
      const targetNode = nodeMap.get(edge.target);
      if (!sourceNode || !targetNode) return null;

      const sourceStatus = nodeStatuses[sourceNode.id] || 'operational';
      const targetStatus = nodeStatuses[targetNode.id] || 'operational';

      const isCascadeAffected =
        sourceStatus === 'failed' ||
        targetStatus === 'failed' ||
        sourceStatus === 'degraded' ||
        targetStatus === 'degraded';

      return {
        id: edge.id || `${edge.source}-${edge.target}`,
        positions: [
          [sourceNode.lat, sourceNode.lng] as [number, number],
          [targetNode.lat, targetNode.lng] as [number, number]
        ],
        isCascadeAffected,
        strength: edge.strength ?? 0.8
      };
    }).filter((e): e is NonNullable<typeof e> => e !== null);
  }, [nodes, nodeStatuses]);

  // Node DivIcon generator
  const createNodeDivIcon = (node: InfrastructureNode, isTargetFocus: boolean) => {
    const effectiveStatus = nodeStatuses[node.id] || 'operational';
    const statusCfg = STATUS_COLOR_MAP[effectiveStatus] || STATUS_COLOR_MAP.operational;
    const svgIcon = CATEGORY_SVGS[node.category] || CATEGORY_SVGS.power;
    const isFailed = effectiveStatus === 'failed';

    const pulseHtml = isFailed || isTargetFocus
      ? `<span class="absolute -inset-2 rounded-full animate-pulse-ring pointer-events-none" style="background-color: ${statusCfg.border};"></span>`
      : '';

    const focusRingHtml = isTargetFocus
      ? `<span class="absolute -inset-1.5 rounded-full ring-2 ring-[#5eead4] ring-offset-2 ring-offset-[#051F20]"></span>`
      : '';

    const labelHtml = isTargetFocus
      ? `<div class="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-[#0B2B26]/95 border border-[#5eead4]/60 text-[10px] font-mono font-bold text-[#5eead4] whitespace-nowrap shadow-md pointer-events-none z-20">${node.name.split(' (')[0]}</div>`
      : '';

    const html = `
      <div class="relative w-8 h-8 flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-115">
        ${pulseHtml}
        ${focusRingHtml}
        ${labelHtml}
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

  const defaultCenter: [number, number] = [21.1450, 79.0850];

  return (
    <div className="relative w-full h-full min-h-[480px] bg-[#051F20] rounded-2xl border border-[#8EB69B]/20 shadow-card-depth overflow-hidden flex flex-col">
      {/* Top Map Header Row */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0B2B26]/95 border-b border-[#8EB69B]/20 z-10">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#5eead4] animate-pulse inline-block" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#DAF1DE]">
            Live Spatial Simulation Map
          </h3>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => handleZoom('in')}
            className="p-1.5 rounded-lg bg-[#163832] text-[#8EB69B] hover:text-[#DAF1DE] hover:bg-[#235347] border border-[#8EB69B]/20 text-xs transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn size={13} />
          </button>
          <button
            type="button"
            onClick={() => handleZoom('out')}
            className="p-1.5 rounded-lg bg-[#163832] text-[#8EB69B] hover:text-[#DAF1DE] hover:bg-[#235347] border border-[#8EB69B]/20 text-xs transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut size={13} />
          </button>
          <button
            type="button"
            onClick={() => setResetTrigger((t) => t + 1)}
            className="p-1.5 rounded-lg bg-[#163832] text-[#8EB69B] hover:text-[#DAF1DE] hover:bg-[#235347] border border-[#8EB69B]/20 text-xs transition-colors cursor-pointer"
            title="Reset Map View"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative flex-1 w-full h-full">
        <MapContainer
          center={defaultCenter}
          zoom={12}
          zoomControl={false}
          className="w-full h-full"
          attributionControl={false}
        >
          {/* CartoDB Dark Matter Basemap */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            maxZoom={19}
            subdomains="abcd"
          />

          <MapController nodes={nodes} resetTrigger={resetTrigger} zoomTrigger={zoomTrigger} />

          {/* Dependency Polylines */}
          {visibleEdges.map((edge) => {
            const color = edge.isCascadeAffected ? '#C95C5C' : '#8EB69B';
            const opacity = edge.isCascadeAffected ? 0.95 : 0.15;
            const weight = edge.isCascadeAffected ? 2.8 : 1.2;
            const dashArray = edge.isCascadeAffected ? '6, 6' : '4, 8';

            return (
              <Polyline
                key={edge.id}
                positions={edge.positions}
                pathOptions={{
                  color,
                  weight,
                  opacity,
                  dashArray,
                  className: edge.isCascadeAffected ? 'cascade-active-edge' : undefined
                }}
              />
            );
          })}

          {/* Node Markers */}
          {nodes.map((node) => {
            const isFocus = node.id === activeFocusNodeId;
            const icon = createNodeDivIcon(node, isFocus);
            const effectiveStatus = nodeStatuses[node.id] || 'operational';
            const statusCfg = STATUS_COLOR_MAP[effectiveStatus] || STATUS_COLOR_MAP.operational;

            return (
              <Marker
                key={node.id}
                position={[node.lat, node.lng]}
                icon={icon}
                eventHandlers={{
                  click: () => onSelectNode && onSelectNode(node.id)
                }}
              >
                <Popup className="custom-dark-popup" closeButton={true}>
                  <div className="p-3 min-w-[200px] text-xs">
                    <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-[#8EB69B]/20 mb-2">
                      <span className="font-bold text-[#DAF1DE]">{node.name.split(' (')[0]}</span>
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-bold uppercase border"
                        style={{
                          backgroundColor: statusCfg.bg,
                          borderColor: statusCfg.border,
                          color: statusCfg.text
                        }}
                      >
                        {statusCfg.label}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#8EB69B] font-mono">
                      <span>{node.coordinates.district}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Bottom-left Legend */}
        <div className="absolute bottom-3.5 left-3.5 z-[1000] p-2.5 rounded-xl bg-[#0B2B26]/95 border border-[#8EB69B]/25 backdrop-blur-md text-[10px] font-mono flex items-center space-x-3 text-[#DAF1DE] shadow-card-depth">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8EB69B]" />
            <span>Operational</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D9A441]" />
            <span>At Risk</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C95C5C]" />
            <span>Failed</span>
          </div>
        </div>

        {/* Bottom-right Active Focus Readout */}
        <div className="absolute bottom-3.5 right-3.5 z-[1000] px-3 py-2 rounded-xl bg-[#0B2B26]/95 border border-[#8EB69B]/25 backdrop-blur-md text-[10px] font-mono text-[#DAF1DE] flex items-center space-x-1.5 shadow-card-depth">
          <span className="text-[#8EB69B]">Active Focus:</span>
          <span className="font-bold text-[#5eead4] truncate max-w-[150px]">
            {activeFocusNode ? activeFocusNode.name.split(' (')[0] : 'Power Station A'}
          </span>
        </div>
      </div>
    </div>
  );
};
