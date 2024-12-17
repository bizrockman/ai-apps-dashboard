import React from 'react';
import { Wifi, Battery, Signal, ArrowLeft } from 'lucide-react';

interface StatusBarProps {
  onBack?: () => void;
}

const StatusBar: React.FC<StatusBarProps> = ({ onBack }) => {
  return (
    <div className="w-full bg-white/80 backdrop-blur-sm border-t">
      <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </button>
          )}
          {!onBack && (
            <>
              <span>Connected</span>
              <Wifi className="h-4 w-4" />
              <Signal className="h-4 w-4" />
            </>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span>{new Date().toLocaleTimeString()}</span>
          <Battery className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

export default StatusBar;