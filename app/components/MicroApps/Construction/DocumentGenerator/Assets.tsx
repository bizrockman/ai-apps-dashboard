import React from 'react';
import { Image } from 'lucide-react';

const Assets: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Image className="h-8 w-8 text-blue-500" />
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Construction Elements</h2>
          <p className="text-gray-600">Manage construction elements and trades</p>
        </div>
      </div>
      <p className="text-gray-500">Construction elements management interface will be implemented here.</p>
    </div>
  );
};

export default Assets;