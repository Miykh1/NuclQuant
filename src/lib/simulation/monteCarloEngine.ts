import { ReactorParameters, FinancialParameters, PolicyParameters, MonteCarloResult, SimulationResult } from '@/types/simulation';
import { SimulationEngine } from './simulationEngine';

export class MonteCarloEngine {
  private simulationEngine: SimulationEngine;

  constructor() {
    this.simulationEngine = new SimulationEngine();
  }

  runMonteCarloSimulation(
    baseReactorParams: ReactorParameters,
    baseFinancialParams: FinancialParameters,
    basePolicyParams: PolicyParameters,
    iterations: number = 1000
  ): MonteCarloResult {
    const scenarios: SimulationResult[] = [];

    for (let i = 0; i < iterations; i++) {
      // Create variations in parameters
      const reactorParams = this.varyReactorParams(baseReactorParams);
      const financialParams = this.varyFinancialParams(baseFinancialParams);
      const policyParams = basePolicyParams; // Keep policy constant for now

      // Run simulation
      const result = this.simulationEngine.runSimulation(
        reactorParams,
        financialParams,
        policyParams
      );

      scenarios.push(result);
    }

    return this.analyzeScenarios(scenarios);
  }

  private varyReactorParams(base: ReactorParameters): ReactorParameters {
    return {
      ...base,
      uptimePercent: this.randomVariation(base.uptimePercent, 0.05, 70, 98),
      thermalEfficiency: this.randomVariation(base.thermalEfficiency, 0.03, 0.25, 0.40),
    };
  }

  private varyFinancialParams(base: FinancialParameters): FinancialParameters {
    return {
      ...base,
      constructionCostPerMW: this.randomVariation(base.constructionCostPerMW, 0.15),
      annualOperatingCost: this.randomVariation(base.annualOperatingCost, 0.10),
      electricityPricePerMWh: this.randomVariation(base.electricityPricePerMWh, 0.20, 30, 150),
      discountRate: this.randomVariation(base.discountRate, 0.15, 0.03, 0.12),
      inflationRate: this.randomVariation(base.inflationRate, 0.30, 0.01, 0.06),
      carbonTaxPerTon: this.randomVariation(base.carbonTaxPerTon, 0.25, 0, 200),
    };
  }

  private randomVariation(
    baseValue: number,
    variationPercent: number,
    min?: number,
    max?: number
  ): number {
    // Normal distribution (Box-Muller transform)
    const u1 = Math.random();
    const u2 = Math.random();
    const standardNormal = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    
    const variation = baseValue * variationPercent * standardNormal;
    let result = baseValue + variation;

    if (min !== undefined) result = Math.max(min, result);
    if (max !== undefined) result = Math.min(max, result);

    return result;
  }

  private analyzeScenarios(scenarios: SimulationResult[]): MonteCarloResult {
    const npvValues = scenarios.map(s => s.npv).sort((a, b) => a - b);
    const irrValues = scenarios.map(s => s.irr);

    const meanNPV = this.mean(npvValues);
    const medianNPV = this.median(npvValues);
    const stdDevNPV = this.standardDeviation(npvValues);
    const probabilityProfit = npvValues.filter(v => v > 0).length / npvValues.length;

    return {
      scenarios,
      meanNPV,
      medianNPV,
      stdDevNPV,
      probabilityProfit,
      percentile5: this.percentile(npvValues, 0.05),
      percentile95: this.percentile(npvValues, 0.95),
      meanIRR: this.mean(irrValues),
    };
  }

  private mean(values: number[]): number {
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  private median(sortedValues: number[]): number {
    const mid = Math.floor(sortedValues.length / 2);
    return sortedValues.length % 2 === 0
      ? (sortedValues[mid - 1] + sortedValues[mid]) / 2
      : sortedValues[mid];
  }

  private standardDeviation(values: number[]): number {
    const avg = this.mean(values);
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    return Math.sqrt(this.mean(squareDiffs));
  }

  private percentile(sortedValues: number[], p: number): number {
    const index = Math.ceil(sortedValues.length * p) - 1;
    return sortedValues[Math.max(0, index)];
  }
}
