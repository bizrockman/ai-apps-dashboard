import { ReactNode } from 'react';

export interface KiApp {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  component: React.LazyExoticComponent<React.FC>;
}

export type UserRole = 'consulting' | 'ecommerce' | 'chamber' | 'master' | 'association' | 'logistics' | 'construction';

export interface User {
  username: string;
  displayName: string;
  firstname: string;
  lastname: string;
  role: UserRole;
}