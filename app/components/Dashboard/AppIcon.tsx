'use client';

import React from 'react';
import { KiApp } from '../../types';

interface AppIconProps {
  app: KiApp;
  onClick: () => void;
  onDoubleClick: () => void;
}

const AppIcon: React.FC<AppIconProps> = ({ app, onClick, onDoubleClick }) => {
  return (
    <button
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className="flex flex-col items-center p-4 rounded-xl hover:bg-white/50 transition-colors"
    >
      <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg text-white">
        {app.icon}
      </div>
      <span className="mt-2 text-sm font-medium text-gray-700">{app.name}</span>
    </button>
  );
};

export default AppIcon;