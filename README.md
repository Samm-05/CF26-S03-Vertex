# CASCADE-X

## Urban Infrastructure Cascade Simulator & Resilience Decision Support Platform

> **Simulate failures. Understand cascading impacts. Test interventions. Build resilient cities.**

---
---

## 1. Project Overview

**CASCADE-X** is an interactive urban infrastructure resilience and decision-support platform that simulates how the failure of one critical infrastructure node can propagate through interconnected city systems.

Modern cities are not collections of independent infrastructure assets. Electricity, water, healthcare, transportation, telecommunications, emergency services, and other critical systems depend on one another — a failure in one system can trigger a chain reaction across multiple sectors.

CASCADE-X models these relationships as an interconnected dependency network and lets users:

- Explore urban infrastructure and its dependencies
- Select a critical infrastructure node and configure a failure scenario
- Simulate cascading failures over time and observe the propagation path
- Analyze infrastructure and population impact
- Identify critical vulnerabilities
- Test mitigation strategies and re-run scenarios post-intervention
- Compare baseline vs. mitigated outcomes to evaluate resilience improvement

```
FAILURE → PROPAGATION → IMPACT → VULNERABILITY → INTERVENTION → RECOVERY → RESILIENCE IMPROVEMENT
```

---

## 2. Problem Statement

Modern urban infrastructure is highly interconnected. A disruption to one critical system can affect multiple dependent systems:

```
Power Station Failure
      ↓
Grid Disruption
      ↓
Water Plant Loses Power
      ↓
Water Supply Degrades
      ↓
Hospitals Become At Risk
      ↓
Emergency Services Are Constrained
      ↓
Population Impact Increases
```

Traditional infrastructure monitoring focuses on individual assets. The more important question is: **What happens after the first failure?**

Decision makers need to understand:

- Which infrastructure depends on the failed asset?
- How will the failure propagate, and how quickly?
- Which critical services will be affected?
- Which infrastructure creates the largest cascading risk?
- Where should resilience investments be made?
- Which intervention reduces overall impact, and by how much?

CASCADE-X addresses this by providing an interactive simulation environment for understanding infrastructure interdependencies and cascading failures.

---

## 3. Proposed Solution

CASCADE-X represents urban infrastructure as a **dependency graph** — each infrastructure asset is a node, and relationships between assets are directed edges.

```
Power Station A
      │
      ▼
Water Plant B
      │
      ▼
Hospital Network
      │
      ▼
Emergency Services
```

When a failure occurs, the simulation engine evaluates dependency relationships and propagates the impact through the network. Users observe:

1. The initial failure
2. The affected infrastructure
3. The propagation sequence
4. The severity of each impact
5. The resulting population impact
6. The recovery process
7. The effect of mitigation strategies

---

## 4. Core Objective

CASCADE-X transforms infrastructure resilience analysis from:

> "What failed?"

into:

> "What will fail next?"

and ultimately:

> "What should we strengthen first?"

---

## 5. Core Features

### 5.1 Command Dashboard

A high-level overview of the city's current resilience state, showing:

- City resilience score
- Infrastructure status
- Active scenario
- Critical infrastructure alerts
- Population at risk
- Number of affected nodes
- Recovery information and key resilience indicators

```
CITY RESILIENCE
78 / 100
```

### 5.2 Interactive City Map

A spatial representation of infrastructure assets. Users can view, filter, and select infrastructure, inspect details, identify critical nodes, explore dependencies, and start a simulation directly from a selected node.

Infrastructure categories include: Power, Water, Healthcare, Transportation, Telecommunications, Emergency Services, Industrial Infrastructure, and other critical services.

### 5.3 Dependency Network

Displays how infrastructure systems depend on one another:

```
Power Station A
      │
      ├──────────────► Water Plant B
      │                       │
      │                       ▼
      └──────────────► Hospital Network
                              │
                              ▼
                       Emergency Center
```

Enables users to identify direct/downstream dependencies, critical and highly connected nodes, bottlenecks, potential cascade paths, and vulnerabilities. During simulation, the active cascade path is highlighted.

---

## 6. Cascade Simulation Engine

The core component of CASCADE-X. Users select an infrastructure node and configure a failure scenario:

```
Infrastructure:   Power Station A
Failure Severity: 70%
Failure Duration: 12 Hours
Scenario:         High Demand
```

The engine then evaluates how the failure propagates through the dependency network.

---

## 7. Infrastructure Node States

```
OPERATIONAL → AT RISK → DEGRADED → FAILED → RECOVERING → OPERATIONAL
```

| State | Description |
|---|---|
| **Operational** | Functioning normally |
| **At Risk** | Experiencing a potential threat, not yet failed |
| **Degraded** | Partially functional, below normal capacity |
| **Failed** | No longer able to provide expected service |
| **Recovering** | Being restored after failure |

---

## 8. Simulation Timeline

CASCADE-X provides a chronological representation of the cascade:

```
T = 0 min   Power Station A          FAILED
T = 10 min  Water Plant B            AT RISK
T = 20 min  North Grid Substation    FAILED
T = 30 min  Water Plant B            FAILED
T = 45 min  Hospital Network         AT RISK
```

This shows both **where** and **when** the cascade occurs.

---

## 9. Live Simulation Visualization

A visual representation of the active cascade over time.

**T = 0 Minutes**
```
Power Station A       🔴 FAILED
Water Plant B         🟢 OPERATIONAL
Hospital Network      🟢 OPERATIONAL
Emergency Services    🟢 OPERATIONAL
```

**T = 30 Minutes**
```
Power Station A       🔴 FAILED
Water Plant B         🔴 FAILED
Hospital Network      🟡 AT RISK
Emergency Services    🟢 OPERATIONAL
```

**T = 45 Minutes**
```
Power Station A       🔴 FAILED
Water Plant B         🔴 FAILED
Hospital Network      🔴 AFFECTED
Emergency Services    🟡 AT RISK
```

The graph provides the visual explanation for **why and how** the cascade spreads.

---

## 10. Propagation Sequence

The system maintains a detailed sequence of cascading events:

```
T = 0 min   Power Station A          Thermal Turbine Trip & Grid Line Severance   FAILED
     ↓
T = 10 min  Water Plant B            High-Lift Intake Pumps Lose Grid Voltage     AT RISK
     ↓
T = 20 min  North Grid Substation A  Substation Protection Lockout                FAILED
     ↓
T = 30 min  Water Plant B            Municipal Water Pressure Degrades            FAILED
```

This chronology makes the simulation explainable and easy to walk through during demonstrations.

---

## 11. Impact Analysis

Key metrics calculated during/after a simulation:

- Number of affected, failed, and at-risk infrastructure nodes
- Critical infrastructure affected
- Population at risk
- Cascade depth
- Recovery duration
- Sector-level impact
- Overall resilience score

```
Affected Infrastructure     37
Critical Nodes Affected      8
Population at Risk         240K
Estimated Recovery          16 hr
```

---

## 12. Explainable Cascade Analysis

CASCADE-X explains the chain of events that caused the impact, not just the final result:

```
ROOT FAILURE
Power Station A
      ↓
Grid Substation
      ↓
Water Plant B
      ↓
Hospital Network
      ↓
Emergency Services
```

It can also identify the primary contributor to the cascade:

```
PRIMARY VULNERABILITY: Water Plant B
Reason: High dependency on Power Station A
      + Low redundancy
      + High downstream criticality
```

---

## 13. Intervention & Mitigation

CASCADE-X lets users test resilience interventions before committing resources.

| Sector | Potential Interventions |
|---|---|
| **Power** | Backup generator, secondary power connection, additional substation, redundant power source |
| **Water** | Backup pumping system, emergency reservoir, alternate water source |
| **Healthcare** | Backup electricity, emergency water supply, additional service capacity |
| **Transportation** | Alternate route, emergency routing, backup transport capacity |

---

## 14. Before & After Comparison

The same failure scenario can be re-simulated after applying an intervention:

| Metric | Baseline | With Intervention |
|---|---:|---:|
| Population at Risk | 240K | 90K |
| Affected Nodes | 37 | 15 |
| Critical Nodes | 8 | 3 |
| Hospital Impact | 4 | 1 |
| Recovery Time | 16 hr | 7 hr |

> The values above are demonstration examples — replace with actual measured results from the final implementation.

---

## 15. Resilience Score

CASCADE-X provides an overall city resilience score:

```
CITY RESILIENCE
78 / 100
```

Considered factors include: Infrastructure Redundancy, Network Connectivity, Recovery Capability, Critical Service Reliability, and Infrastructure Availability. The score gives a high-level indicator, while the simulation provides the detailed explanation.

---

## 16. Core Technical Mechanism

### 16.1 Graph-Based Infrastructure Model

The infrastructure network is a directed graph `G = (V, E)`, where `V` = infrastructure nodes and `E` = dependency relationships:

```
Power_A → Water_B
Water_B → Hospital_A
Hospital_A → Emergency_A
```

### 16.2 Infrastructure Node Model

```javascript
{
  id: "power-a",
  name: "Power Station A",
  type: "power",
  criticality: 94,
  status: "operational",
  capacity: 500,
  redundancy: 0.35,
  populationImpact: 240000
}
```

### 16.3 Dependency Model

A dependency defines how strongly one system depends on another (dependency strength affects the severity of propagated impact):

```
Power Station A ──(Dependency Strength = 0.8)──► Water Plant B
```

### 16.4 Failure Propagation

```
Impact = Failure Severity × Dependency Strength × Criticality × Duration Factor
```

Resulting impact determines the dependent node's state:

```
Low Impact      → OPERATIONAL
Moderate Impact  → AT RISK
High Impact      → DEGRADED
Critical Impact  → FAILED
```

The process continues across the network until the cascade stabilizes or the simulation reaches its configured end time.

### 16.5 Recovery Mechanism

```
FAILED → REPAIR / RESTORATION → RECOVERING → OPERATIONAL
```

Recovery time may depend on damage severity, infrastructure criticality, redundancy, recovery capability, intervention, and available resources.

---

## 17. System Architecture

```
┌──────────────────────────────────────────────┐
│                USER INTERFACE                 │
│  Dashboard · City Map · Dependency Network     │
│  Cascade Simulator · Results & Mitigation      │
└──────────────────────┬─────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────┐
│               SIMULATION ENGINE                │
│  Scenario Configuration · Failure Propagation  │
│  Dependency Evaluation · Impact Calculation    │
│  Recovery Calculation · Intervention Evaluation│
└──────────────────────┬─────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────┐
│             INFRASTRUCTURE MODEL                │
│  Nodes · Dependencies · Criticality · Capacity │
│  Redundancy · Population Impact · Recovery     │
└──────────────────────────────────────────────┘
```

---

## 18. Complete System Workflow

```
Explore Infrastructure
      ↓
Select Critical Node
      ↓
Configure Failure Scenario
      ↓
Run Simulation
      ↓
Evaluate Dependencies → Propagate Failure
      ↓
Calculate Infrastructure & Population Impact
      ↓
Identify Vulnerabilities
      ↓
Select Intervention → Re-run Simulation
      ↓
Compare Results
      ↓
Evaluate Resilience Improvement
```

**Application modules:** Command Dashboard, Interactive City Map, Dependency Network, Cascade Simulator, Results & Mitigation, Resilience Analysis.

---

## 19. Technology Stack

> Update this section to exactly match the technologies implemented in the repository.

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Visualization:** React Flow (or equivalent graph library), MapLibre / Leaflet (or equivalent mapping library), Recharts (or equivalent charting library)
- **UI:** Lucide Icons, responsive component-based interface
- **Development:** Node.js, npm, Git

---

## 20. Design System & Color Palette

CASCADE-X uses a dark green smart-city visual language communicating resilience, technology, infrastructure, stability, environmental awareness, and operational monitoring.

**Primary Palette**

| Token | Hex | Purpose |
|---|---|---|
| Deep Background | `#051F20` | Main application background |
| Secondary Background | `#0B2B26` | Sidebar / navigation |
| Surface | `#163832` | Cards / panels |
| Primary Accent | `#235347` | Buttons / active components |
| Secondary Accent | `#8EB69B` | Secondary UI / graph elements |
| Light Surface | `#DAF1DE` | Primary text / highlights |

**Status Colors**

| Status | Color |
|---|---|
| Operational | `#8EB69B` |
| Active | `#235347` |
| At Risk | `#D9A441` |
| Degraded | `#C97A4A` |
| Failed | `#C95C5C` |

---

## 21. Project Structure

> Update to match the final repository.

```
cascade-x/
├── public/
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   ├── map/
│   │   ├── network/
│   │   ├── simulation/
│   │   ├── results/
│   │   └── common/
│   ├── data/
│   │   ├── infrastructure/
│   │   ├── dependencies/
│   │   └── scenarios/
│   ├── engine/
│   │   ├── simulation/
│   │   ├── propagation/
│   │   ├── impact/
│   │   └── intervention/
│   ├── pages/
│   │   ├── Dashboard
│   │   ├── CityMap
│   │   ├── DependencyNetwork
│   │   ├── Simulator
│   │   └── Results
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── README.md
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 22. Installation & Setup

### Prerequisites

- Node.js 18+
- npm 9+

```bash
node --version
npm --version
```

### Clone Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd cascade-x
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Open the local development URL shown in the terminal (typically `http://localhost:5173`).

### Production Build

```bash
npm run build
npm run preview
```

---

## 23. Usage Instructions

| Step | Action |
|---|---|
| 1 | **Open Dashboard** — review the city's current resilience score and infrastructure status. |
| 2 | **Explore City Map** — select an infrastructure asset (e.g., Power Station A) and review its type, criticality, dependencies, population impact, and redundancy. |
| 3 | **Explore Dependency Network** — inspect the selected node and its downstream dependencies. |
| 4 | **Configure Simulation** — set node, failure severity, duration, and scenario. |
| 5 | **Run Simulation** — observe simulation time, active cascade node, propagation path, timeline, and impact metrics. |
| 6 | **Analyze Results** — review affected/failed infrastructure, critical impact, population at risk, cascade depth, and recovery time. |
| 7 | **Apply Intervention** — select a mitigation (e.g., Backup Power → Water Plant B). |
| 8 | **Re-run Simulation** — run the same scenario with the intervention enabled. |
| 9 | **Compare Results** — baseline vs. mitigated, to see whether the intervention reduces the cascade. |

---

## 24. Primary Demonstration Scenario

### Power Station A Failure During High Demand

```
Infrastructure:      Power Station A
Failure Severity:    70%
Failure Duration:    12 Hours
Operating Condition: High Demand
```

Expected conceptual cascade:

```
Power Station A → Grid Substation → Water Plant B → Hospital Network → Emergency Services → Population Impact
```

Proposed mitigation: **Backup Power → Water Plant B**, then re-simulated to measure improvement.

---

## 25. Validation & Experiments

### Experiment 1 — Baseline Failure

Node: Power Station A · Severity: 70% · Duration: 12 Hours · Demand: High.
Measure: affected/failed/critical nodes, population impact, cascade depth, recovery time.

### Experiment 2 — Failure Severity

Run at 30%, 50%, 70%, 90% to determine whether increasing severity produces a corresponding increase in downstream impact.

### Experiment 3 — Failure Duration

Run at 2, 6, 12, 24 hours to evaluate how duration affects cascade propagation and recovery.

### Experiment 4 — Intervention

Compare **No Intervention** vs. **Backup Power (Water Plant B)** across population impact, infrastructure impact, critical node impact, and recovery time.

### Validation Criteria

The simulation is considered internally consistent when:

- Failure states propagate according to defined dependencies
- The active cascade path corresponds to the dependency graph
- Timeline events occur in the expected sequence
- Impact metrics update according to node state changes
- Intervention scenarios produce measurable differences where expected
- Re-running the same deterministic scenario produces consistent results

---

## 26. Results

The prototype demonstrates the complete resilience workflow:

```
Infrastructure Failure → Dependency Evaluation → Cascade Propagation → Impact Calculation
→ Vulnerability Identification → Intervention → Re-simulation → Before/After Comparison
```

| Metric | Baseline | Intervention |
|---|---:|---:|
| Population at Risk | 240K | 90K |
| Affected Nodes | 37 | 15 |
| Critical Nodes | 8 | 3 |
| Hospital Impact | 4 | 1 |
| Recovery Time | 16 hr | 7 hr |

> These are example values. Final documentation should contain the actual values generated by the implemented simulation.

---

## 27. Limitations

- **Synthetic / Demonstration Data** — real-world deployment would require validated infrastructure datasets.
- **Simplified Dependencies** — real infrastructure systems contain significantly more complex interactions.
- **Simplified Population Impact** — production deployment would require validated demographic and service-access data.
- **Simplified Recovery** — real recovery depends on repair resources, personnel, spare parts, accessibility, weather, damage severity, and operational priorities.
- **No Direct Infrastructure Control** — CASCADE-X is a decision-support simulation platform; it does not control real infrastructure systems.

---

## 28. Future Scope

- **Real-Time Infrastructure Integration** — IoT sensors, utility monitoring, traffic systems, weather data, emergency operations systems.
- **Advanced Simulation** — probabilistic failure models, Monte Carlo simulation, dynamic network flow, capacity constraints, multi-layer networks, multi-hazard and simultaneous failure simulations.
- **Digital Twin** — combining infrastructure, geospatial, population, weather, and real-time sensor data.
- **Automated Intervention Optimization** — optimizing risk reduction and population protected against recovery improvement and intervention cost.
- **Scenario Library** — power outage, water system failure, flood, telecom outage, transportation disruption, extreme weather, infrastructure fire, and multiple simultaneous failures.

---

## 29. Security & Data Considerations

Critical infrastructure information can be sensitive. A production implementation should include authentication, role-based access control, encryption, audit logging, secure APIs, data anonymization, and infrastructure data access controls.

The current prototype is intended for demonstration and decision-support purposes only.

---

## 30. Team

| Team Member | Role |
|---|---|
| `<NAME>` | Product & System Design |
| `<NAME>` | Frontend Development |
| `<NAME>` | Simulation Engine |
| `<NAME>` | Data & Visualization |
| `<NAME>` | Research & Presentation |

> Replace placeholders with actual team information.

---

## 31. AI Assistance Disclosure

AI-assisted development tools were used during the development of this project where applicable, including for brainstorming and ideation, system architecture discussions, UI/UX exploration, code development assistance, debugging suggestions, technical documentation, technical explanation, and refinement of project descriptions.

All AI-assisted outputs were reviewed, adapted, integrated, and tested by the project team. The project team remains responsible for the final implementation, architecture, validation, and submitted code.

---

## 32. License

> Add the appropriate project license here, e.g.:

```
MIT License
```

---

## Project Status

| | |
|---|---|
| **Project** | CASCADE-X |
| **Status** | Hackathon Prototype |
| **Domain** | Urban Infrastructure Resilience |
| **Primary Capability** | Cascading Infrastructure Failure Simulation |
| **Primary Scenario** | Power Station A failure during high-demand conditions |

**Core Workflow:** `EXPLORE → SELECT → SIMULATE → ANALYZE → INTERVENE → COMPARE → STRENGTHEN`

---

## Key Value Proposition

CASCADE-X combines interactive infrastructure mapping, dependency graph visualization, failure propagation simulation, impact analysis, vulnerability detection, intervention testing, and before/after comparison into a single decision-support platform — helping decision makers understand the complete chain from failure to resilience:

```
FAILURE → DEPENDENCY → PROPAGATION → IMPACT → VULNERABILITY → INTERVENTION → RECOVERY → RESILIENCE
```

---

## Conclusion

CASCADE-X demonstrates how graph-based simulation can be used to understand cascading infrastructure failures in interconnected urban systems, providing a complete resilience decision-support workflow:

```
SEE → UNDERSTAND → SIMULATE → MEASURE → MITIGATE → COMPARE → STRENGTHEN
```

The ultimate objective is to help cities move from reactive infrastructure management toward proactive resilience planning.

> **CASCADE-X**
> Don't just see what failed.
> Understand what fails next.
> Find where intervention can stop the cascade.
