import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';

interface SchedulingDashboardProps {
  schedule: any;
  ganttData: any[];
}

export const SchedulingDashboard = ({ schedule, ganttData }: SchedulingDashboardProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Project Duration</div>
                <div className="text-2xl font-bold">{schedule.makespan} days</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <div>
                <div className="text-sm text-muted-foreground">Critical Tasks</div>
                <div className="text-2xl font-bold">{schedule.criticalPath?.length || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-sm text-muted-foreground">Total Tasks</div>
                <div className="text-2xl font-bold">{schedule.tasks?.size || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div>
                <div className="text-sm text-muted-foreground">Total Cost</div>
                <div className="text-2xl font-bold text-primary">
                  ${schedule.totalCost?.toLocaleString() || 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gantt Chart - Project Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={ganttData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis 
                dataKey="task" 
                type="category" 
                stroke="hsl(var(--muted-foreground))"
                width={100}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))' 
                }}
              />
              <Legend />
              <Bar 
                dataKey="start" 
                stackId="a" 
                fill="transparent"
                name="Start Offset"
              />
              <Bar 
                dataKey="duration" 
                stackId="a" 
                fill="hsl(var(--primary))"
                name="Duration (days)"
                radius={[0, 8, 8, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {schedule.criticalPath && schedule.criticalPath.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Critical Path Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Tasks on the critical path have zero slack. Any delay in these tasks will delay the entire project.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {schedule.criticalPath.map((taskId: string) => {
                  const task: any = Array.from(schedule.tasks.values()).find((t: any) => t.id === taskId);
                  return (
                    <div key={taskId} className="px-3 py-1 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <span className="text-sm font-medium text-destructive">{task?.name || taskId}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
