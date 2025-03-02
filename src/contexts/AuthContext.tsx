import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, ROLE_CREDENTIALS } from '../types';

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
      const displayNames = {
        consulting: 'Consulting User',
        ecommerce: 'E-Commerce User',
        chamber: 'Chamber User',
        master: 'Master User',
        association: 'Association User',
        logistics: 'Logistics Member',
        construction: 'Construction User',
      };

      setUser({
        username,
        displayName: displayNames[role],
        role: role as UserRole,
      });
      setIsAuthenticated(true);
      return true;
    }

    // Demo login fallback
    if (username === 'demo' && password === 'demo') {
      setUser({
        username: 'demo',
        displayName: 'Demo User',
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