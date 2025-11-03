import { Card } from '@/components/ui/card';
import { Atom } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface FissionProductsChartProps {
  fissionData?: Array<{
    isotope: string;
    concentration: number;
    activity: number;
    doseRate: number;
  }>;
  productsData?: Array<{
    isotope: string;
    concentration: number;
    activity: number;
    doseRate: number;
  }>;
}

export const FissionProductsChart = ({ fissionData, productsData }: FissionProductsChartProps) => {
  const data = fissionData || productsData || [];
  const chartData = data.map(d => ({
    isotope: d.isotope,
    'Activity (TBq)': (d.activity / 1e12).toFixed(2),
    'Dose Rate (mSv/hr)': d.doseRate.toFixed(2),
  }));
  
  const totalActivity = data.reduce((sum, d) => sum + d.activity, 0);
  const maxDoseRate = Math.max(...data.map(d => d.doseRate));
  
  return (
    <Card className="p-6 gradient-card border-primary/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-purple-500/20 p-2 rounded-lg border border-purple-500/30">
          <Atom className="h-5 w-5 text-purple-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Fission Product Inventory</h3>
          <p className="text-sm text-muted-foreground">Key Radioisotopes at End of Life</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-background/50 rounded-lg border border-purple-500/10">
          <div className="text-xs text-muted-foreground">Total Activity</div>
          <div className="text-lg font-bold text-purple-500">
            {(totalActivity / 1e15).toFixed(1)} PBq
          </div>
        </div>
        <div className="p-3 bg-background/50 rounded-lg border border-purple-500/10">
          <div className="text-xs text-muted-foreground">Max Dose Rate</div>
          <div className="text-lg font-bold text-purple-500">
            {maxDoseRate.toFixed(1)} mSv/hr
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="isotope" 
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            label={{ value: 'Activity (TBq)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--background))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Bar 
            dataKey="Activity (TBq)" 
            fill="hsl(var(--chart-3))"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      
      <div className="mt-4 space-y-2">
        {data.map((product) => (
          <div key={product.isotope} className="p-2 bg-background/30 rounded border border-purple-500/10">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-purple-500">{product.isotope}</span>
              <div className="text-xs text-muted-foreground">
                {(product.activity / 1e12).toFixed(1)} TBq | {product.doseRate.toFixed(2)} mSv/hr
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
        <p className="text-xs text-muted-foreground">
          <strong>Note:</strong> Xe-135 is a neutron poison that can prevent reactor restart. 
          Cs-137 and Sr-90 are long-lived hazards requiring geological storage.
        </p>
      </div>
    </Card>
  );
};
