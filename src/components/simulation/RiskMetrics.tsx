import { Card } from '@/components/ui/card';
import { MonteCarloResult } from '@/types/simulation';
import { TrendingDown, TrendingUp, AlertCircle, Target } from 'lucide-react';

interface RiskMetricsProps {
  result: MonteCarloResult;
}

export const RiskMetrics = ({ result }: RiskMetricsProps) => {
  // Calculate VaR and CVaR
  const scenarios = result.scenarios.map(s => s.npv).sort((a, b) => a - b);
  const var95 = result.percentile5;
  const var5 = result.percentile95;
  
  // CVaR (Conditional VaR) - average of worst 5%
  const worst5Percent = scenarios.slice(0, Math.floor(scenarios.length * 0.05));
  const cvar = worst5Percent.reduce((a, b) => a + b, 0) / worst5Percent.length;

  // Expected loss (negative NPVs)
  const losses = scenarios.filter(npv => npv < 0);
  const expectedLoss = losses.length > 0 
    ? losses.reduce((a, b) => a + b, 0) / losses.length 
    : 0;

  return (
    <Card className="p-6 gradient-card border-primary/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-destructive/20 p-2 rounded-lg border border-destructive/30">
          <AlertCircle className="h-5 w-5 text-destructive" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Advanced Risk Metrics</h3>
          <p className="text-sm text-muted-foreground">VaR, CVaR, and Loss Analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-destructive" />
            <span className="text-xs font-semibold text-destructive">Value at Risk (95%)</span>
          </div>
          <div className="text-2xl font-bold text-destructive">
            ${(var95 / 1_000_000).toFixed(1)}M
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            5% chance NPV below this
          </div>
        </div>

        <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-xs font-semibold text-destructive">CVaR (Tail Risk)</span>
          </div>
          <div className="text-2xl font-bold text-destructive">
            ${(cvar / 1_000_000).toFixed(1)}M
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Average of worst 5% scenarios
          </div>
        </div>

        <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent">Expected Loss</span>
          </div>
          <div className="text-2xl font-bold text-accent">
            ${(expectedLoss / 1_000_000).toFixed(1)}M
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Average of unprofitable scenarios
          </div>
        </div>

        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-primary">Upside Potential (95%)</span>
          </div>
          <div className="text-2xl font-bold text-primary">
            ${(var5 / 1_000_000).toFixed(1)}M
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            5% chance NPV above this
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-background/50 rounded-lg border border-primary/20">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Profit Probability</span>
          <span className="text-lg font-bold text-primary">{(result.probabilityProfit * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-background h-2 rounded-full mt-2 overflow-hidden">
          <div 
            className="bg-primary h-full transition-smooth"
            style={{ width: `${result.probabilityProfit * 100}%` }}
          />
        </div>
      </div>
    </Card>
  );
};
