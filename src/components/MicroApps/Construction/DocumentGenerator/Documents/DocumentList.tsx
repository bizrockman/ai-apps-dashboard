import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Document } from '../../../../../lib/database/models/Document';
import { Project } from '../../../../../lib/database/models/Project';
import { DocumentType } from '../../../../../lib/database/models/DocumentType';
import { ConstructionElement } from '../../../../../lib/database/models/ConstructionElement';

interface DocumentListProps {
  documents: Document[];
  projects: Project[];
  documentTypes: DocumentType[];
  elements: ConstructionElement[];
  onEdit: (document: Document) => void;
  onDelete: (document: Document) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  projects,
  documentTypes,
  elements,
  onEdit,
  onDelete
}) => {
  const getProjectName = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const getTypeName = (typeId: number) => {
    const type = documentTypes.find(t => t.id === typeId);
    return type ? type.name : 'Unknown Type';
  };

  const getElementName = (elementId: number) => {
    const element = elements.find(e => e.id === elementId);
    return element ? element.name : 'Unknown Element';
  };

  const getStatusBadgeClass = (status: Document['status']) => {
    if (!status) return 'bg-gray-100 text-gray-800';

    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'review':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Element</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {documents.map((document) => (
            <tr key={document.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <button
                  onClick={() => onEdit(document)}
                  className="text-gray-900 hover:text-blue-600"
                >
                  {document.title}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {getProjectName(document.projectId)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {getTypeName(document.typeId)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {getElementName(document.elementId)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(document.status)}`}>
                  {document.status ? document.status.charAt(0).toUpperCase() + document.status.slice(1) : 'Unknown'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(document);
                  }}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentList