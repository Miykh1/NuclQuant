import { useState, useCallback } from 'react';
import { SimulationHeader } from '@/components/simulation/SimulationHeader';
import { ReactorConfig } from '@/components/simulation/ReactorConfig';
import { FinancialConfig } from '@/components/simulation/FinancialConfig';
import { PolicyConfig } from '@/components/simulation/PolicyConfig';
import { ResultsDashboard } from '@/components/simulation/ResultsDashboard';
import { CashFlowChart } from '@/components/simulation/CashFlowChart';
import { EnvironmentalChart } from '@/components/simulation/EnvironmentalChart';
import { MonteCarloChart } from '@/components/simulation/MonteCarloChart';
import { ThermalChart } from '@/components/simulation/ThermalChart';
import { ReactivityChart } from '@/components/simulation/ReactivityChart';
import { AccidentScenarios } from '@/components/simulation/AccidentScenarios';
import { RiskMetrics } from '@/components/simulation/RiskMetrics';
import { PresetTemplates } from '@/components/simulation/PresetTemplates';
import { SensitivityAnalysis } from '@/components/simulation/SensitivityAnalysis';
import { ScenarioComparison } from '@/components/simulation/ScenarioComparison';
import { NeutronFluxChart } from '@/components/simulation/NeutronFluxChart';
import { PowerDistributionChart } from '@/components/simulation/PowerDistributionChart';
import { DecayHeatChart } from '@/components/simulation/DecayHeatChart';
import { FissionProductsChart } from '@/components/simulation/FissionProductsChart';
import { BreakEvenAnalysis } from '@/components/simulation/BreakEvenAnalysis';
import { CorrelationAnalysis } from '@/components/simulation/CorrelationAnalysis';
import { PolicyShockSimulator } from '@/components/simulation/PolicyShockSimulator';
import { PortfolioOptimizer } from '@/components/simulation/PortfolioOptimizer';
import { GlobalNuclearDashboard } from '@/components/simulation/GlobalNuclearDashboard';
import { GlobalEfficiencyOptimizer } from '@/components/simulation/GlobalEfficiencyOptimizer';
import { HeliosOperator } from '@/components/helios/HeliosOperator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReactorParameters, FinancialParameters, PolicyParameters, SimulationResult, MonteCarloResult } from '@/types/simulation';
import { REACTOR_SPECS } from '@/constants/reactorData';
import { SimulationEngine } from '@/lib/simulation/simulationEngine';
import { MonteCarloEngine } from '@/lib/simulation/monteCarloEngine';
import { CorrelationEngine } from '@/lib/simulation/correlationEngine';
import { PolicyEngine, PolicyScenario, PolicyImpact } from '@/lib/simulation/policyEngine';
import { PortfolioEngine, OptimizedPortfolio } from '@/lib/simulation/portfolioEngine';
import { exportToCSV, exportMonteCarloToCSV } from '@/lib/utils/exportUtils';
import { Play, Dices, Loader2, Download, Upload, Save, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { SimulationSession } from '@/types/simulation';

const Index = () => {
  const [reactorParams, setReactorParams] = useState<ReactorParameters>({
    type: 'PWR',
    fuelType: 'U-235',
    enrichmentPercent: 5,
    thermalEfficiency: 0.33,
    uptimePercent: 90,
    capacityMW: 1000,
    plantLifespanYears: 40,
    moderatorType: 'Light Water',
    geometry: 'Cylindrical',
    controlRodInsertion: 50,
    coolantFlowRate: 15000,
  });

  const [financialParams, setFinancialParams] = useState<FinancialParameters>({
    constructionCostPerMW: 6000,
    annualOperatingCost: 25,
    fuelCostPerYear: 40,
    decommissioningCost: 500,
    insuranceCostPerYear: 10,
    electricityPricePerMWh: 75,
    discountRate: 0.08,
    inflationRate: 0.025,
    carbonTaxPerTon: 50,
    subsidyPerMWh: 5,
  });

  const [policyParams, setPolicyParams] = useState<PolicyParameters>({
    carbonTaxEnabled: true,
    subsidiesEnabled: true,
    wasteManagementCost: 100000,
    accidentInsuranceMultiplier: 1.5,
    publicAcceptanceFactor: 0.7,
  });

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [monteCarloResult, setMonteCarloResult] = useState<MonteCarloResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isMonteCarloRunning, setIsMonteCarloRunning] = useState(false);
  const [sessionName, setSessionName] = useState<string>('');
  const [comparisonSessions, setComparisonSessions] = useState<SimulationSession[]>([]);
  
  // Advanced analysis states
  const [fluxData, setFluxData] = useState<any>(null);
  const [powerData, setPowerData] = useState<any>(null);
  const [decayData, setDecayData] = useState<any>(null);
  const [fissionData, setFissionData] = useState<any>(null);
  const [correlationMetrics, setCorrelationMetrics] = useState<any>(null);
  const [policyImpact, setPolicyImpact] = useState<PolicyImpact | null>(null);
  const [optimizedPortfolio, setOptimizedPortfolio] = useState<OptimizedPortfolio | null>(null);

  const runSimulation = () => {
    setIsRunning(true);
    
    setTimeout(() => {
      const engine = new SimulationEngine();
      const simResult = engine.runSimulation(reactorParams, financialParams, policyParams);
      setResult(simResult);
      
      // Calculate advanced physics data
      const neutronicsEngine = engine.getNeutronicsEngine();
      const decayEngine = engine.getDecayEngine();
      
      const flux = neutronicsEngine.calculateNeutronFlux(reactorParams, 50);
      const power = neutronicsEngine.calculatePowerDistribution(reactorParams, 100);
      const decay = decayEngine.calculateDecayHeat(reactorParams, 1000);
      const fission = decayEngine.calculateFissionProducts(reactorParams, reactorParams.plantLifespanYears);
      
      setFluxData(flux);
      setPowerData(power);
      setDecayData(decay);
      setFissionData(fission);
      
      setIsRunning(false);
      
      toast({
        title: "Simulation Complete",
        description: `NPV: $${(simResult.npv / 1_000_000).toFixed(1)}M | IRR: ${(simResult.irr * 100).toFixed(2)}%`,
      });
    }, 500);
  };

  const runMonteCarlo = () => {
    setIsMonteCarloRunning(true);
    
    setTimeout(() => {
      const engine = new MonteCarloEngine();
      const mcResult = engine.runMonteCarloSimulation(
        reactorParams,
        financialParams,
        policyParams,
        5000
      );
      setMonteCarloResult(mcResult);
      
      // Calculate correlation metrics
      if (result) {
        const correlationEngine = new CorrelationEngine();
        const metrics = correlationEngine.calculateNuclearFinancialCorrelation(mcResult, result);
        setCorrelationMetrics(metrics);
      }
      
      setIsMonteCarloRunning(false);
      
      toast({
        title: "Monte Carlo Analysis Complete",
        description: `Mean NPV: $${(mcResult.meanNPV / 1_000_000).toFixed(1)}M | Profit Probability: ${(mcResult.probabilityProfit * 100).toFixed(1)}%`,
      });
    }, 1500);
  };

  const saveSession = () => {
    if (!result) {
      toast({
        title: "No Simulation Data",
        description: "Please run a simulation before saving.",
        variant: "destructive",
      });
      return;
    }

    const session: SimulationSession = {
      id: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      reactorParams,
      financialParams,
      policyParams,
      result,
      monteCarloResult: monteCarloResult || undefined,
      name: sessionName || `Simulation ${new Date().toLocaleString()}`,
    };

    const dataStr = JSON.stringify(session, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${session.name.replace(/[^a-z0-9]/gi, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Session Saved",
      description: `Downloaded: ${session.name}.json`,
    });
  };

  const loadSession = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const session: SimulationSession = JSON.parse(e.target?.result as string);
        
        setReactorParams(session.reactorParams);
        setFinancialParams(session.financialParams);
        setPolicyParams(session.policyParams);
        setResult(session.result);
        setMonteCarloResult(session.monteCarloResult || null);
        setSessionName(session.name || '');

        toast({
          title: "Session Loaded",
          description: `Loaded: ${session.name}`,
        });
      } catch (error) {
        toast({
          title: "Load Failed",
          description: "Invalid session file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const exportResults = (type: 'simulation' | 'montecarlo' | 'both') => {
    let data: any = {};
    let filename = '';

    if (type === 'simulation' && result) {
      data = { result, parameters: { reactorParams, financialParams, policyParams } };
      filename = 'simulation_results.json';
    } else if (type === 'montecarlo' && monteCarloResult) {
      data = { monteCarloResult, parameters: { reactorParams, financialParams, policyParams } };
      filename = 'montecarlo_results.json';
    } else if (type === 'both' && result) {
      data = { result, monteCarloResult, parameters: { reactorParams, financialParams, policyParams } };
      filename = 'complete_results.json';
    } else {
      toast({
        title: "No Data",
        description: "No results available to export.",
        variant: "destructive",
      });
      return;
    }

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `Downloaded: ${filename}`,
    });
  };

  const loadPreset = useCallback((
    reactor: ReactorParameters,
    financial: FinancialParameters,
    policy: PolicyParameters
  ) => {
    setReactorParams(reactor);
    setFinancialParams(financial);
    setPolicyParams(policy);
    
    toast({
      title: "Preset Loaded",
      description: "Configuration applied successfully",
    });
  }, []);

  const runPolicyScenario = useCallback((scenario: PolicyScenario) => {
    const policyEngine = new PolicyEngine();
    const impact = policyEngine.simulatePolicyShock(scenario, reactorParams, financialParams, policyParams);
    setPolicyImpact(impact);
    
    // Run simulation with modified params
    setTimeout(() => {
      const engine = new SimulationEngine();
      const simResult = engine.runSimulation(impact.modifiedReactorParams, impact.modifiedFinancialParams, impact.modifiedPolicyParams);
      setResult(simResult);
      
      toast({
        title: "Policy Scenario Complete",
        description: impact.name,
      });
    }, 500);
  }, [reactorParams, financialParams, policyParams]);

  const optimizePortfolio = useCallback((riskTolerance: number, timeHorizon: number) => {
    const portfolioEngine = new PortfolioEngine();
    const portfolio = portfolioEngine.optimizePortfolio(undefined, timeHorizon, riskTolerance);
    setOptimizedPortfolio(portfolio);
    
    toast({
      title: "Portfolio Optimized",
      description: `Sharpe Ratio: ${portfolio.sharpeRatio.toFixed(2)}`,
    });
  }, []);

  const runAccidentScenario = useCallback((scenarioId: string) => {
    toast({
      title: "Running Accident Scenario",
      description: `Simulating ${scenarioId.replace('_', ' ').toUpperCase()}...`,
    });
    
    // Modify reactor params based on scenario
    const scenarioParams = { ...reactorParams };
    
    switch(scenarioId) {
      case 'loca':
        scenarioParams.coolantFlowRate = scenarioParams.coolantFlowRate * 0.3; // 70% coolant loss
        break;
      case 'blackout':
        scenarioParams.uptimePercent = scenarioParams.uptimePercent * 0.5; // 50% downtime
        break;
      case 'rod_ejection':
        scenarioParams.controlRodInsertion = 0; // All rods out
        break;
      case 'pump_failure':
        scenarioParams.coolantFlowRate = scenarioParams.coolantFlowRate * 0.6; // 40% flow reduction
        break;
    }
    
    setTimeout(() => {
      const engine = new SimulationEngine();
      const simResult = engine.runSimulation(scenarioParams, financialParams, policyParams);
      setResult(simResult);
      
      toast({
        title: "Scenario Complete",
        description: `Accident probability: ${(simResult.accidentProbability * 100).toFixed(4)}%`,
        variant: simResult.accidentProbability > 0.01 ? "destructive" : "default",
      });
    }, 800);
  }, [reactorParams, financialParams, policyParams]);

  return (
    <div className="min-h-screen bg-background">
      <SimulationHeader />
      
      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="config" className="space-y-8">
          <TabsList className="grid w-full grid-cols-7 lg:w-full">
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="presets">Templates</TabsTrigger>
            <TabsTrigger value="results" disabled={!result}>Results</TabsTrigger>
            <TabsTrigger value="physics" disabled={!fluxData}>Physics</TabsTrigger>
            <TabsTrigger value="risk" disabled={!monteCarloResult}>Risk</TabsTrigger>
            <TabsTrigger value="global">Global</TabsTrigger>
            <TabsTrigger value="helios">Helios</TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="space-y-6">
            <PresetTemplates onLoadPreset={loadPreset} />
            <AccidentScenarios params={reactorParams} onRunScenario={runAccidentScenario} />
            <PolicyShockSimulator onRunScenario={runPolicyScenario} currentImpact={policyImpact || undefined} />
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ReactorConfig params={reactorParams} onChange={setReactorParams} />
              <div className="space-y-6">
                <FinancialConfig params={financialParams} onChange={setFinancialParams} />
                <PolicyConfig params={policyParams} onChange={setPolicyParams} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={runSimulation} 
                  size="lg"
                  disabled={isRunning}
                  className="bg-primary hover:bg-primary/90 shadow-glow transition-smooth"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Run Simulation
                    </>
                  )}
                </Button>

                <Button 
                  onClick={runMonteCarlo} 
                  size="lg"
                  variant="outline"
                  disabled={isMonteCarloRunning}
                  className="border-secondary text-secondary hover:bg-secondary/10 transition-smooth"
                >
                  {isMonteCarloRunning ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Running 5000 scenarios...
                    </>
                  ) : (
                    <>
                      <Dices className="mr-2 h-5 w-5" />
                      Run Monte Carlo (5000)
                    </>
                  )}
                </Button>
              </div>

              <div className="flex gap-2 justify-center items-center flex-wrap">
                <input
                  type="text"
                  placeholder="Session name (optional)"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  className="px-4 py-2 rounded-md bg-background/50 border border-primary/20 text-sm"
                />
                <Button 
                  onClick={saveSession}
                  size="sm"
                  variant="outline"
                  disabled={!result}
                  className="border-accent text-accent hover:bg-accent/10"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Session
                </Button>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".json"
                    onChange={loadSession}
                    className="hidden"
                  />
                  <Button 
                    size="sm"
                    variant="outline"
                    className="border-secondary text-secondary hover:bg-secondary/10"
                    asChild
                  >
                    <span>
                      <Upload className="mr-2 h-4 w-4" />
                      Load Session
                    </span>
                  </Button>
                </label>
                <Button 
                  onClick={() => exportResults('both')}
                  size="sm"
                  variant="outline"
                  disabled={!result}
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export All
                </Button>
                <Button 
                  onClick={() => exportToCSV(result, reactorParams, financialParams)}
                  size="sm"
                  variant="outline"
                  disabled={!result}
                  className="border-secondary text-secondary hover:bg-secondary/10"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {result && (
              <>
                <ResultsDashboard result={result} />
                <BreakEvenAnalysis result={result} financialParams={financialParams} />
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <CashFlowChart data={result.yearlyData} />
                  <EnvironmentalChart data={result.yearlyData} />
                  <ThermalChart data={result.yearlyData} />
                  <ReactivityChart data={result.yearlyData} />
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="physics" className="space-y-6">
            {fluxData && powerData && decayData && fissionData && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <NeutronFluxChart fluxData={fluxData} />
                <PowerDistributionChart powerData={powerData} />
                <DecayHeatChart decayData={decayData} />
                <FissionProductsChart fissionData={fissionData} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            {monteCarloResult && (
              <>
                <RiskMetrics result={monteCarloResult} />
                {correlationMetrics && <CorrelationAnalysis metrics={correlationMetrics} />}
                {optimizedPortfolio && <PortfolioOptimizer portfolio={optimizedPortfolio} onOptimize={optimizePortfolio} />}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <MonteCarloChart result={monteCarloResult} />
                  <SensitivityAnalysis monteCarloResult={monteCarloResult} />
                </div>
                <ScenarioComparison 
                  sessions={comparisonSessions}
                  onRemoveSession={(id) => setComparisonSessions(prev => prev.filter(s => s.id !== id))}
                />
                <div className="flex justify-center">
                  <Button 
                    onClick={() => exportMonteCarloToCSV(monteCarloResult)}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Export Monte Carlo CSV
                  </Button>
                </div>
                {!optimizedPortfolio && (
                  <Button onClick={() => optimizePortfolio(0.5, 40)} className="w-full">
                    Run Portfolio Optimization
                  </Button>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="global" className="space-y-6">
            <GlobalNuclearDashboard />
            <GlobalEfficiencyOptimizer />
          </TabsContent>

          <TabsContent value="helios" className="space-y-6">
            <HeliosOperator />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
