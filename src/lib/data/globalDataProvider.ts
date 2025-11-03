import { GlobalNuclearData, EnergyMarketData, GeopoliticalIndicator, GlobalIndexData } from '@/types/globalData';

/**
 * Global Nuclear Index Data Provider
 * 
 * This provider aggregates data from multiple sources:
 * - EIA (U.S. Energy Information Administration) for energy statistics
 * - IEA (International Energy Agency) for market data
 * - World Bank Open Data for economic indicators
 * - Our World in Data for environmental metrics
 * - Custom geopolitical analysis
 * 
 * Data Sources:
 * - EIA Open Data API: https://www.eia.gov/opendata/
 * - IEA Statistics: https://www.iea.org/data-and-statistics
 * - World Bank Data: https://data.worldbank.org/
 * - Our World in Data Energy: https://ourworldindata.org/energy
 * 
 * For production, integrate with real APIs
 */
export class GlobalDataProvider {
  private cachedData: GlobalIndexData | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 3600000; // 1 hour

  async fetchGlobalData(): Promise<GlobalIndexData> {
    // Check cache
    if (this.cachedData && Date.now() - this.cacheTimestamp < this.CACHE_DURATION) {
      return this.cachedData;
    }

    // In production, fetch from actual APIs
    // For now, return comprehensive mock data based on real statistics
    const data: GlobalIndexData = {
      nuclearData: this.getMockNuclearData(),
      marketData: this.getMockMarketData(),
      geopoliticalIndicators: this.getMockGeopoliticalData(),
      lastUpdated: new Date().toISOString(),
    };

    this.cachedData = data;
    this.cacheTimestamp = Date.now();

    return data;
  }

  private getMockNuclearData(): GlobalNuclearData[] {
    return [
      {
        country: 'United States',
        countryCode: 'US',
        reactorCount: 93,
        totalCapacityMW: 95492,
        annualGenerationGWh: 775200,
        percentOfElectricity: 18.9,
        co2Avoided: 465000000,
        operatingReactors: [
          { name: 'Vogtle 3', type: 'PWR', capacityMW: 1117, status: 'operational', constructionYear: 2013, gridConnectionYear: 2023 },
          { name: 'Diablo Canyon 1', type: 'PWR', capacityMW: 1122, status: 'operational', constructionYear: 1968, gridConnectionYear: 1985 },
        ],
      },
      {
        country: 'France',
        countryCode: 'FR',
        reactorCount: 56,
        totalCapacityMW: 61370,
        annualGenerationGWh: 379100,
        percentOfElectricity: 70.6,
        co2Avoided: 227000000,
        operatingReactors: [
          { name: 'Flamanville 3', type: 'PWR', capacityMW: 1650, status: 'operational', constructionYear: 2007, gridConnectionYear: 2024 },
        ],
      },
      {
        country: 'China',
        countryCode: 'CN',
        reactorCount: 55,
        totalCapacityMW: 53260,
        annualGenerationGWh: 417400,
        percentOfElectricity: 5.0,
        co2Avoided: 250000000,
        operatingReactors: [
          { name: 'Taishan 1', type: 'PWR', capacityMW: 1750, status: 'operational', constructionYear: 2009, gridConnectionYear: 2018 },
          { name: 'Hualong One', type: 'PWR', capacityMW: 1150, status: 'operational', constructionYear: 2015, gridConnectionYear: 2021 },
        ],
      },
      {
        country: 'Russia',
        countryCode: 'RU',
        reactorCount: 38,
        totalCapacityMW: 28578,
        annualGenerationGWh: 222400,
        percentOfElectricity: 19.7,
        co2Avoided: 133000000,
        operatingReactors: [
          { name: 'Leningrad II-2', type: 'PWR', capacityMW: 1085, status: 'operational', constructionYear: 2010, gridConnectionYear: 2021 },
        ],
      },
      {
        country: 'South Korea',
        countryCode: 'KR',
        reactorCount: 26,
        totalCapacityMW: 25882,
        annualGenerationGWh: 178900,
        percentOfElectricity: 29.6,
        co2Avoided: 107000000,
        operatingReactors: [
          { name: 'Shin-Kori 4', type: 'PWR', capacityMW: 1340, status: 'operational', constructionYear: 2009, gridConnectionYear: 2019 },
        ],
      },
      {
        country: 'Canada',
        countryCode: 'CA',
        reactorCount: 19,
        totalCapacityMW: 13554,
        annualGenerationGWh: 94800,
        percentOfElectricity: 14.6,
        co2Avoided: 57000000,
        operatingReactors: [
          { name: 'Bruce 6', type: 'CANDU', capacityMW: 825, status: 'operational', constructionYear: 1978, gridConnectionYear: 1984 },
        ],
      },
      {
        country: 'Japan',
        countryCode: 'JP',
        reactorCount: 33,
        totalCapacityMW: 31679,
        annualGenerationGWh: 75900,
        percentOfElectricity: 7.2,
        co2Avoided: 45500000,
        operatingReactors: [
          { name: 'Ohi 3', type: 'PWR', capacityMW: 1180, status: 'operational', constructionYear: 1987, gridConnectionYear: 1991 },
        ],
      },
      {
        country: 'United Kingdom',
        countryCode: 'GB',
        reactorCount: 9,
        totalCapacityMW: 5883,
        annualGenerationGWh: 42300,
        percentOfElectricity: 13.9,
        co2Avoided: 25400000,
        operatingReactors: [
          { name: 'Sizewell B', type: 'PWR', capacityMW: 1198, status: 'operational', constructionYear: 1988, gridConnectionYear: 1995 },
        ],
      },
      {
        country: 'India',
        countryCode: 'IN',
        reactorCount: 23,
        totalCapacityMW: 7480,
        annualGenerationGWh: 47100,
        percentOfElectricity: 3.1,
        co2Avoided: 28200000,
        operatingReactors: [
          { name: 'Kudankulam 1', type: 'PWR', capacityMW: 1000, status: 'operational', constructionYear: 2002, gridConnectionYear: 2014 },
        ],
      },
    ];
  }

  private getMockMarketData(): EnergyMarketData[] {
    const data: EnergyMarketData[] = [];
    const startDate = new Date('2024-01-01');
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Simulate realistic price variations
      const dayOfYear = i;
      const uraniumBase = 82;
      const electricityBase = 75;
      const carbonBase = 85;
      const gasBase = 4.5;
      const coalBase = 145;
      
      data.push({
        date: date.toISOString().split('T')[0],
        uraniumPrice: uraniumBase + Math.sin(dayOfYear / 30) * 8 + (Math.random() - 0.5) * 4,
        electricityPrice: electricityBase + Math.sin(dayOfYear / 60) * 15 + (Math.random() - 0.5) * 10,
        carbonPrice: carbonBase + Math.sin(dayOfYear / 90) * 20 + (Math.random() - 0.5) * 8,
        naturalGasPrice: gasBase + Math.sin(dayOfYear / 45) * 1.5 + (Math.random() - 0.5) * 0.8,
        coalPrice: coalBase + Math.sin(dayOfYear / 75) * 25 + (Math.random() - 0.5) * 12,
      });
    }
    
    return data;
  }

  private getMockGeopoliticalData(): GeopoliticalIndicator[] {
    return [
      {
        country: 'United States',
        governanceScore: 78,
        politicalStability: 72,
        nuclearPolicyRating: 'supportive',
        tradeOpenness: 85,
        energySecurityIndex: 82,
      },
      {
        country: 'France',
        governanceScore: 85,
        politicalStability: 75,
        nuclearPolicyRating: 'supportive',
        tradeOpenness: 88,
        energySecurityIndex: 90,
      },
      {
        country: 'China',
        governanceScore: 62,
        politicalStability: 68,
        nuclearPolicyRating: 'supportive',
        tradeOpenness: 70,
        energySecurityIndex: 75,
      },
      {
        country: 'Germany',
        governanceScore: 88,
        politicalStability: 80,
        nuclearPolicyRating: 'restrictive',
        tradeOpenness: 90,
        energySecurityIndex: 65,
      },
      {
        country: 'Japan',
        governanceScore: 83,
        politicalStability: 78,
        nuclearPolicyRating: 'neutral',
        tradeOpenness: 82,
        energySecurityIndex: 68,
      },
      {
        country: 'India',
        governanceScore: 65,
        politicalStability: 60,
        nuclearPolicyRating: 'supportive',
        tradeOpenness: 68,
        energySecurityIndex: 70,
      },
      {
        country: 'Russia',
        governanceScore: 45,
        politicalStability: 55,
        nuclearPolicyRating: 'supportive',
        tradeOpenness: 52,
        energySecurityIndex: 85,
      },
      {
        country: 'South Korea',
        governanceScore: 80,
        politicalStability: 72,
        nuclearPolicyRating: 'supportive',
        tradeOpenness: 85,
        energySecurityIndex: 78,
      },
    ];
  }

  /**
   * Filter data by country
   */
  filterByCountry(data: GlobalIndexData, countryCodes: string[]): GlobalIndexData {
    return {
      ...data,
      nuclearData: data.nuclearData.filter(d => countryCodes.includes(d.countryCode)),
      geopoliticalIndicators: data.geopoliticalIndicators.filter(g => 
        data.nuclearData.some(n => n.country === g.country && countryCodes.includes(n.countryCode))
      ),
    };
  }

  /**
   * Filter data by date range
   */
  filterByDateRange(data: GlobalIndexData, startDate: string, endDate: string): GlobalIndexData {
    return {
      ...data,
      marketData: data.marketData.filter(m => m.date >= startDate && m.date <= endDate),
    };
  }
}
