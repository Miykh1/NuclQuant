import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { CorrelationMetrics } from '@/lib/simulation/correlationEngine';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface CorrelationAnalysisProps {
  metrics: CorrelationMetrics;
}

export const CorrelationAnalysis = ({ metrics }: CorrelationAnalysisProps) => {
  const correlationData = [
    { name: 'Correlation Coefficient', value: metrics.correlationCoefficient },
    { name: 'R²', value: metrics.rSquared },
    { name: 'Sharpe Ratio', value: metrics.sharpeRatio / 10 }, // Scaled for visualization
  ];

  const reliabilityData = [
    { metric: 'Nuclear Reliability', value: metrics.nuclearReliabilityIndex * 100 },
    { metric: 'Market Volatility', value: metrics.marketVolatility * 100 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Nuclear-Financial Correlation
          </CardTitle>
          <CardDescription>
            Relationship between reactor reliability and financial performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/10 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Correlation</div>
                <div className="text-2xl font-bold flex items-center gap-2">
                  {metrics.correlationCoefficient > 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                  {metrics.correlationCoefficient.toFixed(3)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.abs(metrics.correlationCoefficient) > 0.7 ? 'Strong' : 
                   Math.abs(metrics.correlationCoefficient) > 0.4 ? 'Moderate' : 'Weak'}
                </div>
              </div>
              
              <div className="bg-secondary/10 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">R² Score</div>
                <div className="text-2xl font-bold">
                  {(metrics.rSquared * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Model fit quality
                </div>
              </div>

              <div className="bg-secondary/10 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                <div className="text-2xl font-bold">
                  {metrics.sharpeRatio.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Risk-adjusted return
                </div>
              </div>

              <div className="bg-secondary/10 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Expected Loss</div>
                <div className="text-2xl font-bold text-destructive">
                  ${(metrics.expectedLoss / 1_000_000).toFixed(1)}M
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  VaR at 95%
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={correlationData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reliability vs. Volatility Index</CardTitle>
          <CardDescription>
            Nuclear reliability index and market volatility comparison
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reliabilityData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="metric" />
              <YAxis label={{ value: 'Index Value (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="hsl(var(--secondary))" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm">
              <strong>Regression Analysis:</strong> For every 1% increase in nuclear reliability,
              NPV changes by ${(metrics.regressionSlope / 1_000_000).toFixed(2)}M
              (R² = {(metrics.rSquared * 100).toFixed(1)}%)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
