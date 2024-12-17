import React from 'react';
import { Info, Play, Share2 } from 'lucide-react';
import { KiApp } from '../../types';

interface AppContextMenuProps {
  app: KiApp;
  onClose: () => void;
}

const AppContextMenu: React.FC<AppContextMenuProps> = ({ app, onClose }) => {
  return (
    <div className="absolute left-4 top-4 w-64 bg-white rounded-lg shadow-lg border">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white">
            {app.icon}
          </div>
          <div>
            <h3 className="font-medium">{app.name}</h3>
            <p className="text-sm text-gray-500">{app.description}</p>
          </div>
        </div>
      </div>
      <div className="py-2">
        <button className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-50">
          <Play className="h-4 w-4" />
          <span>Launch</span>
        </button>
        <button className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-50">
          <Info className="h-4 w-4" />
          <span>App Info</span>
        </button>
        <button className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-50">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default AppContextMenu;