import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, ROLE_CREDENTIALS } from '../types';

const USER_NAMES = {
  consulting: { firstname: 'Sarah', lastname: 'Schmidt' },
  ecommerce: { firstname: 'Michael', lastname: 'Weber' },
  chamber: { firstname: 'Thomas', lastname: 'Müller' },
  master: { firstname: 'Anna', lastname: 'Becker' },
  association: { firstname: 'Klaus', lastname: 'Wagner' },
  logistics: { firstname: 'Julia', lastname: 'Fischer' },
  construction: { firstname: 'Sabrina', lastname: 'Epmann' }
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string) => {
    // Check if credentials match any role-based login
    const credentials = `${username}/${password}`;
    const role = ROLE_CREDENTIALS[credentials as keyof typeof ROLE_CREDENTIALS];
    
    if (role) {
      const { firstname, lastname } = USER_NAMES[role];

      setUser({
        username,
        displayName: `${firstname} ${lastname}`,
        firstname,
        lastname,
        role: role as UserRole,
      });
      setIsAuthenticated(true);
      return true;
    }

    // Demo login fallback
    if (username === 'demo' && password === 'demo123') {
      setUser({
        username: 'demo',
        displayName: 'Demo Account',
        firstname: 'Demo',
        lastname: 'User',
        role: 'master',
      });
      setIsAuthenticated(true);
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}