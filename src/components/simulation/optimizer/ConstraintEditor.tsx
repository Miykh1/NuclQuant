import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OptimizationConstraint } from '@/lib/optimization/optimizationEngine';
import { Plus, Trash2 } from 'lucide-react';

interface ConstraintEditorProps {
  constraints: OptimizationConstraint[];
  onConstraintsChange: (constraints: OptimizationConstraint[]) => void;
}

export const ConstraintEditor = ({ constraints, onConstraintsChange }: ConstraintEditorProps) => {
  const addConstraint = () => {
    const newConstraint: OptimizationConstraint = {
      type: 'budget',
      value: 100000,
    };
    onConstraintsChange([...constraints, newConstraint]);
  };

  const deleteConstraint = (index: number) => {
    onConstraintsChange(constraints.filter((_, i) => i !== index));
  };

  const updateConstraint = (index: number, updates: Partial<OptimizationConstraint>) => {
    onConstraintsChange(constraints.map((c, i) => i === index ? { ...c, ...updates } : c));
  };

  const getConstraintLabel = (type: string) => {
    const labels: Record<string, string> = {
      budget: 'Budget Cap ($)',
      supply: 'Supply Limit',
      demand: 'Demand Requirement',
      capacity: 'Capacity Constraint',
      geographic: 'Geographic Limit',
      connection: 'Connection Required',
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Constraints</h3>
        <Button onClick={addConstraint} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Constraint
        </Button>
      </div>

      <div className="grid gap-4">
        {constraints.map((constraint, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="flex justify-between items-start">
              <div className="grid grid-cols-2 gap-3 flex-1">
                <div>
                  <Label htmlFor={`constraint-${index}-type`}>Constraint Type</Label>
                  <Select 
                    value={constraint.type} 
                    onValueChange={(value: any) => updateConstraint(index, { type: value })}
                  >
                    <SelectTrigger id={`constraint-${index}-type`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">Budget Cap</SelectItem>
                      <SelectItem value="supply">Supply Limit</SelectItem>
                      <SelectItem value="demand">Demand Requirement</SelectItem>
                      <SelectItem value="capacity">Capacity Constraint</SelectItem>
                      <SelectItem value="geographic">Geographic Limit</SelectItem>
                      <SelectItem value="connection">Connection Required</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`constraint-${index}-value`}>
                    {getConstraintLabel(constraint.type)}
                  </Label>
                  <Input
                    id={`constraint-${index}-value`}
                    type="number"
                    value={constraint.value}
                    onChange={(e) => updateConstraint(index, { value: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteConstraint(index)}
                className="ml-2"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {constraints.length === 0 && (
        <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
          No constraints defined. Constraints are optional but help guide the optimization.
        </div>
      )}
    </div>
  );
};
