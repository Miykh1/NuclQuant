import { Card } from '@/components/ui/card';
import { OptimizationNode, OptimizationEdge, OptimizationSolution } from '@/lib/optimization/optimizationEngine';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Cell } from 'recharts';

interface SystemGraphViewProps {
  nodes: OptimizationNode[];
  edges: OptimizationEdge[];
  solution: OptimizationSolution | null;
}

export const SystemGraphView = ({ nodes, edges, solution }: SystemGraphViewProps) => {
  const getNodeColor = (node: OptimizationNode) => {
    if (!solution) return 'hsl(var(--primary))';
    
    const load = solution.nodeLoads.get(node.id) || 0;
    if (load > 80) return 'hsl(var(--destructive))';
    if (load > 50) return 'hsl(var(--warning))';
    return 'hsl(var(--success))';
  };

  const nodeData = nodes.map(node => ({
    x: node.position?.x || Math.random() * 400,
    y: node.position?.y || Math.random() * 300,
    z: solution ? (solution.nodeLoads.get(node.id) || 0) : 50,
    name: node.name,
    type: node.type,
    color: getNodeColor(node),
    load: solution ? (solution.nodeLoads.get(node.id) || 0) : 0,
  }));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">System Network Visualization</h3>
      
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            type="number" 
            dataKey="x" 
            name="Position X" 
            stroke="hsl(var(--muted-foreground))"
            domain={[0, 500]}
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name="Position Y" 
            stroke="hsl(var(--muted-foreground))"
            domain={[0, 400]}
          />
          <ZAxis type="number" dataKey="z" range={[100, 1000]} name="Load %" />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                    <p className="font-semibold">{data.name}</p>
                    <p className="text-sm text-muted-foreground">Type: {data.type}</p>
                    {solution && (
                      <p className="text-sm">Load: {data.load.toFixed(1)}%</p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter name="Nodes" data={nodeData} fill="hsl(var(--primary))">
            {nodeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 bg-background/50 rounded-lg border">
          <div className="text-xs text-muted-foreground">Total Nodes</div>
          <div className="text-2xl font-bold">{nodes.length}</div>
        </div>
        <div className="p-3 bg-background/50 rounded-lg border">
          <div className="text-xs text-muted-foreground">Connections</div>
          <div className="text-2xl font-bold">{edges.length}</div>
        </div>
        <div className="p-3 bg-background/50 rounded-lg border">
          <div className="text-xs text-muted-foreground">Avg Reliability</div>
          <div className="text-2xl font-bold">
            {((nodes.reduce((s, n) => s + n.reliability, 0) / nodes.length) * 100).toFixed(0)}%
          </div>
        </div>
        <div className="p-3 bg-background/50 rounded-lg border">
          <div className="text-xs text-muted-foreground">System Status</div>
          <div className="text-2xl font-bold text-green-500">
            {solution?.feasible ? '✓ Optimal' : '○ Ready'}
          </div>
        </div>
      </div>
    </Card>
  );
};
