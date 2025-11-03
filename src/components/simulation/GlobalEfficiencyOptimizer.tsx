import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OptimizationEngine, OptimizationConfig, OptimizationNode, OptimizationEdge, OptimizationGoal, OptimizationConstraint, OptimizationSolution } from '@/lib/optimization/optimizationEngine';
import { SystemGraphView } from './optimizer/SystemGraphView';
import { OptimizationResults } from './optimizer/OptimizationResults';
import { NodeEditor } from './optimizer/NodeEditor';
import { EdgeEditor } from './optimizer/EdgeEditor';
import { GoalEditor } from './optimizer/GoalEditor';
import { ConstraintEditor } from './optimizer/ConstraintEditor';
import { OperationsHub } from './operations/OperationsHub';
import { Network, TrendingUp, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const GlobalEfficiencyOptimizer = () => {
  const [nodes, setNodes] = useState<OptimizationNode[]>([
    {
      id: 'n1',
      name: 'Solar Farm',
      type: 'source',
      cost: 50,
      capacity: { min: 100, max: 1000 },
      reliability: 0.85,
      environmental: 0.02,
      position: { x: 100, y: 100 },
    },
    {
      id: 'n2',
      name: 'Nuclear Plant',
      type: 'plant',
      cost: 80,
      capacity: { min: 500, max: 2000 },
      reliability: 0.95,
      environmental: 0.1,
      position: { x: 300, y: 100 },
    },
    {
      id: 'n3',
      name: 'Distribution Hub',
      type: 'facility',
      cost: 20,
      capacity: { min: 200, max: 3000 },
      reliability: 0.98,
      environmental: 0.01,
      position: { x: 200, y: 300 },
    },
  ]);

  const [edges, setEdges] = useState<OptimizationEdge[]>([
    {
      id: 'e1',
      source: 'n1',
      target: 'n3',
      cost: 10,
      capacity: { min: 0, max: 1000 },
      reliability: 0.95,
      distance: 50,
    },
    {
      id: 'e2',
      source: 'n2',
      target: 'n3',
      cost: 15,
      capacity: { min: 0, max: 2000 },
      reliability: 0.98,
      distance: 75,
    },
  ]);

  const [goals, setGoals] = useState<OptimizationGoal[]>([
    { objective: 'minimize_cost', weight: 1.0 },
  ]);

  const [constraints, setConstraints] = useState<OptimizationConstraint[]>([
    { type: 'budget', value: 100000 },
  ]);

  const [solution, setSolution] = useState<OptimizationSolution | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const runOptimization = () => {
    setIsOptimizing(true);
    
    const config: OptimizationConfig = {
      nodes,
      edges,
      goals,
      constraints,
    };

    try {
      const engine = new OptimizationEngine();
      const result = engine.solve(config);
      setSolution(result);
      
      if (result.feasible) {
        toast.success('Optimization completed successfully');
      } else {
        toast.error('No feasible solution found', {
          description: result.recommendations[0],
        });
      }
    } catch (error) {
      console.error('Optimization error:', error);
      toast.error('Optimization failed');
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-6 w-6" />
            Global Efficiency Optimizer
          </CardTitle>
          <CardDescription>
            Universal decision and resource engine for modeling real-world systems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button 
              onClick={runOptimization} 
              className="shadow-glow"
              disabled={isOptimizing}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              {isOptimizing ? 'Optimizing...' : 'Run Optimization'}
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => setSolution(null)}
            >
              Clear Results
            </Button>
          </div>

          {solution && !solution.feasible && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <h4 className="font-semibold text-destructive">Optimization Failed</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {solution.recommendations[0]}
                </p>
              </div>
            </div>
          )}

          <Tabs defaultValue="graph" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="graph">System Graph</TabsTrigger>
              <TabsTrigger value="operations">Operations</TabsTrigger>
              <TabsTrigger value="nodes">Nodes</TabsTrigger>
              <TabsTrigger value="edges">Connections</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="constraints">Constraints</TabsTrigger>
            </TabsList>

            <TabsContent value="graph" className="mt-6">
              <SystemGraphView 
                nodes={nodes} 
                edges={edges} 
                solution={solution}
              />
            </TabsContent>

            <TabsContent value="operations" className="mt-6">
              <OperationsHub />
            </TabsContent>

            <TabsContent value="nodes" className="mt-6">
              <NodeEditor 
                nodes={nodes} 
                onNodesChange={setNodes}
              />
            </TabsContent>

            <TabsContent value="edges" className="mt-6">
              <EdgeEditor 
                edges={edges} 
                nodes={nodes}
                onEdgesChange={setEdges}
              />
            </TabsContent>

            <TabsContent value="goals" className="mt-6">
              <GoalEditor 
                goals={goals} 
                onGoalsChange={setGoals}
              />
            </TabsContent>

            <TabsContent value="constraints" className="mt-6">
              <ConstraintEditor 
                constraints={constraints} 
                onConstraintsChange={setConstraints}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {solution && solution.feasible && (
        <OptimizationResults solution={solution} config={{ nodes, edges, goals, constraints }} />
      )}
    </div>
  );
};
