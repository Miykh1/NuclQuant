import { NUCLEAR_CONSTANTS, FISSION_PRODUCTS } from '@/constants/nuclearConstants';

export interface IsotopeAsset {
  isotope: string;
  halfLife: number; // years
  decayConstant: number; // per year
  energyYield: number; // MWh per kg
  cost: number; // $ per kg
  riskLevel: number; // 0-1
}

export interface PortfolioAllocation {
  isotope: string;
  weight: number; // 0-1
  expectedReturn: number;
  expectedRisk: number;
}

export interface OptimizedPortfolio {
  allocations: PortfolioAllocation[];
  expectedTotalReturn: number;
  expectedTotalRisk: number;
  sharpeRatio: number;
  efficiencyScore: number;
  timeHorizon: number; // years
  decayAdjustedReturn: number[];
}

export class PortfolioEngine {
  private isotopeAssets: IsotopeAsset[] = [
    {
      isotope: 'U-235',
      halfLife: 703800000,
      decayConstant: Math.log(2) / 703800000,
      energyYield: 83000,
      cost: 5000,
      riskLevel: 0.3,
    },
    {
      isotope: 'Pu-239',
      halfLife: 24110,
      decayConstant: Math.log(2) / 24110,
      energyYield: 88000,
      cost: 8000,
      riskLevel: 0.6,
    },
    {
      isotope: 'Th-232',
      halfLife: 14050000000,
      decayConstant: Math.log(2) / 14050000000,
      energyYield: 45000,
      cost: 2000,
      riskLevel: 0.2,
    },
    {
      isotope: 'U-233',
      halfLife: 159200,
      decayConstant: Math.log(2) / 159200,
      energyYield: 87000,
      cost: 9000,
      riskLevel: 0.5,
    },
  ];

  /**
   * Markowitz mean-variance optimization for isotope portfolio
   */
  optimizePortfolio(
    targetReturn?: number,
    timeHorizon: number = 40,
    riskTolerance: number = 0.5
  ): OptimizedPortfolio {
    const n = this.isotopeAssets.length;
    
    // Calculate expected returns and risks
    const returns = this.isotopeAssets.map(asset => 
      this.calculateExpectedReturn(asset, timeHorizon)
    );
    
    const risks = this.isotopeAssets.map(asset => asset.riskLevel);
    
    // Build covariance matrix (simplified)
    const covMatrix = this.buildCovarianceMatrix(risks);
    
    // Optimize using quadratic programming (simplified)
    const weights = this.meanVarianceOptimization(
      returns,
      risks,
      covMatrix,
      targetReturn,
      riskTolerance
    );
    
    // Calculate portfolio metrics
    const portfolioReturn = this.dotProduct(weights, returns);
    const portfolioRisk = Math.sqrt(
      weights.reduce((sum, w, i) => 
        sum + w * w * risks[i] * risks[i], 0
      )
    );
    
    const riskFreeRate = 0.03;
    const sharpeRatio = (portfolioReturn - riskFreeRate) / portfolioRisk;
    
    // Calculate decay-adjusted returns over time
    const decayAdjustedReturn = this.calculateDecayProfile(weights, timeHorizon);
    
    const allocations: PortfolioAllocation[] = this.isotopeAssets.map((asset, i) => ({
      isotope: asset.isotope,
      weight: weights[i],
      expectedReturn: returns[i],
      expectedRisk: risks[i],
    }));
    
    return {
      allocations,
      expectedTotalReturn: portfolioReturn,
      expectedTotalRisk: portfolioRisk,
      sharpeRatio,
      efficiencyScore: sharpeRatio / (portfolioRisk + 0.01),
      timeHorizon,
      decayAdjustedReturn,
    };
  }

  private calculateExpectedReturn(asset: IsotopeAsset, years: number): number {
    // Energy yield adjusted for decay over time
    const decayFactor = Math.exp(-asset.decayConstant * years);
    const effectiveYield = asset.energyYield * decayFactor;
    const energyPrice = 75; // $/MWh
    const revenue = effectiveYield * energyPrice;
    return (revenue - asset.cost) / asset.cost; // ROI
  }

  private buildCovarianceMatrix(risks: number[]): number[][] {
    const n = risks.length;
    const cov: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) {
          cov[i][j] = risks[i] * risks[i];
        } else {
          // Assume some correlation between isotopes
          const correlation = 0.3;
          cov[i][j] = correlation * risks[i] * risks[j];
        }
      }
    }
    
    return cov;
  }

  private meanVarianceOptimization(
    returns: number[],
    risks: number[],
    covMatrix: number[][],
    targetReturn?: number,
    riskTolerance: number = 0.5
  ): number[] {
    const n = returns.length;
    
    // Simplified optimization using risk parity with adjustments
    let weights = new Array(n).fill(1 / n);
    
    // Iterative adjustment based on risk-return tradeoff
    for (let iter = 0; iter < 100; iter++) {
      const newWeights = weights.map((w, i) => {
        const returnScore = returns[i] / this.mean(returns);
        const riskScore = risks[i] / this.mean(risks);
        const adjustment = returnScore / (riskScore + 0.01);
        return w * (1 + 0.05 * (adjustment - 1));
      });
      
      // Normalize
      const sum = newWeights.reduce((a, b) => a + b, 0);
      weights = newWeights.map(w => w / sum);
      
      // Apply risk tolerance
      weights = weights.map((w, i) => {
        const riskAdjustment = 1 - risks[i] * (1 - riskTolerance);
        return w * riskAdjustment;
      });
      
      // Normalize again
      const sum2 = weights.reduce((a, b) => a + b, 0);
      weights = weights.map(w => w / sum2);
    }
    
    return weights;
  }

  private calculateDecayProfile(weights: number[], years: number): number[] {
    const profile: number[] = [];
    
    for (let year = 0; year <= years; year++) {
      let totalReturn = 0;
      
      for (let i = 0; i < this.isotopeAssets.length; i++) {
        const asset = this.isotopeAssets[i];
        const weight = weights[i];
        const decayFactor = Math.exp(-asset.decayConstant * year);
        const yieldAtYear = asset.energyYield * decayFactor * weight;
        totalReturn += yieldAtYear;
      }
      
      profile.push(totalReturn);
    }
    
    return profile;
  }

  private dotProduct(a: number[], b: number[]): number {
    return a.reduce((sum, val, i) => sum + val * b[i], 0);
  }

  private mean(values: number[]): number {
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  getIsotopeAssets(): IsotopeAsset[] {
    return this.isotopeAssets;
  }
}
