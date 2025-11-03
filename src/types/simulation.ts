export type ReactorType = 'PWR' | 'BWR' | 'SMR' | 'Thorium' | 'CANDU' | 'Fast Breeder';

export type ModeratorType = 'Light Water' | 'Heavy Water' | 'Graphite' | 'None';

export type ReactorGeometry = 'Cylindrical' | 'Spherical' | 'Rectangular';

export type FuelType = 'U-235' | 'Pu-239' | 'Thorium-232' | 'MOX';

export interface ReactorParameters {
  type: ReactorType;
  fuelType: FuelType;
  enrichmentPercent: number;
  thermalEfficiency: number;
  uptimePercent: number;
  capacityMW: number;
  plantLifespanYears: number;
  moderatorType: ModeratorType;
  geometry: ReactorGeometry;
  controlRodInsertion: number; // percentage 0-100
  coolantFlowRate: number; // kg/s
}

export interface FinancialParameters {
  constructionCostPerMW: number;
  annualOperatingCost: number;
  fuelCostPerYear: number;
  decommissioningCost: number;
  insuranceCostPerYear: number;
  electricityPricePerMWh: number;
  discountRate: number;
  inflationRate: number;
  carbonTaxPerTon: number;
  subsidyPerMWh: number;
}

export interface PolicyParameters {
  carbonTaxEnabled: boolean;
  subsidiesEnabled: boolean;
  wasteManagementCost: number;
  accidentInsuranceMultiplier: number;
  publicAcceptanceFactor: number;
}

export interface SimulationResult {
  energyProducedMWh: number;
  revenueTotal: number;
  costsTotal: number;
  npv: number;
  irr: number;
  paybackYears: number;
  co2Avoided: number;
  wasteProduced: number;
  accidentProbability: number;
  yearlyData: YearlyData[];
}

export interface YearlyData {
  year: number;
  energyProduced: number;
  revenue: number;
  operatingCost: number;
  cashFlow: number;
  cumulativeCashFlow: number;
  co2Avoided: number;
  wasteProduced: number;
  fuelTemperature: number;
  coolantTemperature: number;
  reactivity: number;
}

export interface SimulationSession {
  id: string;
  timestamp: number;
  reactorParams: ReactorParameters;
  financialParams: FinancialParameters;
  policyParams: PolicyParameters;
  result: SimulationResult;
  monteCarloResult?: MonteCarloResult;
  name?: string;
}

export interface MonteCarloResult {
  scenarios: SimulationResult[];
  meanNPV: number;
  medianNPV: number;
  stdDevNPV: number;
  probabilityProfit: number;
  percentile5: number;
  percentile95: number;
  meanIRR: number;
}

export interface ReactorSpec {
  name: string;
  type: ReactorType;
  efficiency: number;
  constructionCost: number;
  operatingCost: number;
  capacity: number;
  description: string;
}
