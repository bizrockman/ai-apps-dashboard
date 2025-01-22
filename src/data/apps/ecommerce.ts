import React from 'react';
import { Package, Users, DollarSign, BarChart3, Target, Sparkles, Shield, Truck } from 'lucide-react';
import { KiApp } from '../../types';

export const ecommerceApps: KiApp[] = [
  {
    id: 'productai',
    name: 'Product AI',
    description: 'Smart product management and optimization',
    icon: React.createElement(Package, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/ECommerce/ProductAI')),
  },
  {
    id: 'customerai',
    name: 'Customer AI',
    description: 'Advanced customer behavior analysis',
    icon: React.createElement(Users, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/ECommerce/CustomerAI')),
  },
  {
    id: 'pricinai',
    name: 'Pricing AI',
    description: 'Dynamic pricing optimization',
    icon: React.createElement(DollarSign, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/ECommerce/PricingAI')),
  },
  {
    id: 'inventoryai',
    name: 'Inventory AI',
    description: 'Smart inventory management',
    icon: React.createElement(BarChart3, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/ECommerce/InventoryAI')),
  },
  {
    id: 'marketingai',
    name: 'Marketing AI',
    description: 'AI-powered marketing optimization',
    icon: React.createElement(Target, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/ECommerce/MarketingAI')),
  },
  {
    id: 'recommendationai',
    name: 'Recommendation AI',
    description: 'Personalized recommendations',
    icon: React.createElement(Sparkles, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/ECommerce/RecommendationAI')),
  },
  {
    id: 'fraudai',
    name: 'Fraud AI',
    description: 'AI-powered fraud detection',
    icon: React.createElement(Shield, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/ECommerce/FraudAI')),
  },
  {
    id: 'logisticsai',
    name: 'Logistics AI',
    description: 'Smart logistics optimization',
    icon: React.createElement(Truck, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/ECommerce/LogisticsAI')),
  }
];