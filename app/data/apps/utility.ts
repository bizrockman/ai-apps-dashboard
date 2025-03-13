import React from 'react';
import { MessageSquare, Type, Image } from 'lucide-react';
import { KiApp } from '../../types';

export const utilityApps: KiApp[] = [
  {
    id: 'chatbot',
    name: 'AI Chat',
    description: 'Advanced conversational AI assistant',
    icon: React.createElement(MessageSquare, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/ChatBot/ChatBot')),
  },
  {
    id: 'wordcount',
    name: 'Word Count',
    description: 'Count characters, words, and paragraphs',
    icon: React.createElement(Type, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/WordCount/WordCount')),
  },
  {
    id: 'bgremover',
    name: 'BG Remover',
    description: 'Remove background from images using AI',
    icon: React.createElement(Image, { className: "h-8 w-8" }),
    component: React.lazy(() => import('../../components/KiApps/BGRemover/BGRemover')),
  }
];