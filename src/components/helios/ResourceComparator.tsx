import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ComparisonResult } from '@/lib/helios/heliosEngine';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Trophy } from 'lucide-react';

interface ResourceComparatorProps {
  onCompare: (
    entity1: any,
    entity2: any
  ) => ComparisonResult[];
}

export const ResourceComparator = ({ onCompare }: ResourceComparatorProps) => {
  const [entity1Project, setEntity1Project] = useState('');
  const [entity1Task, setEntity1Task] = useState('');
  const [entity2Project, setEntity2Project] = useState('');
  const [entity2Task, setEntity2Task] = useState('');
  const [results, setResults] = useState<ComparisonResult[]>([]);

  const handleCompare = () => {
    const entity1 = {
      projectName: entity1Project || undefined,
      taskName: entity1Task || undefined,
    };
    const entity2 = {
      projectName: entity2Project || undefined,
      taskName: entity2Task || undefined,
    };

    const comparisonResults = onCompare(entity1, entity2);
    setResults(comparisonResults);
  };

  const chartData = results.map(r => ({
    metric: r.metric,
    [r.entity1]: r.value1,
    [r.entity2]: r.value2,
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resource Comparison Analyzer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Entity 1</h3>
              <div>
                <Label>Project Name</Label>
                <Input
                  value={entity1Project}
                  onChange={(e) => setEntity1Project(e.target.value)}
                  placeholder="e.g., Website Redesign"
                />
              </div>
              <div>
                <Label>Task Name (optional)</Label>
                <Input
                  value={entity1Task}
                  onChange={(e) => setEntity1Task(e.target.value)}
                  placeholder="e.g., Database Setup"
                />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Entity 2</h3>
              <div>
                <Label>Project Name</Label>
                <Input
                  value={entity2Project}
                  onChange={(e) => setEntity2Project(e.target.value)}
                  placeholder="e.g., Mobile App"
                />
              </div>
              <div>
                <Label>Task Name (optional)</Label>
                <Input
                  value={entity2Task}
                  onChange={(e) => setEntity2Task(e.target.value)}
                  placeholder="e.g., UI Design"
                />
              </div>
            </div>
          </div>

          <Button onClick={handleCompare} className="w-full">
            Compare Resources
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Comparison Results</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                    }}
                  />
                  <Legend />
                  <Bar dataKey={results[0].entity1} fill="hsl(var(--primary))" />
                  <Bar dataKey={results[0].entity2} fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((result, idx) => (
                  <div key={idx} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg">{result.metric}</h4>
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        <span className="font-semibold">{result.winner}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">{result.entity1}</div>
                        <div className="text-2xl font-bold">{result.value1.toFixed(2)}</div>
                      </div>
                      <div className="p-3 bg-green-500/10 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">{result.entity2}</div>
                        <div className="text-2xl font-bold">{result.value2.toFixed(2)}</div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        {result.difference > 0 ? (
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-destructive" />
                        )}
                        <span className="text-sm font-medium">Difference:</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{Math.abs(result.difference).toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">
                          ({result.percentageDiff > 0 ? '+' : ''}{result.percentageDiff.toFixed(1)}%)
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="font-semibold mb-2">✅ Best Performer</div>
                  <p className="text-sm">
                    {results[0].winner} shows superior performance across most metrics.
                  </p>
                </div>

                {results.some(r => Math.abs(r.percentageDiff) > 50) && (
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <div className="font-semibold mb-2">⚠️ Significant Gaps</div>
                    <p className="text-sm">
                      Some metrics show differences greater than 50%. Consider replicating best practices
                      from the better-performing entity.
                    </p>
                  </div>
                )}

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="font-semibold mb-2">💡 Recommendation</div>
                  <p className="text-sm">
                    Analyze the strategies and resource allocation of {results.find(r => r.metric === 'Efficiency Ratio')?.winner || 'the better performer'} and apply similar approaches to improve overall efficiency.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
