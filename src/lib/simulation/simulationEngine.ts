import { ReactorParameters, FinancialParameters, PolicyParameters, SimulationResult } from '@/types/simulation';
import { PhysicsEngine } from './physicsEngine';
import { FinanceEngine } from './financeEngine';
import { NeutronicsEngine } from './neutronicsEngine';
import { DecayEngine } from './decayEngine';
import { CO2_AVOIDED_PER_MWH } from '@/constants/reactorData';

export class SimulationEngine {
  private physicsEngine: PhysicsEngine;
  private financeEngine: FinanceEngine;
  private neutronicsEngine: NeutronicsEngine;
  private decayEngine: DecayEngine;

  constructor() {
    this.physicsEngine = new PhysicsEngine();
    this.financeEngine = new FinanceEngine();
    this.neutronicsEngine = new NeutronicsEngine();
    this.decayEngine = new DecayEngine();
  }
  
  getNeutronicsEngine() {
    return this.neutronicsEngine;
  }
  
  getDecayEngine() {
    return this.decayEngine;
  }

  runSimulation(
    reactorParams: ReactorParameters,
    financialParams: FinancialParameters,
    policyParams: PolicyParameters
  ): SimulationResult {
    // Calculate yearly energy production
    const energyPerYear: number[] = [];
    const wastePerYear: number[] = [];
    const co2PerYear: number[] = [];

    const fuelTempPerYear: number[] = [];
    const coolantTempPerYear: number[] = [];
    const reactivityPerYear: number[] = [];

    for (let year = 0; year < reactorParams.plantLifespanYears; year++) {
      const efficiency = this.physicsEngine.calculateReactorEfficiency(reactorParams, year);
      const adjustedParams = { ...reactorParams, thermalEfficiency: efficiency };
      
      const annualEnergy = this.physicsEngine.calculateAnnualEnergy(adjustedParams);
      const waste = this.physicsEngine.calculateWasteProduction(annualEnergy, reactorParams.fuelType);
      const co2 = annualEnergy * CO2_AVOIDED_PER_MWH;

      // Thermal-hydraulic calculations
      const fuelTemp = this.physicsEngine.calculateFuelTemperature(reactorParams, reactorParams.capacityMW * (reactorParams.uptimePercent / 100));
      const coolantTemp = this.physicsEngine.calculateCoolantTemperature(reactorParams, fuelTemp);
      const reactivity = this.physicsEngine.calculateReactivity(reactorParams, year);

      energyPerYear.push(annualEnergy);
      wastePerYear.push(waste);
      co2PerYear.push(co2);
      fuelTempPerYear.push(fuelTemp);
      coolantTempPerYear.push(coolantTemp);
      reactivityPerYear.push(reactivity);
    }

    // Generate financial data
    const yearlyData = this.financeEngine.generateYearlyData(
      reactorParams,
      financialParams,
      energyPerYear,
      wastePerYear,
      co2PerYear,
      policyParams.subsidiesEnabled,
      policyParams.carbonTaxEnabled,
      policyParams.wasteManagementCost,
      fuelTempPerYear,
      coolantTempPerYear,
      reactivityPerYear
    );

    // Calculate metrics
    const cashFlows = [
      -this.financeEngine.calculateConstructionCost(reactorParams, financialParams),
      ...yearlyData.map(d => d.cashFlow)
    ];

    const npv = this.financeEngine.calculateNPV(cashFlows, financialParams.discountRate);
    const irr = this.financeEngine.calculateIRR(cashFlows);
    const paybackYears = this.financeEngine.calculatePaybackPeriod(cashFlows);

    // Calculate cumulative accident probability
    let cumulativeAccidentProb = 0;
    for (let year = 0; year < reactorParams.plantLifespanYears; year++) {
      cumulativeAccidentProb += this.physicsEngine.calculateAccidentProbability(reactorParams, year);
    }

    return {
      energyProducedMWh: energyPerYear.reduce((a, b) => a + b, 0),
      revenueTotal: yearlyData.reduce((sum, d) => sum + d.revenue, 0),
      costsTotal: yearlyData.reduce((sum, d) => sum + d.operatingCost, 0),
      npv,
      irr,
      paybackYears,
      co2Avoided: co2PerYear.reduce((a, b) => a + b, 0),
      wasteProduced: wastePerYear.reduce((a, b) => a + b, 0),
      accidentProbability: cumulativeAccidentProb,
      yearlyData,
    };
  }
}
