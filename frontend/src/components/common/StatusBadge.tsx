import React from 'react';
import type { InfrastructureStatus } from '../../types';
import { CheckCircle2, Shield, AlertTriangle, AlertOctagon, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: InfrastructureStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true
}) => {
  let bgClass = '';
  let borderClass = '';
  let textClass = '';
  let label = '';
  let Icon = CheckCircle2;

  switch (status) {
    case 'operational':
      bgClass = 'bg-[#8EB69B]/15';
      borderClass = 'border-[#8EB69B]/40';
      textClass = 'text-[#8EB69B]';
      label = 'Operational';
      Icon = CheckCircle2;
      break;
    case 'healthy':
      bgClass = 'bg-[#235347]/30';
      borderClass = 'border-[#235347]';
      textClass = 'text-[#DAF1DE]';
      label = 'Healthy';
      Icon = Shield;
      break;
    case 'at_risk':
      bgClass = 'bg-[#D9A441]/15';
      borderClass = 'border-[#D9A441]/40';
      textClass = 'text-[#D9A441]';
      label = 'At Risk';
      Icon = AlertTriangle;
      break;
    case 'degraded':
      bgClass = 'bg-[#C97A4A]/15';
      borderClass = 'border-[#C97A4A]/40';
      textClass = 'text-[#C97A4A]';
      label = 'Degraded';
      Icon = AlertOctagon;
      break;
    case 'failed':
      bgClass = 'bg-[#C95C5C]/15';
      borderClass = 'border-[#C95C5C]/40';
      textClass = 'text-[#C95C5C]';
      label = 'Failed / Critical';
      Icon = XCircle;
      break;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 space-x-1',
    md: 'text-xs px-2.5 py-1 space-x-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 space-x-2 font-semibold'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${bgClass} ${borderClass} ${textClass} ${sizeClasses[size]} tracking-wide uppercase`}
    >
      {showIcon && <Icon size={iconSizes[size]} className="shrink-0" />}
      <span>{label}</span>
    </span>
  );
};
