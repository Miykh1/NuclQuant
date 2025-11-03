import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CodeExecutionEngine, CodeExecution } from '@/lib/helios/codeExecutionEngine';
import { PyodideEngine } from '@/lib/helios/pyodideEngine';
import { WasmEngine } from '@/lib/helios/wasmEngine';
import { CollaborationEngine, Participant } from '@/lib/helios/collaborationEngine';
import { Play, Download, Upload, Users, Code2, Eye, FileCode, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Editor from '@monaco-editor/react';
import Plot from 'react-plotly.js';

interface AdvancedCodeEditorProps {
  engine: CodeExecutionEngine;
  heliosContext?: Record<string, any>;
}

export const AdvancedCodeEditor = ({ engine, heliosContext = {} }: AdvancedCodeEditorProps) => {
  const [code, setCode] = useState(`// Helios Advanced Code Editor
// Multi-language support: JavaScript, Python, C++, R, MATLAB
// With real-time visualization and collaboration

console.log('Welcome to Helios!');

// Access Helios data
console.log('Total entries:', entries.length);

// Example: Calculate efficiency
const totalInput = entries.reduce((sum, e) => sum + e.quantity, 0);
console.log('Total input:', totalInput);

return totalInput;`);
  
  const [language, setLanguage] = useState<'javascript' | 'python' | 'cpp' | 'r' | 'matlab'>('javascript');
  const [executions, setExecutions] = useState<CodeExecution[]>([]);
  const [pyodideEngine] = useState(() => new PyodideEngine());
  const [wasmEngine] = useState(() => new WasmEngine());
  const [collaborationEngine] = useState(() => new CollaborationEngine());
  const [collaborationActive, setCollaborationActive] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [proInsightMode, setProInsightMode] = useState(false);
  const [visualOutput, setVisualOutput] = useState<any>(null);
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleExecute = async () => {
    const startTime = performance.now();
    let result: CodeExecution;

    try {
      if (language === 'javascript') {
        result = engine.executeJavaScript(code, heliosContext);
      } else if (language === 'python') {
        try {
          const output = await pyodideEngine.executePython(code);
          result = {
            id: `exec_${Date.now()}`,
            code,
            language: 'python',
            timestamp: Date.now(),
            output,
            executionTime: performance.now() - startTime,
          };
        } catch (error: any) {
          result = {
            id: `exec_${Date.now()}`,
            code,
            language: 'python',
            timestamp: Date.now(),
            output: error.message,
            error: error.message,
            executionTime: performance.now() - startTime,
          };
        }
      } else if (language === 'cpp') {
        const wasmResult = await wasmEngine.executeC(code);
        result = {
          ...wasmResult,
          language: 'cpp',
          timestamp: Date.now(),
        };
      } else if (language === 'r') {
        result = engine.executeR(code);
      } else {
        result = engine.executeMatlab(code);
      }

      setExecutions(prev => [result, ...prev]);

      if (result.error) {
        toast.error('Execution failed', { description: result.error });
      } else {
        toast.success(`Executed in ${result.executionTime.toFixed(2)}ms`);
      }

      // Check for visualization code
      if (code.includes('plot') || code.includes('chart') || code.includes('graph')) {
        generateVisualization();
      }
    } catch (error: any) {
      toast.error('Execution Error', { description: error.message });
    }
  };

  const generateVisualization = () => {
    // Example: Generate sample data visualization
    const sampleData = {
      x: Array.from({ length: 50 }, (_, i) => i),
      y: Array.from({ length: 50 }, () => Math.random() * 100),
      type: 'scatter',
      mode: 'lines+markers',
      marker: { color: 'hsl(195, 92%, 58%)' },
    };

    setVisualOutput(sampleData);
  };

  const startCollaboration = () => {
    const session = collaborationEngine.joinSession('helios-room', 'User ' + Date.now());
    setCollaborationActive(true);
    setParticipants(session.participants);
    toast.success('Collaboration session started!');
  };

  const stopCollaboration = () => {
    collaborationEngine.leaveSession();
    setCollaborationActive(false);
    setParticipants([]);
    toast.info('Left collaboration session');
  };

  const runProInsight = () => {
    const insights: string[] = [];

    // Static code analysis
    if (code.includes('var ')) {
      insights.push('⚠️ Use `let` or `const` instead of `var`');
    }

    if (code.split('\n').some(line => line.length > 100)) {
      insights.push('📏 Some lines exceed 100 characters');
    }

    const functionCount = (code.match(/function /g) || []).length;
    if (functionCount > 10) {
      insights.push('🔧 Consider breaking down into modules');
    }

    if (!code.includes('try') && code.includes('await')) {
      insights.push('⚡ Add error handling for async code');
    }

    if (insights.length === 0) {
      toast.success('Code looks good! No issues found.');
    } else {
      toast.info(`Pro Insight: ${insights.length} suggestions`, {
        description: insights.join('\n'),
      });
    }
  };

  const handleExport = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const ext = language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : language === 'r' ? 'r' : language === 'matlab' ? 'm' : 'js';
    a.download = `helios-code.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Code exported');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.js,.py,.cpp,.r,.m,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setCode(content);
          toast.success('Code imported');
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const codeTemplates = {
    javascript: {
      'Data Analysis': `// Analyze Helios resource data
const resourceTotals = {};
entries.forEach(entry => {
  resourceTotals[entry.resourceType] = 
    (resourceTotals[entry.resourceType] || 0) + entry.quantity;
});

console.log('Resource totals:', resourceTotals);
return resourceTotals;`,
      'Visualization with Plotly': `// Create interactive chart
const data = entries.map(e => ({
  x: e.taskName,
  y: e.quantity,
  type: 'bar'
}));

console.log('Chart data ready');
return data;`,
    },
    python: {
      'NumPy Analysis': `import numpy as np

# Generate sample data
data = np.random.normal(100, 15, 1000)
mean = np.mean(data)
std = np.std(data)

print(f"Mean: {mean:.2f}")
print(f"Std Dev: {std:.2f}")`,
      'Data Processing': `import numpy as np

# Statistical analysis
values = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
print(f"Sum: {np.sum(values)}")
print(f"Mean: {np.mean(values)}")
print(f"Median: {np.median(values)}")`,
    },
  };

  const getLanguageTemplates = () => {
    return codeTemplates[language as keyof typeof codeTemplates] || {};
  };

  return (
    <div className="space-y-6">
      <Card className="border-helios/20 shadow-glow">
        <CardHeader className="gradient-helios text-helios-foreground">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Helios Advanced Code Environment
              </CardTitle>
              <CardDescription className="text-helios-foreground/80">
                Professional multi-language IDE with real-time collaboration
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={language} onValueChange={(v: any) => setLanguage(v)}>
                <SelectTrigger className="w-40 bg-background/20 border-helios-foreground/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python (Pyodide)</SelectItem>
                  <SelectItem value="cpp">C++ (WASM)</SelectItem>
                  <SelectItem value="r">R</SelectItem>
                  <SelectItem value="matlab">MATLAB/Octave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Badge variant={proInsightMode ? "default" : "outline"} className="cursor-pointer" onClick={() => setProInsightMode(!proInsightMode)}>
                <Lightbulb className="mr-1 h-3 w-3" />
                {proInsightMode ? 'Pro Insight: ON' : 'Pro Insight: OFF'}
              </Badge>
              <Badge variant={collaborationActive ? "default" : "outline"} className="cursor-pointer">
                <Users className="mr-1 h-3 w-3" />
                {collaborationActive ? `${participants.length} Active` : 'Collaborate'}
              </Badge>
            </div>

            <div className="flex gap-2">
              {!collaborationActive ? (
                <Button variant="outline" size="sm" onClick={startCollaboration}>
                  <Users className="mr-2 h-4 w-4" />
                  Start Collaboration
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={stopCollaboration}>
                  Leave Session
                </Button>
              )}
              
              {proInsightMode && (
                <Button variant="outline" size="sm" onClick={runProInsight}>
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Analyze Code
                </Button>
              )}
            </div>
          </div>

          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="visualization">Visualization</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="space-y-4">
              <div className="border border-border rounded-lg overflow-hidden">
                <Editor
                  height="500px"
                  language={language === 'cpp' ? 'cpp' : language === 'matlab' ? 'matlab' : language}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  onMount={handleEditorDidMount}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: true },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    automaticLayout: true,
                  }}
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button onClick={handleExecute} className="gradient-helios">
                  <Play className="mr-2 h-4 w-4" />
                  Run Code
                </Button>
                <Button variant="outline" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" onClick={handleImport}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="templates">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Quick start templates for {language}:
                </p>
                {Object.entries(getLanguageTemplates()).map(([name, template]) => (
                  <Button
                    key={name}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      setCode(template as string);
                      toast.success(`Loaded template: ${name}`);
                    }}
                  >
                    <FileCode className="mr-2 h-4 w-4" />
                    {name}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="visualization">
              {visualOutput ? (
                <div className="border rounded-lg p-4">
                  <Plot
                    data={[visualOutput]}
                    layout={{
                      title: 'Code Output Visualization',
                      paper_bgcolor: 'transparent',
                      plot_bgcolor: 'transparent',
                      font: { color: 'hsl(210, 40%, 98%)' },
                    }}
                    config={{ responsive: true }}
                    style={{ width: '100%', height: '500px' }}
                  />
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12 border rounded-lg">
                  <Eye className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No visualization available.</p>
                  <p className="text-sm mt-2">Run code with plotting functions to see visual output.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {executions.map(exec => (
                  <div
                    key={exec.id}
                    className={`p-3 rounded-lg border ${
                      exec.error ? 'bg-destructive/10 border-destructive/20' : 'bg-card border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{exec.language}</Badge>
                      <div className="text-xs text-muted-foreground">
                        {new Date(exec.timestamp).toLocaleTimeString()} • {exec.executionTime.toFixed(2)}ms
                      </div>
                    </div>
                    <pre className="text-xs bg-background/50 p-2 rounded overflow-x-auto max-h-40">
                      {exec.output}
                    </pre>
                  </div>
                ))}
                {executions.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No executions yet. Run some code to see results!
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
