import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, TrendingUp, Truck, AlertCircle } from 'lucide-react';

interface SupplyChainDashboardProps {
  optimization: any;
}

export const SupplyChainDashboard = ({ optimization }: SupplyChainDashboardProps) => {
  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

  const inventoryData = optimization.inventoryPolicies?.map((policy: any, idx: number) => ({
    name: policy.node,
    orderQty: policy.orderQuantity,
    reorderPoint: policy.reorderPoint,
    safetyStock: policy.safetyStock,
  })) || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Avg Inventory</div>
                <div className="text-2xl font-bold">
                  {optimization.averageInventory?.toLocaleString() || 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-sm text-muted-foreground">Service Level</div>
                <div className="text-2xl font-bold text-green-500">
                  {((optimization.serviceLevel || 0) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Truck className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-sm text-muted-foreground">Fill Rate</div>
                <div className="text-2xl font-bold text-blue-500">
                  {((optimization.averageFillRate || 0) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div>
                <div className="text-sm text-muted-foreground">Total Cost</div>
                <div className="text-2xl font-bold text-primary">
                  ${optimization.totalCost?.toLocaleString() || 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Policies by Node</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))' 
                  }}
                />
                <Legend />
                <Bar dataKey="orderQty" fill="hsl(var(--primary))" name="Order Quantity" radius={[8, 8, 0, 0]} />
                <Bar dataKey="safetyStock" fill="hsl(var(--chart-2))" name="Safety Stock" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reorder Points</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))' 
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="reorderPoint" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Reorder Point"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {optimization.recommendations && optimization.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Supply Chain Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {optimization.recommendations.map((rec: string, idx: number) => (
                <div key={idx} className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <p className="text-sm">{rec}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
