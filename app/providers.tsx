'use client';

import { AuthProvider } from './contexts/AuthContext';
import { useEffect } from 'react';
import './i18n'; // Importiere die i18n-Konfiguration

export function Providers({ children }: { children: React.ReactNode }) {
  // Stelle sicher, dass i18n initialisiert wird
  useEffect(() => {
    // i18n wird beim Import initialisiert
  }, []);

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
} 