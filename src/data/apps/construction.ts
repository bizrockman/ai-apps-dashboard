import React from 'react';
import { FileText } from 'lucide-react';
import { KiApp } from '../../types';

export const constructionApps: KiApp[] = [
  {
    id: 'documentgenerator',
    name: 'Document Generator',
    description: 'Generate construction reports and documentation',
    icon: React.createElement(FileText, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/MicroApps/Construction/DocumentGenerator/DocumentGenerator')),
  }
];