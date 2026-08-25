import React from 'react';
import { X, ShieldAlert } from 'lucide-react';

interface AlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlertsDrawer: React.FC<AlertsDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const systemAlerts = [
    {
      id: 'alt-1',
      type: 'critical',
      title: 'POWER STATION A VULNERABILITY ALERT',
      time: '10 minutes ago',
      details: 'Power Station A failure could affect 4 regional hospitals and 3 municipal water treatment facilities.',
      district: 'North District'
    },
    {
      id: 'alt-2',
      type: 'warning',
      title: 'WATER PLANT B BACKUP MISSING',
      time: '35 minutes ago',
      details: 'Water Plant B lacks redundant backup generators. Grid loss will cause immediate pressure drops.',
      district: 'Riverside Basin'
    },
    {
      id: 'alt-[#3]',
      type: 'warning',
      title: 'ELEVATED TELECOM LATENCY',
      time: '1 hour ago',
      details: 'Telecom Hub C battery array at 82% capacity. SCADA telemetry latency elevated by +120ms.',
      district: 'Central Business District'
    },
    {
      id: 'alt-[#4]',
      type: 'info',
      title: 'ROUTINE GRID DIAGNOSTIC COMPLETE',
      time: '3 hours ago',
      details: 'Power Station B solar auxiliary bank operating within normal parameters.',
      district: 'East Tech Park'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#051F20]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0B2B26] border-l border-[#8EB69B]/20 p-6 flex flex-col justify-between h-full shadow-card-depth animate-in slide-in-from-right duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#8EB69B]/15 mb-6">
            <div className="flex items-center space-x-2">
              <ShieldAlert size={20} className="text-[#C95C5C]" />
              <h2 className="text-lg font-bold text-[#DAF1DE]">Active Command Alerts</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#163832] text-[#8EB69B] hover:text-[#DAF1DE] border border-[#8EB69B]/20 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Alerts List */}
          <div className="space-y-3">
            {systemAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                  alert.type === 'critical'
                    ? 'bg-[#C95C5C]/10 border-[#C95C5C]/30'
                    : alert.type === 'warning'
                    ? 'bg-[#D9A441]/10 border-[#D9A441]/30'
                    : 'bg-[#163832]/60 border-[#8EB69B]/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono font-bold text-[10px] uppercase tracking-wider ${
                      alert.type === 'critical'
                        ? 'text-[#C95C5C]'
                        : alert.type === 'warning'
                        ? 'text-[#D9A441]'
                        : 'text-[#8EB69B]'
                    }`}
                  >
                    {alert.title}
                  </span>
                  <span className="text-[10px] text-[#8EB69B]/70">{alert.time}</span>
                </div>
                <p className="text-[#DAF1DE] font-medium leading-relaxed">{alert.details}</p>
                <div className="text-[10px] font-mono text-[#8EB69B] pt-1">
                  Location: {alert.district}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#8EB69B]/15">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#163832] text-[#8EB69B] hover:text-[#DAF1DE] border border-[#8EB69B]/20 font-semibold text-xs transition-colors"
          >
            Acknowledge & Close Alerts
          </button>
        </div>
      </div>
    </div>
  );
};
