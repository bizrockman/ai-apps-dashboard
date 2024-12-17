import React from 'react';
import { Settings, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ProfileMenu: React.FC = () => {
  const { logout, user } = useAuth();

  return (
    <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg py-2 border">
      <div className="px-4 py-2 border-b">
        <div className="font-medium text-gray-800">{user?.displayName}</div>
        <div className="text-sm text-gray-500">{user?.username}</div>
      </div>
      <button className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-50">
        <User className="h-4 w-4" />
        <span>Profile</span>
      </button>
      <button className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-50">
        <Settings className="h-4 w-4" />
        <span>Settings</span>
      </button>
      <hr className="my-2" />
      <button 
        onClick={logout}
        className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-50 text-red-600"
      >
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default ProfileMenu;