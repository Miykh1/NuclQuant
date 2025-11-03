// Nuclear physics constants based on ENDF/B-VIII.0 evaluated nuclear data
// Sources: OECD-NEA JANIS, NIST Physical Constants, Nuclear Engineering literature

export const NUCLEAR_CONSTANTS = {
  // Fundamental constants
  AVOGADRO: 6.02214076e23, // mol^-1
  BOLTZMANN: 1.380649e-23, // J/K
  NEUTRON_MASS: 1.008664916, // amu
  NEUTRON_SPEED_THERMAL: 2200, // m/s at 20°C
  
  // Energy conversions
  EV_TO_JOULES: 1.602176634e-19,
  MEV_TO_JOULES: 1.602176634e-13,
  FISSION_ENERGY_U235: 200, // MeV per fission
  FISSION_ENERGY_PU239: 210, // MeV per fission
  FISSION_ENERGY_TH232: 190, // MeV per fission (bred U-233)
  
  // Cross sections (barns at thermal energy)
  SIGMA_FISSION_U235: 585, // barns
  SIGMA_FISSION_PU239: 748, // barns
  SIGMA_ABSORPTION_U235: 681, // barns
  SIGMA_ABSORPTION_PU239: 1018, // barns
  
  // Neutron properties
  NEUTRONS_PER_FISSION_U235: 2.43,
  NEUTRONS_PER_FISSION_PU239: 2.87,
  NEUTRONS_PER_FISSION_U233: 2.49,
  DELAYED_NEUTRON_FRACTION_U235: 0.0065, // β
  DELAYED_NEUTRON_FRACTION_PU239: 0.0021,
  PROMPT_NEUTRON_LIFETIME: 1e-4, // seconds (PWR)
  
  // Temperature coefficients (pcm/°C)
  DOPPLER_COEFFICIENT_U235: -2.5, // negative for safety
  MODERATOR_COEFFICIENT_PWR: -30, // negative for light water
  MODERATOR_COEFFICIENT_GRAPHITE: 5, // positive for graphite
  
  // Decay constants (per second)
  DECAY_XE135: 2.09e-5, // 9.14 hour half-life
  DECAY_I135: 2.92e-5, // 6.57 hour half-life
  DECAY_CS137: 7.30e-10, // 30.17 year half-life
  DECAY_SR90: 7.61e-10, // 28.8 year half-life
  
  // Fission yields (fraction per fission)
  YIELD_XE135_U235: 0.00237,
  YIELD_I135_U235: 0.0639,
  YIELD_CS137_U235: 0.0625,
  YIELD_SR90_U235: 0.0593,
  
  // Thermal properties
  WATER_SPECIFIC_HEAT: 4186, // J/(kg·K)
  WATER_DENSITY: 1000, // kg/m³ at STP
  WATER_BOILING_POINT: 373.15, // K at 1 atm
  UO2_MELTING_POINT: 3138, // K
  UO2_THERMAL_CONDUCTIVITY: 8.5, // W/(m·K)
  ZIRCALOY_MELTING_POINT: 2128, // K
  
  // Reactor parameters
  PWR_OPERATING_PRESSURE: 15.5e6, // Pa (155 bar)
  BWR_OPERATING_PRESSURE: 7.2e6, // Pa (72 bar)
  PWR_CORE_INLET_TEMP: 563, // K (290°C)
  PWR_CORE_OUTLET_TEMP: 598, // K (325°C)
  
  // Safety limits
  SCRAM_REACTIVITY_INSERTION: -5000, // pcm (parts per million)
  SCRAM_RESPONSE_TIME: 2.5, // seconds
  LOCA_CRITICAL_BREAK_SIZE: 0.2, // fraction of coolant pipe area
  
  // Burnup
  BURNUP_LIMIT_PWR: 60000, // MWd/MTU
  BURNUP_LIMIT_BWR: 55000, // MWd/MTU
  FUEL_ENRICHMENT_NATURAL: 0.711, // % U-235 in natural uranium
  FUEL_ENRICHMENT_TYPICAL_PWR: 4.5, // % U-235
  
  // Economic constants (2024 values)
  CARBON_AVOIDED_PER_MWH: 0.527, // tonnes CO2
  DECOMMISSIONING_COST_MULTIPLIER: 0.15, // 15% of construction cost
  FUEL_COST_PER_KG_U235: 100000, // USD (enriched)
  WASTE_STORAGE_COST_PER_KG: 500, // USD per year
};

export const FISSION_PRODUCTS = {
  'Xe-135': {
    symbol: 'Xe-135',
    halfLife: 9.14, // hours
    decayConstant: NUCLEAR_CONSTANTS.DECAY_XE135,
    yield: NUCLEAR_CONSTANTS.YIELD_XE135_U235,
    neutronPoison: true,
    crossSection: 2.65e6, // barns (strongest known neutron absorber)
  },
  'I-135': {
    symbol: 'I-135',
    halfLife: 6.57, // hours
    decayConstant: NUCLEAR_CONSTANTS.DECAY_I135,
    yield: NUCLEAR_CONSTANTS.YIELD_I135_U235,
    neutronPoison: false,
    decaysTo: 'Xe-135',
  },
  'Cs-137': {
    symbol: 'Cs-137',
    halfLife: 30.17 * 365.25 * 24, // hours
    decayConstant: NUCLEAR_CONSTANTS.DECAY_CS137,
    yield: NUCLEAR_CONSTANTS.YIELD_CS137_U235,
    gammaEnergy: 0.662, // MeV
    biologicalHazard: 'high',
  },
  'Sr-90': {
    symbol: 'Sr-90',
    halfLife: 28.8 * 365.25 * 24, // hours
    decayConstant: NUCLEAR_CONSTANTS.DECAY_SR90,
    yield: NUCLEAR_CONSTANTS.YIELD_SR90_U235,
    betaEnergy: 0.546, // MeV
    biologicalHazard: 'high',
  },
};

// Moderator properties
export const MODERATOR_DATA = {
  'Light Water': {
    density: 1000, // kg/m³
    scatteringCrossSection: 103, // barns
    absorptionCrossSection: 0.664, // barns
    moderatingRatio: 72,
    temperatureCoefficient: -30, // pcm/°C
  },
  'Heavy Water': {
    density: 1105, // kg/m³
    scatteringCrossSection: 13.6, // barns
    absorptionCrossSection: 0.001, // barns (very low)
    moderatingRatio: 5670,
    temperatureCoefficient: -10, // pcm/°C
  },
  'Graphite': {
    density: 1600, // kg/m³
    scatteringCrossSection: 4.8, // barns
    absorptionCrossSection: 0.0045, // barns
    moderatingRatio: 192,
    temperatureCoefficient: 5, // pcm/°C (positive!)
  },
  'None': {
    density: 0,
    scatteringCrossSection: 0,
    absorptionCrossSection: 0,
    moderatingRatio: 0,
    temperatureCoefficient: 0,
  },
};
