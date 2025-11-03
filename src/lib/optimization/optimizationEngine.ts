// Global Efficiency Optimizer - Universal Decision and Resource Engine
// For Operations Research, Supply Chain, Logistics, Scheduling, Project Management

export interface OptimizationNode {
  id: string;
  name: string;
  type: 'source' | 'facility' | 'sink' | 'warehouse' | 'plant' | 'supplier' | 'factory' | 'distribution' | 'customer' | 'task' | 'milestone';
  cost: number; // USD, kWh, hours, etc.
  capacity: { min: number; max: number };
  reliability: number; // 0-1
  environmental: number; // CO2 or impact score
  position?: { x: number; y: number };
  // Operations Research fields
  processingTime?: number; // hours or days
  setupCost?: number;
  inventory?: number;
  leadTime?: number; // days
  demandRate?: number; // units per period
  safetyStock?: number;
  priority?: number; // 1-10 for scheduling
  deadline?: Date;
  dependencies?: string[]; // node IDs this depends on
  resourceRequirements?: Map<string, number>;
  skillRequirements?: string[];
}

export interface OptimizationEdge {
  id: string;
  source: string;
  target: string;
  cost: number;
  capacity: { min: number; max: number };
  distance?: number;
  reliability: number;
}

export interface OptimizationGoal {
  objective: 'minimize_cost' | 'minimize_energy' | 'minimize_co2' | 'maximize_throughput' | 'maximize_profit' | 'maximize_resilience';
  weight: number;
}

export interface OptimizationConstraint {
  type: 'budget' | 'supply' | 'demand' | 'capacity' | 'geographic' | 'connection';
  value: number;
  nodes?: string[];
  edges?: string[];
}

export interface OptimizationConfig {
  nodes: OptimizationNode[];
  edges: OptimizationEdge[];
  goals: OptimizationGoal[];
  constraints: OptimizationConstraint[];
}

export interface OptimizationSolution {
  feasible: boolean;
  objectiveValue: number;
  nodeFlows: Map<string, number>;
  edgeFlows: Map<string, number>;
  nodeLoads: Map<string, number>;
  totalCost: number;
  totalEnergy: number;
  totalCO2: number;
  totalThroughput: number;
  bottlenecks: Array<{ id: string; type: 'node' | 'edge'; unused: number; recommendation: string }>;
  recommendations: string[];
}

export class OptimizationEngine {
  /**
   * Solves the optimization problem using a simplified linear programming approach
   * For production use, this would integrate with javascript-lp-solver or glpk.js
   */
  solve(config: OptimizationConfig): OptimizationSolution {
    // Validate configuration
    if (config.nodes.length === 0) {
      return this.createEmptySolution();
    }

    // Build network graph
    const graph = this.buildGraph(config);
    
    // Apply primary optimization algorithm based on goals
    const primaryGoal = config.goals[0];
    let solution: OptimizationSolution;

    switch (primaryGoal?.objective) {
      case 'minimize_cost':
        solution = this.minimizeCost(graph, config);
        break;
      case 'minimize_energy':
        solution = this.minimizeEnergy(graph, config);
        break;
      case 'minimize_co2':
        solution = this.minimizeCO2(graph, config);
        break;
      case 'maximize_throughput':
        solution = this.maximizeThroughput(graph, config);
        break;
      case 'maximize_profit':
        solution = this.maximizeProfit(graph, config);
        break;
      case 'maximize_resilience':
        solution = this.maximizeResilience(graph, config);
        break;
      default:
        solution = this.minimizeCost(graph, config);
    }

    // Apply constraints
    solution = this.applyConstraints(solution, config);

    // Generate recommendations
    solution.recommendations = this.generateRecommendations(solution, config);

    return solution;
  }

  private buildGraph(config: OptimizationConfig): Map<string, any> {
    const graph = new Map();
    
    config.nodes.forEach(node => {
      graph.set(node.id, {
        ...node,
        inEdges: [],
        outEdges: [],
      });
    });

    config.edges.forEach(edge => {
      const sourceNode = graph.get(edge.source);
      const targetNode = graph.get(edge.target);
      
      if (sourceNode) sourceNode.outEdges.push(edge);
      if (targetNode) targetNode.inEdges.push(edge);
    });

    return graph;
  }

  private minimizeCost(graph: Map<string, any>, config: OptimizationConfig): OptimizationSolution {
    const nodeFlows = new Map<string, number>();
    const edgeFlows = new Map<string, number>();
    const nodeLoads = new Map<string, number>();
    let totalCost = 0;
    let totalEnergy = 0;
    let totalCO2 = 0;

    // Simple greedy algorithm: use cheapest paths
    config.nodes.forEach(node => {
      const nodeData = graph.get(node.id);
      if (nodeData.type === 'source' || nodeData.type === 'plant') {
        const flow = node.capacity.min;
        nodeFlows.set(node.id, flow);
        nodeLoads.set(node.id, (flow / node.capacity.max) * 100);
        totalCost += node.cost * flow;
        totalEnergy += flow;
        totalCO2 += node.environmental * flow;

        // Distribute flow through cheapest edges
        const sortedEdges = nodeData.outEdges.sort((a: OptimizationEdge, b: OptimizationEdge) => a.cost - b.cost);
        let remainingFlow = flow;
        
        sortedEdges.forEach((edge: OptimizationEdge) => {
          if (remainingFlow > 0) {
            const edgeFlow = Math.min(remainingFlow, edge.capacity.max);
            edgeFlows.set(edge.id, edgeFlow);
            totalCost += edge.cost * edgeFlow;
            remainingFlow -= edgeFlow;
          }
        });
      }
    });

    return {
      feasible: true,
      objectiveValue: totalCost,
      nodeFlows,
      edgeFlows,
      nodeLoads,
      totalCost,
      totalEnergy,
      totalCO2,
      totalThroughput: totalEnergy,
      bottlenecks: this.identifyBottlenecks(config, nodeFlows, edgeFlows),
      recommendations: [],
    };
  }

  private minimizeEnergy(graph: Map<string, any>, config: OptimizationConfig): OptimizationSolution {
    // Similar to minimizeCost but optimize for energy efficiency
    return this.minimizeCost(graph, config);
  }

  private minimizeCO2(graph: Map<string, any>, config: OptimizationConfig): OptimizationSolution {
    const nodeFlows = new Map<string, number>();
    const edgeFlows = new Map<string, number>();
    const nodeLoads = new Map<string, number>();
    let totalCost = 0;
    let totalEnergy = 0;
    let totalCO2 = 0;

    // Prioritize nodes with lowest environmental impact
    const sortedNodes = [...config.nodes].sort((a, b) => a.environmental - b.environmental);

    sortedNodes.forEach(node => {
      if (node.type === 'source' || node.type === 'plant') {
        const flow = node.capacity.min;
        nodeFlows.set(node.id, flow);
        nodeLoads.set(node.id, (flow / node.capacity.max) * 100);
        totalCost += node.cost * flow;
        totalEnergy += flow;
        totalCO2 += node.environmental * flow;
      }
    });

    return {
      feasible: true,
      objectiveValue: totalCO2,
      nodeFlows,
      edgeFlows,
      nodeLoads,
      totalCost,
      totalEnergy,
      totalCO2,
      totalThroughput: totalEnergy,
      bottlenecks: this.identifyBottlenecks(config, nodeFlows, edgeFlows),
      recommendations: [],
    };
  }

  private maximizeThroughput(graph: Map<string, any>, config: OptimizationConfig): OptimizationSolution {
    const nodeFlows = new Map<string, number>();
    const edgeFlows = new Map<string, number>();
    const nodeLoads = new Map<string, number>();
    let totalCost = 0;
    let totalEnergy = 0;
    let totalCO2 = 0;

    // Maximize flow by using maximum capacities
    config.nodes.forEach(node => {
      if (node.type === 'source' || node.type === 'plant') {
        const flow = node.capacity.max * node.reliability;
        nodeFlows.set(node.id, flow);
        nodeLoads.set(node.id, 100);
        totalCost += node.cost * flow;
        totalEnergy += flow;
        totalCO2 += node.environmental * flow;
      }
    });

    return {
      feasible: true,
      objectiveValue: totalEnergy,
      nodeFlows,
      edgeFlows,
      nodeLoads,
      totalCost,
      totalEnergy,
      totalCO2,
      totalThroughput: totalEnergy,
      bottlenecks: this.identifyBottlenecks(config, nodeFlows, edgeFlows),
      recommendations: [],
    };
  }

  private maximizeProfit(graph: Map<string, any>, config: OptimizationConfig): OptimizationSolution {
    // Profit = Revenue - Cost
    // Assume revenue is proportional to throughput
    const throughputSolution = this.maximizeThroughput(graph, config);
    const revenue = throughputSolution.totalThroughput * 100; // $100 per unit
    const profit = revenue - throughputSolution.totalCost;

    return {
      ...throughputSolution,
      objectiveValue: profit,
    };
  }

  private maximizeResilience(graph: Map<string, any>, config: OptimizationConfig): OptimizationSolution {
    const nodeFlows = new Map<string, number>();
    const edgeFlows = new Map<string, number>();
    const nodeLoads = new Map<string, number>();
    let totalCost = 0;
    let totalEnergy = 0;
    let totalCO2 = 0;

    // Diversify across multiple nodes for resilience
    config.nodes.forEach(node => {
      if (node.type === 'source' || node.type === 'plant') {
        const flow = (node.capacity.min + node.capacity.max) / 2 * node.reliability;
        nodeFlows.set(node.id, flow);
        nodeLoads.set(node.id, 50); // Operate at 50% for redundancy
        totalCost += node.cost * flow;
        totalEnergy += flow;
        totalCO2 += node.environmental * flow;
      }
    });

    const resilienceScore = this.calculateResilience(config, nodeFlows);

    return {
      feasible: true,
      objectiveValue: resilienceScore,
      nodeFlows,
      edgeFlows,
      nodeLoads,
      totalCost,
      totalEnergy,
      totalCO2,
      totalThroughput: totalEnergy,
      bottlenecks: this.identifyBottlenecks(config, nodeFlows, edgeFlows),
      recommendations: [],
    };
  }

  private calculateResilience(config: OptimizationConfig, nodeFlows: Map<string, number>): number {
    // Resilience based on diversity and redundancy
    const activeNodes = Array.from(nodeFlows.values()).filter(f => f > 0).length;
    const totalNodes = config.nodes.length;
    const avgReliability = config.nodes.reduce((sum, n) => sum + n.reliability, 0) / totalNodes;
    
    return (activeNodes / totalNodes) * avgReliability * 100;
  }

  private applyConstraints(solution: OptimizationSolution, config: OptimizationConfig): OptimizationSolution {
    // Apply budget constraint
    const budgetConstraint = config.constraints.find(c => c.type === 'budget');
    if (budgetConstraint && solution.totalCost > budgetConstraint.value) {
      solution.feasible = false;
      solution.recommendations.push(
        `Budget exceeded: $${solution.totalCost.toFixed(0)} > $${budgetConstraint.value.toFixed(0)}`
      );
    }

    return solution;
  }

  private identifyBottlenecks(
    config: OptimizationConfig,
    nodeFlows: Map<string, number>,
    edgeFlows: Map<string, number>
  ): Array<{ id: string; type: 'node' | 'edge'; unused: number; recommendation: string }> {
    const bottlenecks: Array<{ id: string; type: 'node' | 'edge'; unused: number; recommendation: string }> = [];

    // Check node utilization
    config.nodes.forEach(node => {
      const flow = nodeFlows.get(node.id) || 0;
      const utilization = flow / node.capacity.max;
      const unused = (1 - utilization) * 100;

      if (unused > 25) {
        bottlenecks.push({
          id: node.id,
          type: 'node',
          unused,
          recommendation: `Node ${node.name} has ${unused.toFixed(0)}% unused capacity. Consider reducing capacity or increasing utilization.`,
        });
      }
    });

    // Check edge utilization
    config.edges.forEach(edge => {
      const flow = edgeFlows.get(edge.id) || 0;
      const utilization = flow / edge.capacity.max;
      const unused = (1 - utilization) * 100;

      if (unused > 25) {
        bottlenecks.push({
          id: edge.id,
          type: 'edge',
          unused,
          recommendation: `Connection ${edge.source} → ${edge.target} has ${unused.toFixed(0)}% unused capacity.`,
        });
      }
    });

    return bottlenecks;
  }

  private generateRecommendations(solution: OptimizationSolution, config: OptimizationConfig): string[] {
    const recommendations: string[] = [];

    // Add bottleneck recommendations
    solution.bottlenecks.slice(0, 3).forEach(b => {
      recommendations.push(b.recommendation);
    });

    // Cost optimization
    if (solution.totalCost > 0) {
      const avgCost = solution.totalCost / solution.totalThroughput;
      recommendations.push(
        `Average cost per unit: $${avgCost.toFixed(2)}. Consider negotiating bulk discounts or alternative suppliers.`
      );
    }

    // Environmental impact
    if (solution.totalCO2 > 0) {
      const co2PerUnit = solution.totalCO2 / solution.totalThroughput;
      recommendations.push(
        `CO₂ emissions: ${co2PerUnit.toFixed(2)} kg/unit. Consider renewable energy sources to reduce environmental impact.`
      );
    }

    return recommendations;
  }

  private createEmptySolution(): OptimizationSolution {
    return {
      feasible: false,
      objectiveValue: 0,
      nodeFlows: new Map(),
      edgeFlows: new Map(),
      nodeLoads: new Map(),
      totalCost: 0,
      totalEnergy: 0,
      totalCO2: 0,
      totalThroughput: 0,
      bottlenecks: [],
      recommendations: ['No nodes defined. Please add nodes to the system.'],
    };
  }

  /**
   * Scenario comparison - runs optimization for multiple configurations
   */
  compareScenarios(scenarios: Array<{ name: string; config: OptimizationConfig }>): Array<{
    name: string;
    solution: OptimizationSolution;
  }> {
    return scenarios.map(scenario => ({
      name: scenario.name,
      solution: this.solve(scenario.config),
    }));
  }
}
