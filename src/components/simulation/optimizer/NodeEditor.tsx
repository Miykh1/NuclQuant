import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OptimizationNode } from '@/lib/optimization/optimizationEngine';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface NodeEditorProps {
  nodes: OptimizationNode[];
  onNodesChange: (nodes: OptimizationNode[]) => void;
}

export const NodeEditor = ({ nodes, onNodesChange }: NodeEditorProps) => {
  const [editingNode, setEditingNode] = useState<OptimizationNode | null>(null);

  const addNode = () => {
    const newNode: OptimizationNode = {
      id: `n${nodes.length + 1}`,
      name: `Node ${nodes.length + 1}`,
      type: 'facility',
      cost: 50,
      capacity: { min: 100, max: 1000 },
      reliability: 0.9,
      environmental: 0.1,
      position: { x: Math.random() * 400, y: Math.random() * 300 },
    };
    onNodesChange([...nodes, newNode]);
  };

  const deleteNode = (id: string) => {
    onNodesChange(nodes.filter(n => n.id !== id));
  };

  const updateNode = (id: string, updates: Partial<OptimizationNode>) => {
    onNodesChange(nodes.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">System Nodes</h3>
        <Button onClick={addNode} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Node
        </Button>
      </div>

      <div className="grid gap-4">
        {nodes.map((node) => (
          <div key={node.id} className="p-4 border rounded-lg space-y-3">
            <div className="flex justify-between items-start">
              <div className="grid grid-cols-2 gap-3 flex-1">
                <div>
                  <Label htmlFor={`${node.id}-name`}>Name</Label>
                  <Input
                    id={`${node.id}-name`}
                    value={node.name}
                    onChange={(e) => updateNode(node.id, { name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor={`${node.id}-type`}>Type</Label>
                  <Select 
                    value={node.type} 
                    onValueChange={(value: any) => updateNode(node.id, { type: value })}
                  >
                    <SelectTrigger id={`${node.id}-type`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="source">Source</SelectItem>
                      <SelectItem value="facility">Facility</SelectItem>
                      <SelectItem value="plant">Plant</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="sink">Sink</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`${node.id}-cost`}>Cost ($/unit)</Label>
                  <Input
                    id={`${node.id}-cost`}
                    type="number"
                    value={node.cost}
                    onChange={(e) => updateNode(node.id, { cost: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor={`${node.id}-reliability`}>Reliability (0-1)</Label>
                  <Input
                    id={`${node.id}-reliability`}
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={node.reliability}
                    onChange={(e) => updateNode(node.id, { reliability: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor={`${node.id}-min`}>Min Capacity</Label>
                  <Input
                    id={`${node.id}-min`}
                    type="number"
                    value={node.capacity.min}
                    onChange={(e) => updateNode(node.id, { 
                      capacity: { ...node.capacity, min: parseFloat(e.target.value) } 
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor={`${node.id}-max`}>Max Capacity</Label>
                  <Input
                    id={`${node.id}-max`}
                    type="number"
                    value={node.capacity.max}
                    onChange={(e) => updateNode(node.id, { 
                      capacity: { ...node.capacity, max: parseFloat(e.target.value) } 
                    })}
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteNode(node.id)}
                className="ml-2"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
