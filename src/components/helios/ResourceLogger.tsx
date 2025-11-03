import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ResourceEntry } from '@/lib/helios/heliosEngine';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ResourceLoggerProps {
  onAddEntry: (entry: Omit<ResourceEntry, 'id'>) => void;
  entries: ResourceEntry[];
  onDeleteEntry: (id: string) => void;
}

export const ResourceLogger = ({ onAddEntry, entries, onDeleteEntry }: ResourceLoggerProps) => {
  const [resourceType, setResourceType] = useState<'time' | 'money' | 'energy' | 'material' | 'custom'>('time');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('hours');
  const [taskName, setTaskName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [category, setCategory] = useState('');
  const [output, setOutput] = useState('');
  const [outputUnit, setOutputUnit] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!quantity || !taskName || !projectName) {
      toast.error('Please fill in required fields');
      return;
    }

    const entry: Omit<ResourceEntry, 'id'> = {
      timestamp: Date.now(),
      resourceType,
      quantity: parseFloat(quantity),
      unit,
      taskName,
      projectName,
      category,
      output: output ? parseFloat(output) : undefined,
      outputUnit: outputUnit || undefined,
      notes: notes || undefined,
    };

    onAddEntry(entry);
    
    // Reset form
    setQuantity('');
    setTaskName('');
    setNotes('');
    setOutput('');
    
    toast.success('Resource entry logged');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Log Resource Entry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Resource Type *</Label>
              <Select value={resourceType} onValueChange={(v: any) => setResourceType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="time">Time</SelectItem>
                  <SelectItem value="money">Money</SelectItem>
                  <SelectItem value="energy">Energy</SelectItem>
                  <SelectItem value="material">Material</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Project Name *</Label>
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g., Website Redesign"
              />
            </div>

            <div>
              <Label>Task Name *</Label>
              <Input
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="e.g., Database Setup"
              />
            </div>

            <div>
              <Label>Category</Label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Development"
              />
            </div>

            <div>
              <Label>Quantity *</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                step="0.01"
              />
            </div>

            <div>
              <Label>Unit</Label>
              <Input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="hours, $, kWh, kg"
              />
            </div>

            <div>
              <Label>Output (optional)</Label>
              <Input
                type="number"
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                placeholder="e.g., 100"
                step="0.01"
              />
            </div>

            <div>
              <Label>Output Unit</Label>
              <Input
                value={outputUnit}
                onChange={(e) => setOutputUnit(e.target.value)}
                placeholder="e.g., pages, items, users"
              />
            </div>
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional details..."
              rows={3}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Log Entry
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Entries ({entries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {entries.slice().reverse().slice(0, 20).map(entry => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-semibold">{entry.taskName}</div>
                  <div className="text-sm text-muted-foreground">
                    {entry.projectName} • {entry.quantity} {entry.unit} of {entry.resourceType}
                    {entry.output && ` → ${entry.output} ${entry.outputUnit}`}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleString()}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteEntry(entry.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            {entries.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No entries yet. Start logging your resources!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
