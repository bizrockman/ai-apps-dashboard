import React from 'react';
import { AlertTriangle } from 'lucide-react';

const CrisisManagementAI: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="text-center">
        <AlertTriangle className="h-16 w-16 mx-auto text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Crisis Management AI</h2>
        <p className="text-gray-600 mt-2">Crisis detection and response planning</p>
      </div>
    </div>
  );
};

export default CrisisManagementAI;