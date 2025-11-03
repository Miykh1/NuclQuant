# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

# Nuclear Energy Simulation Platform - Complete User Guide

Welcome! This guide explains every feature in simple terms for everyone.

## What This App Does

- **Simulate nuclear power plants** - Test reactor designs economically and environmentally
- **Analyze finances** - See if projects are profitable
- **Optimize resources** - Track time, money, materials, energy with Helios
- **Compare scenarios** - Import/export and compare different simulations
- **Write code** - JavaScript, Python, C++, R, MATLAB execution
- **View global data** - Real-world nuclear statistics

## Quick Start

1. Click **Templates** tab → Load "Small Modular Reactor"
2. Click blue **Run Simulation** button
3. Click **Results** tab to see outcomes
4. Click **Save Session** to compare later
5. Click **Export** to save results

## Key Features

### Configuration Tab
Set up your reactor and financial parameters.

### Results Tab
View NPV (profit), IRR (return %), Payback Years, and charts.

### Helios Tab
- **Resource Logger** - Track any resource (time/money/energy/materials)
- **Dashboard** - Visual charts of usage
- **Efficiency Analyzer** - Get improvement suggestions
- **Advanced Code Editor** - Write/run code in 5 languages with real-time collaboration
- **Import/Export** - Save your work

### Global Tab
- **Nuclear Dashboard** - World reactor data (credited to EIA, IEA, World Bank, Our World in Data)
- **Efficiency Optimizer** - Operations research tools for supply chain, scheduling, forecasting

### Scenario Comparison
- Save multiple simulation runs
- Import scenarios from .json files
- Export individual or all scenarios
- Compare NPV, IRR, and other metrics side-by-side

## Key Terms

**NPV** - Net Present Value (profit in today's dollars)
**IRR** - Internal Rate of Return (% annual return)
**LCOE** - Levelized Cost of Electricity (average cost per MWh)
**Monte Carlo** - Run 5000 simulations to see probability ranges
**Helios** - Universal resource optimization tool

## Data Sources

All global nuclear data credited to:
- **U.S. Energy Information Administration (EIA)**
- **International Energy Agency (IEA)**
- **World Bank**
- **Our World in Data**

## Getting Help

- Hover over (?) icons for tooltips
- Use templates to learn by example
- Start simple, add complexity gradually

Version 1.0 | Educational simulation tool - consult professionals for real projects
