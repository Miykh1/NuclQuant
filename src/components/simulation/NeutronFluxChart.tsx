import { Card } from '@/components/ui/card';
import { useMemo } from 'react';
import { Activity } from 'lucide-react';

interface NeutronFluxChartProps {
  fluxData: Array<{
    radialPosition: number;
    axialPosition: number;
    thermalFlux: number;
    fastFlux: number;
  }>;
}

export const NeutronFluxChart = ({ fluxData }: NeutronFluxChartProps) => {
  const heatmapData = useMemo(() => {
    // Convert to 2D grid for visualization
    const gridSize = Math.sqrt(fluxData.length);
    const grid: number[][] = [];
    
    let maxFlux = 0;
    fluxData.forEach(d => {
      const totalFlux = d.thermalFlux + d.fastFlux;
      maxFlux = Math.max(maxFlux, totalFlux);
    });
    
    for (let i = 0; i < gridSize; i++) {
      grid[i] = [];
      for (let j = 0; j < gridSize; j++) {
        const index = i * gridSize + j;
        const totalFlux = fluxData[index].thermalFlux + fluxData[index].fastFlux;
        grid[i][j] = totalFlux / maxFlux; // Normalize
      }
    }
    
    return { grid, gridSize, maxFlux };
  }, [fluxData]);
  
  const getColor = (intensity: number) => {
    // Color gradient: blue (low) -> cyan -> green -> yellow -> red (high)
    if (intensity < 0.2) return `hsl(240, 100%, ${20 + intensity * 200}%)`;
    if (intensity < 0.4) return `hsl(180, 100%, ${40 + intensity * 100}%)`;
    if (intensity < 0.6) return `hsl(120, 100%, ${30 + intensity * 50}%)`;
    if (intensity < 0.8) return `hsl(60, 100%, ${40 + intensity * 30}%)`;
    return `hsl(0, 100%, ${40 + intensity * 20}%)`;
  };
  
  const avgThermalFlux = fluxData.reduce((sum, d) => sum + d.thermalFlux, 0) / fluxData.length;
  const avgFastFlux = fluxData.reduce((sum, d) => sum + d.fastFlux, 0) / fluxData.length;
  
  return (
    <Card className="p-6 gradient-card border-primary/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary/20 p-2 rounded-lg border border-primary/30">
          <Activity className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Neutron Flux Distribution</h3>
          <p className="text-sm text-muted-foreground">2D Core Map (n/cm²·s)</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-background/50 rounded-lg border border-primary/10">
          <div className="text-xs text-muted-foreground">Avg Thermal Flux</div>
          <div className="text-lg font-bold text-primary">
            {(avgThermalFlux / 1e13).toFixed(2)}×10¹³
          </div>
        </div>
        <div className="p-3 bg-background/50 rounded-lg border border-primary/10">
          <div className="text-xs text-muted-foreground">Avg Fast Flux</div>
          <div className="text-lg font-bold text-accent">
            {(avgFastFlux / 1e13).toFixed(2)}×10¹³
          </div>
        </div>
      </div>
      
      <div className="relative aspect-square bg-background/30 rounded-lg p-4 border border-primary/10">
        <div className="absolute top-2 left-2 text-xs text-muted-foreground">Top</div>
        <div className="absolute bottom-2 left-2 text-xs text-muted-foreground">Bottom</div>
        <div className="absolute top-2 right-2 text-xs text-muted-foreground">Edge</div>
        
        <div className="grid gap-0.5 h-full w-full" style={{ gridTemplateColumns: `repeat(${heatmapData.gridSize}, 1fr)` }}>
          {heatmapData.grid.map((row, i) =>
            row.map((intensity, j) => (
              <div
                key={`${i}-${j}`}
                className="transition-all duration-300 hover:scale-110 hover:z-10 rounded-sm"
                style={{
                  backgroundColor: getColor(intensity),
                  boxShadow: intensity > 0.7 ? `0 0 8px ${getColor(intensity)}` : 'none',
                }}
                title={`Flux: ${(intensity * heatmapData.maxFlux / 1e13).toFixed(2)}×10¹³ n/cm²·s`}
              />
            ))
          )}
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Low Flux</span>
        <div className="flex-1 mx-4 h-3 rounded-full" style={{
          background: 'linear-gradient(to right, hsl(240, 100%, 40%), hsl(180, 100%, 50%), hsl(120, 100%, 40%), hsl(60, 100%, 50%), hsl(0, 100%, 50%))'
        }} />
        <span className="text-muted-foreground">High Flux</span>
      </div>
    </Card>
  );
};
