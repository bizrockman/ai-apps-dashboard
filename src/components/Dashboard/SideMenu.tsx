import React from 'react';
import { X, Play, Info, Share2, ChevronRight } from 'lucide-react';
import { KiApp } from '../../types';

interface SideMenuProps {
  app: KiApp;
  onClose?: () => void;
  onLaunch: () => void;
  isMobile?: boolean;
}

const SideMenu: React.FC<SideMenuProps> = ({ app, onClose, onLaunch, isMobile = false }) => {
  const menuItems = [
    { icon: <Play className="h-5 w-5" />, label: 'Launch', action: onLaunch },
    { icon: <Info className="h-5 w-5" />, label: 'App Info', action: () => console.log('Info') },
    { icon: <Share2 className="h-5 w-5" />, label: 'Share', action: () => console.log('Share') },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b bg-gradient-to-br from-blue-500 to-indigo-600 text-white relative">
        {isMobile && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        )}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 flex items-center justify-center bg-white/10 rounded-2xl backdrop-blur-sm">
            {app.icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{app.name}</h2>
            <p className="text-blue-100 mt-1">{app.description}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 py-4">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3 text-gray-700">
              {item.icon}
              <span>{item.label}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="p-6 border-t bg-gray-50">
        <div className="text-sm text-gray-500">
          <p className="font-medium text-gray-700">About this app</p>
          <p className="mt-1">This KI app provides advanced AI capabilities to enhance your workflow.</p>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;