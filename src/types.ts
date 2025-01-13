import { ReactNode } from 'react';

export interface KiApp {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  component: React.LazyExoticComponent<React.FC>;
}

export type UserRole = 'consulting' | 'ecommerce' | 'chamber' | 'master';

export interface User {
  username: string;
  displayName: string;
  role: UserRole;
}

export const ROLE_CREDENTIALS = {
  'consulting/consulting': 'consulting',
  'ecommerce/ecommerce': 'ecommerce',
  'kammer/kammer': 'chamber',
  'master/master': 'master',
} as const;