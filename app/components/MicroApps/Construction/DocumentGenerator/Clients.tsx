import React from 'react';
import { Users } from 'lucide-react';

const Clients: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Users className="h-8 w-8 text-blue-500" />
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Clients</h2>
          <p className="text-gray-600">Manage construction clients and contacts</p>
        </div>
      </div>
      <p className="text-gray-500">Client management interface will be implemented here.</p>
    </div>
  );
};

export default Clients