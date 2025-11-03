import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GitCompare, X, Upload, Download } from 'lucide-react';
import { SimulationSession } from '@/types/simulation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { toast } from 'sonner';

interface ScenarioComparisonProps {
  sessions: SimulationSession[];
  onRemoveSession: (id: string) => void;
  onAddSession?: (session: SimulationSession) => void;
}

export const ScenarioComparison = ({ sessions, onRemoveSession, onAddSession }: ScenarioComparisonProps) => {
  const handleImportScenario = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        Array.from(files).forEach(file => {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const content = e.target?.result as string;
              const session = JSON.parse(content) as SimulationSession;
              if (onAddSession) {
                onAddSession(session);
                toast.success(`Imported scenario: ${session.name || 'Unnamed'}`);
              }
            } catch (error) {
              toast.error('Failed to import scenario', { description: 'Invalid file format' });
            }
          };
          reader.readAsText(file);
        });
      }
    };
    input.click();
  };

  const handleExportScenario = (session: SimulationSession) => {
    const blob = new Blob([JSON.stringify(session, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scenario-${session.name || session.id.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Scenario exported');
  };

  const handleExportAll = () => {
    const blob = new Blob([JSON.stringify(sessions, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scenarios-comparison-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('All scenarios exported');
  };

  if (sessions.length === 0) {
    return (
      <Card className="p-6 gradient-card border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/20 p-2 rounded-lg border border-primary/30">
            <GitCompare className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Scenario Comparison</h3>
            <p className="text-sm text-muted-foreground">No scenarios to compare</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center py-8 mb-4">
          Save simulation sessions or import previous scenarios to compare side-by-side
        </p>
        <div className="flex justify-center">
          <Button onClick={handleImportScenario} variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import Scenarios
          </Button>
        </div>
      </Card>
    );
  }
  
  const comparisonData = sessions.map(session => ({
    name: session.name || `Session ${session.id.slice(0, 6)}`,
    'NPV ($M)': (session.result.npv / 1_000_000).toFixed(0),
    'IRR (%)': (session.result.irr * 100).toFixed(1),
    'Payback (yrs)': session.result.paybackYears.toFixed(1),
    'Energy (TWh)': (session.result.energyProducedMWh / 1_000_000).toFixed(2),
  }));
  
  return (
    <Card className="p-6 gradient-card border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-lg border border-primary/30">
            <GitCompare className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Scenario Comparison</h3>
            <p className="text-sm text-muted-foreground">{sessions.length} scenarios</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleImportScenario} variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button onClick={handleExportAll} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Multi-Metric Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold mb-2">Net Present Value Comparison</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="NPV ($M)" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-2">IRR & Payback Period</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="IRR (%)" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="Payback (yrs)" stroke="hsl(var(--accent))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Detailed Comparison Table */}
        <div className="space-y-2">
          {sessions.map((session) => (
            <div 
              key={session.id}
              className="p-4 bg-background/50 rounded-lg border border-primary/10 hover:border-primary/30 transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold">{session.name || `Session ${session.id.slice(0, 8)}`}</h4>
                  <p className="text-xs text-muted-foreground">
                    {new Date(session.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExportScenario(session)}
                    className="h-8 w-8 p-0"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveSession(session.id)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">NPV</div>
                  <div className={`text-sm font-bold ${
                    session.result.npv > 0 ? 'text-primary' : 'text-destructive'
                  }`}>
                    ${(session.result.npv / 1_000_000).toFixed(1)}M
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">IRR</div>
                  <div className="text-sm font-bold">{(session.result.irr * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Payback</div>
                  <div className="text-sm font-bold">{session.result.paybackYears.toFixed(1)} yrs</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Energy</div>
                  <div className="text-sm font-bold">
                    {(session.result.energyProducedMWh / 1_000_000).toFixed(1)} TWh
                  </div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-primary/10">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Reactor:</span>{' '}
                    <span className="font-semibold">{session.reactorParams.type}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Capacity:</span>{' '}
                    <span className="font-semibold">{session.reactorParams.capacityMW} MW</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Efficiency:</span>{' '}
                    <span className="font-semibold">{(session.reactorParams.thermalEfficiency * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Uptime:</span>{' '}
                    <span className="font-semibold">{session.reactorParams.uptimePercent}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
