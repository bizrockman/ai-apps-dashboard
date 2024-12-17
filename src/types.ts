import { ReactNode } from 'react';

export interface KiApp {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  component: React.LazyExoticComponent<React.FC>;
}