export interface ResourceEntry {
  id: string;
  timestamp: number;
  resourceType: 'time' | 'money' | 'energy' | 'material' | 'custom';
  quantity: number;
  unit: string;
  taskName: string;
  projectName: string;
  category: string;
  output?: number;
  outputUnit?: string;
  notes?: string;
}

export interface EfficiencyMetric {
  taskName: string;
  projectName: string;
  totalInput: number;
  totalOutput: number;
  efficiencyRatio: number;
  resourceBreakdown: Record<string, number>;
  wastePercentage: number;
  trend: 'improving' | 'declining' | 'stable';
}

export interface Goal {
  id: string;
  name: string;
  resourceType: string;
  targetValue: number;
  currentValue: number;
  deadline?: number;
  achieved: boolean;
}

export interface Bottleneck {
  type: 'time' | 'cost' | 'efficiency' | 'waste';
  severity: 'high' | 'medium' | 'low';
  description: string;
  affectedTasks: string[];
  suggestedAction: string;
  estimatedImprovement: number;
}

export interface ComparisonResult {
  entity1: string;
  entity2: string;
  metric: string;
  value1: number;
  value2: number;
  difference: number;
  percentageDiff: number;
  winner: string;
}

export class HeliosEngine {
  private entries: ResourceEntry[] = [];
  private goals: Goal[] = [];

  addEntry(entry: Omit<ResourceEntry, 'id'>): ResourceEntry {
    const newEntry: ResourceEntry = {
      ...entry,
      id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    this.entries.push(newEntry);
    return newEntry;
  }

  getEntries(filters?: {
    projectName?: string;
    taskName?: string;
    resourceType?: string;
    startDate?: number;
    endDate?: number;
  }): ResourceEntry[] {
    let filtered = [...this.entries];

    if (filters) {
      if (filters.projectName) {
        filtered = filtered.filter(e => e.projectName === filters.projectName);
      }
      if (filters.taskName) {
        filtered = filtered.filter(e => e.taskName === filters.taskName);
      }
      if (filters.resourceType) {
        filtered = filtered.filter(e => e.resourceType === filters.resourceType);
      }
      if (filters.startDate) {
        filtered = filtered.filter(e => e.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        filtered = filtered.filter(e => e.timestamp <= filters.endDate!);
      }
    }

    return filtered;
  }

  calculateEfficiency(projectName?: string, taskName?: string): EfficiencyMetric[] {
    const entries = this.getEntries({ projectName, taskName });
    const grouped = new Map<string, ResourceEntry[]>();

    entries.forEach(entry => {
      const key = `${entry.projectName}::${entry.taskName}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(entry);
    });

    const metrics: EfficiencyMetric[] = [];

    grouped.forEach((taskEntries, key) => {
      const [project, task] = key.split('::');
      const totalInput = taskEntries.reduce((sum, e) => sum + e.quantity, 0);
      const totalOutput = taskEntries.reduce((sum, e) => sum + (e.output || 0), 0);
      const efficiencyRatio = totalOutput > 0 ? totalOutput / totalInput : 0;

      const resourceBreakdown: Record<string, number> = {};
      taskEntries.forEach(e => {
        resourceBreakdown[e.resourceType] = (resourceBreakdown[e.resourceType] || 0) + e.quantity;
      });

      // Calculate waste (simplified: entries with low output)
      const lowOutputEntries = taskEntries.filter(e => (e.output || 0) < e.quantity * 0.5);
      const wastePercentage = (lowOutputEntries.length / taskEntries.length) * 100;

      // Determine trend (simplified: compare last 3 vs previous 3)
      const sorted = [...taskEntries].sort((a, b) => a.timestamp - b.timestamp);
      const recent = sorted.slice(-3);
      const previous = sorted.slice(-6, -3);
      const recentAvg = recent.reduce((sum, e) => sum + (e.output || 0) / e.quantity, 0) / recent.length;
      const prevAvg = previous.length > 0 
        ? previous.reduce((sum, e) => sum + (e.output || 0) / e.quantity, 0) / previous.length 
        : recentAvg;
      
      let trend: 'improving' | 'declining' | 'stable' = 'stable';
      if (recentAvg > prevAvg * 1.1) trend = 'improving';
      else if (recentAvg < prevAvg * 0.9) trend = 'declining';

      metrics.push({
        taskName: task,
        projectName: project,
        totalInput,
        totalOutput,
        efficiencyRatio,
        resourceBreakdown,
        wastePercentage,
        trend,
      });
    });

    return metrics;
  }

  detectBottlenecks(): Bottleneck[] {
    const metrics = this.calculateEfficiency();
    const bottlenecks: Bottleneck[] = [];

    metrics.forEach(metric => {
      // Low efficiency bottleneck
      if (metric.efficiencyRatio < 0.5) {
        bottlenecks.push({
          type: 'efficiency',
          severity: metric.efficiencyRatio < 0.3 ? 'high' : 'medium',
          description: `${metric.taskName} has low efficiency ratio (${(metric.efficiencyRatio * 100).toFixed(1)}%)`,
          affectedTasks: [metric.taskName],
          suggestedAction: 'Review task procedures and optimize resource allocation',
          estimatedImprovement: (0.7 - metric.efficiencyRatio) * 100,
        });
      }

      // High waste bottleneck
      if (metric.wastePercentage > 30) {
        bottlenecks.push({
          type: 'waste',
          severity: metric.wastePercentage > 50 ? 'high' : 'medium',
          description: `${metric.taskName} has ${metric.wastePercentage.toFixed(1)}% waste`,
          affectedTasks: [metric.taskName],
          suggestedAction: 'Identify and eliminate wasteful steps, batch similar activities',
          estimatedImprovement: metric.wastePercentage * 0.6,
        });
      }

      // Declining trend bottleneck
      if (metric.trend === 'declining') {
        bottlenecks.push({
          type: 'efficiency',
          severity: 'medium',
          description: `${metric.taskName} efficiency is declining over time`,
          affectedTasks: [metric.taskName],
          suggestedAction: 'Investigate recent changes and restore best practices',
          estimatedImprovement: 15,
        });
      }

      // High time consumption
      if (metric.resourceBreakdown['time'] > 100) {
        bottlenecks.push({
          type: 'time',
          severity: metric.resourceBreakdown['time'] > 200 ? 'high' : 'low',
          description: `${metric.taskName} consumes ${metric.resourceBreakdown['time']} time units`,
          affectedTasks: [metric.taskName],
          suggestedAction: 'Consider automation, delegation, or process streamlining',
          estimatedImprovement: 20,
        });
      }

      // High cost
      if (metric.resourceBreakdown['money'] > 10000) {
        bottlenecks.push({
          type: 'cost',
          severity: metric.resourceBreakdown['money'] > 50000 ? 'high' : 'medium',
          description: `${metric.taskName} has high costs: $${metric.resourceBreakdown['money'].toLocaleString()}`,
          affectedTasks: [metric.taskName],
          suggestedAction: 'Review vendor contracts, explore alternatives, negotiate better rates',
          estimatedImprovement: 25,
        });
      }
    });

    return bottlenecks.sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  compareResources(
    entity1: { projectName?: string; taskName?: string; startDate?: number; endDate?: number },
    entity2: { projectName?: string; taskName?: string; startDate?: number; endDate?: number }
  ): ComparisonResult[] {
    const entries1 = this.getEntries(entity1);
    const entries2 = this.getEntries(entity2);
    
    const metrics1 = this.calculateEfficiency(entity1.projectName, entity1.taskName);
    const metrics2 = this.calculateEfficiency(entity2.projectName, entity2.taskName);

    const totalInput1 = entries1.reduce((sum, e) => sum + e.quantity, 0);
    const totalInput2 = entries2.reduce((sum, e) => sum + e.quantity, 0);
    const totalOutput1 = entries1.reduce((sum, e) => sum + (e.output || 0), 0);
    const totalOutput2 = entries2.reduce((sum, e) => sum + (e.output || 0), 0);
    const efficiency1 = totalOutput1 / (totalInput1 || 1);
    const efficiency2 = totalOutput2 / (totalInput2 || 1);

    const entity1Name = entity1.taskName || entity1.projectName || 'Entity 1';
    const entity2Name = entity2.taskName || entity2.projectName || 'Entity 2';

    const results: ComparisonResult[] = [
      {
        entity1: entity1Name,
        entity2: entity2Name,
        metric: 'Total Input',
        value1: totalInput1,
        value2: totalInput2,
        difference: totalInput1 - totalInput2,
        percentageDiff: ((totalInput1 - totalInput2) / (totalInput2 || 1)) * 100,
        winner: totalInput1 < totalInput2 ? entity1Name : entity2Name,
      },
      {
        entity1: entity1Name,
        entity2: entity2Name,
        metric: 'Total Output',
        value1: totalOutput1,
        value2: totalOutput2,
        difference: totalOutput1 - totalOutput2,
        percentageDiff: ((totalOutput1 - totalOutput2) / (totalOutput2 || 1)) * 100,
        winner: totalOutput1 > totalOutput2 ? entity1Name : entity2Name,
      },
      {
        entity1: entity1Name,
        entity2: entity2Name,
        metric: 'Efficiency Ratio',
        value1: efficiency1,
        value2: efficiency2,
        difference: efficiency1 - efficiency2,
        percentageDiff: ((efficiency1 - efficiency2) / (efficiency2 || 1)) * 100,
        winner: efficiency1 > efficiency2 ? entity1Name : entity2Name,
      },
    ];

    return results;
  }

  addGoal(goal: Omit<Goal, 'id' | 'achieved'>): Goal {
    const newGoal: Goal = {
      ...goal,
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      achieved: goal.currentValue >= goal.targetValue,
    };
    this.goals.push(newGoal);
    return newGoal;
  }

  updateGoalProgress(goalId: string, currentValue: number): void {
    const goal = this.goals.find(g => g.id === goalId);
    if (goal) {
      goal.currentValue = currentValue;
      goal.achieved = currentValue >= goal.targetValue;
    }
  }

  getGoals(): Goal[] {
    return [...this.goals];
  }

  exportData(format: 'csv' | 'json'): string {
    if (format === 'json') {
      return JSON.stringify({
        entries: this.entries,
        goals: this.goals,
        metrics: this.calculateEfficiency(),
        bottlenecks: this.detectBottlenecks(),
      }, null, 2);
    } else {
      // CSV export
      const headers = ['ID', 'Timestamp', 'Resource Type', 'Quantity', 'Unit', 'Task', 'Project', 'Output', 'Notes'];
      const rows = this.entries.map(e => [
        e.id,
        new Date(e.timestamp).toISOString(),
        e.resourceType,
        e.quantity,
        e.unit,
        e.taskName,
        e.projectName,
        e.output || '',
        e.notes || '',
      ]);
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
  }

  importData(data: string, format: 'csv' | 'json'): void {
    if (format === 'json') {
      const parsed = JSON.parse(data);
      if (parsed.entries) this.entries = parsed.entries;
      if (parsed.goals) this.goals = parsed.goals;
    } else {
      // CSV import (simplified)
      const lines = data.split('\n').slice(1); // Skip header
      lines.forEach(line => {
        const [id, timestamp, resourceType, quantity, unit, taskName, projectName, output, notes] = line.split(',');
        if (id && timestamp) {
          this.entries.push({
            id,
            timestamp: new Date(timestamp).getTime(),
            resourceType: resourceType as any,
            quantity: parseFloat(quantity),
            unit,
            taskName,
            projectName,
            category: '',
            output: output ? parseFloat(output) : undefined,
            notes,
          });
        }
      });
    }
  }
}
