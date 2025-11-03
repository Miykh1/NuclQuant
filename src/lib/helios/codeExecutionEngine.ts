export interface CodeExecution {
  id: string;
  code: string;
  language: 'javascript' | 'python' | 'cpp' | 'r' | 'matlab';
  timestamp: number;
  output: string;
  error?: string;
  executionTime: number;
  visualOutput?: string; // For charts, plots, HTML output
}

export interface CodeNode {
  id: string;
  name: string;
  code: string;
  language: 'javascript' | 'python' | 'cpp' | 'r' | 'matlab';
  inputs: string[];
  outputs: string[];
  connectedTo: string[];
}

export class CodeExecutionEngine {
  private executions: CodeExecution[] = [];
  private codeNodes: CodeNode[] = [];
  private globalContext: Record<string, any> = {};

  executeJavaScript(code: string, context: Record<string, any> = {}): CodeExecution {
    const startTime = performance.now();
    const execution: CodeExecution = {
      id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      code,
      language: 'javascript',
      timestamp: Date.now(),
      output: '',
      executionTime: 0,
    };

    try {
      // Create a safe execution context
      const mergedContext = { ...this.globalContext, ...context };
      const contextKeys = Object.keys(mergedContext);
      const contextValues = Object.values(mergedContext);

      // Capture console output
      const logs: string[] = [];
      const customConsole = {
        log: (...args: any[]) => logs.push(args.map(a => String(a)).join(' ')),
        error: (...args: any[]) => logs.push('ERROR: ' + args.map(a => String(a)).join(' ')),
        warn: (...args: any[]) => logs.push('WARN: ' + args.map(a => String(a)).join(' ')),
      };

      // Execute code in isolated context
      const func = new Function(...contextKeys, 'console', 'return (async () => { ' + code + ' })()');
      const result = func(...contextValues, customConsole);

      // Handle promises
      if (result && typeof result.then === 'function') {
        result.then((res: any) => {
          if (res !== undefined) logs.push('Return: ' + JSON.stringify(res));
        }).catch((err: any) => {
          logs.push('ERROR: ' + err.message);
        });
      } else if (result !== undefined) {
        logs.push('Return: ' + JSON.stringify(result));
      }

      execution.output = logs.join('\n');
    } catch (error: any) {
      execution.error = error.message;
      execution.output = `Error: ${error.message}\n${error.stack || ''}`;
    }

    execution.executionTime = performance.now() - startTime;
    this.executions.push(execution);
    return execution;
  }

  executePython(code: string): CodeExecution {
    // Python execution would require a backend service or Pyodide
    const execution: CodeExecution = {
      id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      code,
      language: 'python',
      timestamp: Date.now(),
      output: 'Python execution requires backend service (Pyodide integration coming soon)',
      executionTime: 0,
    };
    this.executions.push(execution);
    return execution;
  }

  executeCpp(code: string): CodeExecution {
    // C++ execution would require WebAssembly compilation
    const execution: CodeExecution = {
      id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      code,
      language: 'cpp',
      timestamp: Date.now(),
      output: 'C++ execution requires WebAssembly compilation (coming soon)',
      executionTime: 0,
    };
    this.executions.push(execution);
    return execution;
  }

  executeR(code: string): CodeExecution {
    const execution: CodeExecution = {
      id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      code,
      language: 'r',
      timestamp: Date.now(),
      output: 'R execution requires backend service or WebR integration',
      executionTime: 0,
    };
    this.executions.push(execution);
    return execution;
  }

  executeMatlab(code: string): CodeExecution {
    const execution: CodeExecution = {
      id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      code,
      language: 'matlab',
      timestamp: Date.now(),
      output: 'MATLAB/Octave execution requires Octave.js or backend service',
      executionTime: 0,
    };
    this.executions.push(execution);
    return execution;
  }

  setGlobalContext(key: string, value: any): void {
    this.globalContext[key] = value;
  }

  getGlobalContext(): Record<string, any> {
    return { ...this.globalContext };
  }

  addCodeNode(node: Omit<CodeNode, 'id'>): CodeNode {
    const newNode: CodeNode = {
      ...node,
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    this.codeNodes.push(newNode);
    return newNode;
  }

  executeNodeChain(startNodeId: string): Record<string, any> {
    const results: Record<string, any> = {};
    const visited = new Set<string>();

    const executeNode = (nodeId: string): any => {
      if (visited.has(nodeId)) return results[nodeId];
      visited.add(nodeId);

      const node = this.codeNodes.find(n => n.id === nodeId);
      if (!node) return null;

      // Collect inputs from connected nodes
      const inputContext: Record<string, any> = {};
      node.inputs.forEach((inputName, idx) => {
        const connectedNodeId = node.connectedTo[idx];
        if (connectedNodeId) {
          inputContext[inputName] = executeNode(connectedNodeId);
        }
      });

      // Execute node code
      const execution = this.executeJavaScript(node.code, inputContext);
      results[nodeId] = execution.output;
      return execution.output;
    };

    executeNode(startNodeId);
    return results;
  }

  getExecutionHistory(): CodeExecution[] {
    return [...this.executions];
  }

  getCodeNodes(): CodeNode[] {
    return [...this.codeNodes];
  }

  clearExecutionHistory(): void {
    this.executions = [];
  }

  exportCode(nodeId: string, format: 'js' | 'json'): string {
    const node = this.codeNodes.find(n => n.id === nodeId);
    if (!node) return '';

    if (format === 'json') {
      return JSON.stringify(node, null, 2);
    } else {
      return `// ${node.name}\n// Inputs: ${node.inputs.join(', ')}\n// Outputs: ${node.outputs.join(', ')}\n\n${node.code}`;
    }
  }

  importCode(data: string, format: 'js' | 'json'): CodeNode | null {
    try {
      if (format === 'json') {
        const parsed = JSON.parse(data);
        return this.addCodeNode({
          name: parsed.name || 'Imported Node',
          code: parsed.code,
          language: parsed.language || 'javascript',
          inputs: parsed.inputs || [],
          outputs: parsed.outputs || [],
          connectedTo: parsed.connectedTo || [],
        });
      } else {
        // Extract code from JS file
        const lines = data.split('\n');
        const codeLines = lines.filter(l => !l.trim().startsWith('//'));
        return this.addCodeNode({
          name: 'Imported Code',
          code: codeLines.join('\n'),
          language: 'javascript',
          inputs: [],
          outputs: [],
          connectedTo: [],
        });
      }
    } catch (error) {
      console.error('Import failed:', error);
      return null;
    }
  }
}
