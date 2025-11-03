import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OptimizationEdge, OptimizationNode } from '@/lib/optimization/optimizationEngine';
import { Plus, Trash2 } from 'lucide-react';

interface EdgeEditorProps {
  edges: OptimizationEdge[];
  nodes: OptimizationNode[];
  onEdgesChange: (edges: OptimizationEdge[]) => void;
}

export const EdgeEditor = ({ edges, nodes, onEdgesChange }: EdgeEditorProps) => {
  const addEdge = () => {
    if (nodes.length < 2) return;
    
    const newEdge: OptimizationEdge = {
      id: `e${edges.length + 1}`,
      source: nodes[0].id,
      target: nodes[1].id,
      cost: 10,
      capacity: { min: 0, max: 1000 },
      reliability: 0.95,
      distance: 50,
    };
    onEdgesChange([...edges, newEdge]);
  };

  const deleteEdge = (id: string) => {
    onEdgesChange(edges.filter(e => e.id !== id));
  };

  const updateEdge = (id: string, updates: Partial<OptimizationEdge>) => {
    onEdgesChange(edges.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const getNodeName = (id: string) => {
    return nodes.find(n => n.id === id)?.name || id;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Connections</h3>
        <Button onClick={addEdge} size="sm" disabled={nodes.length < 2}>
          <Plus className="mr-2 h-4 w-4" />
          Add Connection
        </Button>
      </div>

      <div className="grid gap-4">
        {edges.map((edge) => (
          <div key={edge.id} className="p-4 border rounded-lg space-y-3">
            <div className="flex justify-between items-start">
              <div className="grid grid-cols-2 gap-3 flex-1">
                <div>
                  <Label htmlFor={`${edge.id}-source`}>Source Node</Label>
                  <Select 
                    value={edge.source} 
                    onValueChange={(value) => updateEdge(edge.id, { source: value })}
                  >
                    <SelectTrigger id={`${edge.id}-source`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {nodes.map(node => (
                        <SelectItem key={node.id} value={node.id}>{node.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`${edge.id}-target`}>Target Node</Label>
                  <Select 
                    value={edge.target} 
                    onValueChange={(value) => updateEdge(edge.id, { target: value })}
                  >
                    <SelectTrigger id={`${edge.id}-target`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {nodes.map(node => (
                        <SelectItem key={node.id} value={node.id}>{node.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`${edge.id}-cost`}>Transport Cost ($/unit)</Label>
                  <Input
                    id={`${edge.id}-cost`}
                    type="number"
                    value={edge.cost}
                    onChange={(e) => updateEdge(edge.id, { cost: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor={`${edge.id}-reliability`}>Reliability (0-1)</Label>
                  <Input
                    id={`${edge.id}-reliability`}
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={edge.reliability}
                    onChange={(e) => updateEdge(edge.id, { reliability: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor={`${edge.id}-min`}>Min Flow</Label>
                  <Input
                    id={`${edge.id}-min`}
                    type="number"
                    value={edge.capacity.min}
                    onChange={(e) => updateEdge(edge.id, { 
                      capacity: { ...edge.capacity, min: parseFloat(e.target.value) } 
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor={`${edge.id}-max`}>Max Flow</Label>
                  <Input
                    id={`${edge.id}-max`}
                    type="number"
                    value={edge.capacity.max}
                    onChange={(e) => updateEdge(edge.id, { 
                      capacity: { ...edge.capacity, max: parseFloat(e.target.value) } 
                    })}
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteEdge(edge.id)}
                className="ml-2"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              {getNodeName(edge.source)} → {getNodeName(edge.target)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
