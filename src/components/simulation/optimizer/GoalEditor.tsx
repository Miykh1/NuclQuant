import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { OptimizationGoal } from '@/lib/optimization/optimizationEngine';
import { Plus, Trash2 } from 'lucide-react';

interface GoalEditorProps {
  goals: OptimizationGoal[];
  onGoalsChange: (goals: OptimizationGoal[]) => void;
}

export const GoalEditor = ({ goals, onGoalsChange }: GoalEditorProps) => {
  const addGoal = () => {
    const newGoal: OptimizationGoal = {
      objective: 'minimize_cost',
      weight: 1.0,
    };
    onGoalsChange([...goals, newGoal]);
  };

  const deleteGoal = (index: number) => {
    onGoalsChange(goals.filter((_, i) => i !== index));
  };

  const updateGoal = (index: number, updates: Partial<OptimizationGoal>) => {
    onGoalsChange(goals.map((g, i) => i === index ? { ...g, ...updates } : g));
  };

  const objectiveLabels: Record<string, string> = {
    minimize_cost: 'Minimize Cost',
    minimize_energy: 'Minimize Energy Use',
    minimize_co2: 'Minimize CO₂ Emissions',
    maximize_throughput: 'Maximize Throughput',
    maximize_profit: 'Maximize Profit',
    maximize_resilience: 'Maximize Resilience',
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Optimization Goals</h3>
        <Button onClick={addGoal} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Goal
        </Button>
      </div>

      <div className="grid gap-4">
        {goals.map((goal, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="flex justify-between items-start">
              <div className="grid gap-3 flex-1">
                <div>
                  <Label htmlFor={`goal-${index}-objective`}>Objective</Label>
                  <Select 
                    value={goal.objective} 
                    onValueChange={(value: any) => updateGoal(index, { objective: value })}
                  >
                    <SelectTrigger id={`goal-${index}-objective`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimize_cost">Minimize Cost</SelectItem>
                      <SelectItem value="minimize_energy">Minimize Energy Use</SelectItem>
                      <SelectItem value="minimize_co2">Minimize CO₂ Emissions</SelectItem>
                      <SelectItem value="maximize_throughput">Maximize Throughput</SelectItem>
                      <SelectItem value="maximize_profit">Maximize Profit</SelectItem>
                      <SelectItem value="maximize_resilience">Maximize Resilience</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`goal-${index}-weight`}>
                    Weight: {goal.weight.toFixed(2)}
                  </Label>
                  <Slider
                    id={`goal-${index}-weight`}
                    value={[goal.weight * 100]}
                    onValueChange={(v) => updateGoal(index, { weight: v[0] / 100 })}
                    max={100}
                    step={5}
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteGoal(index)}
                className="ml-2"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {goals.length === 0 && (
        <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
          No goals defined. Add at least one optimization goal.
        </div>
      )}
    </div>
  );
};
