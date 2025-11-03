import { ReactorParameters } from '@/types/simulation';
import { NUCLEAR_CONSTANTS, MODERATOR_DATA } from '@/constants/nuclearConstants';

export interface NeutronFluxData {
  radialPosition: number; // normalized 0-1
  axialPosition: number; // normalized 0-1
  thermalFlux: number; // n/(cm²·s)
  fastFlux: number; // n/(cm²·s)
}

export interface PowerDistribution {
  radialPosition: number;
  axialPosition: number;
  powerDensity: number; // MW/m³
  peakingFactor: number;
}

export class NeutronicsEngine {
  // Calculate 2D neutron flux distribution (simplified diffusion theory)
  calculateNeutronFlux(params: ReactorParameters, timestep: number): NeutronFluxData[] {
    const gridSize = 20;
    const fluxData: NeutronFluxData[] = [];
    
    // Get moderator properties
    const moderatorProps = MODERATOR_DATA[params.moderatorType];
    const moderatingRatio = moderatorProps.moderatingRatio;
    
    // Fuel-dependent flux parameters
    const fuelFactors: Record<string, number> = {
      'U-235': 1.0,
      'Pu-239': 1.15,
      'Thorium-232': 0.85,
      'MOX': 1.08,
    };
    
    const fuelFactor = fuelFactors[params.fuelType] || 1.0;
    const enrichmentFactor = params.enrichmentPercent / 5.0;
    
    // Base flux scaled by reactor capacity
    const baseFlux = 1e13 * (params.capacityMW / 1000) * fuelFactor * enrichmentFactor;
    
    // Burnup effect - flux decreases over time
    const burnupFactor = Math.exp(-timestep / (params.plantLifespanYears * 2));
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const r = i / (gridSize - 1); // radial 0-1
        const z = j / (gridSize - 1); // axial 0-1
        
        // Cosine distribution (fundamental mode)
        let radialProfile: number;
        if (params.geometry === 'Cylindrical') {
          // Bessel function approximation (J0)
          radialProfile = Math.cos(2.405 * r); // First zero of J0
        } else if (params.geometry === 'Spherical') {
          // Spherical harmonics
          radialProfile = r > 0 ? Math.sin(Math.PI * r) / (Math.PI * r) : 1;
        } else {
          // Rectangular - cosine in both directions
          radialProfile = Math.cos(Math.PI * (r - 0.5));
        }
        
        // Axial cosine distribution
        const axialProfile = Math.cos(Math.PI * (z - 0.5));
        
        // Thermal flux (moderated neutrons)
        const thermalFlux = baseFlux * radialProfile * axialProfile * 
                           burnupFactor * (moderatingRatio / 100);
        
        // Fast flux (unmoderated)
        const fastFlux = baseFlux * radialProfile * axialProfile * 
                        burnupFactor * 0.3;
        
        fluxData.push({
          radialPosition: r,
          axialPosition: z,
          thermalFlux: Math.max(0, thermalFlux),
          fastFlux: Math.max(0, fastFlux),
        });
      }
    }
    
    return fluxData;
  }
  
  // Calculate power distribution
  calculatePowerDistribution(params: ReactorParameters, timestep: number): PowerDistribution[] {
    const gridSize = 20;
    const powerData: PowerDistribution[] = [];
    
    // Core volume estimate (m³)
    const coreVolume = params.geometry === 'Cylindrical' ? 150 : 
                       params.geometry === 'Spherical' ? 120 : 180;
    
    // Average power density
    const avgPowerDensity = (params.capacityMW * params.thermalEfficiency * 1000) / coreVolume; // MW/m³
    
    // Burnup effect
    const burnupFactor = Math.exp(-timestep / (params.plantLifespanYears * 2));
    
    let maxPower = 0;
    const tempData: PowerDistribution[] = [];
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const r = i / (gridSize - 1);
        const z = j / (gridSize - 1);
        
        // Power follows flux distribution
        let radialProfile: number;
        if (params.geometry === 'Cylindrical') {
          radialProfile = Math.cos(2.405 * r);
        } else if (params.geometry === 'Spherical') {
          radialProfile = r > 0 ? Math.sin(Math.PI * r) / (Math.PI * r) : 1;
        } else {
          radialProfile = Math.cos(Math.PI * (r - 0.5));
        }
        
        const axialProfile = Math.cos(Math.PI * (z - 0.5));
        
        const powerDensity = avgPowerDensity * radialProfile * axialProfile * burnupFactor;
        
        tempData.push({
          radialPosition: r,
          axialPosition: z,
          powerDensity: Math.max(0, powerDensity),
          peakingFactor: 0, // Will calculate after finding max
        });
        
        maxPower = Math.max(maxPower, powerDensity);
      }
    }
    
    // Calculate peaking factors
    for (const point of tempData) {
      powerData.push({
        ...point,
        peakingFactor: maxPower > 0 ? point.powerDensity / avgPowerDensity : 1,
      });
    }
    
    return powerData;
  }
  
  // Calculate effective multiplication factor (k_eff)
  calculateKeff(params: ReactorParameters, year: number): number {
    const moderatorProps = MODERATOR_DATA[params.moderatorType];
    
    // Base k_eff for fresh fuel
    let keff = 1.05; // slightly supercritical when fresh
    
    // Enrichment effect
    const enrichmentEffect = (params.enrichmentPercent - 3.5) * 0.02;
    keff += enrichmentEffect;
    
    // Moderator effect
    const moderatorEffect = moderatorProps.moderatingRatio / 1000;
    keff += moderatorEffect;
    
    // Fuel depletion (burnup)
    const burnupEffect = -year * 0.008; // ~0.8% reactivity loss per year
    keff += burnupEffect;
    
    // Control rods
    const controlRodEffect = -params.controlRodInsertion * 0.005;
    keff += controlRodEffect;
    
    // Temperature feedback (Doppler effect)
    const tempEffect = NUCLEAR_CONSTANTS.DOPPLER_COEFFICIENT_U235 * 0.0001;
    keff += tempEffect;
    
    // Xenon poisoning (peaks after shutdown, simplified)
    const xenonEffect = -0.03;
    keff += xenonEffect;
    
    return Math.max(0.8, Math.min(1.2, keff));
  }
  
  // Calculate neutron generation time
  calculateNeutronGenerationTime(params: ReactorParameters): number {
    const moderatorProps = MODERATOR_DATA[params.moderatorType];
    
    // Base prompt neutron lifetime
    let genTime = NUCLEAR_CONSTANTS.PROMPT_NEUTRON_LIFETIME;
    
    // Moderator slows down neutrons, increasing generation time
    if (params.moderatorType === 'Light Water') {
      genTime *= 1.5;
    } else if (params.moderatorType === 'Heavy Water') {
      genTime *= 2.0;
    } else if (params.moderatorType === 'Graphite') {
      genTime *= 1.8;
    }
    
    return genTime;
  }
}
