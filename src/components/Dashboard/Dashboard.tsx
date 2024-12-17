import React, { useState, useRef, Suspense } from 'react';
import AppGrid from './AppGrid';
import StatusBar from './StatusBar';
import SideMenu from './SideMenu';
import DefaultSideMenu from './DefaultSideMenu';
import Header from './Header';
import { KiApp } from '../../types';
import { useClickOutside } from '../../hooks/useClickOutside';

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<KiApp | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(true);
  const [activeApp, setActiveApp] = useState<KiApp | null>(null);
  
  const dashboardRef = useRef<HTMLDivElement>(null);
  const sideMenuRef = useRef<HTMLDivElement>(null);

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
      // Show default side menu on mobile when clicking empty area
      setIsSideMenuOpen(true);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showProfileMenu={showProfileMenu}
        setShowProfileMenu={setShowProfileMenu}
        activeApp={activeApp}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {!activeApp ? (
          <>
            {/* Side Menu - Hidden on small screens, visible on lg */}
            <div className="hidden lg:block w-80 bg-white border-r" ref={sideMenuRef}>
              {selectedApp ? (
                <SideMenu 
                  app={selectedApp}
                  onLaunch={() => handleAppLaunch(selectedApp)} 
                />
              ) : (
                <DefaultSideMenu />
              )}
            </div>

            {/* Sliding Menu - Visible on small screens */}
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

            {/* Overlay for mobile */}
            {isSideMenuOpen && (
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