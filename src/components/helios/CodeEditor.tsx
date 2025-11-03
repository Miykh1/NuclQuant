import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CodeExecutionEngine, CodeExecution } from '@/lib/helios/codeExecutionEngine';
import { Play, Download, Upload, Save, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CodeEditorProps {
  engine: CodeExecutionEngine;
  heliosContext?: Record<string, any>;
}

export const CodeEditor = ({ engine, heliosContext = {} }: CodeEditorProps) => {
  const [code, setCode] = useState(`// Helios Code Editor
// Access Helios data via: entries, metrics, goals
// Example:
console.log('Total entries:', entries.length);
const totalInput = entries.reduce((sum, e) => sum + e.quantity, 0);
console.log('Total input:', totalInput);
return totalInput;`);
  const [language, setLanguage] = useState<'javascript' | 'python' | 'c'>('javascript');
  const [executions, setExecutions] = useState<CodeExecution[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewContent, setPreviewContent] = useState('');

  const handleExecute = () => {
    let result: CodeExecution;
    
    if (language === 'javascript') {
      result = engine.executeJavaScript(code, heliosContext);
    } else if (language === 'python') {
      result = engine.executePython(code);
    } else {
      result = engine.executeC(code);
    }

    setExecutions(prev => [result, ...prev]);
    
    if (result.error) {
      toast.error('Execution failed', { description: result.error });
    } else {
      toast.success(`Executed in ${result.executionTime.toFixed(2)}ms`);
    }
  };

  const handleExport = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `helios-code.${language === 'javascript' ? 'js' : language}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Code exported');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.js,.py,.c,.txt';
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

  const handlePreview = () => {
    if (language === 'javascript') {
      try {
        // For HTML preview, extract any document writes or HTML generation
        const previewCode = code.includes('document.') || code.includes('innerHTML') || code.includes('<');
        if (previewCode) {
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          document.body.appendChild(iframe);
          
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            iframeDoc.open();
            iframeDoc.write(`
              <!DOCTYPE html>
              <html>
              <head><style>body { font-family: system-ui; padding: 1rem; }</style></head>
              <body>
                <script>${code}</script>
              </body>
              </html>
            `);
            iframeDoc.close();
            
            setTimeout(() => {
              setPreviewContent(iframeDoc.body.innerHTML);
              setPreviewMode(true);
              document.body.removeChild(iframe);
            }, 100);
          }
        } else {
          toast.info('No HTML content to preview. Run the code to see output.');
        }
      } catch (error) {
        toast.error('Preview failed');
      }
    } else {
      toast.info('Preview only available for JavaScript with HTML output');
    }
  };

  const codeTemplates = {
    javascript: {
      'Calculate Total Resources': `// Calculate total resources by type
const resourceTotals = {};
entries.forEach(entry => {
  resourceTotals[entry.resourceType] = 
    (resourceTotals[entry.resourceType] || 0) + entry.quantity;
});
console.log('Resource totals:', resourceTotals);
return resourceTotals;`,
      'Find Top Tasks': `// Find tasks with highest input
const taskTotals = {};
entries.forEach(entry => {
  const key = entry.taskName;
  taskTotals[key] = (taskTotals[key] || 0) + entry.quantity;
});
const sorted = Object.entries(taskTotals)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);
console.log('Top 5 tasks:', sorted);
return sorted;`,
      'Generate HTML Report': `// Generate HTML report
let html = '<div style="padding: 20px;">';
html += '<h1>Helios Resource Report</h1>';
html += '<p>Total entries: ' + entries.length + '</p>';
html += '<ul>';
metrics.forEach(m => {
  html += '<li><strong>' + m.taskName + '</strong>: ' + 
    (m.efficiencyRatio * 100).toFixed(1) + '% efficiency</li>';
});
html += '</ul></div>';
document.body.innerHTML = html;
return html;`,
    },
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Code Editor - Helios Integration</CardTitle>
            <div className="flex gap-2">
              <Select value={language} onValueChange={(v: any) => setLanguage(v)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="c">C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="editor">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="space-y-4">
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-mono min-h-96"
                placeholder="Write your code here..."
              />

              <div className="flex gap-2 flex-wrap">
                <Button onClick={handleExecute}>
                  <Play className="mr-2 h-4 w-4" />
                  Run Code
                </Button>
                <Button variant="outline" onClick={handlePreview}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
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
                <p className="text-sm text-muted-foreground">Quick start with pre-built templates:</p>
                {Object.entries(codeTemplates[language] || {}).map(([name, template]) => (
                  <Button
                    key={name}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      setCode(template as string);
                      toast.success(`Loaded template: ${name}`);
                    }}
                  >
                    {name}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="preview">
              {previewMode && previewContent ? (
                <div 
                  className="border rounded-lg p-4 bg-background min-h-96"
                  dangerouslySetInnerHTML={{ __html: previewContent }}
                />
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  No preview available. Click "Preview" to generate HTML output.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Execution History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {executions.map(exec => (
              <div
                key={exec.id}
                className={`p-3 rounded-lg border ${exec.error ? 'bg-destructive/10 border-destructive/20' : 'bg-muted/50'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">{exec.language}</span>
                  <div className="text-xs text-muted-foreground">
                    {new Date(exec.timestamp).toLocaleTimeString()} • {exec.executionTime.toFixed(2)}ms
                  </div>
                </div>
                <pre className="text-xs bg-background/50 p-2 rounded overflow-x-auto">
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
        </CardContent>
      </Card>
    </div>
  );
};
