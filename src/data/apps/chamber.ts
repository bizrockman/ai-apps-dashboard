import React from 'react';
import { GraduationCap, ClipboardCheck, Scale, UserCheck, BookOpen, BadgeCheck, PenTool, BarChart } from 'lucide-react';
import { KiApp } from '../../types';

export const chamberApps: KiApp[] = [
  {
    id: 'apprenticeshipai',
    name: 'Apprenticeship AI',
    description: 'AI-powered apprenticeship management',
    icon: React.createElement(GraduationCap, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Chamber/ApprenticeshipAI')),
  },
  {
    id: 'examai',
    name: 'Exam Management AI',
    description: 'Intelligent examination planning',
    icon: React.createElement(ClipboardCheck, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Chamber/ExamAI')),
  },
  {
    id: 'regulationai',
    name: 'Regulation AI',
    description: 'Trade regulation monitoring',
    icon: React.createElement(Scale, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Chamber/RegulationAI')),
  },
  {
    id: 'membershipai',
    name: 'Membership AI',
    description: 'Advanced membership management',
    icon: React.createElement(UserCheck, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Chamber/MembershipAI')),
  },
  {
    id: 'qualificationai',
    name: 'Qualification AI',
    description: 'Qualification verification',
    icon: React.createElement(BookOpen, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Chamber/QualificationAI')),
  },
  {
    id: 'certificationai',
    name: 'Certification AI',
    description: 'Certification processing',
    icon: React.createElement(BadgeCheck, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Chamber/CertificationAI')),
  },
  {
    id: 'skillsanalysisai',
    name: 'Skills Analysis AI',
    description: 'Trade skills gap analysis',
    icon: React.createElement(PenTool, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Chamber/SkillsAnalysisAI')),
  },
  {
    id: 'chamberstatisticsai',
    name: 'Statistics AI',
    description: 'Chamber statistics automation',
    icon: React.createElement(BarChart, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/Chamber/StatisticsAI')),
  }
];