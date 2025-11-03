import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target, Activity } from 'lucide-react';

interface KPI {
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
  category: 'efficiency' | 'quality' | 'cost' | 'time';
}

interface KPIDashboardProps {
  kpis: KPI[];
}

export const KPIDashboard = ({ kpis }: KPIDashboardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'efficiency': return 'text-blue-500';
      case 'quality': return 'text-green-500';
      case 'cost': return 'text-orange-500';
      case 'time': return 'text-purple-500';
      default: return 'text-primary';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'efficiency': return Activity;
      case 'quality': return Target;
      case 'cost': return TrendingDown;
      case 'time': return TrendingUp;
      default: return Activity;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Performance Indicators (KPIs)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi, idx) => {
            const Icon = getCategoryIcon(kpi.category);
            const progress = (kpi.value / kpi.target) * 100;
            const isOnTarget = progress >= 90;

            return (
              <div key={idx} className={`p-4 rounded-lg border ${isOnTarget ? 'bg-green-500/10 border-green-500/20' : 'bg-background/50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${getCategoryColor(kpi.category)}`} />
                    <span className="text-sm font-semibold">{kpi.name}</span>
                  </div>
                  {kpi.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                  {kpi.trend === 'down' && <TrendingDown className="h-4 w-4 text-destructive" />}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl font-bold">{kpi.value.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">/ {kpi.target} {kpi.unit}</span>
                  </div>

                  <Progress value={Math.min(progress, 100)} className="h-2" />

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{progress.toFixed(0)}% of target</span>
                    <span className={isOnTarget ? 'text-green-500' : 'text-orange-500'}>
                      {isOnTarget ? '✓ On Track' : '⚠ Below Target'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
