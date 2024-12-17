import React, { useRef } from 'react';
import { Search, User, Layout } from 'lucide-react';
import ProfileMenu from './ProfileMenu';
import { useClickOutside } from '../../hooks/useClickOutside';
import { KiApp } from '../../types';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showProfileMenu: boolean;
  setShowProfileMenu: (show: boolean) => void;
  activeApp: KiApp | null;
}

const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  showProfileMenu,
  setShowProfileMenu,
  activeApp,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useClickOutside(menuRef, () => {
    setShowProfileMenu(false);
  }, buttonRef);

  return (
    <div className="w-full bg-white/80 backdrop-blur-sm border-b">
      <div className="h-16 px-4 grid grid-cols-3 items-center">
        {/* Left */}
        <div className="flex items-center">
          <Layout className="h-6 w-6 text-blue-600" />
        </div>

        {/* Center */}
        <div className="flex justify-center">
          {activeApp ? (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg text-white">
                {activeApp.icon}
              </div>
              <span className="text-lg font-semibold text-gray-800">{activeApp.name}</span>
            </div>
          ) : (
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search KI Apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex justify-end">
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <User className="h-6 w-6 text-gray-700" />
            </button>
            {showProfileMenu && (
              <div ref={menuRef}>
                <ProfileMenu />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;