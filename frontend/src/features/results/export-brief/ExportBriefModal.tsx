import React, { useEffect, useRef } from 'react';
import type { SimulationResult, Intervention } from '../../../types';
import { useExportBriefData } from './useExportBriefData';
import { ExportBriefPrintView } from './ExportBriefPrintView';
import { FileText, X, Printer, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExportBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: SimulationResult;
  activeIntervention?: Intervention | null;
}

export const ExportBriefModal: React.FC<ExportBriefModalProps> = ({
  isOpen,
  onClose,
  result,
  activeIntervention
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    scenarioLabel,
    resilienceScore,
    affectedNodes,
    failedNodes,
    popAtRisk,
    recoveryTime,
    keyMitigationFinding,
    handleExportJson,
    handlePrint
  } = useExportBriefData({ result, activeIntervention });

  // Handle Esc key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Hidden dedicated print-only template */}
      <ExportBriefPrintView result={result} activeIntervention={activeIntervention} />

      {/* Screen Modal */}
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:hidden">
          {/* Backdrop Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#051F20]/80 backdrop-blur-md transition-opacity"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-brief-title"
            className="relative w-full max-w-2xl bg-[#0B2B26] border border-[#8EB69B]/30 rounded-2xl shadow-2xl overflow-hidden z-10 text-[#DAF1DE]"
          >
            {/* 1. Header */}
            <div className="p-5 pb-4 border-b border-[#8EB69B]/15 flex items-start justify-between">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#163832] border border-[#8EB69B]/30 flex items-center justify-center text-[#5eead4] shadow-sm">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 id="modal-brief-title" className="text-base md:text-lg font-bold text-[#DAF1DE] leading-tight">
                    Executive Cascade Mitigation Brief
                  </h2>
                  <p className="text-xs text-[#8EB69B] font-mono mt-0.5">
                    Official Decision Support Summary for City Authorities
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg bg-[#163832] text-[#8EB69B] hover:text-[#DAF1DE] hover:bg-[#235347] border border-[#8EB69B]/20 transition-colors cursor-pointer"
                title="Close"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* 2. Body Content */}
            <div className="p-5 md:p-6 space-y-4">
              {/* Scenario Summary Card + 4 Stat Chips */}
              <div className="p-4 md:p-5 rounded-xl bg-[#07211D] border border-[#8EB69B]/20 space-y-4">
                {/* Scenario & Score Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-3 border-b border-[#8EB69B]/10">
                  <div className="min-w-0">
                    <span className="text-xs font-mono font-bold text-[#DAF1DE] leading-snug">
                      Scenario: {scenarioLabel}
                    </span>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-xs font-mono font-semibold text-[#8EB69B]">
                      Score: <strong className="text-[#DAF1DE]">{resilienceScore}/100</strong>
                    </span>
                  </div>
                </div>

                {/* 4 Stat Chips in Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Affected Nodes */}
                  <div className="p-3 rounded-lg bg-[#0B2B26] border border-[#8EB69B]/15">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8EB69B] block mb-1">
                      Affected Nodes
                    </span>
                    <span className="text-lg md:text-xl font-bold font-mono text-[#DAF1DE]">
                      {affectedNodes}
                    </span>
                  </div>

                  {/* Failed Nodes */}
                  <div className="p-3 rounded-lg bg-[#0B2B26] border border-[#C95C5C]/30">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#C95C5C] block mb-1">
                      Failed Nodes
                    </span>
                    <span className="text-lg md:text-xl font-bold font-mono text-[#C95C5C]">
                      {failedNodes}
                    </span>
                  </div>

                  {/* Pop at Risk */}
                  <div className="p-3 rounded-lg bg-[#0B2B26] border border-[#8EB69B]/15">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8EB69B] block mb-1">
                      Pop at Risk
                    </span>
                    <span className="text-lg md:text-xl font-bold font-mono text-[#DAF1DE]">
                      {popAtRisk}
                    </span>
                  </div>

                  {/* Recovery Time */}
                  <div className="p-3 rounded-lg bg-[#0B2B26] border border-[#8EB69B]/15">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8EB69B] block mb-1">
                      Recovery Time
                    </span>
                    <span className="text-lg md:text-xl font-bold font-mono text-[#DAF1DE]">
                      {recoveryTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Mitigation Finding Box */}
              <div className="p-4 rounded-xl bg-[#07211D] border border-[#8EB69B]/20 space-y-1.5">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8EB69B] block">
                  KEY MITIGATION FINDING:
                </span>
                <p className="text-xs md:text-sm text-[#DAF1DE] leading-relaxed">
                  {keyMitigationFinding}
                </p>
              </div>
            </div>

            {/* 3. Footer Actions */}
            <div className="p-5 pt-3 border-t border-[#8EB69B]/15 bg-[#051F20]/70 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-medium text-[#8EB69B] hover:text-[#DAF1DE] hover:underline transition-colors cursor-pointer self-start sm:self-center"
              >
                Close
              </button>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-[#163832] text-[#DAF1DE] hover:bg-[#235347] border border-[#8EB69B]/30 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Printer size={14} className="text-[#8EB69B]" />
                  <span>Print Report</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportJson}
                  className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-[#235347] text-[#DAF1DE] hover:bg-[#2d695a] border border-[#5eead4]/40 text-xs font-bold transition-all shadow-[0_0_15px_rgba(94,234,212,0.25)] cursor-pointer"
                >
                  <Download size={14} />
                  <span>Export JSON Dataset</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    </>
  );
};
