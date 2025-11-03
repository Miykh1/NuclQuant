import { ReactorParameters } from '@/types/simulation';
import { NUCLEAR_CONSTANTS, FISSION_PRODUCTS } from '@/constants/nuclearConstants';

export interface FissionProductData {
  isotope: string;
  concentration: number; // atoms/cm³
  activity: number; // Becquerels
  doseRate: number; // mSv/hr at 1m
}

export interface DecayHeatData {
  timeAfterShutdown: number; // hours
  decayPower: number; // MW
  percentOfOperating: number;
}

export class DecayEngine {
  // Calculate fission product buildup during operation
  calculateFissionProducts(
    params: ReactorParameters, 
    operatingTime: number // years
  ): FissionProductData[] {
    const products: FissionProductData[] = [];
    
    // Total fissions per year
    const thermalPower = params.capacityMW / params.thermalEfficiency;
    const fissionsPerSecond = (thermalPower * 1e6) / (NUCLEAR_CONSTANTS.FISSION_ENERGY_U235 * NUCLEAR_CONSTANTS.MEV_TO_JOULES);
    const totalFissions = fissionsPerSecond * 365.25 * 24 * 3600 * operatingTime;
    
    // Core volume (approximation)
    const coreVolume = 1e8; // cm³ (100 m³ typical)
    
    for (const [isotope, data] of Object.entries(FISSION_PRODUCTS)) {
      // Production rate
      const productionRate = totalFissions * data.yield;
      
      // Equilibrium concentration accounting for decay
      const lambda = data.decayConstant;
      const operatingSeconds = operatingTime * 365.25 * 24 * 3600;
      
      // N(t) = (production_rate/λ) * (1 - e^(-λt))
      const concentration = productionRate / (coreVolume * lambda) * 
                           (1 - Math.exp(-lambda * operatingSeconds));
      
      // Activity (Bq) = λ * N
      const activity = lambda * concentration * coreVolume;
      
      // Dose rate estimation (simplified)
      let doseRate = 0;
      if ('gammaEnergy' in data) {
        doseRate = activity * 1e-12; // Simplified dose rate in mSv/hr
      }
      
      products.push({
        isotope,
        concentration,
        activity,
        doseRate,
      });
    }
    
    return products;
  }
  
  // Calculate decay heat after shutdown
  calculateDecayHeat(
    params: ReactorParameters,
    operatingTime: number // years
  ): DecayHeatData[] {
    const decayData: DecayHeatData[] = [];
    
    const operatingPower = params.capacityMW / params.thermalEfficiency; // MW thermal
    
    // Time points: 1 sec to 1 year after shutdown
    const timePoints = [
      1/3600, 10/3600, 1, 2, 6, 12, 24, // hours
      48, 72, 168, 336, 720, 2160, 4320, 8760 // days in hours
    ];
    
    for (const t of timePoints) {
      // ANS-5.1 decay heat standard (simplified)
      // P_decay = P_0 * [0.066 * t^(-0.2) - 0.0017 * t_op^0.2 * t^(-0.2)]
      
      const tSeconds = t * 3600;
      const tOpSeconds = operatingTime * 365.25 * 24 * 3600;
      
      // Simplified decay heat formula
      let decayPowerFraction: number;
      
      if (t < 1) {
        // First hour: ~6-7% of operating power
        decayPowerFraction = 0.066 * Math.pow(tSeconds, -0.2);
      } else if (t < 24) {
        // First day: ~1-2%
        decayPowerFraction = 0.022 * Math.pow(t, -0.3);
      } else if (t < 720) {
        // First month: ~0.5-1%
        decayPowerFraction = 0.010 * Math.pow(t / 24, -0.35);
      } else {
        // Long term: ~0.1-0.5%
        decayPowerFraction = 0.004 * Math.pow(t / 24, -0.4);
      }
      
      // Operating time correction
      const opTimeFactor = Math.min(1, Math.pow(operatingTime / 3, 0.2));
      decayPowerFraction *= opTimeFactor;
      
      const decayPower = operatingPower * decayPowerFraction;
      
      decayData.push({
        timeAfterShutdown: t,
        decayPower,
        percentOfOperating: decayPowerFraction * 100,
      });
    }
    
    return decayData;
  }
  
  // Calculate radiation dose rate from spent fuel
  calculateRadiationDose(
    params: ReactorParameters,
    coolingTime: number // hours
  ): number {
    // Dose rate at 1 meter from spent fuel assembly
    // Based on empirical data
    
    const operatingPower = params.capacityMW / params.thermalEfficiency;
    
    // Initial dose rate (R/hr at 1m, immediately after shutdown)
    const initialDoseRate = operatingPower * 1000; // very high!
    
    // Decay follows roughly t^(-1.2) for mixed fission products
    const doseRate = initialDoseRate * Math.pow(coolingTime + 1, -1.2);
    
    // Convert to mSv/hr (1 R ≈ 10 mSv)
    return doseRate * 10;
  }
  
  // Calculate required shielding thickness
  calculateShieldingRequirement(
    doseRate: number, // mSv/hr
    targetDoseRate: number = 0.001 // mSv/hr (safe level)
  ): { concrete: number; lead: number; water: number } {
    // Attenuation formula: I = I₀ * e^(-μx)
    // μ for gamma rays: concrete ~0.5 cm⁻¹, lead ~1.5 cm⁻¹, water ~0.1 cm⁻¹
    
    const attenuationFactor = doseRate / targetDoseRate;
    
    return {
      concrete: Math.log(attenuationFactor) / 0.5, // cm
      lead: Math.log(attenuationFactor) / 1.5, // cm
      water: Math.log(attenuationFactor) / 0.1, // cm
    };
  }
}
