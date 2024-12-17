import React from 'react';
import { KiApp } from '../../types';
import AppIcon from './AppIcon';
import { kiApps } from '../../data/apps';

interface AppGridProps {
  onAppSelect: (app: KiApp) => void;
  onAppLaunch: (app: KiApp) => void;
  searchQuery: string;
}

const AppGrid: React.FC<AppGridProps> = ({ onAppSelect, onAppLaunch, searchQuery }) => {
  const filteredApps = kiApps.filter(app =>
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