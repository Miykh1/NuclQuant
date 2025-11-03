/**
 * Pyodide Engine - Python Execution in Browser
 * 
 * Loads and manages Pyodide for in-browser Python execution
 * Supports NumPy, Pandas, Matplotlib, and scientific computing
 */

export class PyodideEngine {
  private pyodide: any = null;
  private loading = false;
  private loaded = false;

  async initialize(): Promise<void> {
    if (this.loaded) return;
    if (this.loading) {
      // Wait for current initialization
      while (this.loading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return;
    }

    this.loading = true;

    try {
      // @ts-ignore - Pyodide is loaded via CDN
      const loadPyodide = window.loadPyodide;
      
      if (!loadPyodide) {
        throw new Error('Pyodide not loaded. Include Pyodide CDN in index.html');
      }

      this.pyodide = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
      });

      // Load essential scientific packages
      await this.pyodide.loadPackage(['numpy', 'scipy', 'matplotlib']);
      
      this.loaded = true;
    } catch (error) {
      console.error('Failed to initialize Pyodide:', error);
      throw error;
    } finally {
      this.loading = false;
    }
  }

  async executePython(code: string, context: Record<string, any> = {}): Promise<string> {
    if (!this.loaded) {
      await this.initialize();
    }

    try {
      // Set context variables
      for (const [key, value] of Object.entries(context)) {
        this.pyodide.globals.set(key, value);
      }

      // Capture stdout
      await this.pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
      `);

      // Execute code
      const result = await this.pyodide.runPythonAsync(code);

      // Get stdout
      const stdout = await this.pyodide.runPythonAsync('sys.stdout.getvalue()');

      let output = stdout || '';
      if (result !== undefined && result !== null) {
        output += (output ? '\n' : '') + `Return: ${result}`;
      }

      return output || 'Execution completed (no output)';
    } catch (error: any) {
      throw new Error(`Python Error: ${error.message}`);
    }
  }

  isLoaded(): boolean {
    return this.loaded;
  }

  async installPackage(packageName: string): Promise<void> {
    if (!this.loaded) {
      await this.initialize();
    }
    await this.pyodide.loadPackage(packageName);
  }
}
