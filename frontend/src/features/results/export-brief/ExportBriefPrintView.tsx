import React from 'react';
import type { SimulationResult, Intervention } from '../../../types';
import { useExportBriefData } from './useExportBriefData';

interface ExportBriefPrintViewProps {
  result: SimulationResult;
  activeIntervention?: Intervention | null;
}

export const ExportBriefPrintView: React.FC<ExportBriefPrintViewProps> = ({
  result,
  activeIntervention
}) => {
  const {
    scenarioLabel,
    resilienceScore,
    affectedNodes,
    failedNodes,
    popAtRisk,
    recoveryTime,
    keyMitigationFinding
  } = useExportBriefData({ result, activeIntervention });

  return (
    <div className="hidden print:block print:p-8 print:max-w-4xl print:mx-auto print:bg-white print:text-black font-sans">
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #print-brief-container, #print-brief-container * {
              visibility: visible;
            }
            #print-brief-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 24px;
              background: white !important;
              color: black !important;
            }
          }
        `}
      </style>

      <div id="print-brief-container" className="space-y-6">
        {/* Document Header */}
        <div className="border-b-2 border-gray-900 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-gray-500 font-bold">
                CASCADE-X • Urban Infrastructure Resilience Platform
              </span>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">
                Executive Cascade Mitigation Brief
              </h1>
              <p className="text-sm text-gray-600">
                Official Decision Support Summary for City Authorities
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-gray-500 block">Date of Generation</span>
              <span className="text-sm font-semibold text-gray-900">
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Scenario & Resilience Score */}
        <div className="p-4 bg-gray-50 border border-gray-300 rounded flex justify-between items-center">
          <div>
            <span className="text-xs uppercase font-bold text-gray-500 block">Active Scenario</span>
            <span className="text-base font-semibold text-gray-900">{scenarioLabel}</span>
          </div>
          <div className="text-right">
            <span className="text-xs uppercase font-bold text-gray-500 block">
              City Resilience Score
            </span>
            <span className="text-xl font-bold font-mono text-gray-900">{resilienceScore}/100</span>
          </div>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-3.5 border border-gray-300 rounded bg-gray-50">
            <span className="text-xs text-gray-600 block uppercase font-medium">Affected Nodes</span>
            <span className="text-2xl font-bold font-mono text-gray-900">{affectedNodes}</span>
          </div>
          <div className="p-3.5 border border-red-300 rounded bg-red-50">
            <span className="text-xs text-red-700 block uppercase font-medium">Failed Nodes</span>
            <span className="text-2xl font-bold font-mono text-red-800">{failedNodes}</span>
          </div>
          <div className="p-3.5 border border-gray-300 rounded bg-gray-50">
            <span className="text-xs text-gray-600 block uppercase font-medium">Pop at Risk</span>
            <span className="text-2xl font-bold font-mono text-gray-900">{popAtRisk}</span>
          </div>
          <div className="p-3.5 border border-gray-300 rounded bg-gray-50">
            <span className="text-xs text-gray-600 block uppercase font-medium">Recovery Time</span>
            <span className="text-2xl font-bold font-mono text-gray-900">{recoveryTime}</span>
          </div>
        </div>

        {/* Key Mitigation Finding */}
        <div className="p-4 border-l-4 border-gray-800 bg-gray-100 rounded-r space-y-1.5">
          <span className="text-xs font-mono font-bold text-gray-700 uppercase tracking-wider block">
            KEY MITIGATION FINDING:
          </span>
          <p className="text-sm text-gray-900 leading-relaxed font-medium">
            {keyMitigationFinding}
          </p>
        </div>

        {/* Cross Sector Breakdown Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Cross-Sector Disruption Summary
          </h3>
          <table className="w-full text-left text-xs border border-gray-300">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="p-2.5 font-bold text-gray-800">Infrastructure Sector</th>
                <th className="p-2.5 font-bold text-gray-800">Impact Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="p-2.5 text-gray-700">Healthcare Facilities (Hospitals)</td>
                <td className="p-2.5 font-bold text-gray-900">{result.impactBreakdown.hospitals} facilities affected</td>
              </tr>
              <tr>
                <td className="p-2.5 text-gray-700">Water Treatment & Booster Plants</td>
                <td className="p-2.5 font-bold text-gray-900">{result.impactBreakdown.water} plants degraded</td>
              </tr>
              <tr>
                <td className="p-2.5 text-gray-700">Public Transit & Railway Interchanges</td>
                <td className="p-2.5 font-bold text-gray-900">{result.impactBreakdown.transport} hubs disrupted</td>
              </tr>
              <tr>
                <td className="p-2.5 text-gray-700">Telecommunications & SCADA Towers</td>
                <td className="p-2.5 font-bold text-gray-900">{result.impactBreakdown.telecom} towers degraded</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Authority Signoff */}
        <div className="pt-8 border-t border-gray-300 flex justify-between text-xs text-gray-500">
          <span>CASCADE-X Resilience Decision Support System</span>
          <span>Confidential — For Municipal Emergency Operations Use</span>
        </div>
      </div>
    </div>
  );
};
