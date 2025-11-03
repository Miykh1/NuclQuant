import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { EfficiencyMetric, Goal } from '@/lib/helios/heliosEngine';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Target, AlertCircle, Activity, DollarSign, Clock, Zap } from 'lucide-react';

interface HeliosDashboardProps {
  metrics: EfficiencyMetric[];
  goals: Goal[];
  totalResources: Record<string, number>;
}

export const HeliosDashboard = ({ metrics, goals, totalResources }: HeliosDashboardProps) => {
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', '#10b981', '#f59e0b', '#8b5cf6'];

  const resourceData = Object.entries(totalResources).map(([type, value]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: parseFloat(value.toFixed(2)),
  }));

  const efficiencyData = metrics.map(m => ({
    task: m.taskName.substring(0, 15),
    efficiency: (m.efficiencyRatio * 100).toFixed(1),
    waste: m.wastePercentage.toFixed(1),
  }));

  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'time': return Clock;
      case 'money': return DollarSign;
      case 'energy': return Zap;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Total Tasks</div>
                <div className="text-2xl font-bold">{metrics.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-sm text-muted-foreground">Goals Achieved</div>
                <div className="text-2xl font-bold">
                  {goals.filter(g => g.achieved).length}/{goals.length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-sm text-muted-foreground">Avg Efficiency</div>
                <div className="text-2xl font-bold">
                  {metrics.length > 0
                    ? ((metrics.reduce((sum, m) => sum + m.efficiencyRatio, 0) / metrics.length) * 100).toFixed(1)
                    : 0}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-orange-500" />
              <div>
                <div className="text-sm text-muted-foreground">Avg Waste</div>
                <div className="text-2xl font-bold">
                  {metrics.length > 0
                    ? (metrics.reduce((sum, m) => sum + m.wastePercentage, 0) / metrics.length).toFixed(1)
                    : 0}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resource Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resource Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={resourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {resourceData.map((entry, index) => (
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
            <CardTitle>Efficiency vs Waste by Task</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="task" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                  }}
                />
                <Legend />
                <Bar dataKey="efficiency" fill="hsl(var(--primary))" name="Efficiency %" />
                <Bar dataKey="waste" fill="#f59e0b" name="Waste %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Goals Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Goals Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goals.map(goal => {
              const progress = (goal.currentValue / goal.targetValue) * 100;
              const Icon = getResourceIcon(goal.resourceType);
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="font-semibold">{goal.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {goal.currentValue} / {goal.targetValue}
                      </span>
                      {goal.achieved && (
                        <span className="text-green-500 text-sm">✓ Achieved</span>
                      )}
                    </div>
                  </div>
                  <Progress value={Math.min(progress, 100)} className="h-2" />
                  {goal.deadline && (
                    <div className="text-xs text-muted-foreground">
                      Deadline: {new Date(goal.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
              );
            })}
            {goals.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No goals set yet. Add goals to track your progress!
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Efficiency Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Task Efficiency Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.map(metric => (
              <div key={`${metric.projectName}-${metric.taskName}`} className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-semibold">{metric.taskName}</div>
                    <div className="text-sm text-muted-foreground">{metric.projectName}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {metric.trend === 'improving' && (
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    )}
                    {metric.trend === 'declining' && (
                      <TrendingDown className="h-5 w-5 text-destructive" />
                    )}
                    <span className="text-lg font-bold text-primary">
                      {(metric.efficiencyRatio * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Input:</span> {metric.totalInput.toFixed(1)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Output:</span> {metric.totalOutput.toFixed(1)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Waste:</span> {metric.wastePercentage.toFixed(1)}%
                  </div>
                  <div>
                    <span className="text-muted-foreground">Trend:</span>{' '}
                    <span className={
                      metric.trend === 'improving' ? 'text-green-500' :
                      metric.trend === 'declining' ? 'text-destructive' :
                      'text-muted-foreground'
                    }>
                      {metric.trend}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {metrics.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No data yet. Start logging resources to see metrics!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
