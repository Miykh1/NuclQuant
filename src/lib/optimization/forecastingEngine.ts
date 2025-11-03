// Forecasting and Statistical Analysis for Data Scientists and Quant Researchers

export interface ForecastResult {
  predictions: number[];
  confidence: { lower: number[]; upper: number[] };
  mape: number; // Mean Absolute Percentage Error
  rmse: number; // Root Mean Square Error
  r2: number; // R-squared
  method: string;
}

export class ForecastingEngine {
  /**
   * Simple Moving Average (SMA)
   */
  movingAverage(data: number[], window: number): number[] {
    const result: number[] = [];
    for (let i = 0; i < data.length; i++) {
      if (i < window - 1) {
        result.push(data[i]);
      } else {
        const sum = data.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0);
        result.push(sum / window);
      }
    }
    return result;
  }

  /**
   * Exponential Moving Average (EMA)
   */
  exponentialMovingAverage(data: number[], alpha: number = 0.3): number[] {
    const result: number[] = [data[0]];
    for (let i = 1; i < data.length; i++) {
      result.push(alpha * data[i] + (1 - alpha) * result[i - 1]);
    }
    return result;
  }

  /**
   * Linear Regression Forecast
   */
  linearRegression(data: number[], forecastPeriods: number = 10): ForecastResult {
    const n = data.length;
    const x = Array.from({ length: n }, (_, i) => i);
    
    // Calculate slope and intercept
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = data.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * data[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Generate predictions
    const predictions: number[] = [];
    for (let i = n; i < n + forecastPeriods; i++) {
      predictions.push(slope * i + intercept);
    }

    // Calculate error metrics
    const fitted = x.map(xi => slope * xi + intercept);
    const errors = data.map((yi, i) => yi - fitted[i]);
    const mse = errors.reduce((sum, e) => sum + e * e, 0) / n;
    const rmse = Math.sqrt(mse);
    
    const meanY = sumY / n;
    const ssTot = data.reduce((sum, yi) => sum + (yi - meanY) ** 2, 0);
    const ssRes = errors.reduce((sum, e) => sum + e * e, 0);
    const r2 = 1 - ssRes / ssTot;

    const mape = errors.reduce((sum, e, i) => sum + Math.abs(e / data[i]), 0) / n * 100;

    // Simple confidence intervals (95%)
    const stdError = Math.sqrt(mse);
    const confidenceMultiplier = 1.96; // for 95% confidence
    
    const confidence = {
      lower: predictions.map(p => p - confidenceMultiplier * stdError),
      upper: predictions.map(p => p + confidenceMultiplier * stdError),
    };

    return {
      predictions,
      confidence,
      mape,
      rmse,
      r2,
      method: 'Linear Regression',
    };
  }

  /**
   * Holt-Winters Seasonal Forecast (Simplified)
   */
  holtWinters(
    data: number[],
    alpha: number = 0.3,
    beta: number = 0.1,
    gamma: number = 0.1,
    seasonLength: number = 12,
    forecastPeriods: number = 10
  ): ForecastResult {
    const n = data.length;
    
    // Initialize level, trend, and seasonal components
    let level = data[0];
    let trend = 0;
    const seasonal = new Array(seasonLength).fill(0);

    // Initialize seasonal indices
    for (let i = 0; i < seasonLength && i < n; i++) {
      seasonal[i] = data[i] / level;
    }

    const fitted: number[] = [];

    // Update components
    for (let i = 0; i < n; i++) {
      const seasonalIndex = seasonal[i % seasonLength];
      const prevLevel = level;
      
      level = alpha * (data[i] / seasonalIndex) + (1 - alpha) * (level + trend);
      trend = beta * (level - prevLevel) + (1 - beta) * trend;
      seasonal[i % seasonLength] = gamma * (data[i] / level) + (1 - gamma) * seasonalIndex;
      
      fitted.push((level + trend) * seasonal[i % seasonLength]);
    }

    // Generate forecasts
    const predictions: number[] = [];
    for (let i = 0; i < forecastPeriods; i++) {
      const forecast = (level + (i + 1) * trend) * seasonal[i % seasonLength];
      predictions.push(forecast);
    }

    // Calculate error metrics
    const errors = data.map((yi, i) => yi - fitted[i]);
    const mse = errors.reduce((sum, e) => sum + e * e, 0) / n;
    const rmse = Math.sqrt(mse);
    
    const meanY = data.reduce((a, b) => a + b, 0) / n;
    const ssTot = data.reduce((sum, yi) => sum + (yi - meanY) ** 2, 0);
    const ssRes = errors.reduce((sum, e) => sum + e * e, 0);
    const r2 = 1 - ssRes / ssTot;

    const mape = errors.reduce((sum, e, i) => sum + Math.abs(e / data[i]), 0) / n * 100;

    const stdError = Math.sqrt(mse);
    const confidenceMultiplier = 1.96;
    
    const confidence = {
      lower: predictions.map(p => p - confidenceMultiplier * stdError),
      upper: predictions.map(p => p + confidenceMultiplier * stdError),
    };

    return {
      predictions,
      confidence,
      mape,
      rmse,
      r2,
      method: 'Holt-Winters',
    };
  }

  /**
   * Monte Carlo Simulation for Uncertainty Quantification
   */
  monteCarloForecast(
    baseValue: number,
    volatility: number,
    drift: number = 0,
    periods: number = 100,
    simulations: number = 1000
  ): {
    paths: number[][];
    percentiles: { p5: number[]; p50: number[]; p95: number[] };
    mean: number[];
    stdDev: number[];
  } {
    const paths: number[][] = [];
    
    for (let sim = 0; sim < simulations; sim++) {
      const path: number[] = [baseValue];
      for (let t = 1; t < periods; t++) {
        const random = this.randomNormal(0, 1);
        const change = drift + volatility * random;
        path.push(path[t - 1] * (1 + change));
      }
      paths.push(path);
    }

    // Calculate statistics across simulations
    const mean: number[] = [];
    const stdDev: number[] = [];
    const p5: number[] = [];
    const p50: number[] = [];
    const p95: number[] = [];

    for (let t = 0; t < periods; t++) {
      const values = paths.map(path => path[t]).sort((a, b) => a - b);
      mean.push(values.reduce((a, b) => a + b, 0) / simulations);
      
      const variance = values.reduce((sum, v) => sum + (v - mean[t]) ** 2, 0) / simulations;
      stdDev.push(Math.sqrt(variance));
      
      p5.push(values[Math.floor(simulations * 0.05)]);
      p50.push(values[Math.floor(simulations * 0.50)]);
      p95.push(values[Math.floor(simulations * 0.95)]);
    }

    return {
      paths: paths.slice(0, 50), // Return first 50 paths for visualization
      percentiles: { p5, p50, p95 },
      mean,
      stdDev,
    };
  }

  /**
   * Box-Muller transform for generating normal random variables
   */
  private randomNormal(mean: number, stdDev: number): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0 * stdDev + mean;
  }

  /**
   * Calculate autocorrelation for time series analysis
   */
  autocorrelation(data: number[], lag: number): number {
    const n = data.length;
    const mean = data.reduce((a, b) => a + b, 0) / n;
    
    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n - lag; i++) {
      numerator += (data[i] - mean) * (data[i + lag] - mean);
    }

    for (let i = 0; i < n; i++) {
      denominator += (data[i] - mean) ** 2;
    }

    return numerator / denominator;
  }

  /**
   * Detect seasonality in time series
   */
  detectSeasonality(data: number[], maxPeriod: number = 24): {
    hasSeason: boolean;
    period: number;
    strength: number;
  } {
    let maxCorr = 0;
    let bestPeriod = 0;

    for (let period = 2; period <= Math.min(maxPeriod, Math.floor(data.length / 2)); period++) {
      const corr = Math.abs(this.autocorrelation(data, period));
      if (corr > maxCorr) {
        maxCorr = corr;
        bestPeriod = period;
      }
    }

    return {
      hasSeason: maxCorr > 0.5,
      period: bestPeriod,
      strength: maxCorr,
    };
  }
}
