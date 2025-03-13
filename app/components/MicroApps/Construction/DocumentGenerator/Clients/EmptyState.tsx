import React from 'react';
import { Users } from 'lucide-react';

interface EmptyStateProps {
  onAddClient: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddClient }) => {
  return (
    <div className="text-center py-12">
      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No clients yet</h3>
      <p className="text-gray-500 mb-4">Get started by adding your first client</p>
      <button
        onClick={onAddClient}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Add Client
      </button>
    </div>
  );
};

export default EmptyState