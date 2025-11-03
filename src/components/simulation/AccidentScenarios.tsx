import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Zap, Droplet, Settings, Radio } from 'lucide-react';
import { ReactorParameters } from '@/types/simulation';

interface AccidentScenariosProps {
  params: ReactorParameters;
  onRunScenario: (scenario: string) => void;
}

export const AccidentScenarios = ({ params, onRunScenario }: AccidentScenariosProps) => {
  const scenarios = [
    {
      id: 'loca',
      name: 'LOCA - Loss of Coolant Accident',
      icon: Droplet,
      description: 'Simulates coolant system breach with emergency core cooling',
      risk: 'High',
      color: 'destructive',
    },
    {
      id: 'blackout',
      name: 'Station Blackout',
      icon: Zap,
      description: 'Total loss of electrical power including backup systems',
      risk: 'Critical',
      color: 'destructive',
    },
    {
      id: 'rod_ejection',
      name: 'Control Rod Ejection',
      icon: Settings,
      description: 'Rapid uncontrolled reactivity insertion accident',
      risk: 'High',
      color: 'destructive',
    },
    {
      id: 'pump_failure',
      name: 'Coolant Pump Failure',
      icon: Radio,
      description: 'Loss of forced circulation with natural convection backup',
      risk: 'Medium',
      color: 'accent',
    },
  ];

  return (
    <Card className="p-6 gradient-card border-destructive/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-destructive/20 p-2 rounded-lg border border-destructive/30">
          <AlertTriangle className="h-5 w-5 text-destructive" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Accident & Safety Scenarios</h3>
          <p className="text-sm text-muted-foreground">Test reactor response to critical events</p>
        </div>
      </div>

      <div className="space-y-3">
        {scenarios.map((scenario) => {
          const Icon = scenario.icon;
          return (
            <div 
              key={scenario.id}
              className="p-4 bg-background/50 rounded-lg border border-primary/20 hover:border-primary/40 transition-smooth"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3 flex-1">
                  <div className={`bg-${scenario.color}/20 p-2 rounded-lg border border-${scenario.color}/30 h-fit`}>
                    <Icon className={`h-4 w-4 text-${scenario.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">{scenario.name}</h4>
                    <p className="text-xs text-muted-foreground">{scenario.description}</p>
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full bg-${scenario.color}/20 text-${scenario.color}`}>
                        Risk: {scenario.risk}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRunScenario(scenario.id)}
                  className="border-primary/30 hover:bg-primary/10"
                >
                  Simulate
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
        <div className="text-xs font-semibold text-accent mb-1">Safety Note</div>
        <div className="text-xs text-muted-foreground">
          These scenarios test emergency response systems. Reactor type: {params.type} with {params.moderatorType} moderator.
        </div>
      </div>
    </Card>
  );
};
