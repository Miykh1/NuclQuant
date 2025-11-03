import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SchedulingEngine, Task, Resource } from '@/lib/optimization/schedulingEngine';
import { SupplyChainEngine, SupplyChainNode } from '@/lib/optimization/supplyChainEngine';
import { SchedulingDashboard } from './SchedulingDashboard';
import { SupplyChainDashboard } from './SupplyChainDashboard';
import { KPIDashboard } from './KPIDashboard';
import { ForecastingDashboard } from './ForecastingDashboard';
import { Briefcase, Package, BarChart3, Play } from 'lucide-react';
import { toast } from 'sonner';

export const OperationsHub = () => {
  const [scheduleResult, setScheduleResult] = useState<any>(null);
  const [supplyChainResult, setSupplyChainResult] = useState<any>(null);
  const [ganttData, setGanttData] = useState<any[]>([]);

  // Sample KPIs for demonstration
  const sampleKPIs = [
    { name: 'On-Time Delivery', value: 94, target: 95, unit: '%', trend: 'up' as const, category: 'quality' as const },
    { name: 'Resource Utilization', value: 87, target: 90, unit: '%', trend: 'up' as const, category: 'efficiency' as const },
    { name: 'Operating Cost', value: 450000, target: 500000, unit: '$', trend: 'down' as const, category: 'cost' as const },
    { name: 'Cycle Time', value: 12, target: 10, unit: 'days', trend: 'down' as const, category: 'time' as const },
    { name: 'Quality Score', value: 4.7, target: 4.5, unit: '/5', trend: 'up' as const, category: 'quality' as const },
    { name: 'Inventory Turnover', value: 8.5, target: 10, unit: 'x/year', trend: 'up' as const, category: 'efficiency' as const },
  ];

  const runProjectScheduling = () => {
    // Sample project tasks
    const sampleTasks: Task[] = [
      {
        id: 'T1',
        name: 'Requirements Analysis',
        duration: 5,
        earliestStart: 0,
        latestStart: 0,
        earliestFinish: 0,
        latestFinish: 0,
        slack: 0,
        predecessors: [],
        successors: ['T2', 'T3'],
        resourceRequirements: new Map([['analyst', 1]]),
        priority: 10,
      },
      {
        id: 'T2',
        name: 'System Design',
        duration: 8,
        earliestStart: 0,
        latestStart: 0,
        earliestFinish: 0,
        latestFinish: 0,
        slack: 0,
        predecessors: ['T1'],
        successors: ['T4'],
        resourceRequirements: new Map([['architect', 2]]),
        priority: 9,
      },
      {
        id: 'T3',
        name: 'Database Design',
        duration: 6,
        earliestStart: 0,
        latestStart: 0,
        earliestFinish: 0,
        latestFinish: 0,
        slack: 0,
        predecessors: ['T1'],
        successors: ['T4'],
        resourceRequirements: new Map([['dba', 1]]),
        priority: 8,
      },
      {
        id: 'T4',
        name: 'Implementation',
        duration: 15,
        earliestStart: 0,
        latestStart: 0,
        earliestFinish: 0,
        latestFinish: 0,
        slack: 0,
        predecessors: ['T2', 'T3'],
        successors: ['T5'],
        resourceRequirements: new Map([['developer', 4]]),
        priority: 10,
      },
      {
        id: 'T5',
        name: 'Testing',
        duration: 7,
        earliestStart: 0,
        latestStart: 0,
        earliestFinish: 0,
        latestFinish: 0,
        slack: 0,
        predecessors: ['T4'],
        successors: ['T6'],
        resourceRequirements: new Map([['tester', 2]]),
        priority: 9,
      },
      {
        id: 'T6',
        name: 'Deployment',
        duration: 3,
        earliestStart: 0,
        latestStart: 0,
        earliestFinish: 0,
        latestFinish: 0,
        slack: 0,
        predecessors: ['T5'],
        successors: [],
        resourceRequirements: new Map([['devops', 1]]),
        priority: 10,
      },
    ];

    const sampleResources: Resource[] = [
      { id: 'R1', name: 'Senior Analyst', capacity: 40, cost: 100, availability: [1, 1, 1, 1, 1, 0, 0], skills: ['analyst'] },
      { id: 'R2', name: 'Lead Architect', capacity: 40, cost: 150, availability: [1, 1, 1, 1, 1, 0, 0], skills: ['architect'] },
      { id: 'R3', name: 'DBA', capacity: 40, cost: 120, availability: [1, 1, 1, 1, 1, 0, 0], skills: ['dba'] },
      { id: 'R4', name: 'Dev Team', capacity: 160, cost: 80, availability: [1, 1, 1, 1, 1, 0, 0], skills: ['developer'] },
      { id: 'R5', name: 'QA Team', capacity: 80, cost: 70, availability: [1, 1, 1, 1, 1, 0, 0], skills: ['tester'] },
      { id: 'R6', name: 'DevOps', capacity: 40, cost: 110, availability: [1, 1, 1, 1, 1, 0, 0], skills: ['devops'] },
    ];

    const engine = new SchedulingEngine();
    const schedule = engine.scheduleWithResources(sampleTasks, sampleResources);
    const gantt = engine.generateGanttData(schedule);

    setScheduleResult(schedule);
    setGanttData(gantt);

    toast.success('Project schedule optimized', {
      description: `Project duration: ${schedule.makespan} days`,
    });
  };

  const runSupplyChainOptimization = () => {
    const sampleNodes: SupplyChainNode[] = [
      {
        id: 'S1',
        name: 'Primary Supplier',
        type: 'supplier',
        location: { lat: 40.7128, lng: -74.0060 },
        capacity: 10000,
        inventoryLevel: 5000,
        reorderPoint: 2000,
        safetyStock: 1000,
        leadTime: 7,
        cost: { holding: 0.5, ordering: 500, stockout: 50, shipping: 0.1 },
      },
      {
        id: 'W1',
        name: 'Central Warehouse',
        type: 'warehouse',
        location: { lat: 41.8781, lng: -87.6298 },
        capacity: 20000,
        inventoryLevel: 8000,
        reorderPoint: 4000,
        safetyStock: 2000,
        leadTime: 3,
        cost: { holding: 0.3, ordering: 300, stockout: 40, shipping: 0.08 },
      },
      {
        id: 'D1',
        name: 'Distribution Center East',
        type: 'distributor',
        location: { lat: 42.3601, lng: -71.0589 },
        capacity: 5000,
        inventoryLevel: 2000,
        reorderPoint: 1000,
        safetyStock: 500,
        leadTime: 2,
        cost: { holding: 0.4, ordering: 200, stockout: 60, shipping: 0.12 },
      },
    ];

    const demandForecast = new Map([
      ['S1', 500],
      ['W1', 1000],
      ['D1', 300],
    ]);

    const engine = new SupplyChainEngine();
    const optimization = engine.optimizeInventoryLevels(sampleNodes, demandForecast);

    setSupplyChainResult(optimization);

    toast.success('Supply chain optimized', {
      description: `Total cost: $${optimization.totalCost.toLocaleString()}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-6 w-6" />
          Operations Research & Management Hub
        </CardTitle>
        <CardDescription>
          Comprehensive toolkit for operations analysts, supply chain managers, and project planners
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="kpis" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="kpis">KPIs & Analytics</TabsTrigger>
            <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
            <TabsTrigger value="scheduling">Project Scheduling</TabsTrigger>
            <TabsTrigger value="supply">Supply Chain</TabsTrigger>
          </TabsList>

          <TabsContent value="kpis" className="mt-6">
            <KPIDashboard kpis={sampleKPIs} />
          </TabsContent>

          <TabsContent value="forecasting" className="mt-6">
            <ForecastingDashboard />
          </TabsContent>

          <TabsContent value="scheduling" className="mt-6 space-y-4">
            <div className="flex gap-4">
              <Button onClick={runProjectScheduling} className="shadow-glow">
                <Play className="mr-2 h-4 w-4" />
                Optimize Project Schedule
              </Button>
            </div>

            {scheduleResult && (
              <SchedulingDashboard 
                schedule={scheduleResult} 
                ganttData={ganttData}
              />
            )}
          </TabsContent>

          <TabsContent value="supply" className="mt-6 space-y-4">
            <div className="flex gap-4">
              <Button onClick={runSupplyChainOptimization} className="shadow-glow">
                <Package className="mr-2 h-4 w-4" />
                Optimize Supply Chain
              </Button>
            </div>

            {supplyChainResult && (
              <SupplyChainDashboard optimization={supplyChainResult} />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
