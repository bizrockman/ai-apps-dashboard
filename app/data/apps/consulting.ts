import React from 'react';
import { LineChart, PieChart, TrendingUp, Network, Briefcase, Building, FileText, Lightbulb } from 'lucide-react';
import { KiApp } from '../../types';

export const consultingApps: KiApp[] = [
  {
    id: 'marketanalysis',
    name: 'Market Analysis AI',
    description: 'Advanced market trend analysis',
    icon: React.createElement(LineChart, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Consulting/MarketAnalysisAI')),
  },
  {
    id: 'financialai',
    name: 'Financial AI',
    description: 'Financial forecasting and analysis',
    icon: React.createElement(PieChart, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Consulting/FinancialAI')),
  },
  {
    id: 'strategyai',
    name: 'Strategy AI',
    description: 'Strategic planning assistance',
    icon: React.createElement(TrendingUp, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Consulting/StrategyAI')),
  },
  {
    id: 'processai',
    name: 'Process AI',
    description: 'Business process optimization',
    icon: React.createElement(Network, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Consulting/ProcessAI')),
  },
  {
    id: 'hranalyticsai',
    name: 'HR Analytics AI',
    description: 'Workforce analytics insights',
    icon: React.createElement(Briefcase, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Consulting/HRAnalyticsAI')),
  },
  {
    id: 'mergerai',
    name: 'M&A AI',
    description: 'Mergers and acquisitions analysis',
    icon: React.createElement(Building, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Consulting/MergerAI')),
  },
  {
    id: 'complianceai',
    name: 'Compliance AI',
    description: 'Regulatory compliance monitoring',
    icon: React.createElement(FileText, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Consulting/ComplianceAI')),
  },
  {
    id: 'innovationai',
    name: 'Innovation AI',
    description: 'Innovation opportunity analysis',
    icon: React.createElement(Lightbulb, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Consulting/InnovationAI')),
  }
];