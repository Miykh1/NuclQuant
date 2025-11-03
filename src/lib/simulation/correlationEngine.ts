import { MonteCarloResult, SimulationResult } from '@/types/simulation';

export interface CorrelationMetrics {
  nuclearReliabilityIndex: number;
  marketVolatility: number;
  correlationCoefficient: number;
  regressionSlope: number;
  rSquared: number;
  sharpeRatio: number;
  expectedLoss: number;
}

export class CorrelationEngine {
  /**
   * Analyzes correlation between nuclear physics variables and financial metrics
   */
  calculateNuclearFinancialCorrelation(
    monteCarloResult: MonteCarloResult,
    simulationResult: SimulationResult
  ): CorrelationMetrics {
    const scenarios = monteCarloResult.scenarios;
    
    // Extract nuclear reliability metrics
    const reliabilityScores = scenarios.map(s => 
      (1 - s.accidentProbability) * (s.energyProducedMWh / simulationResult.energyProducedMWh)
    );
    
    // Extract financial performance metrics
    const financialScores = scenarios.map(s => s.npv);
    
    // Calculate correlation coefficient
    const correlation = this.pearsonCorrelation(reliabilityScores, financialScores);
    
    // Linear regression
    const regression = this.linearRegression(reliabilityScores, financialScores);
    
    // Market volatility (standard deviation of returns)
    const marketVolatility = this.standardDeviation(financialScores) / this.mean(financialScores);
    
    // Nuclear reliability index (weighted score)
    const nuclearReliabilityIndex = this.mean(reliabilityScores);
    
    // Sharpe ratio (risk-adjusted return)
    const riskFreeRate = 0.03; // 3% annual
    const meanReturn = this.mean(financialScores);
    const stdReturn = this.standardDeviation(financialScores);
    const sharpeRatio = (meanReturn - riskFreeRate) / stdReturn;
    
    // Expected loss (VaR at 95%)
    const sortedNPVs = [...financialScores].sort((a, b) => a - b);
    const expectedLoss = -this.percentile(sortedNPVs, 0.05);
    
    return {
      nuclearReliabilityIndex,
      marketVolatility,
      correlationCoefficient: correlation,
      regressionSlope: regression.slope,
      rSquared: regression.rSquared,
      sharpeRatio,
      expectedLoss,
    };
  }

  private pearsonCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    const meanX = this.mean(x);
    const meanY = this.mean(y);
    
    let numerator = 0;
    let denomX = 0;
    let denomY = 0;
    
    for (let i = 0; i < n; i++) {
      const diffX = x[i] - meanX;
      const diffY = y[i] - meanY;
      numerator += diffX * diffY;
      denomX += diffX * diffX;
      denomY += diffY * diffY;
    }
    
    return numerator / Math.sqrt(denomX * denomY);
  }

  private linearRegression(x: number[], y: number[]): { slope: number; intercept: number; rSquared: number } {
    const n = x.length;
    const meanX = this.mean(x);
    const meanY = this.mean(y);
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      const diffX = x[i] - meanX;
      numerator += diffX * (y[i] - meanY);
      denominator += diffX * diffX;
    }
    
    const slope = numerator / denominator;
    const intercept = meanY - slope * meanX;
    
    // Calculate R²
    const yPredicted = x.map(xi => slope * xi + intercept);
    const ssRes = y.reduce((sum, yi, i) => sum + Math.pow(yi - yPredicted[i], 2), 0);
    const ssTot = y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0);
    const rSquared = 1 - (ssRes / ssTot);
    
    return { slope, intercept, rSquared };
  }

  private mean(values: number[]): number {
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  private standardDeviation(values: number[]): number {
    const avg = this.mean(values);
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    return Math.sqrt(this.mean(squareDiffs));
  }

  private percentile(sortedValues: number[], p: number): number {
    const index = Math.ceil(sortedValues.length * p) - 1;
    return sortedValues[Math.max(0, index)];
  }
}
