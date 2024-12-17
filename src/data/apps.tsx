import React from 'react';
import { Brain, MessageSquare, Package, Users, DollarSign, BarChart3, Target, Sparkles, Shield, Truck, Type } from 'lucide-react';
import { KiApp } from '../types';

export const kiApps: KiApp[] = [
  {
    id: 'chatbot',
    name: 'AI Chat',
    description: 'Advanced conversational AI assistant for natural language interactions',
    icon: <MessageSquare className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/ChatBot/ChatBot')),
  },
  {
    id: 'wordcount',
    name: 'Word Count',
    description: 'Count characters, words, and paragraphs in your text',
    icon: <Type className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/WordCount/WordCount')),
  },
  {
    id: 'imageai',
    name: 'AI Analysis',
    description: 'Intelligent data analysis and visualization with advanced machine learning capabilities',
    icon: <Brain className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/ImageAI')),
  },
  {
    id: 'productai',
    name: 'Product AI',
    description: 'Intelligent product catalog management and optimization using AI',
    icon: <Package className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/ProductAI')),
  },
  {
    id: 'customerai',
    name: 'Customer AI',
    description: 'Advanced customer behavior analysis and segmentation',
    icon: <Users className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/CustomerAI')),
  },
  {
    id: 'pricinai',
    name: 'Pricing AI',
    description: 'Dynamic pricing optimization based on market conditions',
    icon: <DollarSign className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/PricingAI')),
  },
  {
    id: 'inventoryai',
    name: 'Inventory AI',
    description: 'Smart inventory management and demand forecasting',
    icon: <BarChart3 className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/InventoryAI')),
  },
  {
    id: 'marketingai',
    name: 'Marketing AI',
    description: 'AI-powered marketing campaign optimization and analytics',
    icon: <Target className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/MarketingAI')),
  },
  {
    id: 'recommendationai',
    name: 'Recommendation AI',
    description: 'Personalized product recommendations for customers',
    icon: <Sparkles className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/RecommendationAI')),
  },
  {
    id: 'fraudai',
    name: 'Fraud AI',
    description: 'AI-powered fraud detection and prevention system',
    icon: <Shield className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/FraudAI')),
  },
  {
    id: 'logisticsai',
    name: 'Logistics AI',
    description: 'Smart logistics and delivery route optimization',
    icon: <Truck className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/LogisticsAI')),
  }
];