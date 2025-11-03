<!-- Copyright © 2025 SaintSynapse  
All rights reserved.   -->

This software and all associated files are the property of its author.  
It may not be copied, modified, distributed, or sold, in whole or in part,  
without explicit written permission from the copyright holder.  

Unauthorized use, reproduction, or redistribution is strictly prohibited.

# Complete User Guide - NuclQUANT: The NuclEAR Engine (Nuclear Reactor Simulation & Universal Optimization Platform)

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Configuration Tab](#configuration-tab)
4. [Templates Tab](#templates-tab)
5. [Results Tab](#results-tab)
6. [Physics Tab](#physics-tab)
7. [Risk Tab](#risk-tab)
8. [Global Tab](#global-tab)
9. [Helios Tab](#helios-tab)
10. [Key Terms & Concepts](#key-terms--concepts)

---

## Introduction

This application is a comprehensive nuclear reactor simulation and universal optimization platform. It combines advanced nuclear physics modeling with financial analysis, risk assessment, operations research, and resource optimization. Whether you're a nuclear engineer, financial analyst, operations manager, student, or business owner, this platform provides powerful tools for decision-making and optimization.

### What Can This App Do?

- **Nuclear Reactor Simulation**: Model different reactor types (PWR, BWR, PHWR) with realistic physics
- **Financial Analysis**: Calculate NPV, IRR, payback periods, and cash flows
- **Monte Carlo Risk Analysis**: Run thousands of scenarios to understand uncertainty
- **Operations Optimization**: Optimize schedules, supply chains, and resource allocation
- **Global Nuclear Data**: Access real-world nuclear energy data from multiple countries
- **Resource Monitoring (Helios)**: Track time, money, energy, materials across any project
- **Code Execution**: Write and run custom JavaScript, Python, or C code

---

## Getting Started

When you first open the app, you'll see **7 main tabs** at the top:
1. Configuration
2. Templates
3. Results
4. Physics
5. Risk
6. Global
7. Helios

**Start Here**: Go to the **Configuration tab** to set up your first simulation.

---

## Configuration Tab

This is where you define the parameters for your nuclear reactor simulation.

### Reactor Configuration

**What is it?** The Reactor Configuration panel lets you choose the type of nuclear reactor and its physical characteristics.

#### Key Settings:

**Reactor Type**
- **PWR (Pressurized Water Reactor)**: Most common type, uses high-pressure water
- **BWR (Boiling Water Reactor)**: Water boils directly in the reactor core
- **PHWR (Pressurized Heavy Water Reactor)**: Uses heavy water (deuterium)
- *What to choose*: PWR is most common and well-understood

**Fuel Type**
- **U-235**: Standard uranium fuel
- **U-238**: Depleted uranium
- **Pu-239**: Plutonium fuel
- **Th-232**: Thorium fuel (experimental)
- *What to choose*: U-235 is most common

**Enrichment Percent** (0-20%)
- How much fissionable material is in the fuel
- Higher enrichment = more power, but more expensive
- Typical: 3-5% for commercial reactors

**Thermal Efficiency** (0-100%)
- How well the reactor converts heat to electricity
- Typical: 30-35% for most reactors

**Uptime Percent** (0-100%)
- How often the reactor runs (vs. maintenance/refueling)
- Typical: 85-95% for well-maintained reactors

**Capacity (MW)** 
- Maximum electrical power output
- Range: 100-3000 MW
- Typical: 1000 MW for commercial reactors

**Plant Lifespan (Years)**
- How long the reactor will operate
- Typical: 40-60 years

**Moderator Type**
- **Light Water**: Most common, uses regular water
- **Heavy Water**: Uses deuterium, allows natural uranium
- **Graphite**: Solid moderator
- *What it does*: Slows down neutrons for better fission

**Geometry**
- **Cylindrical**: Traditional reactor shape
- **Spherical**: Experimental design
- *Impact*: Affects neutron flux distribution

**Control Rod Insertion** (0-100%)
- How far control rods are inserted
- Higher = less power output, more safety
- Typical: 40-60% during normal operation

**Coolant Flow Rate** (kg/s)
- How fast coolant circulates
- Higher = better cooling, but more pump costs
- Typical: 10,000-20,000 kg/s

### Financial Configuration

**What is it?** This panel defines the economic parameters of your reactor project.

#### Key Settings:

**Construction Cost per MW** ($/MW)
- How much it costs to build the reactor per megawatt of capacity
- Typical: $5,000-$8,000 per MW
- Higher for newer, safer designs

**Annual Operating Cost** (Million $/year)
- Yearly cost to run the reactor (staff, maintenance)
- Typical: $20-40 million/year

**Fuel Cost per Year** (Million $/year)
- Cost to purchase and process nuclear fuel
- Typical: $30-50 million/year

**Decommissioning Cost** (Million $)
- Cost to safely shut down and dismantle at end of life
- Typical: $300-800 million

**Insurance Cost per Year** (Million $/year)
- Accident insurance and liability coverage
- Typical: $5-15 million/year

**Electricity Price per MWh** ($/MWh)
- How much you can sell electricity for
- Typical: $60-100 per MWh
- Higher = more revenue

**Discount Rate** (0-1)
- Time value of money (like interest rate in reverse)
- Typical: 0.06-0.10 (6-10%)
- Higher = future money is worth less

**Inflation Rate** (0-1)
- How much costs increase each year
- Typical: 0.02-0.03 (2-3%)

**Carbon Tax per Ton** ($/ton CO₂)
- Tax on carbon emissions (nuclear emits very little)
- Typical: $20-100 per ton
- Higher = nuclear becomes more competitive

**Subsidy per MWh** ($/MWh)
- Government payment for clean energy
- Typical: $0-20 per MWh

### Policy Configuration

**What is it?** Government policies and regulations affecting your reactor.

#### Key Settings:

**Carbon Tax Enabled**
- Turn carbon tax on/off
- *Impact*: Gives nuclear a competitive advantage

**Subsidies Enabled**
- Turn clean energy subsidies on/off
- *Impact*: Increases revenue

**Waste Management Cost** ($/year)
- Cost to store/dispose of nuclear waste
- Typical: $50,000-200,000/year

**Accident Insurance Multiplier** (1-3)
- How much extra insurance is required
- Higher = more safety regulations
- Typical: 1.2-1.8

**Public Acceptance Factor** (0-1)
- How much public supports nuclear
- Lower = higher political/social costs
- Typical: 0.5-0.8

### Running Your First Simulation

1. **Set your parameters** (or use defaults)
2. **Click "Run Simulation"** (green button)
3. **Wait ~1 second** for results
4. **Results appear** in the Results tab (it will unlock)

**Optional**: Click "Run Monte Carlo (5000)" to run 5,000 scenarios with uncertainty

---

## Templates Tab

Pre-built configurations for common scenarios.

### Preset Templates

**What is it?** Ready-to-use configurations for different reactor types and scenarios.

**How to use**:
1. Click a preset button (e.g., "Small Modular Reactor")
2. Configuration loads automatically
3. Go to Configuration tab to see/modify
4. Click "Run Simulation"

**Available Presets**:
- **Large Commercial PWR**: 1000 MW standard reactor
- **Small Modular Reactor (SMR)**: 300 MW compact design
- **Advanced BWR**: Modern boiling water design
- **CANDU (PHWR)**: Canadian heavy water reactor

### Accident Scenarios

**What is it?** Simulate safety incidents to test reactor response.

**Scenarios**:
1. **LOCA (Loss of Coolant Accident)**: Pipe break, coolant leak
2. **Station Blackout**: Total power loss
3. **Control Rod Ejection**: Rod shoots out unexpectedly
4. **Pump Failure**: Coolant circulation fails

**How to use**:
1. Click scenario button
2. App automatically adjusts parameters to simulate accident
3. See impact on safety and economics

### Policy Shock Simulator

**What is it?** Test how government policy changes affect your reactor.

**Scenarios**:
- **Uranium Import Ban**: Can't import fuel
- **Carbon Tax Increase**: Higher carbon pricing
- **Subsidy Removal**: Clean energy incentives end
- **Safety Regulation Change**: Stricter rules
- **Public Opposition**: Social resistance increases

**How to use**:
1. Click scenario
2. See "before vs after" comparison
3. Review recommendations

---

## Results Tab

View simulation outcomes and financial metrics.

### Results Dashboard

**What is it?** Summary of key financial and operational metrics.

**Key Metrics Explained**:

**NPV (Net Present Value)**
- *What it is*: Total profit over reactor lifetime in today's dollars
- *Good value*: Above $0 means profitable
- *Example*: NPV of $500M means project makes $500 million profit

**IRR (Internal Rate of Return)**
- *What it is*: Annual profit rate, like a percentage return
- *Good value*: Above 8-10%
- *Example*: IRR of 12% means 12% annual return

**Payback Period**
- *What it is*: Years until you recover initial investment
- *Good value*: Under 15 years
- *Example*: 12 years means you break even in year 12

**LCOE (Levelized Cost of Energy)**
- *What it is*: Average cost per MWh over lifetime
- *Good value*: $40-80/MWh for nuclear
- *Example*: $55/MWh means each MWh costs $55 to produce

**Total Revenue**
- All money earned from selling electricity

**Total Costs**
- All expenses (construction + operation + fuel + decommissioning)

**CO₂ Avoided**
- How much carbon emissions prevented vs. fossil fuels
- *Why it matters*: Nuclear is clean energy

**Accident Probability**
- Chance of major accident per year
- *Good value*: Below 0.0001% (very safe)

### Charts

**Cash Flow Chart**
- Shows money in/out each year
- Negative early (construction)
- Positive later (operation)

**Environmental Chart**
- CO₂ savings over time
- Shows cumulative climate benefit

**Thermal Chart**
- Core temperature and cooling
- Shows reactor stays safe

**Reactivity Chart**
- Neutron population over time
- Shows reactor control

### Break-Even Analysis

**What is it?** Shows when your project becomes profitable.

**How to read**:
- **X-axis**: Years
- **Y-axis**: Cumulative profit/loss
- **Break-even point**: Where line crosses $0

---

## Physics Tab

Advanced nuclear physics simulation results.

### Neutron Flux Chart

**What is it?** Shows neutron density distribution in reactor.

**How to read**:
- **High flux** (bright areas): Active fission
- **Low flux** (dark areas): Less activity
- **Gradient**: Shows flux shape based on geometry

**Why it matters**: Ensures even power distribution, no hot spots

### Power Distribution Chart

**What is it?** Thermal power output across the reactor core.

**How to read**:
- Each zone shows power level
- Want: Relatively flat distribution
- Avoid: Large spikes (can damage fuel)

### Decay Heat Chart

**What is it?** Heat from radioactive decay after shutdown.

**How to read**:
- Shows heat over time after reactor stops
- Drops quickly at first, then slowly
- **Critical**: Must cool even when "off"

**Why it matters**: Fukushima accident was from decay heat

### Fission Products Chart

**What is it?** Radioactive isotopes created during operation.

**Shows**:
- Different isotopes (I-131, Cs-137, Sr-90, etc.)
- Activity level (radioactivity)
- Half-life (decay time)

**Why it matters**: These are nuclear "waste" that must be stored

---

## Risk Tab

Monte Carlo analysis and uncertainty quantification.

### What is Monte Carlo?

**Simple explanation**: Runs simulation 5,000 times with random variations to see all possible outcomes.

**Why use it**: Real world is uncertain. This shows the range of possible results.

### Risk Metrics

**Confidence Intervals**:
- **P10**: 10% of scenarios are worse than this (pessimistic)
- **P50 (Median)**: Middle outcome (most likely)
- **P90**: 90% of scenarios are worse than this (optimistic)

**Example**: 
- P10 NPV: $200M (worst realistic case)
- P50 NPV: $500M (expected case)
- P90 NPV: $800M (best realistic case)

**Standard Deviation**
- How spread out results are
- Higher = more uncertainty
- Lower = more predictable

**Probability of Profit**
- Chance NPV is above $0
- *Good value*: Above 70%
- *Example*: 85% means 85% chance of profit

### Monte Carlo Chart

**What is it?** Histogram showing distribution of NPV outcomes.

**How to read**:
- **X-axis**: NPV value
- **Y-axis**: Frequency (how often)
- **Peak**: Most likely outcome
- **Width**: Uncertainty range

### Sensitivity Analysis

**What is it?** Shows which inputs have biggest impact on results.

**How to read**:
- Longer bars = bigger impact
- Positive = increases NPV
- Negative = decreases NPV

**Use it to**: Focus on most important variables

### Correlation Analysis

**What is it?** Shows relationships between nuclear physics and financial outcomes.

**Examples**:
- Higher uptime → Higher NPV
- Better efficiency → Lower costs
- More capacity → More revenue

### Portfolio Optimizer

**What is it?** Optimizes mix of different isotopes/assets for best risk-adjusted return.

**Settings**:
- **Risk Tolerance**: 0 (very safe) to 1 (very risky)
- **Time Horizon**: Investment period in years

**Output**:
- Recommended allocation percentages
- Expected return
- Risk level (volatility)
- **Sharpe Ratio**: Return per unit of risk (higher is better)

---

## Global Tab

Real-world nuclear data and universal optimization.

### Global Nuclear Dashboard

**What is it?** Displays worldwide nuclear energy data from multiple sources.

**Data Sources**:
- EIA (energy data)
- World Bank (economic indicators)
- IMF (financial data)

**Shows**:
- Operating reactors by country
- Nuclear capacity globally
- Energy production trends
- Policy indicators
- Market prices

**Note**: Data may be cached/simulated if offline

### Global Efficiency Optimizer

**What is it?** Universal decision engine for ANY optimization problem.

**Use Cases**:
- Energy grid optimization
- Supply chain logistics
- Manufacturing workflows
- Investment portfolios
- Project scheduling
- Resource allocation

#### System Graph Tab

**What is it?** Visual network of your system.

**Components**:
- **Nodes**: Facilities, plants, warehouses, etc.
- **Edges**: Connections, routes, flows

**How to use**:
1. Add nodes (with costs, capacity, reliability)
2. Connect with edges
3. Set goals (minimize cost, maximize throughput, etc.)
4. Run optimization
5. See optimal configuration

#### Operations Hub

**Comprehensive operations research tools**:

**Scheduling Dashboard**:
- Project timelines (Gantt charts)
- Critical path analysis
- Resource-constrained scheduling
- Identifies delays and bottlenecks

**Supply Chain Dashboard**:
- Inventory optimization (EOQ model)
- Reorder points and safety stock
- Multi-echelon optimization
- Vehicle routing

**KPI Dashboard**:
- Track key performance indicators
- Efficiency, quality, cost, time metrics
- Compare against targets

**Forecasting Dashboard**:
- Predict future values
- Methods: Moving average, exponential smoothing, regression, Holt-Winters
- Confidence intervals
- Trend analysis

---

## Helios Tab

Universal resource monitor and code execution engine.

### What is Helios?

**Helios** is a comprehensive resource tracking and optimization system that works for ANY type of project or activity.

**Who can use it**:
- Students (study time optimization)
- Researchers (lab resource tracking)
- Businesses (cost monitoring)
- Individuals (personal productivity)
- Project managers (resource allocation)
- Anyone tracking time, money, energy, or materials

### Dashboard

**What is it?** Visual overview of your resource usage and efficiency.

**Displays**:
- Total tasks and projects
- Goals achieved
- Average efficiency
- Resource distribution (pie chart)
- Efficiency vs. waste by task
- Goal progress bars

**How to read**:
- **Green trends**: Improving efficiency
- **Red trends**: Declining efficiency
- **High efficiency**: Good resource use
- **High waste**: Room for improvement

### Logger

**What is it?** Log individual resource entries.

**How to use**:
1. Select **Resource Type** (time, money, energy, material, custom)
2. Enter **Project Name** (e.g., "Website Redesign")
3. Enter **Task Name** (e.g., "Database Setup")
4. Enter **Quantity** (e.g., 8 hours, $500, 100 kWh)
5. **Optional**: Enter output (what you produced)
6. Click "Log Entry"

**Example Entry**:
- Resource: Time
- Project: Mobile App
- Task: UI Design
- Quantity: 6 hours
- Output: 12 screens
- Efficiency: 12 screens / 6 hours = 2 screens/hour

### Analyzer

**What is it?** AI-powered efficiency analysis and recommendations.

**Provides**:
- **Bottleneck Detection**: Tasks with low efficiency
- **Waste Identification**: Activities with poor output
- **Trend Analysis**: Improving or declining tasks
- **Prioritized Actions**: Quick wins for improvement
- **Estimated Improvements**: Potential efficiency gains

**Severity Levels**:
- **High**: Urgent issues, fix immediately
- **Medium**: Important, address soon
- **Low**: Minor improvements

**Example Recommendation**:
- "Database Setup has low efficiency (35%). Review procedures and optimize resource allocation. Estimated improvement: +40%"

### Compare

**What is it?** Compare efficiency between projects, tasks, or time periods.

**How to use**:
1. Enter **Entity 1** (project/task)
2. Enter **Entity 2** (project/task to compare)
3. Click "Compare Resources"
4. See side-by-side comparison

**Shows**:
- Total input comparison
- Total output comparison
- Efficiency ratio comparison
- Percentage differences
- Winner for each metric
- Key insights and recommendations

**Use it to**:
- Identify best practices
- Replicate successful strategies
- Eliminate inefficient approaches

### Code

**What is it?** Write, run, and preview code that integrates with Helios data.

**Supported Languages**:
- **JavaScript**: Full support, runs in browser
- **Python**: Coming soon (requires backend)
- **C**: Coming soon (requires WebAssembly)

**Features**:
- **Code Editor**: Write custom logic
- **Templates**: Pre-built examples
- **Preview Mode**: See HTML output
- **Import/Export**: Share code files
- **Execution History**: Review past runs
- **Helios Integration**: Access all your data

**What you can do**:
- Custom calculations on your data
- Generate HTML reports
- Create visualizations
- Automate analysis
- Export formatted data
- Extend Helios functionality

**Available Data** (in JavaScript):
- `entries`: All resource entries
- `metrics`: Efficiency calculations
- `goals`: Your goals and progress
- `bottlenecks`: Detected issues
- `totalResources`: Sum by type

**Example Code**:
```javascript
// Calculate total time spent
const totalTime = entries
  .filter(e => e.resourceType === 'time')
  .reduce((sum, e) => sum + e.quantity, 0);

console.log('Total hours:', totalTime);

// Find most efficient task
const best = metrics.sort((a, b) => 
  b.efficiencyRatio - a.efficiencyRatio
)[0];

console.log('Best task:', best.taskName);
console.log('Efficiency:', best.efficiencyRatio);
```

**Templates**:
- Calculate Total Resources
- Find Top Tasks
- Generate HTML Report

---

## Key Terms & Concepts

### Nuclear Terms

**Fission**: Splitting atoms to release energy

**Enrichment**: Increasing percentage of fissionable U-235

**Moderator**: Material that slows neutrons (water, graphite)

**Control Rods**: Absorb neutrons to control reaction

**Coolant**: Liquid/gas that removes heat

**Decay Heat**: Heat from radioactive decay after shutdown

**Half-Life**: Time for radioactivity to reduce by half

**Criticality**: State where fission is self-sustaining

**Reactivity**: Measure of how fast reaction changes

**Neutron Flux**: Density of neutrons in reactor

### Financial Terms

**NPV (Net Present Value)**: Total profit in today's dollars. Accounts for time value of money. **Positive = profitable project**.

**IRR (Internal Rate of Return)**: Annual return percentage. **Higher = better investment**.

**Discount Rate**: Interest rate used to value future money. **Higher discount rate = future money worth less**.

**LCOE (Levelized Cost of Energy)**: Average cost per MWh over lifetime. **Lower = more competitive**.

**Payback Period**: Years to recover initial investment. **Shorter = less risky**.

**Cash Flow**: Money in (revenue) minus money out (costs) each period.

**Decommissioning**: Safely shutting down and dismantling reactor at end of life.

### Risk Terms

**Monte Carlo**: Simulation method using random sampling to model uncertainty.

**Confidence Interval**: Range where true value likely falls (e.g., 90% confidence).

**Standard Deviation**: Measure of spread/variability. **Higher = more uncertain**.

**Percentile (P10, P50, P90)**: Value below which X% of data falls.

**Sensitivity**: How much output changes when input changes.

**Correlation**: Relationship between two variables. **Positive = move together, Negative = move opposite**.

### Operations Terms

**Critical Path**: Sequence of tasks that determines minimum project duration. **Delay any critical path task = delay entire project**.

**Bottleneck**: Constraint limiting system performance.

**EOQ (Economic Order Quantity)**: Optimal order size to minimize costs.

**Reorder Point**: Inventory level triggering new order.

**Safety Stock**: Extra inventory buffer against uncertainty.

**KPI (Key Performance Indicator)**: Metric measuring success toward objectives.

**Gantt Chart**: Visual timeline showing task schedules.

**Throughput**: Amount processed per time period.

**Utilization**: Percentage of capacity being used.

**Sharpe Ratio**: Return per unit of risk. **Higher = better risk-adjusted performance**.

### Helios Terms

**Resource Entry**: Single logged instance of resource usage.

**Efficiency Ratio**: Output divided by input. **Higher = better productivity**.

**Waste Percentage**: Proportion of low-output activities. **Lower = better**.

**Bottleneck**: Activity with poor efficiency dragging down performance.

**Trend**: Direction of change over time (improving/declining/stable).

**Comparison**: Side-by-side analysis of different entities.

---

## Tips for Success

### For Nuclear Engineers:
1. Start with realistic reactor parameters
2. Run Monte Carlo to understand uncertainty
3. Use Physics tab to verify safety
4. Check accident scenarios regularly

### For Financial Analysts:
1. Focus on NPV, IRR, and payback period
2. Run sensitivity analysis to find key drivers
3. Use Monte Carlo for risk assessment
4. Compare scenarios with different assumptions

### For Operations Managers:
1. Use Global Efficiency Optimizer for system design
2. Leverage Operations Hub for scheduling
3. Track KPIs in real-time
4. Run supply chain optimization

### For Students/Researchers:
1. Use Helios to track study/research time
2. Monitor resource efficiency
3. Compare different approaches
4. Export data for reports

### For Business Owners:
1. Log all business activities in Helios
2. Identify bottlenecks and waste
3. Optimize resource allocation
4. Track progress toward goals

---

## Export & Save Features

**Save Session**: Saves current configuration and results as JSON file

**Load Session**: Restores previously saved session

**Export CSV**: Exports simulation data to spreadsheet format

**Export JSON**: Exports all data in structured format

**Helios Export**: Export resource data (CSV or JSON)

**Code Export**: Save custom code files

---

## Troubleshooting

**Simulation won't run**: Check that all required fields have valid values

**Results Tab locked**: Run simulation first (Configuration tab)

**Physics Tab locked**: Run simulation to generate physics data

**Risk Tab locked**: Run Monte Carlo analysis first

**High accident probability**: Check coolant flow, control rod insertion, uptime

**Negative NPV**: Increase electricity price, reduce costs, or enable subsidies

**No Helios data**: Start logging entries in the Logger tab

**Code execution error**: Check syntax, use console.log for debugging

---

This guide covers all major features. Explore each tab, experiment with settings, and use the export features to save your work!
