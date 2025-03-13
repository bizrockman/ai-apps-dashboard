'use client';

import React from 'react';
import { Bell, Newspaper, X } from 'lucide-react';

interface DefaultSideMenuProps {
  onClose?: () => void;
  isMobile?: boolean;
}

const DefaultSideMenu: React.FC<DefaultSideMenuProps> = ({ onClose, isMobile = false }) => {
  const news = [
    {
      id: 1,
      title: 'New AI Features Released',
      description: 'Explore the latest AI capabilities in our newest update.',
      date: '2024-03-15',
    },
    {
      id: 2,
      title: 'Performance Improvements',
      description: 'Enhanced processing speed for all KI applications.',
      date: '2024-03-14',
    },
    {
      id: 3,
      title: 'Community Highlights',
      description: 'See how others are using KI Apps in innovative ways.',
      date: '2024-03-13',
    },
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
            <Bell className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">KI Dashboard</h2>
            <p className="text-blue-100 mt-1">Your AI Assistant Hub</p>
          </div>
        </div>
      </div>

      {/* News Feed */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Newspaper className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Latest Updates</h3>
          </div>
          <div className="space-y-4">
            {news.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
              >
                <h4 className="font-medium text-gray-800">{item.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                <p className="text-xs text-gray-400 mt-2">{item.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t bg-gray-50">
        <div className="text-sm text-gray-500">
          <p className="font-medium text-gray-700">Welcome to KI Dashboard</p>
          <p className="mt-1">Select any KI App to view details and actions.</p>
        </div>
      </div>
    </div>
  );
};

export default DefaultSideMenu;