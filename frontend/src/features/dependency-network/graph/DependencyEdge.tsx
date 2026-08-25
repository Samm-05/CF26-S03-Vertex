import React from 'react';
import { getBezierPath, type EdgeProps } from '@xyflow/react';

export interface DependencyEdgeData {
  kind: 'direct' | 'indirect';
  isHighlighted: boolean;
  isDimmed: boolean;
  isCriticalPath?: boolean;
  isCascadeActive?: boolean;
}

export const DependencyEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data
}) => {
  const edgeData = (data as unknown as DependencyEdgeData) || {
    kind: 'direct',
    isHighlighted: false,
    isDimmed: false
  };

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.35
  });

  const isIndirect = edgeData.kind === 'indirect';
  const isHighlighted = edgeData.isHighlighted || edgeData.isCriticalPath || edgeData.isCascadeActive;
  const isDimmed = edgeData.isDimmed && !isHighlighted;
  const isCascade = edgeData.isCascadeActive;

  // Determine stroke style
  let strokeColor = '#8EB69B';
  let strokeOpacity = 0.35;
  let strokeWidth = isIndirect ? 1.5 : 2;
  let strokeDasharray = isIndirect ? '5, 5' : undefined;

  if (isCascade) {
    strokeColor = '#C95C5C';
    strokeOpacity = 0.95;
    strokeWidth = 2.5;
    strokeDasharray = '6, 6';
  } else if (isHighlighted) {
    strokeColor = '#5eead4';
    strokeOpacity = 0.9;
    strokeWidth = 2.5;
    strokeDasharray = isIndirect ? '6, 6' : '6, 6'; // Animated dash when highlighted
  } else if (isDimmed) {
    strokeOpacity = 0.08;
    strokeWidth = 1;
  }

  return (
    <g className="dependency-edge-group">
      {/* Background glow path when highlighted */}
      {isHighlighted && (
        <path
          d={edgePath}
          fill="none"
          stroke={isCascade ? 'rgba(201, 92, 92, 0.4)' : 'rgba(94, 234, 212, 0.35)'}
          strokeWidth={strokeWidth + 4}
          strokeLinecap="round"
        />
      )}

      {/* Main Connector Path */}
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeOpacity={strokeOpacity}
        strokeDasharray={strokeDasharray}
        strokeLinecap="round"
        className={isHighlighted ? 'animate-flow-dash' : undefined}
      />
    </g>
  );
};
