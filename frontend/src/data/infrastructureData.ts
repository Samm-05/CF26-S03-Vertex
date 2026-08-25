import type { InfrastructureNode, DependencyLink, Intervention } from '../types';

export const INITIAL_NODES: InfrastructureNode[] = [
  // LEVEL 1: Power Backbone
  {
    id: 'power-station-a',
    name: 'Power Station A',
    category: 'power',
    criticality: 94,
    capacity: '500 MW (Primary Grid)',
    status: 'operational',
    connectedSystemsCount: 12,
    dependentSystemsCount: 8,
    backupAvailable: true,
    backupDetails: 'Auxiliary diesel generator (15% capacity, max 4h)',
    failureProbability: 12,
    populationImpact: 240000,
    coordinates: { x: 28, y: 32, district: 'North Industrial' },
    level: 1,
    dependencies: [],
    dependents: ['water-plant-b', 'telecom-hub-c', 'hospital-network-a', 'transport-hub-d'],
    description: 'Primary thermal energy generation hub providing base power to North & Central Districts.'
  },
  {
    id: 'power-station-b',
    name: 'Power Station B',
    category: 'power',
    criticality: 88,
    capacity: '350 MW (Substation)',
    status: 'operational',
    connectedSystemsCount: 9,
    dependentSystemsCount: 6,
    backupAvailable: true,
    backupDetails: 'Battery storage bank (30 min full load)',
    failureProbability: 8,
    populationImpact: 160000,
    coordinates: { x: 72, y: 25, district: 'East Tech Park' },
    level: 1,
    dependencies: [],
    dependents: ['water-plant-a', 'telecom-hub-a', 'hospital-network-b'],
    description: 'Secondary power plant servicing South Bay and Eastern commercial zones.'
  },

  // LEVEL 2: Water & Core Telecom
  {
    id: 'water-plant-b',
    name: 'Water Plant B',
    category: 'water',
    criticality: 91,
    capacity: '120 MLD (Mega Liters/Day)',
    status: 'operational',
    connectedSystemsCount: 8,
    dependentSystemsCount: 6,
    backupAvailable: false,
    backupDetails: 'No redundant power supply installed',
    failureProbability: 24,
    populationImpact: 180000,
    coordinates: { x: 38, y: 48, district: 'Riverside Basin' },
    level: 2,
    dependencies: ['power-station-a'],
    dependents: ['hospital-network-a', 'residential-zone-a', 'industrial-alpha'],
    description: 'Central water filtration & pumping facility serving 180K residents and central trauma centers.'
  },
  {
    id: 'water-plant-a',
    name: 'Water Plant A',
    category: 'water',
    criticality: 84,
    capacity: '90 MLD',
    status: 'operational',
    connectedSystemsCount: 6,
    dependentSystemsCount: 4,
    backupAvailable: true,
    backupDetails: 'Emergency reservoir storage (12 hours)',
    failureProbability: 10,
    populationImpact: 110000,
    coordinates: { x: 78, y: 42, district: 'Eastern Heights' },
    level: 2,
    dependencies: ['power-station-b'],
    dependents: ['residential-zone-b', 'hospital-network-b'],
    description: 'Eastern sector water treatment facility feeding South Bay residential grid.'
  },
  {
    id: 'telecom-hub-c',
    name: 'Telecom Hub C',
    category: 'telecom',
    criticality: 86,
    capacity: '10 Gbps Fiber Backbone',
    status: 'operational',
    connectedSystemsCount: 11,
    dependentSystemsCount: 7,
    backupAvailable: true,
    backupDetails: 'UPS battery bank (4 hours)',
    failureProbability: 15,
    populationImpact: 210000,
    coordinates: { x: 45, y: 28, district: 'Central Business District' },
    level: 2,
    dependencies: ['power-station-a'],
    dependents: ['emergency-center-a', 'transport-hub-d', 'residential-zone-a'],
    description: 'Primary data center & SCADA communications node routing citywide IoT traffic.'
  },
  {
    id: 'telecom-hub-a',
    name: 'Telecom Hub A',
    category: 'telecom',
    criticality: 79,
    capacity: '5 Gbps Sub-node',
    status: 'operational',
    connectedSystemsCount: 5,
    dependentSystemsCount: 3,
    backupAvailable: true,
    backupDetails: 'UPS battery bank (2 hours)',
    failureProbability: 9,
    populationImpact: 95000,
    coordinates: { x: 65, y: 35, district: 'South Suburbs' },
    level: 2,
    dependencies: ['power-station-b'],
    dependents: ['emergency-center-a'],
    description: 'Secondary communications relay node supporting emergency dispatch backup routing.'
  },

  // LEVEL 3: Healthcare & Transport
  {
    id: 'hospital-network-a',
    name: 'Hospital Network A',
    category: 'healthcare',
    criticality: 82,
    capacity: '850 Beds (Trauma Level 1)',
    status: 'operational',
    connectedSystemsCount: 7,
    dependentSystemsCount: 4,
    backupAvailable: true,
    backupDetails: 'Diesel generator (6 hours fuel capacity)',
    failureProbability: 18,
    populationImpact: 85000,
    coordinates: { x: 48, y: 62, district: 'Central Medical District' },
    level: 3,
    dependencies: ['power-station-a', 'water-plant-b'],
    dependents: ['emergency-center-a'],
    description: 'Regional level-1 trauma center & intensive emergency response care unit.'
  },
  {
    id: 'hospital-network-b',
    name: 'Hospital Network B',
    category: 'healthcare',
    criticality: 78,
    capacity: '450 Beds',
    status: 'operational',
    connectedSystemsCount: 4,
    dependentSystemsCount: 2,
    backupAvailable: true,
    backupDetails: 'Backup generator (8 hours)',
    failureProbability: 11,
    populationImpact: 45000,
    coordinates: { x: 82, y: 58, district: 'East Community' },
    level: 3,
    dependencies: ['power-station-b', 'water-plant-a'],
    dependents: [],
    description: 'Secondary community healthcare facility & emergency pediatric center.'
  },
  {
    id: 'transport-hub-d',
    name: 'Transport Hub D',
    category: 'transport',
    criticality: 74,
    capacity: '180K Commuters / Day',
    status: 'operational',
    connectedSystemsCount: 6,
    dependentSystemsCount: 3,
    backupAvailable: false,
    backupDetails: 'Substation automated transfer switch',
    failureProbability: 16,
    populationImpact: 180000,
    coordinates: { x: 32, y: 55, district: 'Central Station' },
    level: 3,
    dependencies: ['power-station-a', 'telecom-hub-c'],
    dependents: ['emergency-center-a', 'industrial-alpha'],
    description: 'Central rail, metro line, and bus transit exchange center.'
  },

  // LEVEL 4: Emergency & Industrial
  {
    id: 'emergency-center-a',
    name: 'Emergency Center A',
    category: 'emergency',
    criticality: 80,
    capacity: '911 Dispatch & Operations Command',
    status: 'operational',
    connectedSystemsCount: 8,
    dependentSystemsCount: 5,
    backupAvailable: true,
    backupDetails: 'Emergency solar + battery array (12 hours)',
    failureProbability: 14,
    populationImpact: 240000,
    coordinates: { x: 55, y: 48, district: 'Civic Core' },
    level: 4,
    dependencies: ['telecom-hub-c', 'hospital-network-a', 'transport-hub-d'],
    dependents: ['residential-zone-a', 'residential-zone-b'],
    description: 'Centralized 911 dispatch, disaster coordination center, and emergency fleet routing.'
  },
  {
    id: 'industrial-alpha',
    name: 'Industrial Zone Alpha',
    category: 'industrial',
    criticality: 72,
    capacity: '45 Advanced Manufacturing Facilities',
    status: 'operational',
    connectedSystemsCount: 5,
    dependentSystemsCount: 2,
    backupAvailable: false,
    backupDetails: 'Local grid feed only',
    failureProbability: 20,
    populationImpact: 35000,
    coordinates: { x: 22, y: 70, district: 'Port & Heavy Industry' },
    level: 4,
    dependencies: ['power-station-a', 'water-plant-b'],
    dependents: [],
    description: 'High-density industrial sector including chemical processing and logistical warehouses.'
  },

  // LEVEL 5: Residential & Public Facilities
  {
    id: 'residential-zone-a',
    name: 'Residential Zone A',
    category: 'schools', // combined housing & civic schools
    criticality: 65,
    capacity: '120K Population Density',
    status: 'operational',
    connectedSystemsCount: 4,
    dependentSystemsCount: 0,
    backupAvailable: false,
    backupDetails: 'None',
    failureProbability: 5,
    populationImpact: 120000,
    coordinates: { x: 42, y: 78, district: 'North Metro Housing' },
    level: 5,
    dependencies: ['water-plant-b', 'telecom-hub-c', 'emergency-center-a'],
    dependents: [],
    description: 'High-density residential neighborhood, 14 schools, and local civic centers.'
  },
  {
    id: 'residential-zone-b',
    name: 'Residential Zone B',
    category: 'schools',
    criticality: 60,
    capacity: '85K Population Density',
    status: 'operational',
    connectedSystemsCount: 3,
    dependentSystemsCount: 0,
    backupAvailable: false,
    backupDetails: 'None',
    failureProbability: 5,
    populationImpact: 85000,
    coordinates: { x: 75, y: 72, district: 'South Bay Residences' },
    level: 5,
    dependencies: ['water-plant-a', 'emergency-center-a'],
    dependents: [],
    description: 'Suburban housing community and secondary education campus.'
  }
];

export const DEPENDENCY_LINKS: DependencyLink[] = [
  // Power Station A outbound links
  { source: 'power-station-a', target: 'water-plant-b', type: 'Primary Electric Power (138kV)', critical: true },
  { source: 'power-station-a', target: 'telecom-hub-c', type: 'High-Reliability Grid Feed', critical: true },
  { source: 'power-station-a', target: 'hospital-network-a', type: 'Direct Feeder Line', critical: true },
  { source: 'power-station-a', target: 'transport-hub-d', type: 'Traction Power Grid', critical: false },
  { source: 'power-station-a', target: 'industrial-alpha', type: 'Heavy Industrial Line', critical: false },

  // Power Station B outbound links
  { source: 'power-station-b', target: 'water-plant-a', type: 'Primary Substation Feed', critical: true },
  { source: 'power-station-b', target: 'telecom-hub-a', type: 'Grid Feed', critical: false },
  { source: 'power-station-b', target: 'hospital-network-b', type: 'Feeder Line', critical: true },

  // Water Plant B outbound links
  { source: 'water-plant-b', target: 'hospital-network-a', type: 'Sterile Water Supply (Main Branch)', critical: true },
  { source: 'water-plant-b', target: 'residential-zone-a', type: 'Municipal Water Pressure Main', critical: true },
  { source: 'water-plant-b', target: 'industrial-alpha', type: 'Cooling Water Branch', critical: false },

  // Water Plant A outbound links
  { source: 'water-plant-a', target: 'residential-zone-b', type: 'East District Main', critical: true },
  { source: 'water-plant-a', target: 'hospital-network-b', type: 'Medical Water Line', critical: true },

  // Telecom Hub C outbound links
  { source: 'telecom-hub-c', target: 'emergency-center-a', type: 'Fiber Optic SCADA & 911 Trunk', critical: true },
  { source: 'telecom-hub-c', target: 'transport-hub-d', type: 'Automated Signaling Network', critical: true },
  { source: 'telecom-hub-c', target: 'residential-zone-a', type: 'Consumer Broadband Node', critical: false },

  // Telecom Hub A outbound links
  { source: 'telecom-hub-a', target: 'emergency-center-a', type: 'Radio Backup Link', critical: false },

  // Hospital Network A outbound
  { source: 'hospital-network-a', target: 'emergency-center-a', type: 'Triage Coordination Protocol', critical: true },

  // Transport Hub D outbound
  { source: 'transport-hub-d', target: 'emergency-center-a', type: 'Emergency Evacuation Transit Corridor', critical: true },

  // Emergency Center A outbound
  { source: 'emergency-center-a', target: 'residential-zone-a', type: 'Disaster Patrol & Response Fleet', critical: true },
  { source: 'emergency-center-a', target: 'residential-zone-b', type: 'Emergency Broadcast & Dispatch', critical: false }
];

export const AVAILABLE_INTERVENTIONS: Intervention[] = [
  {
    id: 'int-1',
    title: 'Backup Power — Water Plant B',
    targetNodeId: 'water-plant-b',
    targetNodeName: 'Water Plant B',
    category: 'water',
    estimatedCost: '₹10 Crore',
    riskReductionPercent: 42,
    populationProtected: 180000,
    recoveryImprovementPercent: 40,
    description: 'Install high-capacity dual industrial diesel generators & automated fast-transfer switches at Water Plant B to prevent loss of water pumping during grid power outages.'
  },
  {
    id: 'int-2',
    title: 'Secondary Power Connection — Hospital Network A',
    targetNodeId: 'hospital-network-a',
    targetNodeName: 'Hospital Network A',
    category: 'healthcare',
    estimatedCost: '₹14 Crore',
    riskReductionPercent: 35,
    populationProtected: 140000,
    recoveryImprovementPercent: 50,
    description: 'Construct a redundant underground feeder line connecting Hospital Network A directly to Power Station B, creating dual-path electrical resilience.'
  },
  {
    id: 'int-3',
    title: 'Microwave Radio Link — Emergency Center A',
    targetNodeId: 'emergency-center-a',
    targetNodeName: 'Emergency Center A',
    category: 'emergency',
    estimatedCost: '₹4.5 Crore',
    riskReductionPercent: 28,
    populationProtected: 95000,
    recoveryImprovementPercent: 30,
    description: 'Deploy satellite microwave communications antennas at Emergency Center A to maintain 911 dispatch capabilities during terrestrial fiber optic failure.'
  },
  {
    id: 'int-4',
    title: 'Emergency Generator Array — Transport Hub D',
    targetNodeId: 'transport-hub-d',
    targetNodeName: 'Transport Hub D',
    category: 'transport',
    estimatedCost: '₹8 Crore',
    riskReductionPercent: 30,
    populationProtected: 110000,
    recoveryImprovementPercent: 35,
    description: 'Install battery energy storage system (BESS) for metro emergency lighting and automated switch ventilation systems.'
  }
];

export const CITY_RESILIENCE_METRICS = {
  overallScore: 78,
  breakdown: {
    redundancy: 82,
    infrastructure: 75,
    recovery: 79,
    connectivity: 84,
    criticalServices: 71
  }
};
