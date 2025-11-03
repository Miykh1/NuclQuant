import { SimulationResult, MonteCarloResult, ReactorParameters, FinancialParameters, PolicyParameters } from '@/types/simulation';

export const exportToCSV = (
  result: SimulationResult,
  reactorParams: ReactorParameters,
  financialParams: FinancialParameters
): void => {
  const headers = [
    'Year',
    'Energy Produced (MWh)',
    'Revenue ($M)',
    'Operating Cost ($M)',
    'Cash Flow ($M)',
    'Cumulative Cash Flow ($M)',
    'CO2 Avoided (tons)',
    'Waste Produced (tons)',
    'Fuel Temperature (°C)',
    'Coolant Temperature (°C)',
    'Reactivity (k-eff)',
  ].join(',');

  const rows = result.yearlyData.map(d => [
    d.year,
    d.energyProduced.toFixed(2),
    (d.revenue / 1_000_000).toFixed(2),
    (d.operatingCost / 1_000_000).toFixed(2),
    (d.cashFlow / 1_000_000).toFixed(2),
    (d.cumulativeCashFlow / 1_000_000).toFixed(2),
    d.co2Avoided.toFixed(2),
    d.wasteProduced.toFixed(4),
    d.fuelTemperature.toFixed(2),
    d.coolantTemperature.toFixed(2),
    d.reactivity.toFixed(4),
  ].join(','));

  const csv = [
    `# Nuclear Reactor Simulation Results`,
    `# Reactor: ${reactorParams.type} - ${reactorParams.capacityMW}MW`,
    `# Fuel: ${reactorParams.fuelType} at ${reactorParams.enrichmentPercent}% enrichment`,
    `# Generated: ${new Date().toISOString()}`,
    '',
    headers,
    ...rows,
    '',
    `# Summary Metrics`,
    `NPV,$${(result.npv / 1_000_000).toFixed(2)}M`,
    `IRR,${(result.irr * 100).toFixed(2)}%`,
    `Payback Period,${result.paybackYears.toFixed(1)} years`,
    `Total Energy,${(result.energyProducedMWh / 1_000_000).toFixed(2)} TWh`,
    `Total CO2 Avoided,${(result.co2Avoided / 1_000_000).toFixed(2)}M tons`,
    `Total Waste,${result.wasteProduced.toFixed(2)} tons`,
    `Accident Probability,${(result.accidentProbability * 100).toFixed(4)}%`,
  ].join('\n');

  downloadFile(csv, 'simulation_results.csv', 'text/csv');
};

export const exportMonteCarloToCSV = (result: MonteCarloResult): void => {
  const headers = ['Scenario', 'NPV ($M)', 'IRR (%)', 'Payback (years)'].join(',');
  
  const rows = result.scenarios.map((s, i) => [
    i + 1,
    (s.npv / 1_000_000).toFixed(2),
    (s.irr * 100).toFixed(2),
    s.paybackYears.toFixed(2),
  ].join(','));

  const csv = [
    `# Monte Carlo Risk Analysis Results`,
    `# Scenarios: ${result.scenarios.length}`,
    `# Generated: ${new Date().toISOString()}`,
    '',
    headers,
    ...rows,
    '',
    `# Statistical Summary`,
    `Mean NPV,$${(result.meanNPV / 1_000_000).toFixed(2)}M`,
    `Median NPV,$${(result.medianNPV / 1_000_000).toFixed(2)}M`,
    `Std Dev NPV,$${(result.stdDevNPV / 1_000_000).toFixed(2)}M`,
    `Profit Probability,${(result.probabilityProfit * 100).toFixed(2)}%`,
    `5th Percentile NPV,$${(result.percentile5 / 1_000_000).toFixed(2)}M`,
    `95th Percentile NPV,$${(result.percentile95 / 1_000_000).toFixed(2)}M`,
    `Mean IRR,${(result.meanIRR * 100).toFixed(2)}%`,
  ].join('\n');

  downloadFile(csv, 'montecarlo_analysis.csv', 'text/csv');
};

const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
