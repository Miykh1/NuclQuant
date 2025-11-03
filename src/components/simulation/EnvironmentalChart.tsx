import { YearlyData } from '@/types/simulation';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Leaf } from 'lucide-react';

interface EnvironmentalChartProps {
  data: YearlyData[];
}

export const EnvironmentalChart = ({ data }: EnvironmentalChartProps) => {
  return (
    <Card className="p-6 gradient-card border-secondary/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-secondary/20 p-2 rounded-lg border border-secondary/30">
          <Leaf className="h-5 w-5 text-secondary" />
        </div>
        <h3 className="text-xl font-semibold">Environmental Impact</h3>
      </div>
      
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="year" 
            stroke="hsl(var(--muted-foreground))"
            label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            yAxisId="left"
            stroke="hsl(var(--secondary))"
            label={{ value: 'CO₂ Avoided (tons)', angle: -90, position: 'insideLeft' }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="hsl(var(--accent))"
            label={{ value: 'Waste Produced (tons)', angle: 90, position: 'insideRight' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            formatter={(value: number) => value.toFixed(2)}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="co2Avoided"
            stroke="hsl(var(--secondary))"
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--secondary))', r: 4 }}
            name="CO₂ Avoided (tons)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="wasteProduced"
            stroke="hsl(var(--accent))"
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--accent))', r: 4 }}
            name="Nuclear Waste (tons)"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
