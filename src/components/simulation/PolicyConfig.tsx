import { PolicyParameters } from '@/types/simulation';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Scale, Leaf, Shield } from 'lucide-react';

interface PolicyConfigProps {
  params: PolicyParameters;
  onChange: (params: PolicyParameters) => void;
}

export const PolicyConfig = ({ params, onChange }: PolicyConfigProps) => {
  return (
    <Card className="p-6 gradient-card border-accent/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-accent/20 p-2 rounded-lg border border-accent/30">
          <Scale className="h-5 w-5 text-accent" />
        </div>
        <h2 className="text-xl font-semibold">Policy & Sustainability</h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-border">
          <div className="flex items-center gap-3">
            <Leaf className="h-5 w-5 text-secondary" />
            <div>
              <Label className="text-sm font-medium">Carbon Tax Enabled</Label>
              <p className="text-xs text-muted-foreground">Apply carbon credits to revenue</p>
            </div>
          </div>
          <Switch
            checked={params.carbonTaxEnabled}
            onCheckedChange={(checked) => onChange({ ...params, carbonTaxEnabled: checked })}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-border">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary" />
            <div>
              <Label className="text-sm font-medium">Subsidies Enabled</Label>
              <p className="text-xs text-muted-foreground">Government renewable energy subsidies</p>
            </div>
          </div>
          <Switch
            checked={params.subsidiesEnabled}
            onCheckedChange={(checked) => onChange({ ...params, subsidiesEnabled: checked })}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Waste Management Cost ($/ton)</Label>
          <Input
            type="number"
            value={params.wasteManagementCost}
            onChange={(e) => onChange({ ...params, wasteManagementCost: Number(e.target.value) })}
            className="bg-background/50"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Accident Insurance Multiplier</Label>
          <Input
            type="number"
            step="0.1"
            value={params.accidentInsuranceMultiplier}
            onChange={(e) => onChange({ ...params, accidentInsuranceMultiplier: Number(e.target.value) })}
            className="bg-background/50"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Public Acceptance Factor</Label>
          <Input
            type="number"
            step="0.1"
            min="0"
            max="1"
            value={params.publicAcceptanceFactor}
            onChange={(e) => onChange({ ...params, publicAcceptanceFactor: Number(e.target.value) })}
            className="bg-background/50"
          />
          <p className="text-xs text-muted-foreground">0 = Low acceptance, 1 = High acceptance</p>
        </div>
      </div>
    </Card>
  );
};
