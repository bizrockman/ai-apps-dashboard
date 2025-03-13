'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserRole } from '../lib/auth/users';

// Benutzertyp definieren
interface User {
  id: string;
  email?: string;
  username?: string;
  displayName?: string;
  firstname?: string;
  lastname?: string;
  role?: UserRole;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (usernameOrEmail: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Beim ersten Laden der Komponente prüfen, ob ein Benutzer angemeldet ist
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Wir verwenden jetzt unsere eigene API, um den Benutzer zu überprüfen
        const response = await fetch('/api/auth/session', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser(data.user);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      }
    };
    
    checkSession();
  }, []);

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      // Prüfen, ob es sich um eine E-Mail-Adresse handelt
      const isEmail = usernameOrEmail.includes('@');
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          isEmail 
            ? { email: usernameOrEmail, password } 
            : { username: usernameOrEmail, password }
        ),
        credentials: 'include', // Wichtig für Cookies
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      
      if (data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // API-Aufruf zum Abmelden
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Wichtig für Cookies
      });
      
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
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