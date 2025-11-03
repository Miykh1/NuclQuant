import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PolicyScenario, PolicyImpact } from '@/lib/simulation/policyEngine';
import { AlertTriangle, TrendingUp, TrendingDown, Leaf } from 'lucide-react';
import { useState } from 'react';

interface PolicyShockSimulatorProps {
  onRunScenario: (scenario: PolicyScenario) => void;
  currentImpact?: PolicyImpact;
}

export const PolicyShockSimulator = ({ onRunScenario, currentImpact }: PolicyShockSimulatorProps) => {
  const [selectedScenario, setSelectedScenario] = useState<PolicyScenario>('carbon_tax_increase');

  const scenarios: { value: PolicyScenario; label: string; description: string }[] = [
    { value: 'uranium_import_ban', label: 'Uranium Import Ban', description: 'Sanctions restrict uranium supply' },
    { value: 'carbon_tax_increase', label: 'Carbon Tax Increase', description: 'Double carbon pricing' },
    { value: 'subsidy_cut', label: 'Subsidy Elimination', description: 'Remove nuclear subsidies' },
    { value: 'nuclear_phase_out', label: 'Nuclear Phase-Out', description: 'Gradual shutdown mandate' },
    { value: 'accelerated_deployment', label: 'Accelerated Deployment', description: 'Rapid nuclear expansion' },
    { value: 'waste_tax_increase', label: 'Waste Tax Increase', description: 'Higher waste management costs' },
    { value: 'insurance_mandate', label: 'Insurance Mandate', description: 'Stricter insurance requirements' },
    { value: 'renewable_preference', label: 'Renewable Preference', description: 'Policy favors renewables' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Policy Shock Simulator
        </CardTitle>
        <CardDescription>
          Simulate geopolitical and policy changes on nuclear energy markets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Select Policy Scenario</label>
            <Select value={selectedScenario} onValueChange={(v) => setSelectedScenario(v as PolicyScenario)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {scenarios.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => onRunScenario(selectedScenario)} className="shadow-glow">
            Run Scenario
          </Button>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            {scenarios.find(s => s.value === selectedScenario)?.description}
          </p>
        </div>

        {currentImpact && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{currentImpact.name} - Impact Analysis</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary/10 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  Energy Cost Change
                </div>
                <div className={`text-2xl font-bold mt-1 ${currentImpact.expectedImpacts.energyCostChange > 0 ? 'text-destructive' : 'text-green-500'}`}>
                  {currentImpact.expectedImpacts.energyCostChange > 0 ? '+' : ''}
                  {currentImpact.expectedImpacts.energyCostChange.toFixed(1)}%
                </div>
              </div>

              <div className="bg-secondary/10 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingDown className="h-4 w-4" />
                  Portfolio Impact
                </div>
                <div className={`text-2xl font-bold mt-1 ${currentImpact.expectedImpacts.portfolioLossExpected > 0 ? 'text-destructive' : 'text-green-500'}`}>
                  {currentImpact.expectedImpacts.portfolioLossExpected > 0 ? '-' : '+'}
                  ${Math.abs(currentImpact.expectedImpacts.portfolioLossExpected / 1_000_000_000).toFixed(1)}B
                </div>
              </div>

              <div className="bg-secondary/10 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Leaf className="h-4 w-4" />
                  CO₂ Reduction Change
                </div>
                <div className={`text-2xl font-bold mt-1 ${currentImpact.expectedImpacts.co2ReductionChange < 0 ? 'text-destructive' : 'text-green-500'}`}>
                  {currentImpact.expectedImpacts.co2ReductionChange > 0 ? '+' : ''}
                  {currentImpact.expectedImpacts.co2ReductionChange.toFixed(1)}%
                </div>
              </div>

              <div className="bg-secondary/10 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4" />
                  Reliability Change
                </div>
                <div className={`text-2xl font-bold mt-1 ${currentImpact.expectedImpacts.reliabilityChange < 0 ? 'text-destructive' : 'text-green-500'}`}>
                  {currentImpact.expectedImpacts.reliabilityChange > 0 ? '+' : ''}
                  {currentImpact.expectedImpacts.reliabilityChange.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg border border-border">
              <h4 className="font-medium mb-2">Scenario Description</h4>
              <p className="text-sm text-muted-foreground">{currentImpact.description}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
