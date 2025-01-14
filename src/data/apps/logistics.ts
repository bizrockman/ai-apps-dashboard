import React from 'react';
import { Leaf, Route, UserCog, Link2, HeartPulse, Boxes, Fuel, Headphones } from 'lucide-react';
import { KiApp } from '../../types';

export const logisticsApps: KiApp[] = [
  {
    id: 'sustainability',
    name: 'Sustainability AI',
    description: 'Environmental impact management',
    icon: React.createElement(Leaf, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Logistics/SustainabilityAI')),
  },
  {
    id: 'routeplanning',
    name: 'Route Planning AI',
    description: 'AI-powered route optimization',
    icon: React.createElement(Route, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Logistics/RoutePlanningAI')),
  },
  {
    id: 'workforce',
    name: 'Workforce AI',
    description: 'Personnel planning and scheduling',
    icon: React.createElement(UserCog, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Logistics/WorkforceAI')),
  },
  {
    id: 'supplychain',
    name: 'Supply Chain AI',
    description: 'Supply chain optimization',
    icon: React.createElement(Link2, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Logistics/SupplyChainAI')),
  },
  {
    id: 'safety',
    name: 'Safety AI',
    description: 'Safety monitoring and prevention',
    icon: React.createElement(HeartPulse, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Logistics/SafetyAI')),
  },
  {
    id: 'warehouse',
    name: 'Warehouse AI',
    description: 'Warehouse management',
    icon: React.createElement(Boxes, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Logistics/WarehouseAI')),
  },
  {
    id: 'fuelmanagement',
    name: 'Fuel Management AI',
    description: 'Fuel efficiency optimization',
    icon: React.createElement(Fuel, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Logistics/FuelManagementAI')),
  },
  {
    id: 'support',
    name: 'Support AI',
    description: 'Association support chat',
    icon: React.createElement(Headphones, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Logistics/SupportAI')),
  }
];