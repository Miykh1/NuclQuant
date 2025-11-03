import { MonteCarloResult } from '@/types/simulation';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Target } from 'lucide-react';
import { useMemo } from 'react';

interface MonteCarloChartProps {
  result: MonteCarloResult;
}

export const MonteCarloChart = ({ result }: MonteCarloChartProps) => {
  const formatCurrency = (value: number) => `$${(value / 1_000_000).toFixed(0)}M`;

  const distributionData = useMemo(() => {
    const npvValues = result.scenarios.map(s => s.npv).sort((a, b) => a - b);
    const bins = 30;
    const min = Math.min(...npvValues);
    const max = Math.max(...npvValues);
    const binSize = (max - min) / bins;

    const histogram: { range: string; count: number; npv: number }[] = [];
    
    for (let i = 0; i < bins; i++) {
      const binStart = min + i * binSize;
      const binEnd = binStart + binSize;
      const count = npvValues.filter(v => v >= binStart && v < binEnd).length;
      
      histogram.push({
        range: formatCurrency(binStart),
        count,
        npv: binStart,
      });
    }

    return histogram;
  }, [result]);

  return (
    <Card className="p-6 gradient-card border-primary/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary/20 p-2 rounded-lg border border-primary/30">
          <Target className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Monte Carlo Analysis</h3>
          <p className="text-sm text-muted-foreground">NPV Distribution ({result.scenarios.length} scenarios)</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-background/30 border border-border">
          <p className="text-xs text-muted-foreground">Mean NPV</p>
          <p className="text-lg font-bold text-primary">{formatCurrency(result.meanNPV)}</p>
        </div>
        <div className="p-4 rounded-lg bg-background/30 border border-border">
          <p className="text-xs text-muted-foreground">Median NPV</p>
          <p className="text-lg font-bold text-secondary">{formatCurrency(result.medianNPV)}</p>
        </div>
        <div className="p-4 rounded-lg bg-background/30 border border-border">
          <p className="text-xs text-muted-foreground">Std Deviation</p>
          <p className="text-lg font-bold text-accent">{formatCurrency(result.stdDevNPV)}</p>
        </div>
        <div className="p-4 rounded-lg bg-background/30 border border-border">
          <p className="text-xs text-muted-foreground">Profit Probability</p>
          <p className="text-lg font-bold text-secondary">{(result.probabilityProfit * 100).toFixed(1)}%</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={distributionData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="range" 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 10 }}
            interval="preserveStartEnd"
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            labelFormatter={(value) => `NPV: ${value}`}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {distributionData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.npv >= 0 ? 'hsl(var(--secondary))' : 'hsl(var(--destructive))'}
                opacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 p-4 rounded-lg bg-background/30 border border-border">
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-muted-foreground">5th Percentile: </span>
            <span className="font-mono text-destructive">{formatCurrency(result.percentile5)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">95th Percentile: </span>
            <span className="font-mono text-secondary">{formatCurrency(result.percentile95)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
