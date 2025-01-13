import React from 'react';
import { Brain, MessageSquare, Package, Users, DollarSign, BarChart3, Target, Sparkles, Shield, Truck, Type, Image, 
  LineChart, PieChart, TrendingUp, Briefcase, Building, Network, FileText, Lightbulb,
  GraduationCap, ClipboardCheck, Scale, UserCheck, BookOpen, BadgeCheck, PenTool, BarChart } from 'lucide-react';
import { KiApp } from '../types';

// Utility Apps
export const utilityApps: KiApp[] = [
  {
    id: 'chatbot',
    name: 'AI Chat',
    description: 'Advanced conversational AI assistant',
    icon: <MessageSquare className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/ChatBot/ChatBot')),
  },
  {
    id: 'wordcount',
    name: 'Word Count',
    description: 'Count characters, words, and paragraphs',
    icon: <Type className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/WordCount/WordCount')),
  },
  {
    id: 'bgremover',
    name: 'BG Remover',
    description: 'Remove background from images using AI',
    icon: <Image className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/BGRemover/BGRemover')),
  }
];

// E-Commerce Apps
export const ecommerceApps: KiApp[] = [
  {
    id: 'productai',
    name: 'Product AI',
    description: 'Smart product management and optimization',
    icon: <Package className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/ECommerce/ProductAI')),
  },
  {
    id: 'customerai',
    name: 'Customer AI',
    description: 'Advanced customer behavior analysis',
    icon: <Users className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/ECommerce/CustomerAI')),
  },
  {
    id: 'pricinai',
    name: 'Pricing AI',
    description: 'Dynamic pricing optimization',
    icon: <DollarSign className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/ECommerce/PricingAI')),
  },
  {
    id: 'inventoryai',
    name: 'Inventory AI',
    description: 'Smart inventory management',
    icon: <BarChart3 className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/ECommerce/InventoryAI')),
  },
  {
    id: 'marketingai',
    name: 'Marketing AI',
    description: 'AI-powered marketing optimization',
    icon: <Target className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/ECommerce/MarketingAI')),
  },
  {
    id: 'recommendationai',
    name: 'Recommendation AI',
    description: 'Personalized recommendations',
    icon: <Sparkles className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/ECommerce/RecommendationAI')),
  },
  {
    id: 'fraudai',
    name: 'Fraud AI',
    description: 'AI-powered fraud detection',
    icon: <Shield className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/ECommerce/FraudAI')),
  },
  {
    id: 'logisticsai',
    name: 'Logistics AI',
    description: 'Smart logistics optimization',
    icon: <Truck className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/ECommerce/LogisticsAI')),
  }
];

// Consulting Apps
export const consultingApps: KiApp[] = [
  {
    id: 'marketanalysis',
    name: 'Market Analysis AI',
    description: 'Advanced market trend analysis',
    icon: <LineChart className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/Consulting/MarketAnalysisAI')),
  },
  {
    id: 'financialai',
    name: 'Financial AI',
    description: 'Financial forecasting and analysis',
    icon: <PieChart className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/Consulting/FinancialAI')),
  },
  {
    id: 'strategyai',
    name: 'Strategy AI',
    description: 'Strategic planning assistance',
    icon: <TrendingUp className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/Consulting/StrategyAI')),
  },
  {
    id: 'processai',
    name: 'Process AI',
    description: 'Business process optimization',
    icon: <Network className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/Consulting/ProcessAI')),
  },
  {
    id: 'hranalyticsai',
    name: 'HR Analytics AI',
    description: 'Workforce analytics insights',
    icon: <Briefcase className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/Consulting/HRAnalyticsAI')),
  },
  {
    id: 'mergerai',
    name: 'M&A AI',
    description: 'Mergers and acquisitions analysis',
    icon: <Building className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/Consulting/MergerAI')),
  },
  {
    id: 'complianceai',
    name: 'Compliance AI',
    description: 'Regulatory compliance monitoring',
    icon: <FileText className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/Consulting/ComplianceAI')),
  },
  {
    id: 'innovationai',
    name: 'Innovation AI',
    description: 'Innovation opportunity analysis',
    icon: <Lightbulb className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/Consulting/InnovationAI')),
  }
];

// Chamber of Crafts Apps
export const chamberApps: KiApp[] = [
  {
    id: 'apprenticeshipai',
    name: 'Apprenticeship AI',
    description: 'AI-powered apprenticeship management',
    icon: <GraduationCap className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/Chamber/ApprenticeshipAI')),
  },
  {
    id: 'examai',
    name: 'Exam Management AI',
    description: 'Intelligent examination planning',
    icon: <ClipboardCheck className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/Chamber/ExamAI')),
  },
  {
    id: 'regulationai',
    name: 'Regulation AI',
    description: 'Trade regulation monitoring',
    icon: <Scale className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/Chamber/RegulationAI')),
  },
  {
    id: 'membershipai',
    name: 'Membership AI',
    description: 'Advanced membership management',
    icon: <UserCheck className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/Chamber/MembershipAI')),
  },
  {
    id: 'qualificationai',
    name: 'Qualification AI',
    description: 'Qualification verification',
    icon: <BookOpen className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/Chamber/QualificationAI')),
  },
  {
    id: 'certificationai',
    name: 'Certification AI',
    description: 'Certification processing',
    icon: <BadgeCheck className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/Chamber/CertificationAI')),
  },
  {
    id: 'skillsanalysisai',
    name: 'Skills Analysis AI',
    description: 'Trade skills gap analysis',
    icon: <PenTool className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/Chamber/SkillsAnalysisAI')),
  },
  {
    id: 'chamberstatisticsai',
    name: 'Statistics AI',
    description: 'Chamber statistics automation',
    icon: <BarChart className="h-8 w-8" />,
    component: React.lazy(() => import('../components/KiApps/Chamber/StatisticsAI')),
  }
];

// Combined apps for the main grid
export const kiApps: KiApp[] = [...utilityApps, ...ecommerceApps, ...consultingApps, ...chamberApps];