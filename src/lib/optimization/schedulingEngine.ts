// Scheduling and Timetabling Engine for Operations Research

export interface Task {
  id: string;
  name: string;
  duration: number; // hours or days
  earliestStart: number;
  latestStart: number;
  earliestFinish: number;
  latestFinish: number;
  slack: number;
  predecessors: string[];
  successors: string[];
  resourceRequirements: Map<string, number>;
  priority: number;
  deadline?: number;
  assignedTo?: string[];
}

export interface Resource {
  id: string;
  name: string;
  capacity: number;
  cost: number;
  availability: number[]; // availability by time period
  skills: string[];
}

export interface Schedule {
  tasks: Map<string, Task>;
  assignments: Map<string, string[]>; // task ID -> resource IDs
  makespan: number; // total project duration
  criticalPath: string[];
  resourceUtilization: Map<string, number>;
  totalCost: number;
  feasible: boolean;
}

export class SchedulingEngine {
  /**
   * Critical Path Method (CPM) - finds longest path through project
   */
  calculateCriticalPath(tasks: Task[]): { criticalPath: string[]; makespan: number } {
    const taskMap = new Map(tasks.map(t => [t.id, t]));
    
    // Forward pass - calculate earliest start/finish
    const sorted = this.topologicalSort(tasks);
    sorted.forEach(taskId => {
      const task = taskMap.get(taskId)!;
      
      if (task.predecessors.length === 0) {
        task.earliestStart = 0;
      } else {
        task.earliestStart = Math.max(
          ...task.predecessors.map(predId => {
            const pred = taskMap.get(predId)!;
            return pred.earliestFinish;
          })
        );
      }
      task.earliestFinish = task.earliestStart + task.duration;
    });

    // Find project makespan
    const makespan = Math.max(...Array.from(taskMap.values()).map(t => t.earliestFinish));

    // Backward pass - calculate latest start/finish
    sorted.reverse().forEach(taskId => {
      const task = taskMap.get(taskId)!;
      
      if (task.successors.length === 0) {
        task.latestFinish = makespan;
      } else {
        task.latestFinish = Math.min(
          ...task.successors.map(succId => {
            const succ = taskMap.get(succId)!;
            return succ.latestStart;
          })
        );
      }
      task.latestStart = task.latestFinish - task.duration;
      task.slack = task.latestStart - task.earliestStart;
    });

    // Find critical path (tasks with zero slack)
    const criticalPath = Array.from(taskMap.values())
      .filter(t => t.slack === 0)
      .map(t => t.id);

    return { criticalPath, makespan };
  }

  /**
   * Resource-Constrained Project Scheduling
   */
  scheduleWithResources(
    tasks: Task[],
    resources: Resource[]
  ): Schedule {
    const taskMap = new Map(tasks.map(t => [t.id, t]));
    const resourceMap = new Map(resources.map(r => [r.id, r]));
    const assignments = new Map<string, string[]>();
    const resourceUtilization = new Map<string, number>();

    // Initialize resource utilization
    resources.forEach(r => resourceUtilization.set(r.id, 0));

    // Sort tasks by priority and earliest start
    const sortedTasks = [...tasks].sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      return a.earliestStart - b.earliestStart;
    });

    let totalCost = 0;
    let feasible = true;

    // Assign resources to tasks
    sortedTasks.forEach(task => {
      const requiredResources: string[] = [];
      let taskFeasible = true;

      // Try to assign required resources
      for (const [resourceType, amount] of task.resourceRequirements.entries()) {
        const availableResources = resources.filter(r => 
          r.skills.includes(resourceType) && 
          resourceUtilization.get(r.id)! + amount <= r.capacity
        );

        if (availableResources.length === 0) {
          taskFeasible = false;
          feasible = false;
          break;
        }

        // Choose cheapest available resource
        const chosen = availableResources.sort((a, b) => a.cost - b.cost)[0];
        requiredResources.push(chosen.id);
        resourceUtilization.set(chosen.id, resourceUtilization.get(chosen.id)! + amount);
        totalCost += chosen.cost * task.duration * amount;
      }

      if (taskFeasible) {
        assignments.set(task.id, requiredResources);
      }
    });

    const { criticalPath, makespan } = this.calculateCriticalPath(tasks);

    return {
      tasks: taskMap,
      assignments,
      makespan,
      criticalPath,
      resourceUtilization,
      totalCost,
      feasible,
    };
  }

  /**
   * Shift Scheduling Optimization
   */
  optimizeShiftSchedule(
    workers: Resource[],
    shifts: Array<{ start: number; end: number; requiredWorkers: number }>,
    days: number
  ): Map<string, number[]> {
    const schedule = new Map<string, number[]>();
    
    workers.forEach(worker => {
      const assignments: number[] = [];
      for (let day = 0; day < days; day++) {
        // Simple greedy assignment
        const shift = shifts.find(s => worker.availability[day % worker.availability.length] > 0);
        assignments.push(shift ? shifts.indexOf(shift) : -1);
      }
      schedule.set(worker.id, assignments);
    });

    return schedule;
  }

  /**
   * Topological sort for task dependencies
   */
  private topologicalSort(tasks: Task[]): string[] {
    const visited = new Set<string>();
    const sorted: string[] = [];
    const taskMap = new Map(tasks.map(t => [t.id, t]));

    const visit = (taskId: string) => {
      if (visited.has(taskId)) return;
      visited.add(taskId);

      const task = taskMap.get(taskId)!;
      task.predecessors.forEach(predId => visit(predId));
      sorted.push(taskId);
    };

    tasks.forEach(task => visit(task.id));
    return sorted;
  }

  /**
   * Generate Gantt chart data
   */
  generateGanttData(schedule: Schedule): Array<{
    task: string;
    start: number;
    duration: number;
    end: number;
    critical: boolean;
    resources: string[];
  }> {
    return Array.from(schedule.tasks.values()).map(task => ({
      task: task.name,
      start: task.earliestStart,
      duration: task.duration,
      end: task.earliestFinish,
      critical: schedule.criticalPath.includes(task.id),
      resources: schedule.assignments.get(task.id) || [],
    }));
  }

  /**
   * What-if analysis for schedule changes
   */
  analyzeScheduleChange(
    baseSchedule: Schedule,
    taskId: string,
    newDuration: number
  ): { impactedTasks: string[]; newMakespan: number; delay: number } {
    const tasks = Array.from(baseSchedule.tasks.values());
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
      return { impactedTasks: [], newMakespan: baseSchedule.makespan, delay: 0 };
    }

    // Create modified task list
    const modifiedTasks = tasks.map(t => 
      t.id === taskId ? { ...t, duration: newDuration } : t
    );

    const { criticalPath, makespan } = this.calculateCriticalPath(modifiedTasks);
    
    // Find impacted tasks (those on critical path)
    const impactedTasks = criticalPath.filter(id => 
      !baseSchedule.criticalPath.includes(id) || id === taskId
    );

    return {
      impactedTasks,
      newMakespan: makespan,
      delay: makespan - baseSchedule.makespan,
    };
  }
}
