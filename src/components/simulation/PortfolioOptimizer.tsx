import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { OptimizedPortfolio } from '@/lib/simulation/portfolioEngine';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { useState } from 'react';

interface PortfolioOptimizerProps {
  portfolio: OptimizedPortfolio;
  onOptimize: (riskTolerance: number, timeHorizon: number) => void;
}

export const PortfolioOptimizer = ({ portfolio, onOptimize }: PortfolioOptimizerProps) => {
  const [riskTolerance, setRiskTolerance] = useState(0.5);
  const [timeHorizon, setTimeHorizon] = useState(40);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  const allocationData = portfolio.allocations
    .filter(a => a.weight > 0.01)
    .map(a => ({
      name: a.isotope,
      value: a.weight * 100,
      return: a.expectedReturn,
      risk: a.expectedRisk,
    }));

  const decayData = portfolio.decayAdjustedReturn.map((value, year) => ({
    year,
    yield: value / 1000, // Scale to thousands
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Risk-Adjusted Decay Portfolio Optimizer
          </CardTitle>
          <CardDescription>
            Optimize isotope portfolio using mean-variance analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Risk Tolerance: {(riskTolerance * 100).toFixed(0)}%
              </label>
              <Slider
                value={[riskTolerance * 100]}
                onValueChange={(v) => setRiskTolerance(v[0] / 100)}
                max={100}
                step={5}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Time Horizon: {timeHorizon} years
              </label>
              <Slider
                value={[timeHorizon]}
                onValueChange={(v) => setTimeHorizon(v[0])}
                min={10}
                max={60}
                step={5}
              />
            </div>
          </div>

          <Button onClick={() => onOptimize(riskTolerance, timeHorizon)} className="w-full shadow-glow">
            <TrendingUp className="mr-2 h-4 w-4" />
            Optimize Portfolio
          </Button>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-secondary/10 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Expected Return</div>
              <div className="text-2xl font-bold text-green-500">
                {(portfolio.expectedTotalReturn * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-secondary/10 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Portfolio Risk</div>
              <div className="text-2xl font-bold text-orange-500">
                {(portfolio.expectedTotalRisk * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-secondary/10 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
              <div className="text-2xl font-bold">
                {portfolio.sharpeRatio.toFixed(2)}
              </div>
            </div>
            <div className="bg-secondary/10 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Efficiency Score</div>
              <div className="text-2xl font-bold">
                {portfolio.efficiencyScore.toFixed(2)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Allocation</CardTitle>
            <CardDescription>Optimal isotope distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                  outerRadius={100}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-4 space-y-2">
              {portfolio.allocations
                .filter(a => a.weight > 0.01)
                .map((alloc, idx) => (
                  <div key={alloc.isotope} className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      {alloc.isotope}
                    </span>
                    <span className="font-medium">
                      {(alloc.weight * 100).toFixed(1)}% | Return: {(alloc.expectedReturn * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Decay-Adjusted Energy Yield</CardTitle>
            <CardDescription>Energy output over time accounting for radioactive decay</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={decayData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="year" 
                  label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  label={{ value: 'Energy Yield (GWh)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="yield" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Total Yield"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
