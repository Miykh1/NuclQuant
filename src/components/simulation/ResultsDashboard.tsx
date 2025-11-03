import { SimulationResult } from '@/types/simulation';
import { Card } from '@/components/ui/card';
import { TrendingUp, DollarSign, Zap, Leaf, AlertTriangle, Clock } from 'lucide-react';

interface ResultsDashboardProps {
  result: SimulationResult;
}

export const ResultsDashboard = ({ result }: ResultsDashboardProps) => {
  const formatCurrency = (value: number) => 
    `$${(value / 1_000_000).toFixed(1)}M`;

  const formatEnergy = (value: number) => 
    `${(value / 1_000_000).toFixed(2)} TWh`;

  const formatPercent = (value: number) => 
    `${(value * 100).toFixed(2)}%`;

  const metrics = [
    {
      label: 'Net Present Value',
      value: formatCurrency(result.npv),
      icon: DollarSign,
      color: result.npv > 0 ? 'text-secondary' : 'text-destructive',
      bgColor: result.npv > 0 ? 'bg-secondary/20' : 'bg-destructive/20',
      borderColor: result.npv > 0 ? 'border-secondary/30' : 'border-destructive/30',
    },
    {
      label: 'Internal Rate of Return',
      value: formatPercent(result.irr),
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/20',
      borderColor: 'border-primary/30',
    },
    {
      label: 'Energy Produced',
      value: formatEnergy(result.energyProducedMWh),
      icon: Zap,
      color: 'text-accent',
      bgColor: 'bg-accent/20',
      borderColor: 'border-accent/30',
    },
    {
      label: 'CO₂ Avoided',
      value: `${(result.co2Avoided / 1_000_000).toFixed(2)}M tons`,
      icon: Leaf,
      color: 'text-secondary',
      bgColor: 'bg-secondary/20',
      borderColor: 'border-secondary/30',
    },
    {
      label: 'Payback Period',
      value: `${result.paybackYears.toFixed(1)} years`,
      icon: Clock,
      color: 'text-primary',
      bgColor: 'bg-primary/20',
      borderColor: 'border-primary/30',
    },
    {
      label: 'Accident Probability',
      value: formatPercent(result.accidentProbability),
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/20',
      borderColor: 'border-destructive/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card 
            key={index} 
            className={`p-6 gradient-card border ${metric.borderColor} transition-smooth hover:scale-105`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
              </div>
              <div className={`${metric.bgColor} p-3 rounded-lg border ${metric.borderColor}`}>
                <Icon className={`h-6 w-6 ${metric.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
