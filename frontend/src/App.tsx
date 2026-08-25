import { useState, useMemo } from 'react';
import type {
  NavigationTab,
  InfrastructureNode,
  InfrastructureStatus,
  SimulationConfig,
  SimulationResult,
  Intervention
} from './types';
import { INITIAL_NODES, DEPENDENCY_LINKS } from './data/infrastructureData';
import { runCascadeSimulation } from './utils/cascadeEngine';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { DashboardView } from './views/DashboardView';
import { CityMapView } from './views/CityMapView';
import { NetworkView } from './views/NetworkView';
import { SimulatorView } from './views/SimulatorView';
import { ResultsView } from './views/ResultsView';
import { AlertsDrawer } from './components/common/AlertsDrawer';

export function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab['id']>('dashboard');
  const [nodes] = useState<InfrastructureNode[]>(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('power-station-a');
  const [alertsOpen, setAlertsOpen] = useState(false);

  // Simulation Config State
  const [simulationConfig, setSimulationConfig] = useState<SimulationConfig>({
    targetNodeId: 'power-station-a',
    severity: 70,
    durationHours: 12,
    extremeWeather: false,
    highDemand: true,
    backupUnavailable: false
  });

  // Active Intervention State
  const [activeIntervention, setActiveIntervention] = useState<Intervention | null>(null);

  // Current Active Simulation Result
  const [currentResult, setCurrentResult] = useState<SimulationResult>(() =>
    runCascadeSimulation(simulationConfig, activeIntervention)
  );

  // Primary Demo Scenario Preset Trigger
  const handleRunPrimaryDemo = () => {
    const demoConfig: SimulationConfig = {
      targetNodeId: 'power-station-a',
      severity: 70,
      durationHours: 12,
      extremeWeather: false,
      highDemand: true,
      backupUnavailable: false
    };

    setSimulationConfig(demoConfig);
    setSelectedNodeId('power-station-a');
    setActiveIntervention(null);
    const res = runCascadeSimulation(demoConfig, null);
    setCurrentResult(res);
    setActiveTab('simulator');
  };

  // Handle simulation complete
  const handleSimulationComplete = (result: SimulationResult) => {
    setCurrentResult(result);
    setActiveTab('results');
  };

  // Handle applying intervention
  const handleApplyIntervention = (intervention: Intervention) => {
    setActiveIntervention(intervention);
    const updatedResult = runCascadeSimulation(simulationConfig, intervention);
    setCurrentResult(updatedResult);
  };

  // Compute current node status states across the simulated cascade
  const simulatedStatuses = useMemo(() => {
    const map: Record<string, InfrastructureStatus> = {};
    if (currentResult && currentResult.timeline) {
      for (const step of currentResult.timeline) {
        map[step.nodeId] = step.newStatus;
      }
    }
    return map;
  }, [currentResult]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#051F20] text-[#DAF1DE]">
      {/* Persistent Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeScenarioName={currentResult.targetNodeName + ' Failure'}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-y-auto bg-ambient-gradient">
        <TopBar
          onRunPrimaryDemo={handleRunPrimaryDemo}
          onOpenAlerts={() => setAlertsOpen(true)}
          alertsCount={3}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* View Switcher */}
        <main className="flex-1 min-w-0 pb-16 md:pb-0">
          {activeTab === 'dashboard' && (
            <DashboardView
              nodes={nodes}
              onSelectNode={setSelectedNodeId}
              onNavigateToMap={() => setActiveTab('map')}
              onNavigateToSimulator={() => setActiveTab('simulator')}
              onNavigateToResults={() => setActiveTab('results')}
              onOpenAlertsDrawer={() => setAlertsOpen(true)}
            />
          )}

          {activeTab === 'map' && (
            <CityMapView
              nodes={nodes}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              simulatedStatuses={simulatedStatuses}
              onSimulateFailure={(nodeId) => {
                setSimulationConfig((prev) => ({ ...prev, targetNodeId: nodeId }));
                setActiveTab('simulator');
              }}
              onViewDependencies={(nodeId) => {
                setSelectedNodeId(nodeId);
                setActiveTab('network');
              }}
            />
          )}

          {activeTab === 'network' && (
            <NetworkView
              nodes={nodes}
              links={DEPENDENCY_LINKS}
              selectedNodeId={selectedNodeId}
              onSelectNode={(id) => setSelectedNodeId(id)}
              simulatedStatuses={simulatedStatuses}
              onNavigateToResults={() => setActiveTab('results')}
              onSimulateFailure={(nodeId) => {
                setSimulationConfig((prev) => ({ ...prev, targetNodeId: nodeId }));
                setActiveTab('simulator');
              }}
            />
          )}

          {activeTab === 'simulator' && (
            <SimulatorView
              nodes={nodes}
              config={simulationConfig}
              onChangeConfig={setSimulationConfig}
              onSimulationComplete={handleSimulationComplete}
            />
          )}

          {activeTab === 'results' && (
            <ResultsView
              result={currentResult}
              onApplyIntervention={handleApplyIntervention}
              activeIntervention={activeIntervention}
            />
          )}
        </main>
      </div>

      {/* Command Alerts Drawer */}
      <AlertsDrawer isOpen={alertsOpen} onClose={() => setAlertsOpen(false)} />
    </div>
  );
}
export default App;
