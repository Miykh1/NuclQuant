import { ReactorParameters } from '@/types/simulation';
import { FUEL_DATA } from '@/constants/reactorData';

export class PhysicsEngine {
  calculateEnergyOutput(params: ReactorParameters, years: number): number {
    const hoursPerYear = 8760;
    const uptimeFactor = params.uptimePercent / 100;
    const fuelEfficiency = FUEL_DATA[params.fuelType].energyDensity;
    
    const annualEnergyMWh = params.capacityMW * hoursPerYear * uptimeFactor * params.thermalEfficiency * fuelEfficiency;
    
    return annualEnergyMWh * years;
  }

  calculateAnnualEnergy(params: ReactorParameters): number {
    return this.calculateEnergyOutput(params, 1);
  }

  calculateWasteProduction(energyMWh: number, fuelType: string): number {
    const wasteFactor = FUEL_DATA[fuelType as keyof typeof FUEL_DATA].wasteFactor;
    const baseWastePerMWh = 0.0003; // tons per MWh
    return energyMWh * baseWastePerMWh * wasteFactor;
  }

  calculateFuelBurnup(params: ReactorParameters, year: number): number {
    // Simplified fuel burnup rate (GWd/MTU)
    const baseBurnup = 50;
    const enrichmentFactor = params.enrichmentPercent / 5;
    const degradation = 1 - (year * 0.01); // 1% degradation per year
    
    return baseBurnup * enrichmentFactor * Math.max(0.8, degradation);
  }

  calculateReactorEfficiency(params: ReactorParameters, year: number): number {
    // Efficiency degrades slightly over time
    const agingFactor = Math.pow(0.995, year); // 0.5% degradation per year
    return params.thermalEfficiency * agingFactor;
  }

  calculateAccidentProbability(params: ReactorParameters, year: number): number {
    // Base probability (per reactor-year)
    let baseProbability = 0.0001; // 1 in 10,000 per year
    
    // Reactor type factors
    const typeFactors: Record<string, number> = {
      PWR: 1.0,
      BWR: 1.1,
      SMR: 0.5,
      Thorium: 0.3,
      CANDU: 0.7,
      'Fast Breeder': 1.3,
    };
    
    // Aging increases risk
    const agingFactor = 1 + (year * 0.02); // 2% increase per year
    
    // Lower uptime might indicate maintenance issues
    const maintenanceFactor = params.uptimePercent < 80 ? 1.5 : 1.0;
    
    // Control rod position affects safety
    const controlRodFactor = params.controlRodInsertion < 30 ? 1.2 : 0.9;
    
    return baseProbability * typeFactors[params.type] * agingFactor * maintenanceFactor * controlRodFactor;
  }

  calculateFuelTemperature(params: ReactorParameters, powerLevel: number): number {
    // Base fuel centerline temperature in Celsius
    const baseFuelTemp = 600; // °C
    const powerFactor = (powerLevel / params.capacityMW) * 1000;
    const efficiencyFactor = params.thermalEfficiency * 500;
    
    return baseFuelTemp + powerFactor + efficiencyFactor;
  }

  calculateCoolantTemperature(params: ReactorParameters, fuelTemp: number): number {
    // Coolant inlet temperature
    const inletTemp = 280; // °C typical for PWR
    
    // Heat transfer to coolant
    const flowRateFactor = params.coolantFlowRate / 1000; // normalized
    const heatTransfer = (fuelTemp - inletTemp) * 0.3 * flowRateFactor;
    
    return inletTemp + heatTransfer;
  }

  calculateReactivity(params: ReactorParameters, year: number): number {
    // k_eff calculation (simplified)
    let keff = 1.0; // critical
    
    // Fuel depletion reduces reactivity
    const burnupEffect = -0.001 * year;
    
    // Control rods reduce reactivity
    const controlEffect = -params.controlRodInsertion * 0.002;
    
    // Temperature coefficient (negative for safety)
    const tempCoeff = -0.00003;
    
    // Moderator effect
    const moderatorBonus = params.moderatorType === 'Heavy Water' ? 0.05 : 
                           params.moderatorType === 'Graphite' ? 0.03 : 0;
    
    return keff + burnupEffect + controlEffect + tempCoeff + moderatorBonus;
  }

  calculateMaintenanceCycles(params: ReactorParameters): number {
    // Major maintenance every N years
    const cycleLength = params.type === 'SMR' ? 4 : 6;
    return Math.floor(params.plantLifespanYears / cycleLength);
  }
}
