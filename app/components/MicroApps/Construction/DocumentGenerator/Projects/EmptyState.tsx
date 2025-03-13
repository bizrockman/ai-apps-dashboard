import React from 'react';
import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  onAddProject: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddProject }) => {
  return (
    <div className="text-center py-12">
      <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
      <p className="text-gray-500 mb-4">Get started by creating your first project</p>
      <button
        onClick={onAddProject}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Add Project
      </button>
    </div>
  );
};

export default EmptyState