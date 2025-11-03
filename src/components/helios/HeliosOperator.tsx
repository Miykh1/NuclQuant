import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { HeliosEngine } from '@/lib/helios/heliosEngine';
import { CodeExecutionEngine } from '@/lib/helios/codeExecutionEngine';
import { ResourceLogger } from './ResourceLogger';
import { HeliosDashboard } from './HeliosDashboard';
import { AdvancedCodeEditor } from './AdvancedCodeEditor';
import { EfficiencyAnalyzer } from './EfficiencyAnalyzer';
import { ResourceComparator } from './ResourceComparator';
import { Activity, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

export const HeliosOperator = () => {
  const [heliosEngine] = useState(() => new HeliosEngine());
  const [codeEngine] = useState(() => new CodeExecutionEngine());
  const [entries, setEntries] = useState(heliosEngine.getEntries());
  const [goals, setGoals] = useState(heliosEngine.getGoals());

  const metrics = useMemo(() => heliosEngine.calculateEfficiency(), [entries]);
  const bottlenecks = useMemo(() => heliosEngine.detectBottlenecks(), [entries]);

  const totalResources = useMemo(() => {
    const totals: Record<string, number> = {};
    entries.forEach(e => {
      totals[e.resourceType] = (totals[e.resourceType] || 0) + e.quantity;
    });
    return totals;
  }, [entries]);

  const heliosContext = useMemo(() => ({
    entries,
    metrics,
    goals,
    bottlenecks,
    totalResources,
  }), [entries, metrics, goals, bottlenecks, totalResources]);

  const handleAddEntry = (entry: any) => {
    heliosEngine.addEntry(entry);
    setEntries(heliosEngine.getEntries());
  };

  const handleDeleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    toast.success('Entry deleted');
  };

  const handleExport = (format: 'csv' | 'json') => {
    const data = heliosEngine.exportData(format);
    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `helios-export.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Data exported as ${format.toUpperCase()}`);
  };

  const handleImport = (format: 'csv' | 'json') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = format === 'json' ? '.json' : '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          heliosEngine.importData(content, format);
          setEntries(heliosEngine.getEntries());
          setGoals(heliosEngine.getGoals());
          toast.success('Data imported successfully');
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-6 w-6" />
              Helios Operator - Universal Resource Monitor
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                <Download className="mr-2 h-4 w-4" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('json')}>
                <Download className="mr-2 h-4 w-4" />
                JSON
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleImport('json')}>
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="logger">Logger</TabsTrigger>
          <TabsTrigger value="analyzer">Analyzer</TabsTrigger>
          <TabsTrigger value="compare">Compare</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <HeliosDashboard
            metrics={metrics}
            goals={goals}
            totalResources={totalResources}
          />
        </TabsContent>

        <TabsContent value="logger" className="mt-6">
          <ResourceLogger
            onAddEntry={handleAddEntry}
            entries={entries}
            onDeleteEntry={handleDeleteEntry}
          />
        </TabsContent>

        <TabsContent value="analyzer" className="mt-6">
          <EfficiencyAnalyzer bottlenecks={bottlenecks} />
        </TabsContent>

        <TabsContent value="compare" className="mt-6">
          <ResourceComparator
            onCompare={(e1, e2) => heliosEngine.compareResources(e1, e2)}
          />
        </TabsContent>

        <TabsContent value="code" className="mt-6">
          <AdvancedCodeEditor
            engine={codeEngine}
            heliosContext={heliosContext}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
