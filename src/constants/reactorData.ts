import { ReactorSpec, FuelType } from '@/types/simulation';

export const REACTOR_SPECS: Record<string, ReactorSpec> = {
  PWR: {
    name: 'Pressurized Water Reactor',
    type: 'PWR',
    efficiency: 0.33,
    constructionCost: 6000,
    operatingCost: 25,
    capacity: 1000,
    description: 'Most common reactor type, uses pressurized water as coolant and moderator',
  },
  BWR: {
    name: 'Boiling Water Reactor',
    type: 'BWR',
    efficiency: 0.32,
    constructionCost: 5500,
    operatingCost: 23,
    capacity: 1100,
    description: 'Water boils in the reactor core, simpler design than PWR',
  },
  SMR: {
    name: 'Small Modular Reactor',
    type: 'SMR',
    efficiency: 0.35,
    constructionCost: 4000,
    operatingCost: 20,
    capacity: 300,
    description: 'Compact, factory-built, enhanced safety features',
  },
  Thorium: {
    name: 'Thorium Reactor',
    type: 'Thorium',
    efficiency: 0.38,
    constructionCost: 7000,
    operatingCost: 30,
    capacity: 1000,
    description: 'Next-generation design, safer fuel cycle, less waste',
  },
  CANDU: {
    name: 'CANDU Heavy Water Reactor',
    type: 'CANDU',
    efficiency: 0.30,
    constructionCost: 5800,
    operatingCost: 24,
    capacity: 700,
    description: 'Canadian design using heavy water moderator, can use natural uranium',
  },
  'Fast Breeder': {
    name: 'Fast Breeder Reactor',
    type: 'Fast Breeder',
    efficiency: 0.40,
    constructionCost: 9000,
    operatingCost: 28,
    capacity: 1200,
    description: 'Advanced reactor that produces more fissile material than it consumes',
  },
};

export const FUEL_DATA: Record<FuelType, {
  name: string;
  energyDensity: number;
  wasteFactor: number;
  costMultiplier: number;
  description: string;
}> = {
  'U-235': {
    name: 'Uranium-235',
    energyDensity: 1.0,
    wasteFactor: 1.0,
    costMultiplier: 1.0,
    description: 'Standard enriched uranium fuel',
  },
  'Pu-239': {
    name: 'Plutonium-239',
    energyDensity: 1.2,
    wasteFactor: 0.8,
    costMultiplier: 1.5,
    description: 'Higher energy density, reprocessed from spent fuel',
  },
  'Thorium-232': {
    name: 'Thorium-232',
    energyDensity: 1.1,
    wasteFactor: 0.3,
    costMultiplier: 0.8,
    description: 'Cleaner fuel cycle, significantly less waste',
  },
  'MOX': {
    name: 'Mixed Oxide Fuel',
    energyDensity: 1.15,
    wasteFactor: 0.9,
    costMultiplier: 1.3,
    description: 'Blend of uranium and plutonium oxides',
  },
};

export const CO2_AVOIDED_PER_MWH = 0.5; // tons of CO2 avoided vs fossil fuels
export const WASTE_PER_MWH = 0.0003; // tons of nuclear waste per MWh
