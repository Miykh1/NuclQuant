import { ReactorParameters, FinancialParameters, PolicyParameters } from '@/types/simulation';

export type PolicyScenario = 
  | 'uranium_import_ban'
  | 'carbon_tax_increase'
  | 'subsidy_cut'
  | 'nuclear_phase_out'
  | 'accelerated_deployment'
  | 'waste_tax_increase'
  | 'insurance_mandate'
  | 'renewable_preference';

export interface PolicyImpact {
  scenario: PolicyScenario;
  name: string;
  description: string;
  modifiedReactorParams: ReactorParameters;
  modifiedFinancialParams: FinancialParameters;
  modifiedPolicyParams: PolicyParameters;
  expectedImpacts: {
    energyCostChange: number; // percentage
    portfolioLossExpected: number; // absolute value
    co2ReductionChange: number; // percentage
    reliabilityChange: number; // percentage
  };
}

export class PolicyEngine {
  simulatePolicyShock(
    scenario: PolicyScenario,
    baseReactor: ReactorParameters,
    baseFinancial: FinancialParameters,
    basePolicy: PolicyParameters
  ): PolicyImpact {
    const impacts: Record<PolicyScenario, () => PolicyImpact> = {
      uranium_import_ban: () => this.uraniumImportBan(baseReactor, baseFinancial, basePolicy),
      carbon_tax_increase: () => this.carbonTaxIncrease(baseReactor, baseFinancial, basePolicy),
      subsidy_cut: () => this.subsidyCut(baseReactor, baseFinancial, basePolicy),
      nuclear_phase_out: () => this.nuclearPhaseOut(baseReactor, baseFinancial, basePolicy),
      accelerated_deployment: () => this.acceleratedDeployment(baseReactor, baseFinancial, basePolicy),
      waste_tax_increase: () => this.wasteTaxIncrease(baseReactor, baseFinancial, basePolicy),
      insurance_mandate: () => this.insuranceMandate(baseReactor, baseFinancial, basePolicy),
      renewable_preference: () => this.renewablePreference(baseReactor, baseFinancial, basePolicy),
    };

    return impacts[scenario]();
  }

  private uraniumImportBan(
    reactor: ReactorParameters,
    financial: FinancialParameters,
    policy: PolicyParameters
  ): PolicyImpact {
    return {
      scenario: 'uranium_import_ban',
      name: 'Uranium Import Ban',
      description: 'Simulates sanctions or domestic supply restrictions on uranium',
      modifiedReactorParams: {
        ...reactor,
        uptimePercent: reactor.uptimePercent * 0.7, // 30% reduction in uptime
      },
      modifiedFinancialParams: {
        ...financial,
        fuelCostPerYear: financial.fuelCostPerYear * 2.5, // 150% increase
        electricityPricePerMWh: financial.electricityPricePerMWh * 1.3, // Supply shortage drives prices up
      },
      modifiedPolicyParams: policy,
      expectedImpacts: {
        energyCostChange: 130,
        portfolioLossExpected: 2500000000,
        co2ReductionChange: -30,
        reliabilityChange: -30,
      },
    };
  }

  private carbonTaxIncrease(
    reactor: ReactorParameters,
    financial: FinancialParameters,
    policy: PolicyParameters
  ): PolicyImpact {
    return {
      scenario: 'carbon_tax_increase',
      name: 'Carbon Tax Increase',
      description: 'Doubles carbon pricing to incentivize clean energy',
      modifiedReactorParams: reactor,
      modifiedFinancialParams: {
        ...financial,
        carbonTaxPerTon: financial.carbonTaxPerTon * 2,
        subsidyPerMWh: financial.subsidyPerMWh * 1.5, // Increased clean energy subsidies
      },
      modifiedPolicyParams: {
        ...policy,
        carbonTaxEnabled: true,
        subsidiesEnabled: true,
      },
      expectedImpacts: {
        energyCostChange: -15, // Negative = cost reduction for nuclear
        portfolioLossExpected: -500000000, // Negative = gain
        co2ReductionChange: 40,
        reliabilityChange: 5,
      },
    };
  }

  private subsidyCut(
    reactor: ReactorParameters,
    financial: FinancialParameters,
    policy: PolicyParameters
  ): PolicyImpact {
    return {
      scenario: 'subsidy_cut',
      name: 'Nuclear Subsidy Elimination',
      description: 'Removes all government subsidies for nuclear energy',
      modifiedReactorParams: reactor,
      modifiedFinancialParams: {
        ...financial,
        subsidyPerMWh: 0,
      },
      modifiedPolicyParams: {
        ...policy,
        subsidiesEnabled: false,
      },
      expectedImpacts: {
        energyCostChange: 25,
        portfolioLossExpected: 800000000,
        co2ReductionChange: -15,
        reliabilityChange: -10,
      },
    };
  }

  private nuclearPhaseOut(
    reactor: ReactorParameters,
    financial: FinancialParameters,
    policy: PolicyParameters
  ): PolicyImpact {
    return {
      scenario: 'nuclear_phase_out',
      name: 'Nuclear Phase-Out Policy',
      description: 'Mandates gradual shutdown of nuclear facilities',
      modifiedReactorParams: {
        ...reactor,
        plantLifespanYears: Math.floor(reactor.plantLifespanYears * 0.5),
        uptimePercent: reactor.uptimePercent * 0.8,
      },
      modifiedFinancialParams: {
        ...financial,
        decommissioningCost: financial.decommissioningCost * 1.5,
      },
      modifiedPolicyParams: {
        ...policy,
        subsidiesEnabled: false,
        publicAcceptanceFactor: 0.3,
      },
      expectedImpacts: {
        energyCostChange: 60,
        portfolioLossExpected: 5000000000,
        co2ReductionChange: -50,
        reliabilityChange: -40,
      },
    };
  }

  private acceleratedDeployment(
    reactor: ReactorParameters,
    financial: FinancialParameters,
    policy: PolicyParameters
  ): PolicyImpact {
    return {
      scenario: 'accelerated_deployment',
      name: 'Accelerated Nuclear Deployment',
      description: 'Government program to rapidly expand nuclear capacity',
      modifiedReactorParams: {
        ...reactor,
        type: 'SMR', // Favor SMRs for faster deployment
      },
      modifiedFinancialParams: {
        ...financial,
        constructionCostPerMW: financial.constructionCostPerMW * 0.7, // Economies of scale
        subsidyPerMWh: financial.subsidyPerMWh * 2,
      },
      modifiedPolicyParams: {
        ...policy,
        subsidiesEnabled: true,
        publicAcceptanceFactor: 0.85,
      },
      expectedImpacts: {
        energyCostChange: -30,
        portfolioLossExpected: -1500000000,
        co2ReductionChange: 70,
        reliabilityChange: 20,
      },
    };
  }

  private wasteTaxIncrease(
    reactor: ReactorParameters,
    financial: FinancialParameters,
    policy: PolicyParameters
  ): PolicyImpact {
    return {
      scenario: 'waste_tax_increase',
      name: 'Nuclear Waste Tax Increase',
      description: 'Doubles the cost of nuclear waste management',
      modifiedReactorParams: reactor,
      modifiedFinancialParams: financial,
      modifiedPolicyParams: {
        ...policy,
        wasteManagementCost: policy.wasteManagementCost * 2,
      },
      expectedImpacts: {
        energyCostChange: 15,
        portfolioLossExpected: 600000000,
        co2ReductionChange: -5,
        reliabilityChange: 0,
      },
    };
  }

  private insuranceMandate(
    reactor: ReactorParameters,
    financial: FinancialParameters,
    policy: PolicyParameters
  ): PolicyImpact {
    return {
      scenario: 'insurance_mandate',
      name: 'Stricter Insurance Requirements',
      description: 'Mandates higher insurance coverage for nuclear accidents',
      modifiedReactorParams: reactor,
      modifiedFinancialParams: {
        ...financial,
        insuranceCostPerYear: financial.insuranceCostPerYear * 2.5,
      },
      modifiedPolicyParams: {
        ...policy,
        accidentInsuranceMultiplier: policy.accidentInsuranceMultiplier * 2,
      },
      expectedImpacts: {
        energyCostChange: 20,
        portfolioLossExpected: 450000000,
        co2ReductionChange: 0,
        reliabilityChange: 10, // Better safety standards
      },
    };
  }

  private renewablePreference(
    reactor: ReactorParameters,
    financial: FinancialParameters,
    policy: PolicyParameters
  ): PolicyImpact {
    return {
      scenario: 'renewable_preference',
      name: 'Renewable Energy Preference',
      description: 'Policy shift favoring renewables over nuclear',
      modifiedReactorParams: reactor,
      modifiedFinancialParams: {
        ...financial,
        electricityPricePerMWh: financial.electricityPricePerMWh * 0.85, // Lower prices due to competition
        subsidyPerMWh: financial.subsidyPerMWh * 0.5,
      },
      modifiedPolicyParams: {
        ...policy,
        subsidiesEnabled: true,
        publicAcceptanceFactor: 0.5,
      },
      expectedImpacts: {
        energyCostChange: 10,
        portfolioLossExpected: 350000000,
        co2ReductionChange: -10,
        reliabilityChange: -5,
      },
    };
  }
}
