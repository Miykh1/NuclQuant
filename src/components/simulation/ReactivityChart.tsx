import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { YearlyData } from '@/types/simulation';
import { Activity } from 'lucide-react';

interface ReactivityChartProps {
  data: YearlyData[];
}

export const ReactivityChart = ({ data }: ReactivityChartProps) => {
  return (
    <Card className="p-6 gradient-card border-primary/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-secondary/20 p-2 rounded-lg border border-secondary/30">
          <Activity className="h-5 w-5 text-secondary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Reactivity & k-eff Over Time</h3>
          <p className="text-sm text-muted-foreground">Effective Multiplication Factor</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
          <XAxis 
            dataKey="year" 
            stroke="hsl(var(--foreground) / 0.5)"
            label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            stroke="hsl(var(--foreground) / 0.5)"
            domain={[0.85, 1.15]}
            label={{ value: 'k-eff', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--primary) / 0.2)',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <ReferenceLine 
            y={1.0} 
            stroke="hsl(var(--accent))" 
            strokeDasharray="5 5" 
            label="Critical"
          />
          <Line 
            type="monotone" 
            dataKey="reactivity" 
            stroke="hsl(var(--secondary))" 
            name="k-eff (Reactivity)"
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--secondary))', r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
        <div className="text-xs text-muted-foreground mb-1">Reactor Status</div>
        <div className="text-lg font-bold text-accent">
          {data[0]?.reactivity > 1.0 ? 'Supercritical' : data[0]?.reactivity < 1.0 ? 'Subcritical' : 'Critical'}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Initial k-eff: {data[0]?.reactivity.toFixed(4)}
        </div>
      </div>
    </Card>
  );
};
