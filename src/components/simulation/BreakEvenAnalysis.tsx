import { Card } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { SimulationResult } from '@/types/simulation';
import { useMemo } from 'react';

interface BreakEvenAnalysisProps {
  result: SimulationResult;
  financialParams?: any;
  currentPrice?: number;
}

export const BreakEvenAnalysis = ({ result, financialParams, currentPrice = 80 }: BreakEvenAnalysisProps) => {
  const analysis = useMemo(() => {
    const totalEnergy = result.energyProducedMWh;
    const totalCosts = result.costsTotal;
    
    // Break-even price is total costs / total energy
    const breakEvenPrice = totalCosts / totalEnergy;
    
    // Margin at current price
    const margin = ((currentPrice - breakEvenPrice) / breakEvenPrice) * 100;
    
    // Required price for target NPV
    const targetNPV = 500_000_000; // $500M
    const currentNPV = result.npv;
    const npvGap = targetNPV - currentNPV;
    const requiredPriceForTarget = currentPrice + (npvGap / totalEnergy);
    
    // Sensitivity: price change needed for breakeven
    const priceChangeNeeded = breakEvenPrice - currentPrice;
    
    return {
      breakEvenPrice,
      margin,
      requiredPriceForTarget,
      priceChangeNeeded,
      isProfitable: currentPrice > breakEvenPrice,
    };
  }, [result, currentPrice]);
  
  return (
    <Card className="p-6 gradient-card border-primary/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-green-500/20 p-2 rounded-lg border border-green-500/30">
          <DollarSign className="h-5 w-5 text-green-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Break-Even Analysis</h3>
          <p className="text-sm text-muted-foreground">Energy Market Competitiveness</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className={`p-4 rounded-lg border ${
          analysis.isProfitable 
            ? 'bg-green-500/10 border-green-500/20' 
            : 'bg-destructive/10 border-destructive/20'
        }`}>
          <div className="text-xs text-muted-foreground mb-1">Break-Even Price</div>
          <div className={`text-2xl font-bold ${
            analysis.isProfitable ? 'text-green-500' : 'text-destructive'
          }`}>
            ${analysis.breakEvenPrice.toFixed(2)}/MWh
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Current: ${currentPrice.toFixed(2)}/MWh
          </div>
        </div>
        
        <div className={`p-4 rounded-lg border ${
          analysis.margin > 0 
            ? 'bg-green-500/10 border-green-500/20' 
            : 'bg-destructive/10 border-destructive/20'
        }`}>
          <div className="text-xs text-muted-foreground mb-1">Profit Margin</div>
          <div className={`text-2xl font-bold ${
            analysis.margin > 0 ? 'text-green-500' : 'text-destructive'
          }`}>
            {analysis.margin > 0 ? '+' : ''}{analysis.margin.toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            At current electricity price
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="p-3 bg-background/50 rounded-lg border border-primary/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">Levelized Cost of Energy (LCOE)</span>
            <span className="text-lg font-bold text-primary">
              ${analysis.breakEvenPrice.toFixed(2)}/MWh
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Total lifetime costs divided by total energy production
          </div>
        </div>
        
        <div className="p-3 bg-background/50 rounded-lg border border-primary/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">Price for $500M NPV</span>
            <span className="text-lg font-bold text-primary">
              ${analysis.requiredPriceForTarget.toFixed(2)}/MWh
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Required electricity price to achieve target return
          </div>
        </div>
        
        {!analysis.isProfitable && (
          <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-destructive">Price Increase Needed</span>
              <span className="text-lg font-bold text-destructive">
                +${Math.abs(analysis.priceChangeNeeded).toFixed(2)}/MWh
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Minimum price increase required to break even
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
        <p className="text-xs text-muted-foreground mb-2">
          <strong>Market Context (2024):</strong>
        </p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Coal LCOE: $60-140/MWh</li>
          <li>• Natural Gas LCOE: $45-75/MWh</li>
          <li>• Nuclear LCOE: $90-130/MWh</li>
          <li>• Solar LCOE: $30-60/MWh</li>
          <li>• Wind LCOE: $30-60/MWh</li>
        </ul>
      </div>
      
      {analysis.isProfitable && (
        <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
          <p className="text-xs text-green-500">
            ✓ Project is economically viable at current electricity prices with a {analysis.margin.toFixed(1)}% margin.
          </p>
        </div>
      )}
    </Card>
  );
};
