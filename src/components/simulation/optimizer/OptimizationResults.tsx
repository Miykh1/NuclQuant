import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OptimizationSolution, OptimizationConfig } from '@/lib/optimization/optimizationEngine';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingDown, Zap, Leaf, AlertTriangle } from 'lucide-react';

interface OptimizationResultsProps {
  solution: OptimizationSolution;
  config: OptimizationConfig;
}

export const OptimizationResults = ({ solution, config }: OptimizationResultsProps) => {
  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

  const costBreakdown = Array.from(solution.nodeFlows.entries()).map(([nodeId, flow]) => {
    const node = config.nodes.find(n => n.id === nodeId);
    return {
      name: node?.name || nodeId,
      cost: node ? node.cost * flow : 0,
      flow,
    };
  });

  const utilizationData = config.nodes.map(node => ({
    name: node.name,
    utilization: solution.nodeLoads.get(node.id) || 0,
    capacity: node.capacity.max,
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Optimization Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-green-500" />
                <div className="text-xs text-muted-foreground">Total Cost</div>
              </div>
              <div className="text-2xl font-bold text-green-500">
                ${solution.totalCost.toLocaleString()}
              </div>
            </div>

            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-blue-500" />
                <div className="text-xs text-muted-foreground">Total Energy</div>
              </div>
              <div className="text-2xl font-bold text-blue-500">
                {solution.totalEnergy.toLocaleString()} kWh
              </div>
            </div>

            <div className="p-4 bg-green-600/10 rounded-lg border border-green-600/20">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="h-4 w-4 text-green-600" />
                <div className="text-xs text-muted-foreground">CO₂ Emissions</div>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {solution.totalCO2.toFixed(1)} kg
              </div>
            </div>

            <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-xs text-muted-foreground">Throughput</div>
              </div>
              <div className="text-2xl font-bold text-purple-500">
                {solution.totalThroughput.toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cost Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="hsl(var(--primary))"
                  dataKey="cost"
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Node Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={utilizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))' 
                  }}
                />
                <Legend />
                <Bar dataKey="utilization" fill="hsl(var(--primary))" name="Utilization %" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {solution.bottlenecks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Bottlenecks & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {solution.bottlenecks.slice(0, 5).map((bottleneck, idx) => (
                <div key={idx} className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-orange-500">{bottleneck.id}</span>
                    <span className="text-sm text-muted-foreground">
                      {bottleneck.unused.toFixed(0)}% unused
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{bottleneck.recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {solution.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {solution.recommendations.map((rec, idx) => (
                <div key={idx} className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm">{rec}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

