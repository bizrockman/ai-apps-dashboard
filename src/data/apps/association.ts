import React from 'react';
import { Search, AlertTriangle, Users2, Megaphone, BookText, Handshake, TrendingDown, Globe } from 'lucide-react';
import { KiApp } from '../../types';

export const associationApps: KiApp[] = [
  {
    id: 'marketresearch',
    name: 'Market Research AI',
    description: 'Comprehensive market analysis',
    icon: React.createElement(Search, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Association/MarketResearchAI')),
  },
  {
    id: 'crisismanagement',
    name: 'Crisis Management AI',
    description: 'Crisis detection and response',
    icon: React.createElement(AlertTriangle, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Association/CrisisManagementAI')),
  },
  {
    id: 'memberinfo',
    name: 'Member Info AI',
    description: 'Member information and analytics',
    icon: React.createElement(Users2, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Association/MemberInfoAI')),
  },
  {
    id: 'publicrelations',
    name: 'Public Relations AI',
    description: 'PR strategy and communication',
    icon: React.createElement(Megaphone, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Association/PublicRelationsAI')),
  },
  {
    id: 'policyanalysis',
    name: 'Policy Analysis AI',
    description: 'Legislative impact analysis',
    icon: React.createElement(BookText, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Association/PolicyAnalysisAI')),
  },
  {
    id: 'stakeholder',
    name: 'Stakeholder AI',
    description: 'Stakeholder management',
    icon: React.createElement(Handshake, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Association/StakeholderAI')),
  },
  {
    id: 'economicimpact',
    name: 'Economic Impact AI',
    description: 'Economic analysis and forecasting',
    icon: React.createElement(TrendingDown, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Association/EconomicImpactAI')),
  },
  {
    id: 'international',
    name: 'International AI',
    description: 'International trade relations',
    icon: React.createElement(Globe, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Association/InternationalAI')),
  }
];