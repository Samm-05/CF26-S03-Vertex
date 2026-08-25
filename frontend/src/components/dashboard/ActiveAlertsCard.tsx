import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface ActiveAlertsCardProps {
  onOpenAlertsDrawer: () => void;
}

export const ActiveAlertsCard: React.FC<ActiveAlertsCardProps> = ({
  onOpenAlertsDrawer
}) => {
  const alerts = [
    {
      id: 'a1',
      severity: 'critical',
      title: 'CRITICAL CASCADE RISK',
      message: 'Power Station A failure could affect 4 hospitals and 3 water facilities.',
      time: '12m ago'
    },
    {
      id: 'a2',
      severity: 'warning',
      title: 'VULNERABILITY WARNING',
      message: 'Water Plant B lacks redundant backup power connection.',
      time: '45m ago'
    },
    {
      id: 'a3',
      severity: 'info',
      title: 'SYSTEMIC STATUS',
      message: 'Grid load elevated in North Industrial District (+18%).',
      time: '2h ago'
    }
  ];

  return (
    <div className="p-5 rounded-card bg-[#0B2B26] border border-[#8EB69B]/15 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <ShieldAlert size={18} className="text-[#C95C5C]" />
            <h3 className="text-[#DAF1DE] font-semibold text-sm">Active Command Alerts</h3>
          </div>
          <span className="text-[10px] font-mono text-[#C95C5C] px-2 py-0.5 bg-[#C95C5C]/15 rounded border border-[#C95C5C]/30">
            3 Active
          </span>
        </div>

        <div className="space-y-2.5 mb-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-xl border text-xs ${
                alert.severity === 'critical'
                  ? 'bg-[#C95C5C]/10 border-[#C95C5C]/30 text-[#DAF1DE]'
                  : alert.severity === 'warning'
                  ? 'bg-[#D9A441]/10 border-[#D9A441]/30 text-[#DAF1DE]'
                  : 'bg-[#163832]/60 border-[#8EB69B]/20 text-[#8EB69B]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`font-bold font-mono text-[10px] ${
                    alert.severity === 'critical'
                      ? 'text-[#C95C5C]'
                      : alert.severity === 'warning'
                      ? 'text-[#D9A441]'
                      : 'text-[#8EB69B]'
                  }`}
                >
                  {alert.title}
                </span>
                <span className="text-[10px] text-[#8EB69B]/70">{alert.time}</span>
              </div>
              <p className="leading-snug">{alert.message}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onOpenAlertsDrawer}
        className="w-full text-center py-2 rounded-xl bg-[#163832] text-[#8EB69B] hover:text-[#DAF1DE] border border-[#8EB69B]/20 font-medium text-xs transition-colors"
      >
        View All System Alerts
      </button>
    </div>
  );
};
