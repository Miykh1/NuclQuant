import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { ForecastingEngine } from '@/lib/optimization/forecastingEngine';
import { TrendingUp, Activity, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

export const ForecastingDashboard = () => {
  const [forecastResult, setForecastResult] = useState<any>(null);
  const [method, setMethod] = useState<string>('linear');

  // Sample historical data (could be demand, revenue, inventory, etc.)
  const sampleData = [
    120, 135, 140, 155, 160, 148, 152, 165, 170, 158, 162, 175,
    180, 195, 200, 185, 190, 205, 210, 198, 202, 215, 220, 208,
    212, 225, 230, 218, 222, 235, 240, 228, 232, 245, 250, 238,
  ];

  const runForecast = () => {
    const engine = new ForecastingEngine();
    let result;

    switch (method) {
      case 'linear':
        result = engine.linearRegression(sampleData, 12);
        break;
      case 'holt-winters':
        result = engine.holtWinters(sampleData, 0.3, 0.1, 0.1, 12, 12);
        break;
      default:
        result = engine.linearRegression(sampleData, 12);
    }

    setForecastResult(result);
    toast.success('Forecast generated', {
      description: `Method: ${result.method}, R²: ${result.r2.toFixed(3)}`,
    });
  };

  const chartData: any[] = sampleData.map((value, index) => ({
    period: index + 1,
    actual: value,
  }));

  if (forecastResult) {
    forecastResult.predictions.forEach((pred: number, idx: number) => {
      chartData.push({
        period: sampleData.length + idx + 1,
        actual: undefined,
        forecast: pred,
        lower: forecastResult.confidence.lower[idx],
        upper: forecastResult.confidence.upper[idx],
      });
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          Demand Forecasting & Predictive Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Forecasting Method</label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linear">Linear Regression</SelectItem>
                <SelectItem value="holt-winters">Holt-Winters Seasonal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={runForecast} className="shadow-glow">
            <Activity className="mr-2 h-4 w-4" />
            Generate Forecast
          </Button>
        </div>

        {forecastResult && (
          <>
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">R² Score</div>
                  <div className="text-2xl font-bold text-primary">
                    {forecastResult.r2.toFixed(3)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Goodness of fit
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">MAPE</div>
                  <div className="text-2xl font-bold text-green-500">
                    {forecastResult.mape.toFixed(2)}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Prediction accuracy
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">RMSE</div>
                  <div className="text-2xl font-bold text-blue-500">
                    {forecastResult.rmse.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Root mean square error
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Forecast with Confidence Intervals</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="period" 
                      stroke="hsl(var(--muted-foreground))"
                      label={{ value: 'Time Period', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      label={{ value: 'Value', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))' 
                      }}
                    />
                    <Legend />
                    
                    {/* Confidence interval */}
                    <Area
                      type="monotone"
                      dataKey="upper"
                      stroke="none"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.1}
                      name="95% Upper Bound"
                    />
                    <Area
                      type="monotone"
                      dataKey="lower"
                      stroke="none"
                      fill="hsl(var(--background))"
                      fillOpacity={1}
                      name="95% Lower Bound"
                    />
                    
                    {/* Actual and forecast lines */}
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="hsl(var(--chart-1))" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="Historical Data"
                      connectNulls={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="forecast" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 3 }}
                      name="Forecast"
                      connectNulls={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}

        {!forecastResult && (
          <div className="p-12 text-center border-2 border-dashed rounded-lg">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Select a forecasting method and click "Generate Forecast" to see predictions
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
