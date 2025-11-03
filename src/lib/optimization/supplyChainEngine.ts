// Supply Chain and Logistics Optimization Engine

export interface SupplyChainNode {
  id: string;
  name: string;
  type: 'supplier' | 'manufacturer' | 'warehouse' | 'distributor' | 'retailer' | 'customer';
  location: { lat: number; lng: number };
  capacity: number;
  inventoryLevel: number;
  reorderPoint: number;
  safetyStock: number;
  leadTime: number; // days
  cost: {
    holding: number; // per unit per day
    ordering: number; // per order
    stockout: number; // per unit
    shipping: number; // per unit per km
  };
}

export interface SupplyChainLink {
  from: string;
  to: string;
  distance: number; // km
  transitTime: number; // days
  cost: number; // per unit
  capacity: number;
}

export interface InventoryPolicy {
  node: string;
  orderQuantity: number;
  reorderPoint: number;
  safetyStock: number;
  leadTime: number;
}

export interface SupplyChainOptimization {
  inventoryPolicies: InventoryPolicy[];
  routingPlan: Map<string, Array<{ from: string; to: string; quantity: number }>>;
  totalCost: number;
  serviceLevel: number; // % of demand met
  averageInventory: number;
  averageFillRate: number;
  recommendations: string[];
}

export class SupplyChainEngine {
  /**
   * Economic Order Quantity (EOQ) calculation
   */
  calculateEOQ(
    annualDemand: number,
    orderingCost: number,
    holdingCost: number
  ): { eoq: number; totalCost: number; ordersPerYear: number } {
    const eoq = Math.sqrt((2 * annualDemand * orderingCost) / holdingCost);
    const ordersPerYear = annualDemand / eoq;
    const totalCost = (annualDemand / eoq) * orderingCost + (eoq / 2) * holdingCost;

    return { eoq, totalCost, ordersPerYear };
  }

  /**
   * Reorder Point with lead time and safety stock
   */
  calculateReorderPoint(
    demandRate: number, // units per day
    leadTime: number, // days
    safetyStock: number
  ): number {
    return demandRate * leadTime + safetyStock;
  }

  /**
   * Safety Stock calculation using service level
   */
  calculateSafetyStock(
    demandStdDev: number,
    leadTime: number,
    serviceLevel: number = 0.95
  ): number {
    // Z-score for service level (95% = 1.65, 99% = 2.33)
    const zScore = serviceLevel >= 0.99 ? 2.33 : serviceLevel >= 0.95 ? 1.65 : 1.28;
    return zScore * demandStdDev * Math.sqrt(leadTime);
  }

  /**
   * Multi-echelon inventory optimization
   */
  optimizeInventoryLevels(
    nodes: SupplyChainNode[],
    demandForecast: Map<string, number>
  ): SupplyChainOptimization {
    const inventoryPolicies: InventoryPolicy[] = [];
    let totalCost = 0;
    const recommendations: string[] = [];

    nodes.forEach(node => {
      const demand = demandForecast.get(node.id) || 1000;
      const eoqResult = this.calculateEOQ(
        demand * 365, // annual demand
        node.cost.ordering,
        node.cost.holding
      );

      const safetyStock = this.calculateSafetyStock(
        demand * 0.2, // assume 20% std dev
        node.leadTime,
        0.95
      );

      const reorderPoint = this.calculateReorderPoint(
        demand,
        node.leadTime,
        safetyStock
      );

      inventoryPolicies.push({
        node: node.id,
        orderQuantity: eoqResult.eoq,
        reorderPoint,
        safetyStock,
        leadTime: node.leadTime,
      });

      totalCost += eoqResult.totalCost + safetyStock * node.cost.holding * 365;

      // Generate recommendations
      if (node.inventoryLevel < safetyStock) {
        recommendations.push(
          `${node.name}: Current inventory (${node.inventoryLevel}) below safety stock (${safetyStock.toFixed(0)}). Reorder immediately.`
        );
      }

      if (eoqResult.eoq > node.capacity * 0.8) {
        recommendations.push(
          `${node.name}: Optimal order quantity (${eoqResult.eoq.toFixed(0)}) near capacity limit (${node.capacity}). Consider increasing capacity.`
        );
      }
    });

    return {
      inventoryPolicies,
      routingPlan: new Map(),
      totalCost,
      serviceLevel: 0.95,
      averageInventory: inventoryPolicies.reduce((sum, p) => sum + p.safetyStock + p.orderQuantity / 2, 0),
      averageFillRate: 0.95,
      recommendations,
    };
  }

  /**
   * Vehicle Routing Problem (VRP) - simplified heuristic
   */
  solveVRP(
    depot: { lat: number; lng: number },
    customers: Array<{ id: string; lat: number; lng: number; demand: number }>,
    vehicleCapacity: number,
    numVehicles: number
  ): Array<{
    vehicle: number;
    route: string[];
    totalDistance: number;
    load: number;
  }> {
    const routes: Array<{ vehicle: number; route: string[]; totalDistance: number; load: number }> = [];
    const unvisited = new Set(customers.map(c => c.id));

    for (let v = 0; v < numVehicles && unvisited.size > 0; v++) {
      const route: string[] = [];
      let currentLoad = 0;
      let currentPos = depot;
      let totalDistance = 0;

      while (unvisited.size > 0) {
        // Find nearest unvisited customer
        let nearest: typeof customers[0] | null = null;
        let minDist = Infinity;

        customers.forEach(customer => {
          if (!unvisited.has(customer.id)) return;
          if (currentLoad + customer.demand > vehicleCapacity) return;

          const dist = this.calculateDistance(
            currentPos.lat, currentPos.lng,
            customer.lat, customer.lng
          );

          if (dist < minDist) {
            minDist = dist;
            nearest = customer;
          }
        });

        if (!nearest) break;

        route.push(nearest.id);
        unvisited.delete(nearest.id);
        currentLoad += nearest.demand;
        totalDistance += minDist;
        currentPos = { lat: nearest.lat, lng: nearest.lng };
      }

      // Return to depot
      totalDistance += this.calculateDistance(
        currentPos.lat, currentPos.lng,
        depot.lat, depot.lng
      );

      routes.push({
        vehicle: v + 1,
        route,
        totalDistance,
        load: currentLoad,
      });
    }

    return routes;
  }

  /**
   * Calculate distance between two points (Haversine formula)
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Bullwhip effect analysis
   */
  analyzeBullwhipEffect(
    demandVariance: number[],
    orderVariance: number[]
  ): { bullwhipRatio: number; severity: 'low' | 'medium' | 'high' } {
    const avgDemandVar = demandVariance.reduce((a, b) => a + b, 0) / demandVariance.length;
    const avgOrderVar = orderVariance.reduce((a, b) => a + b, 0) / orderVariance.length;
    
    const bullwhipRatio = avgOrderVar / avgDemandVar;
    
    let severity: 'low' | 'medium' | 'high';
    if (bullwhipRatio < 1.5) severity = 'low';
    else if (bullwhipRatio < 3) severity = 'medium';
    else severity = 'high';

    return { bullwhipRatio, severity };
  }

  /**
   * ABC Analysis for inventory classification
   */
  performABCAnalysis(
    items: Array<{ id: string; annualUsageValue: number }>
  ): Map<string, 'A' | 'B' | 'C'> {
    const sorted = [...items].sort((a, b) => b.annualUsageValue - a.annualUsageValue);
    const total = sorted.reduce((sum, item) => sum + item.annualUsageValue, 0);
    
    const classification = new Map<string, 'A' | 'B' | 'C'>();
    let cumulative = 0;

    sorted.forEach(item => {
      cumulative += item.annualUsageValue;
      const percentage = (cumulative / total) * 100;

      if (percentage <= 80) {
        classification.set(item.id, 'A');
      } else if (percentage <= 95) {
        classification.set(item.id, 'B');
      } else {
        classification.set(item.id, 'C');
      }
    });

    return classification;
  }
}
