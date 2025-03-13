'use client';

import React, { useState, useRef, Suspense, useEffect } from 'react';
import AppGrid from './AppGrid';
import StatusBar from './StatusBar';
import SideMenu from './SideMenu';
import DefaultSideMenu from './DefaultSideMenu';
import Header from './Header';
import { KiApp } from '../../types';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<KiApp | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeApp, setActiveApp] = useState<KiApp | null>(null);
  
  // Initialize isSideMenuOpen from localStorage if authenticated
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(() => {
    if (typeof window !== 'undefined' && isAuthenticated) {
      const saved = localStorage.getItem('sideMenuOpen');
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });
  
  const dashboardRef = useRef<HTMLDivElement>(null);
  const sideMenuRef = useRef<HTMLDivElement>(null);

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('sideMenuOpen', JSON.stringify(isSideMenuOpen));
    }
  }, [isSideMenuOpen, isAuthenticated]);

  const handleAppSelect = (app: KiApp) => {
    setSelectedApp(app);
    setIsSideMenuOpen(true);
  };

  const handleAppLaunch = (app: KiApp) => {
    setActiveApp(app);
    setSelectedApp(null);
    setSearchQuery('');
  };

  const handleBack = () => {
    setActiveApp(null);
    setSelectedApp(null);
  };

  const handleDashboardClick = (event: React.MouseEvent) => {
    if (event.target === dashboardRef.current) {
      setSelectedApp(null);
    }
  };

  const toggleSideMenu = () => {
    setIsSideMenuOpen(prev => !prev);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showProfileMenu={showProfileMenu}
        setShowProfileMenu={setShowProfileMenu}
        activeApp={activeApp}
        onToggleSideMenu={toggleSideMenu}
        isSideMenuOpen={isSideMenuOpen}
        isAuthenticated={isAuthenticated}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {!activeApp ? (
          <>
            {/* Side Menu - Hidden on small screens, visible on lg */}
            {isAuthenticated && (
              <div className={`hidden lg:block w-80 bg-white border-r transition-all duration-300 ${
                isSideMenuOpen ? 'translate-x-0' : '-translate-x-full'
              }`} ref={sideMenuRef}>
                {selectedApp ? (
                  <SideMenu 
                    app={selectedApp}
                    onLaunch={() => handleAppLaunch(selectedApp)} 
                  />
                ) : (
                  <DefaultSideMenu />
                )}
              </div>
            )}

            {/* Sliding Menu - Visible on small screens */}
            {isAuthenticated && (
              <div
                className={`lg:hidden fixed inset-y-[64px] left-0 transform ${
                  isSideMenuOpen ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300 ease-in-out z-30 w-80 bg-white shadow-lg`}
              >
                {selectedApp ? (
                  <SideMenu
                    app={selectedApp}
                    onClose={() => setIsSideMenuOpen(false)}
                    onLaunch={() => handleAppLaunch(selectedApp)}
                    isMobile
                  />
                ) : (
                  <DefaultSideMenu
                    onClose={() => setIsSideMenuOpen(false)}
                    isMobile
                  />
                )}
              </div>
            )}

            {/* Overlay for mobile */}
            {isAuthenticated && isSideMenuOpen && (
              <div
                className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
                onClick={() => setIsSideMenuOpen(false)}
              />
            )}

            {/* App Grid */}
            <div 
              ref={dashboardRef}
              className="flex-1 overflow-auto"
              onClick={handleDashboardClick}
            >
              <AppGrid 
                onAppSelect={handleAppSelect} 
                searchQuery={searchQuery}
                onAppLaunch={handleAppLaunch}
              />
            </div>
          </>
        ) : (
          // Active App View
          <div className="flex-1">
            <Suspense fallback={
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            }>
              <activeApp.component />
            </Suspense>
          </div>
        )}
      </div>

      <StatusBar onBack={activeApp ? handleBack : undefined} />
    </div>
  );
};

export default Dashboard;