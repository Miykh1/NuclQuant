import { FinancialParameters } from '@/types/simulation';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { DollarSign, TrendingUp, Percent, Shield } from 'lucide-react';

interface FinancialConfigProps {
  params: FinancialParameters;
  onChange: (params: FinancialParameters) => void;
}

export const FinancialConfig = ({ params, onChange }: FinancialConfigProps) => {
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <Card className="p-6 gradient-card border-secondary/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-secondary/20 p-2 rounded-lg border border-secondary/30">
          <DollarSign className="h-5 w-5 text-secondary" />
        </div>
        <h2 className="text-xl font-semibold">Financial Parameters</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm">Construction Cost ($/MW)</Label>
            <Input
              type="number"
              value={params.constructionCostPerMW}
              onChange={(e) => onChange({ ...params, constructionCostPerMW: Number(e.target.value) })}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Annual Operating Cost ($M)</Label>
            <Input
              type="number"
              value={params.annualOperatingCost}
              onChange={(e) => onChange({ ...params, annualOperatingCost: Number(e.target.value) })}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Annual Fuel Cost ($M)</Label>
            <Input
              type="number"
              value={params.fuelCostPerYear}
              onChange={(e) => onChange({ ...params, fuelCostPerYear: Number(e.target.value) })}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Decommissioning Cost ($M)</Label>
            <Input
              type="number"
              value={params.decommissioningCost}
              onChange={(e) => onChange({ ...params, decommissioningCost: Number(e.target.value) })}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Insurance Cost ($M/yr)</Label>
            <Input
              type="number"
              value={params.insuranceCostPerYear}
              onChange={(e) => onChange({ ...params, insuranceCostPerYear: Number(e.target.value) })}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Electricity Price ($/MWh)</Label>
            <Input
              type="number"
              value={params.electricityPricePerMWh}
              onChange={(e) => onChange({ ...params, electricityPricePerMWh: Number(e.target.value) })}
              className="bg-background/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="space-y-2">
            <Label className="text-sm flex items-center gap-2">
              <Percent className="h-3 w-3" />
              Discount Rate
            </Label>
            <Input
              type="number"
              step="0.01"
              value={params.discountRate}
              onChange={(e) => onChange({ ...params, discountRate: Number(e.target.value) })}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm flex items-center gap-2">
              <TrendingUp className="h-3 w-3" />
              Inflation Rate
            </Label>
            <Input
              type="number"
              step="0.01"
              value={params.inflationRate}
              onChange={(e) => onChange({ ...params, inflationRate: Number(e.target.value) })}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Carbon Tax ($/ton)</Label>
            <Input
              type="number"
              value={params.carbonTaxPerTon}
              onChange={(e) => onChange({ ...params, carbonTaxPerTon: Number(e.target.value) })}
              className="bg-background/50"
            />
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-border">
          <Label className="text-sm">Subsidy ($/MWh)</Label>
          <Input
            type="number"
            value={params.subsidyPerMWh}
            onChange={(e) => onChange({ ...params, subsidyPerMWh: Number(e.target.value) })}
            className="bg-background/50"
          />
        </div>
      </div>
    </Card>
  );
};
