import React from 'react';
import { KiApp } from '../../types';
import AppIcon from './AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import { kiApps, utilityApps, ecommerceApps, consultingApps, chamberApps, associationApps, logisticsApps, constructionApps } from '../../data/apps/index';

interface AppGridProps {
  onAppSelect: (app: KiApp) => void;
  onAppLaunch: (app: KiApp) => void;
  searchQuery: string;
}

const AppGrid: React.FC<AppGridProps> = ({ onAppSelect, onAppLaunch, searchQuery }) => {
  const { user } = useAuth();

  // Get available apps based on user role
  const getAvailableApps = () => {
    if (!user) return [];

    switch (user.role) {
      case 'consulting':
        return [...utilityApps, ...consultingApps];
      case 'ecommerce':
        return [...utilityApps, ...ecommerceApps];
      case 'chamber':
        return [...utilityApps, ...chamberApps];
      case 'association':
        return [...utilityApps, ...associationApps];
      case 'logistics':
        return [...utilityApps, ...logisticsApps];
      case 'construction':
        return [...utilityApps, ...constructionApps];
      case 'master':
        return kiApps;
      default:
        return kiApps;
    }
  };

  const availableApps = getAvailableApps();
  const filteredApps = availableApps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-6">
      {filteredApps.map((app) => (
        <AppIcon
          key={app.id}
          app={app}
          onClick={() => onAppSelect(app)}
          onDoubleClick={() => onAppLaunch(app)}
        />
      ))}
    </div>
  );
};

export default AppGrid;