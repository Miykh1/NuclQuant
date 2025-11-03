import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReactorParameters, FinancialParameters, PolicyParameters } from '@/types/simulation';
import { Sparkles, Building2, GraduationCap, Rocket } from 'lucide-react';

interface PresetTemplatesProps {
  onLoadPreset: (reactor: ReactorParameters, financial: FinancialParameters, policy: PolicyParameters) => void;
}

export const PresetTemplates = ({ onLoadPreset }: PresetTemplatesProps) => {
  const presets = [
    {
      name: 'Utility-Grade PWR',
      icon: Building2,
      description: 'Large-scale commercial reactor for baseload power',
      reactor: {
        type: 'PWR' as const,
        fuelType: 'U-235' as const,
        enrichmentPercent: 4.5,
        thermalEfficiency: 0.33,
        uptimePercent: 92,
        capacityMW: 1000,
        plantLifespanYears: 40,
        moderatorType: 'Light Water' as const,
        geometry: 'Cylindrical' as const,
        controlRodInsertion: 45,
        coolantFlowRate: 15000,
      },
      financial: {
        constructionCostPerMW: 6000,
        annualOperatingCost: 25,
        fuelCostPerYear: 40,
        decommissioningCost: 500,
        insuranceCostPerYear: 10,
        electricityPricePerMWh: 75,
        discountRate: 0.08,
        inflationRate: 0.025,
        carbonTaxPerTon: 50,
        subsidyPerMWh: 5,
      },
      policy: {
        carbonTaxEnabled: true,
        subsidiesEnabled: true,
        wasteManagementCost: 100000,
        accidentInsuranceMultiplier: 1.5,
        publicAcceptanceFactor: 0.7,
      },
    },
    {
      name: 'Research Reactor',
      icon: GraduationCap,
      description: 'Small experimental facility for academic use',
      reactor: {
        type: 'SMR' as const,
        fuelType: 'U-235' as const,
        enrichmentPercent: 6.0,
        thermalEfficiency: 0.35,
        uptimePercent: 85,
        capacityMW: 100,
        plantLifespanYears: 30,
        moderatorType: 'Light Water' as const,
        geometry: 'Cylindrical' as const,
        controlRodInsertion: 60,
        coolantFlowRate: 5000,
      },
      financial: {
        constructionCostPerMW: 8000,
        annualOperatingCost: 15,
        fuelCostPerYear: 20,
        decommissioningCost: 200,
        insuranceCostPerYear: 5,
        electricityPricePerMWh: 80,
        discountRate: 0.05,
        inflationRate: 0.02,
        carbonTaxPerTon: 40,
        subsidyPerMWh: 10,
      },
      policy: {
        carbonTaxEnabled: false,
        subsidiesEnabled: true,
        wasteManagementCost: 50000,
        accidentInsuranceMultiplier: 1.0,
        publicAcceptanceFactor: 0.9,
      },
    },
    {
      name: 'Next-Gen Thorium',
      icon: Rocket,
      description: 'Advanced thorium reactor with minimal waste',
      reactor: {
        type: 'Thorium' as const,
        fuelType: 'Thorium-232' as const,
        enrichmentPercent: 5.5,
        thermalEfficiency: 0.38,
        uptimePercent: 90,
        capacityMW: 900,
        plantLifespanYears: 50,
        moderatorType: 'Graphite' as const,
        geometry: 'Cylindrical' as const,
        controlRodInsertion: 40,
        coolantFlowRate: 14000,
      },
      financial: {
        constructionCostPerMW: 7000,
        annualOperatingCost: 22,
        fuelCostPerYear: 32,
        decommissioningCost: 450,
        insuranceCostPerYear: 8,
        electricityPricePerMWh: 70,
        discountRate: 0.07,
        inflationRate: 0.025,
        carbonTaxPerTon: 60,
        subsidyPerMWh: 8,
      },
      policy: {
        carbonTaxEnabled: true,
        subsidiesEnabled: true,
        wasteManagementCost: 50000,
        accidentInsuranceMultiplier: 1.2,
        publicAcceptanceFactor: 0.8,
      },
    },
  ];

  return (
    <Card className="p-6 gradient-card border-primary/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-accent/20 p-2 rounded-lg border border-accent/30">
          <Sparkles className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Quick Start Templates</h3>
          <p className="text-sm text-muted-foreground">Load pre-configured reactor scenarios</p>
        </div>
      </div>

      <div className="space-y-3">
        {presets.map((preset) => {
          const Icon = preset.icon;
          return (
            <div 
              key={preset.name}
              className="p-4 bg-background/50 rounded-lg border border-primary/20 hover:border-primary/40 transition-smooth"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-3 flex-1">
                  <div className="bg-primary/20 p-2 rounded-lg border border-primary/30 h-fit">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{preset.name}</h4>
                    <p className="text-sm text-muted-foreground">{preset.description}</p>
                    <div className="mt-2 flex gap-2 text-xs">
                      <span className="px-2 py-1 rounded-full bg-secondary/20 text-secondary">
                        {preset.reactor.capacityMW} MW
                      </span>
                      <span className="px-2 py-1 rounded-full bg-accent/20 text-accent">
                        {preset.reactor.type}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => onLoadPreset(preset.reactor, preset.financial, preset.policy)}
                  className="bg-primary hover:bg-primary/90"
                >
                  Load
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
