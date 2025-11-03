import { FinancialParameters, ReactorParameters, YearlyData } from '@/types/simulation';
import { FUEL_DATA } from '@/constants/reactorData';

export class FinanceEngine {
  calculateNPV(cashFlows: number[], discountRate: number): number {
    return cashFlows.reduce((npv, cashFlow, year) => {
      return npv + cashFlow / Math.pow(1 + discountRate, year);
    }, 0);
  }

  calculateIRR(cashFlows: number[]): number {
    // Newton-Raphson method for IRR calculation
    let rate = 0.1; // Initial guess
    const maxIterations = 1000;
    const tolerance = 0.00001;

    for (let i = 0; i < maxIterations; i++) {
      let npv = 0;
      let derivative = 0;

      cashFlows.forEach((cf, t) => {
        npv += cf / Math.pow(1 + rate, t);
        derivative -= (t * cf) / Math.pow(1 + rate, t + 1);
      });

      if (Math.abs(npv) < tolerance) {
        return rate;
      }

      rate = rate - npv / derivative;
      
      if (rate < -0.99) rate = -0.99; // Prevent extreme values
    }

    return rate;
  }

  calculatePaybackPeriod(cashFlows: number[]): number {
    let cumulative = 0;
    for (let year = 0; year < cashFlows.length; year++) {
      cumulative += cashFlows[year];
      if (cumulative > 0) {
        // Interpolate for fractional year
        const previousCumulative = cumulative - cashFlows[year];
        const fraction = -previousCumulative / cashFlows[year];
        return year + fraction;
      }
    }
    return cashFlows.length; // Never pays back
  }

  calculateConstructionCost(
    reactorParams: ReactorParameters,
    financialParams: FinancialParameters
  ): number {
    return reactorParams.capacityMW * financialParams.constructionCostPerMW;
  }

  calculateAnnualRevenue(energyMWh: number, pricePerMWh: number, subsidyPerMWh: number): number {
    return energyMWh * (pricePerMWh + subsidyPerMWh);
  }

  calculateAnnualCosts(
    financialParams: FinancialParameters,
    fuelType: string,
    wasteProduced: number,
    wasteManagementCost: number,
    year: number
  ): number {
    const fuelCostMultiplier = FUEL_DATA[fuelType as keyof typeof FUEL_DATA].costMultiplier;
    
    let totalCost = financialParams.annualOperatingCost +
                    financialParams.fuelCostPerYear * fuelCostMultiplier +
                    financialParams.insuranceCostPerYear;
    
    // Add waste management costs
    totalCost += wasteProduced * wasteManagementCost;
    
    // Apply inflation
    totalCost *= Math.pow(1 + financialParams.inflationRate, year);
    
    return totalCost;
  }

  calculateCarbonCredits(co2Avoided: number, carbonPrice: number): number {
    return co2Avoided * carbonPrice;
  }

  generateYearlyData(
    reactorParams: ReactorParameters,
    financialParams: FinancialParameters,
    energyPerYear: number[],
    wastePerYear: number[],
    co2PerYear: number[],
    subsidiesEnabled: boolean,
    carbonTaxEnabled: boolean,
    wasteManagementCost: number,
    fuelTempPerYear: number[],
    coolantTempPerYear: number[],
    reactivityPerYear: number[]
  ): YearlyData[] {
    const yearlyData: YearlyData[] = [];
    let cumulativeCashFlow = -this.calculateConstructionCost(reactorParams, financialParams);

    for (let year = 0; year < reactorParams.plantLifespanYears; year++) {
      const revenue = this.calculateAnnualRevenue(
        energyPerYear[year],
        financialParams.electricityPricePerMWh,
        subsidiesEnabled ? financialParams.subsidyPerMWh : 0
      );

      const carbonCredits = carbonTaxEnabled
        ? this.calculateCarbonCredits(co2PerYear[year], financialParams.carbonTaxPerTon)
        : 0;

      const costs = this.calculateAnnualCosts(
        financialParams,
        reactorParams.fuelType,
        wastePerYear[year],
        wasteManagementCost,
        year
      );

      const cashFlow = revenue + carbonCredits - costs;
      cumulativeCashFlow += cashFlow;

      yearlyData.push({
        year: year + 1,
        energyProduced: energyPerYear[year],
        revenue: revenue + carbonCredits,
        operatingCost: costs,
        cashFlow,
        cumulativeCashFlow,
        co2Avoided: co2PerYear[year],
        wasteProduced: wastePerYear[year],
        fuelTemperature: fuelTempPerYear[year],
        coolantTemperature: coolantTempPerYear[year],
        reactivity: reactivityPerYear[year],
      });
    }

    // Add decommissioning cost in final year
    if (yearlyData.length > 0) {
      const lastYear = yearlyData[yearlyData.length - 1];
      lastYear.operatingCost += financialParams.decommissioningCost;
      lastYear.cashFlow -= financialParams.decommissioningCost;
      lastYear.cumulativeCashFlow -= financialParams.decommissioningCost;
    }

    return yearlyData;
  }
}
