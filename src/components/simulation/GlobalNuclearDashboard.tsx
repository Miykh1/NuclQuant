import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GlobalIndexData } from '@/types/globalData';
import { GlobalDataProvider } from '@/lib/data/globalDataProvider';
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Globe, TrendingUp, Zap, Leaf, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export const GlobalNuclearDashboard = () => {
  const [data, setData] = useState<GlobalIndexData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['US', 'FR', 'CN']);
  const [dateRange, setDateRange] = useState<'30d' | '90d' | '1y'>('90d');

  const dataProvider = new GlobalDataProvider();

  const loadData = async () => {
    setLoading(true);
    try {
      const globalData = await dataProvider.fetchGlobalData();
      setData(globalData);
      toast({
        title: "Data Loaded",
        description: `Global nuclear data updated: ${new Date(globalData.lastUpdated).toLocaleString()}`,
      });
    } catch (error) {
      toast({
        title: "Error Loading Data",
        description: "Failed to fetch global nuclear data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!data) {
    return (
      <Card>
        <CardContent className="p-12 flex items-center justify-center">
          <Button onClick={loadData} disabled={loading}>
            {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Globe className="mr-2 h-4 w-4" />}
            {loading ? 'Loading...' : 'Load Global Data'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const filteredData = dataProvider.filterByCountry(data, selectedCountries);
  
  const getDaysBack = () => {
    switch(dateRange) {
      case '30d': return 30;
      case '90d': return 90;
      case '1y': return 365;
    }
  };
  
  const marketDataFiltered = data.marketData.slice(-getDaysBack());

  const countryOptions = data.nuclearData.map(d => ({
    code: d.countryCode,
    name: d.country,
  }));

  const worldTotalCapacity = data.nuclearData.reduce((sum, d) => sum + d.totalCapacityMW, 0);
  const worldTotalGeneration = data.nuclearData.reduce((sum, d) => sum + d.annualGenerationGWh, 0);
  const worldTotalCO2Avoided = data.nuclearData.reduce((sum, d) => sum + d.co2Avoided, 0);

  const capacityData = filteredData.nuclearData.map(d => ({
    country: d.country,
    capacity: d.totalCapacityMW / 1000, // GW
    generation: d.annualGenerationGWh / 1000, // TWh
    reactors: d.reactorCount,
  }));

  const geopoliticalData = filteredData.geopoliticalIndicators.map(g => ({
    country: g.country,
    governance: g.governanceScore,
    stability: g.politicalStability,
    energySecurity: g.energySecurityIndex,
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Global Nuclear Index Dashboard
          </CardTitle>
          <CardDescription>
            Real-time aggregation of nuclear energy, market prices, and geopolitical indicators
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4 items-end flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Select Countries</label>
              <Select 
                value={selectedCountries.join(',')} 
                onValueChange={(v) => setSelectedCountries(v.split(','))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US,FR,CN">Major Producers</SelectItem>
                  <SelectItem value="US,FR,CN,RU,KR">Top 5</SelectItem>
                  <SelectItem value="US,FR,CN,RU,KR,CA,JP,GB,IN">Top 9</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Time Range</label>
              <Select value={dateRange} onValueChange={(v) => setDateRange(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={loadData} variant="outline" disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-secondary/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4" />
                World Capacity
              </div>
              <div className="text-2xl font-bold mt-1">
                {(worldTotalCapacity / 1000).toFixed(1)} GW
              </div>
            </div>

            <div className="bg-secondary/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                Annual Generation
              </div>
              <div className="text-2xl font-bold mt-1">
                {(worldTotalGeneration / 1000).toFixed(0)} TWh
              </div>
            </div>

            <div className="bg-secondary/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Leaf className="h-4 w-4" />
                CO₂ Avoided
              </div>
              <div className="text-2xl font-bold text-green-500 mt-1">
                {(worldTotalCO2Avoided / 1_000_000_000).toFixed(1)}B tons
              </div>
            </div>

            <div className="bg-secondary/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />
                Operating Reactors
              </div>
              <div className="text-2xl font-bold mt-1">
                {data.nuclearData.reduce((sum, d) => sum + d.reactorCount, 0)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Nuclear Capacity by Country</CardTitle>
            <CardDescription>Installed capacity and generation</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={capacityData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="country" angle={-45} textAnchor="end" height={100} />
                <YAxis label={{ value: 'GW / TWh', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="capacity" fill="hsl(var(--primary))" name="Capacity (GW)" />
                <Bar dataKey="generation" fill="hsl(var(--secondary))" name="Generation (TWh)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Energy Market Prices</CardTitle>
            <CardDescription>Historical price trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={marketDataFiltered}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis label={{ value: 'Price Index', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="uraniumPrice" stroke="hsl(var(--primary))" name="Uranium ($/lb)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="carbonPrice" stroke="hsl(var(--accent))" name="Carbon ($/ton)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Geopolitical Risk Matrix</CardTitle>
            <CardDescription>Governance vs. Energy Security</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  type="number" 
                  dataKey="governance" 
                  name="Governance Score" 
                  label={{ value: 'Governance Score', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="energySecurity" 
                  name="Energy Security" 
                  label={{ value: 'Energy Security Index', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Countries" data={geopoliticalData} fill="hsl(var(--primary))" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reactor Fleet Status</CardTitle>
            <CardDescription>Distribution by country</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={capacityData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="country" angle={-45} textAnchor="end" height={100} />
                <YAxis label={{ value: 'Number of Reactors', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="reactors" fill="hsl(var(--secondary))" name="Reactors" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Sources & Attribution</CardTitle>
          <CardDescription>All data sourced from publicly available datasets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="p-3 rounded-lg bg-muted/30">
                <div className="font-semibold text-primary mb-1">Energy Markets</div>
                <div className="text-muted-foreground mb-2">
                  U.S. Energy Information Administration (EIA) & International Energy Agency (IEA)
                </div>
                <a 
                  href="https://www.eia.gov/opendata/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  EIA Open Data API ↗
                </a>
              </div>
              
              <div className="p-3 rounded-lg bg-muted/30">
                <div className="font-semibold text-primary mb-1">Economic Indicators</div>
                <div className="text-muted-foreground mb-2">
                  World Bank Open Data for global economic metrics
                </div>
                <a 
                  href="https://data.worldbank.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  World Bank Data ↗
                </a>
              </div>
              
              <div className="p-3 rounded-lg bg-muted/30">
                <div className="font-semibold text-primary mb-1">Environmental Data</div>
                <div className="text-muted-foreground mb-2">
                  Our World in Data for CO₂ emissions and sustainability metrics
                </div>
                <a 
                  href="https://ourworldindata.org/energy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  Our World in Data ↗
                </a>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="text-sm text-muted-foreground">
                Last Updated: {new Date(data.lastUpdated).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                All data is for educational and simulation purposes
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
