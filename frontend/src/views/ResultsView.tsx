import React, { useState } from 'react';
import type {
  SimulationResult,
  Intervention,
  ComparisonResult
} from '../types';
import { AVAILABLE_INTERVENTIONS } from '../data/infrastructureData';
import { calculateBeforeAfterComparison } from '../utils/cascadeEngine';
import { CascadeExplanationCard } from '../components/results/CascadeExplanationCard';
import { InterventionSimulator } from '../components/results/InterventionSimulator';
import { BeforeAfterComparison } from '../components/results/BeforeAfterComparison';
import { RecommendationEngineCard } from '../components/results/RecommendationEngineCard';
import {
  BarChart3,
  Hospital,
  Droplets,
  Train,
  Radio
} from 'lucide-react';

interface ResultsViewProps {
  result: SimulationResult;
  onApplyIntervention: (intervention: Intervention) => void;
  activeIntervention: Intervention | null;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  onApplyIntervention,
  activeIntervention
}) => {
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention>(
    activeIntervention || AVAILABLE_INTERVENTIONS[0]
  );

  // Compute comparative metrics
  const comparison: ComparisonResult = calculateBeforeAfterComparison(
    result.config,
    selectedIntervention
  );

  const recommendedIntervention = AVAILABLE_INTERVENTIONS[0]; // Backup Power - Water Plant B

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#8EB69B]/15 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#8EB69B] uppercase tracking-wider mb-1">
            <BarChart3 size={16} />
            <span>Comprehensive Impact Analysis & Decision Support</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-[#DAF1DE] tracking-tight">
            Simulation Results & Intervention Analysis
          </h1>
          <p className="text-sm md:text-base text-[#8EB69B] mt-1">
            {result.targetNodeName} Outage — {result.config.durationHours} Hour Scenario
          </p>
        </div>

        {activeIntervention && (
          <span className="self-start md:self-auto text-xs font-mono font-bold px-3 py-1.5 bg-[#235347] text-[#DAF1DE] rounded-xl border border-[#8EB69B]/40">
            Active Mitigation Model: {activeIntervention.title}
          </span>
        )}
      </div>

      {/* TOP RESULT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-card bg-[#0B2B26] border border-[#8EB69B]/15">
          <span className="text-[10px] font-mono text-[#8EB69B] uppercase font-bold block mb-1">
            Affected Infrastructure
          </span>
          <p className="text-2xl font-bold font-mono text-[#DAF1DE]">{result.affectedNodesCount} nodes</p>
        </div>

        <div className="p-4 rounded-card bg-[#0B2B26] border border-[#8EB69B]/15">
          <span className="text-[10px] font-mono text-[#C95C5C] uppercase font-bold block mb-1">
            Failed Infrastructure
          </span>
          <p className="text-2xl font-bold font-mono text-[#C95C5C]">{result.failedNodesCount} nodes</p>
        </div>

        <div className="p-4 rounded-card bg-[#0B2B26] border border-[#8EB69B]/15">
          <span className="text-[10px] font-mono text-[#D9A441] uppercase font-bold block mb-1">
            Critical Nodes Affected
          </span>
          <p className="text-2xl font-bold font-mono text-[#D9A441]">{result.criticalNodesAffected}</p>
        </div>

        <div className="p-4 rounded-card bg-[#0B2B26] border border-[#8EB69B]/15">
          <span className="text-[10px] font-mono text-[#8EB69B] uppercase font-bold block mb-1">
            Population at Risk
          </span>
          <p className="text-2xl font-bold font-mono text-[#DAF1DE]">
            {(result.populationAtRisk / 1000).toFixed(0)}K
          </p>
        </div>

        <div className="p-4 rounded-card bg-[#0B2B26] border border-[#8EB69B]/15">
          <span className="text-[10px] font-mono text-[#8EB69B] uppercase font-bold block mb-1">
            Estimated Recovery
          </span>
          <p className="text-2xl font-bold font-mono text-[#DAF1DE]">{result.estimatedRecoveryHours} hours</p>
        </div>
      </div>

      {/* IMPACT BREAKDOWN & CASCADE DEPTH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sector Breakdown */}
        <div className="lg:col-span-2 p-6 rounded-card bg-[#0B2B26] border border-[#8EB69B]/15 space-y-4">
          <h3 className="text-base font-bold text-[#DAF1DE] border-b border-[#8EB69B]/10 pb-3">
            Impact Breakdown by Infrastructure Sector
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-[#163832]/60 border border-[#8EB69B]/15 flex flex-col justify-between">
              <div className="flex items-center space-x-2 text-[#8EB69B] mb-2">
                <Hospital size={16} />
                <span className="text-xs font-semibold">Hospitals</span>
              </div>
              <p className="text-xl font-bold font-mono text-[#DAF1DE]">
                {result.impactBreakdown.hospitals} affected
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#163832]/60 border border-[#8EB69B]/15 flex flex-col justify-between">
              <div className="flex items-center space-x-2 text-[#8EB69B] mb-2">
                <Droplets size={16} />
                <span className="text-xs font-semibold">Water Plants</span>
              </div>
              <p className="text-xl font-bold font-mono text-[#DAF1DE]">
                {result.impactBreakdown.water} affected
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#163832]/60 border border-[#8EB69B]/15 flex flex-col justify-between">
              <div className="flex items-center space-x-2 text-[#8EB69B] mb-2">
                <Train size={16} />
                <span className="text-xs font-semibold">Transport Hubs</span>
              </div>
              <p className="text-xl font-bold font-mono text-[#DAF1DE]">
                {result.impactBreakdown.transport} affected
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#163832]/60 border border-[#8EB69B]/15 flex flex-col justify-between">
              <div className="flex items-center space-x-2 text-[#8EB69B] mb-2">
                <Radio size={16} />
                <span className="text-xs font-semibold">Telecom Hubs</span>
              </div>
              <p className="text-xl font-bold font-mono text-[#DAF1DE]">
                {result.impactBreakdown.telecom} affected
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Cascade Depth */}
        <div className="p-6 rounded-card bg-[#0B2B26] border border-[#8EB69B]/15 space-y-4">
          <div className="flex items-center justify-between border-b border-[#8EB69B]/10 pb-3">
            <h3 className="text-base font-bold text-[#DAF1DE]">Cascade Depth</h3>
            <span className="text-xs font-mono text-[#DAF1DE] px-2.5 py-0.5 bg-[#163832] rounded font-bold">
              {result.cascadeDepth} Levels Deep
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono text-[#DAF1DE]">
            <div className="p-2 rounded-lg bg-[#163832]/60 border border-[#8EB69B]/20 flex justify-between">
              <span>Level 1 → Power Generation</span>
              <span className="text-[#C95C5C] font-bold">TRIGGER</span>
            </div>
            <div className="p-2 rounded-lg bg-[#163832]/60 border border-[#8EB69B]/20 flex justify-between">
              <span>Level 2 → Water & Telecom</span>
              <span className="text-[#C97A4A] font-bold">DEGRADED</span>
            </div>
            <div className="p-2 rounded-lg bg-[#163832]/60 border border-[#8EB69B]/20 flex justify-between">
              <span>Level 3 → Healthcare Network</span>
              <span className="text-[#D9A441] font-bold">AT RISK</span>
            </div>
            <div className="p-2 rounded-lg bg-[#163832]/60 border border-[#8EB69B]/20 flex justify-between">
              <span>Level 4 → Emergency Dispatch</span>
              <span className="text-[#D9A441] font-bold">CONSTRAINED</span>
            </div>
            <div className="p-2 rounded-lg bg-[#163832]/60 border border-[#8EB69B]/20 flex justify-between">
              <span>Level 5 → Population Impact</span>
              <span className="text-[#8EB69B] font-bold">240K POP</span>
            </div>
          </div>
        </div>
      </div>

      {/* CASCADE EXPLANATION */}
      <CascadeExplanationCard result={result} />

      {/* INTERVENTION SIMULATOR */}
      <InterventionSimulator
        interventions={AVAILABLE_INTERVENTIONS}
        selectedIntervention={selectedIntervention}
        onSelectIntervention={setSelectedIntervention}
        onApplyIntervention={() => onApplyIntervention(selectedIntervention)}
        isInterventionApplied={activeIntervention?.id === selectedIntervention.id}
      />

      {/* BEFORE / AFTER COMPARISON */}
      <BeforeAfterComparison comparison={comparison} />

      {/* RECOMMENDATION ENGINE */}
      <RecommendationEngineCard
        recommendedIntervention={recommendedIntervention}
        onApplyRecommendation={(item) => {
          setSelectedIntervention(item);
          onApplyIntervention(item);
        }}
      />
    </div>
  );
};
