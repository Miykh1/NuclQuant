import { Card } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useMemo } from 'react';

interface PowerDistributionChartProps {
  powerData: Array<{
    radialPosition: number;
    axialPosition: number;
    powerDensity: number;
    peakingFactor: number;
  }>;
}

export const PowerDistributionChart = ({ powerData }: PowerDistributionChartProps) => {
  const chartData = useMemo(() => {
    // Get axial profile at core centerline (r ≈ 0)
    const centerlineData = powerData
      .filter(d => d.radialPosition < 0.1)
      .sort((a, b) => a.axialPosition - b.axialPosition)
      .map(d => ({
        position: (d.axialPosition * 100).toFixed(0),
        'Power Density': d.powerDensity.toFixed(2),
        'Peaking Factor': d.peakingFactor.toFixed(2),
      }));
    
    return centerlineData;
  }, [powerData]);
  
  const maxPeakingFactor = Math.max(...powerData.map(d => d.peakingFactor));
  const avgPowerDensity = powerData.reduce((sum, d) => sum + d.powerDensity, 0) / powerData.length;
  
  return (
    <Card className="p-6 gradient-card border-primary/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-amber-500/20 p-2 rounded-lg border border-amber-500/30">
          <Zap className="h-5 w-5 text-amber-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Power Distribution</h3>
          <p className="text-sm text-muted-foreground">Axial Profile at Core Centerline</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-background/50 rounded-lg border border-amber-500/10">
          <div className="text-xs text-muted-foreground">Avg Power Density</div>
          <div className="text-lg font-bold text-amber-500">
            {avgPowerDensity.toFixed(1)} MW/m³
          </div>
        </div>
        <div className="p-3 bg-background/50 rounded-lg border border-amber-500/10">
          <div className="text-xs text-muted-foreground">Max Peaking Factor</div>
          <div className="text-lg font-bold text-amber-500">
            {maxPeakingFactor.toFixed(2)}
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="position" 
            stroke="hsl(var(--muted-foreground))"
            label={{ value: 'Axial Position (%)', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            label={{ value: 'Power Density (MW/m³)', angle: -90, position: 'insideLeft' }}
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
            dataKey="Power Density" 
            stroke="hsl(var(--chart-1))" 
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--chart-1))', r: 3 }}
          />
          <Line 
            type="monotone" 
            dataKey="Peaking Factor" 
            stroke="hsl(var(--chart-2))" 
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--chart-2))', r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
        <p className="text-xs text-muted-foreground">
          <strong>Note:</strong> Peaking factor &gt;1.5 may require enhanced cooling. 
          Typical PWR limit: 2.5. Current max: {maxPeakingFactor.toFixed(2)}.
        </p>
      </div>
    </Card>
  );
};
