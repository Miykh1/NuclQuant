import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { YearlyData } from '@/types/simulation';
import { Thermometer } from 'lucide-react';

interface ThermalChartProps {
  data: YearlyData[];
}

export const ThermalChart = ({ data }: ThermalChartProps) => {
  return (
    <Card className="p-6 gradient-card border-primary/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-accent/20 p-2 rounded-lg border border-accent/30">
          <Thermometer className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Thermal-Hydraulic Behavior</h3>
          <p className="text-sm text-muted-foreground">Temperature and Reactivity Over Time</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
          <XAxis 
            dataKey="year" 
            stroke="hsl(var(--foreground) / 0.5)"
            label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            stroke="hsl(var(--foreground) / 0.5)"
            label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--primary) / 0.2)',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="fuelTemperature" 
            stroke="hsl(var(--destructive))" 
            name="Fuel Temperature (°C)"
            strokeWidth={2}
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="coolantTemperature" 
            stroke="hsl(var(--primary))" 
            name="Coolant Temperature (°C)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
          <div className="text-xs text-muted-foreground">Peak Fuel Temp</div>
          <div className="text-xl font-bold text-destructive">
            {Math.max(...data.map(d => d.fuelTemperature)).toFixed(0)}°C
          </div>
        </div>
        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
          <div className="text-xs text-muted-foreground">Avg Coolant Temp</div>
          <div className="text-xl font-bold text-primary">
            {(data.reduce((sum, d) => sum + d.coolantTemperature, 0) / data.length).toFixed(0)}°C
          </div>
        </div>
      </div>
    </Card>
  );
};
