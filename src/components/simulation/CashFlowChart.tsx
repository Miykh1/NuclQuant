import { YearlyData } from '@/types/simulation';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface CashFlowChartProps {
  data: YearlyData[];
}

export const CashFlowChart = ({ data }: CashFlowChartProps) => {
  const formatCurrency = (value: number) => `$${(value / 1_000_000).toFixed(0)}M`;

  return (
    <Card className="p-6 gradient-card border-primary/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/20 p-2 rounded-lg border border-primary/30">
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">Cash Flow Analysis</h3>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="year" 
            stroke="hsl(var(--muted-foreground))"
            label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            tickFormatter={formatCurrency}
            label={{ value: 'Amount ($M)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            formatter={(value: number) => formatCurrency(value)}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="hsl(var(--secondary))"
            strokeWidth={2}
            fill="url(#colorRevenue)"
            name="Revenue"
          />
          <Area
            type="monotone"
            dataKey="operatingCost"
            stroke="hsl(var(--destructive))"
            strokeWidth={2}
            fill="url(#colorCost)"
            name="Operating Cost"
          />
          <Line
            type="monotone"
            dataKey="cumulativeCashFlow"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--primary))', r: 4 }}
            name="Cumulative Cash Flow"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};
