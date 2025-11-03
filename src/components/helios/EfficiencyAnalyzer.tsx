import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bottleneck } from '@/lib/helios/heliosEngine';
import { AlertTriangle, TrendingUp, Clock, DollarSign, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EfficiencyAnalyzerProps {
  bottlenecks: Bottleneck[];
}

export const EfficiencyAnalyzer = ({ bottlenecks }: EfficiencyAnalyzerProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'time': return Clock;
      case 'cost': return DollarSign;
      case 'efficiency': return TrendingUp;
      case 'waste': return AlertTriangle;
      default: return Target;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const highPriorityBottlenecks = bottlenecks.filter(b => b.severity === 'high');
  const mediumPriorityBottlenecks = bottlenecks.filter(b => b.severity === 'medium');
  const lowPriorityBottlenecks = bottlenecks.filter(b => b.severity === 'low');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            Efficiency Analysis & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <div className="text-3xl font-bold text-destructive">{highPriorityBottlenecks.length}</div>
              <div className="text-sm text-muted-foreground">High Priority Issues</div>
            </div>
            <div className="text-center p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <div className="text-3xl font-bold text-orange-500">{mediumPriorityBottlenecks.length}</div>
              <div className="text-sm text-muted-foreground">Medium Priority Issues</div>
            </div>
            <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="text-3xl font-bold text-blue-500">{lowPriorityBottlenecks.length}</div>
              <div className="text-sm text-muted-foreground">Low Priority Issues</div>
            </div>
          </div>

          <div className="space-y-4">
            {bottlenecks.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p className="text-lg font-semibold">No bottlenecks detected!</p>
                <p className="text-sm">Your operations are running efficiently.</p>
              </div>
            ) : (
              bottlenecks.map((bottleneck, idx) => {
                const Icon = getTypeIcon(bottleneck.type);
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border bg-card space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{bottleneck.description}</span>
                            <Badge variant={getSeverityColor(bottleneck.severity) as any}>
                              {bottleneck.severity} priority
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Affected: {bottleneck.affectedTasks.join(', ')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-500">
                          +{bottleneck.estimatedImprovement.toFixed(0)}%
                        </div>
                        <div className="text-xs text-muted-foreground">potential gain</div>
                      </div>
                    </div>

                    <div className="pl-8 p-3 bg-muted/50 rounded-lg">
                      <div className="text-sm font-semibold mb-1">💡 Suggested Action:</div>
                      <div className="text-sm">{bottleneck.suggestedAction}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {bottlenecks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Wins - Prioritized Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {bottlenecks
                .sort((a, b) => b.estimatedImprovement - a.estimatedImprovement)
                .slice(0, 5)
                .map((bottleneck, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-medium">{bottleneck.affectedTasks[0]}</div>
                        <div className="text-sm text-muted-foreground">{bottleneck.type}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-500">
                        +{bottleneck.estimatedImprovement.toFixed(0)}%
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
