import { Activity, Zap } from 'lucide-react';

export const SimulationHeader = () => {
  return (
    <header className="border-b border-border bg-gradient-card shadow-card">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary blur-xl opacity-50 rounded-full" />
            <div className="relative bg-primary/20 p-3 rounded-xl border border-primary/30">
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Nuclear Energy Simulation Platform
            </h1>
            <p className="text-muted-foreground mt-1">
              Model economic, environmental, and operational impacts of nuclear projects
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
