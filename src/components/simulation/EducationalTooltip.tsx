import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface EducationalTooltipProps {
  term: string;
  definition: string;
  formula?: string;
  citation?: string;
}

export const EducationalTooltip = ({ term, definition, formula, citation }: EducationalTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
            <span className="border-b border-dashed border-primary/50">{term}</span>
            <HelpCircle className="h-3 w-3" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm p-4 bg-background border-primary/20">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-primary">{term}</p>
            <p className="text-xs text-muted-foreground">{definition}</p>
            {formula && (
              <div className="pt-2 border-t border-primary/10">
                <p className="text-xs font-mono bg-background/50 p-2 rounded border border-primary/10">
                  {formula}
                </p>
              </div>
            )}
            {citation && (
              <p className="text-xs italic text-muted-foreground pt-1">
                Source: {citation}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Predefined educational tooltips for common terms
export const EDUCATIONAL_TERMS = {
  NPV: {
    term: 'Net Present Value (NPV)',
    definition: 'The difference between the present value of cash inflows and outflows over time, discounted at a specified rate. Positive NPV indicates a profitable investment.',
    formula: 'NPV = Σ[CFₜ / (1 + r)ᵗ] - C₀',
    citation: 'Standard financial analysis (Brealey & Myers, Principles of Corporate Finance)',
  },
  IRR: {
    term: 'Internal Rate of Return (IRR)',
    definition: 'The discount rate at which the NPV of all cash flows equals zero. Higher IRR indicates better investment efficiency.',
    formula: 'NPV = 0 when r = IRR',
    citation: 'Standard financial analysis',
  },
  keff: {
    term: 'Effective Multiplication Factor (k_eff)',
    definition: 'The ratio of neutrons produced to neutrons absorbed in a reactor. k_eff = 1 for critical (steady-state) operation. k_eff > 1 means power increases, k_eff < 1 means power decreases.',
    formula: 'k_eff = (ν × Σ_f) / (Σ_a + D × B²)',
    citation: 'Lamarsh & Baratta, Introduction to Nuclear Engineering',
  },
  burnup: {
    term: 'Fuel Burnup',
    definition: 'A measure of how much energy has been extracted from nuclear fuel, typically measured in gigawatt-days per metric ton of uranium (GWd/MTU). Higher burnup means more efficient fuel use.',
    formula: 'Burnup = E / M_fuel (GWd/MTU)',
    citation: 'Nuclear Engineering Fundamentals',
  },
  thermalEfficiency: {
    term: 'Thermal Efficiency',
    definition: 'The ratio of electrical energy output to thermal energy input. Typical nuclear plants achieve 30-37% efficiency due to thermodynamic constraints (Carnot cycle).',
    formula: 'η = W_out / Q_in = 1 - T_cold / T_hot',
    citation: 'Thermodynamics fundamentals',
  },
  decayHeat: {
    term: 'Decay Heat',
    definition: 'Heat produced by radioactive decay of fission products after reactor shutdown. Typically 6-7% of operating power immediately after shutdown, following ~t^(-0.2) decay.',
    formula: 'P_decay ≈ P_0 × 0.066 × t^(-0.2)',
    citation: 'ANS-5.1 Decay Heat Standard',
  },
  LCOE: {
    term: 'Levelized Cost of Energy (LCOE)',
    definition: 'The average cost per unit of electricity generated over the lifetime of a power plant, accounting for all costs and energy production.',
    formula: 'LCOE = Σ[Costs / (1+r)ᵗ] / Σ[Energy / (1+r)ᵗ]',
    citation: 'NREL, EIA energy cost analysis',
  },
  VaR: {
    term: 'Value at Risk (VaR)',
    definition: 'A statistical measure of the maximum expected loss at a given confidence level. 95% VaR means there\'s a 5% chance of losing more than this amount.',
    formula: 'VaR₉₅ = Percentile₅(NPV distribution)',
    citation: 'Jorion, Value at Risk: The New Benchmark for Managing Financial Risk',
  },
  CVaR: {
    term: 'Conditional Value at Risk (CVaR)',
    definition: 'The expected loss given that the loss exceeds the VaR threshold. Also called Expected Shortfall. Measures tail risk.',
    formula: 'CVaR = E[Loss | Loss > VaR]',
    citation: 'Rockafellar & Uryasev, Risk management research',
  },
};
