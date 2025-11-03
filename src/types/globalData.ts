export interface GlobalNuclearData {
  country: string;
  countryCode: string;
  reactorCount: number;
  totalCapacityMW: number;
  annualGenerationGWh: number;
  percentOfElectricity: number;
  co2Avoided: number;
  operatingReactors: ReactorInfo[];
}

export interface ReactorInfo {
  name: string;
  type: string;
  capacityMW: number;
  status: 'operational' | 'under_construction' | 'shutdown';
  constructionYear: number;
  gridConnectionYear?: number;
}

export interface EnergyMarketData {
  date: string;
  uraniumPrice: number; // $/lb U3O8
  electricityPrice: number; // $/MWh
  carbonPrice: number; // $/ton CO2
  naturalGasPrice: number; // $/MMBtu
  coalPrice: number; // $/ton
}

export interface GeopoliticalIndicator {
  country: string;
  governanceScore: number; // 0-100
  politicalStability: number; // 0-100
  nuclearPolicyRating: 'supportive' | 'neutral' | 'restrictive';
  tradeOpenness: number; // 0-100
  energySecurityIndex: number; // 0-100
}

export interface GlobalIndexData {
  nuclearData: GlobalNuclearData[];
  marketData: EnergyMarketData[];
  geopoliticalIndicators: GeopoliticalIndicator[];
  lastUpdated: string;
}
