import { Card } from '@/components/ui/card';
import { Flame } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DecayHeatChartProps {
  decayData: Array<{
    timeAfterShutdown: number;
    decayPower: number;
    percentOfOperating: number;
  }>;
}

export const DecayHeatChart = ({ decayData }: DecayHeatChartProps) => {
  const chartData = decayData.map(d => ({
    time: d.timeAfterShutdown < 24 
      ? `${d.timeAfterShutdown.toFixed(1)}h`
      : `${(d.timeAfterShutdown / 24).toFixed(0)}d`,
    'Decay Power (MW)': d.decayPower.toFixed(2),
    'Percent of Operating': d.percentOfOperating.toFixed(2),
  }));
  
  const initialPower = decayData[0]?.decayPower || 0;
  const finalPower = decayData[decayData.length - 1]?.decayPower || 0;
  
  return (
    <Card className="p-6 gradient-card border-destructive/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-destructive/20 p-2 rounded-lg border border-destructive/30">
          <Flame className="h-5 w-5 text-destructive" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Decay Heat After Shutdown</h3>
          <p className="text-sm text-muted-foreground">Residual Fission Product Energy</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 bg-background/50 rounded-lg border border-destructive/10">
          <div className="text-xs text-muted-foreground">@ 1 hour</div>
          <div className="text-lg font-bold text-destructive">
            {initialPower.toFixed(1)} MW
          </div>
        </div>
        <div className="p-3 bg-background/50 rounded-lg border border-destructive/10">
          <div className="text-xs text-muted-foreground">@ 1 year</div>
          <div className="text-lg font-bold text-destructive">
            {finalPower.toFixed(2)} MW
          </div>
        </div>
        <div className="p-3 bg-background/50 rounded-lg border border-destructive/10">
          <div className="text-xs text-muted-foreground">Decay Rate</div>
          <div className="text-lg font-bold text-destructive">
            ~t⁻⁰·²
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="time" 
            stroke="hsl(var(--muted-foreground))"
            label={{ value: 'Time After Shutdown', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            label={{ value: 'Power (MW)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--background))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="Decay Power (MW)" 
            stroke="hsl(var(--destructive))" 
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--destructive))', r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
        <p className="text-xs text-muted-foreground">
          <strong>Critical:</strong> Decay heat requires continuous cooling even after reactor shutdown. 
          Loss of cooling can lead to fuel damage (see Fukushima 2011).
        </p>
      </div>
    </Card>
  );
};
