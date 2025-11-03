import { ReactorParameters, ReactorType, FuelType } from '@/types/simulation';
import { REACTOR_SPECS, FUEL_DATA } from '@/constants/reactorData';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Atom, Fuel, Gauge, Clock, Zap, Calendar, Droplet, Box, Settings } from 'lucide-react';

interface ReactorConfigProps {
  params: ReactorParameters;
  onChange: (params: ReactorParameters) => void;
}

export const ReactorConfig = ({ params, onChange }: ReactorConfigProps) => {
  return (
    <Card className="p-6 gradient-card border-primary/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/20 p-2 rounded-lg border border-primary/30">
          <Atom className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-xl font-semibold">Reactor Configuration</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Atom className="h-4 w-4 text-primary" />
            Reactor Type
          </Label>
          <Select
            value={params.type}
            onValueChange={(value) => onChange({ ...params, type: value as ReactorType })}
          >
            <SelectTrigger className="bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(REACTOR_SPECS).map(([key, spec]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex flex-col">
                    <span className="font-medium">{spec.name}</span>
                    <span className="text-xs text-muted-foreground">{spec.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Fuel className="h-4 w-4 text-secondary" />
            Fuel Type
          </Label>
          <Select
            value={params.fuelType}
            onValueChange={(value) => onChange({ ...params, fuelType: value as FuelType })}
          >
            <SelectTrigger className="bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(FUEL_DATA).map(([key, fuel]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex flex-col">
                    <span className="font-medium">{fuel.name}</span>
                    <span className="text-xs text-muted-foreground">{fuel.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 justify-between">
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-accent" />
              Capacity
            </span>
            <span className="text-primary font-mono">{params.capacityMW} MW</span>
          </Label>
          <Slider
            value={[params.capacityMW]}
            onValueChange={([value]) => onChange({ ...params, capacityMW: value })}
            min={100}
            max={1500}
            step={50}
            className="py-4"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 justify-between">
            <span className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-secondary" />
              Enrichment
            </span>
            <span className="text-primary font-mono">{params.enrichmentPercent.toFixed(1)}%</span>
          </Label>
          <Slider
            value={[params.enrichmentPercent]}
            onValueChange={([value]) => onChange({ ...params, enrichmentPercent: value })}
            min={2}
            max={8}
            step={0.1}
            className="py-4"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 justify-between">
            <span className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-primary" />
              Thermal Efficiency
            </span>
            <span className="text-primary font-mono">{(params.thermalEfficiency * 100).toFixed(1)}%</span>
          </Label>
          <Slider
            value={[params.thermalEfficiency * 100]}
            onValueChange={([value]) => onChange({ ...params, thermalEfficiency: value / 100 })}
            min={25}
            max={42}
            step={0.5}
            className="py-4"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 justify-between">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-secondary" />
              Uptime
            </span>
            <span className="text-primary font-mono">{params.uptimePercent.toFixed(0)}%</span>
          </Label>
          <Slider
            value={[params.uptimePercent]}
            onValueChange={([value]) => onChange({ ...params, uptimePercent: value })}
            min={70}
            max={98}
            step={1}
            className="py-4"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent" />
              Plant Lifespan
            </span>
            <span className="text-primary font-mono">{params.plantLifespanYears} years</span>
          </Label>
          <Slider
            value={[params.plantLifespanYears]}
            onValueChange={([value]) => onChange({ ...params, plantLifespanYears: value })}
            min={20}
            max={60}
            step={5}
            className="py-4"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Droplet className="h-4 w-4 text-primary" />
            Moderator Type
          </Label>
          <Select
            value={params.moderatorType}
            onValueChange={(value) => onChange({ ...params, moderatorType: value as any })}
          >
            <SelectTrigger className="bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Light Water">Light Water</SelectItem>
              <SelectItem value="Heavy Water">Heavy Water</SelectItem>
              <SelectItem value="Graphite">Graphite</SelectItem>
              <SelectItem value="None">None (Fast Reactor)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Box className="h-4 w-4 text-secondary" />
            Reactor Geometry
          </Label>
          <Select
            value={params.geometry}
            onValueChange={(value) => onChange({ ...params, geometry: value as any })}
          >
            <SelectTrigger className="bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cylindrical">Cylindrical</SelectItem>
              <SelectItem value="Spherical">Spherical</SelectItem>
              <SelectItem value="Rectangular">Rectangular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 justify-between">
            <span className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-accent" />
              Control Rod Insertion
            </span>
            <span className="text-primary font-mono">{params.controlRodInsertion.toFixed(0)}%</span>
          </Label>
          <Slider
            value={[params.controlRodInsertion]}
            onValueChange={([value]) => onChange({ ...params, controlRodInsertion: value })}
            min={0}
            max={100}
            step={5}
            className="py-4"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 justify-between">
            <span className="flex items-center gap-2">
              <Droplet className="h-4 w-4 text-primary" />
              Coolant Flow Rate
            </span>
            <span className="text-primary font-mono">{params.coolantFlowRate.toFixed(0)} kg/s</span>
          </Label>
          <Slider
            value={[params.coolantFlowRate]}
            onValueChange={([value]) => onChange({ ...params, coolantFlowRate: value })}
            min={5000}
            max={25000}
            step={500}
            className="py-4"
          />
        </div>
      </div>
    </Card>
  );
};
