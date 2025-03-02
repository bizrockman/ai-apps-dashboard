import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { DocumentType } from '../../../../../lib/database/models/DocumentType';

interface DocumentTypeListProps {
  documentTypes: DocumentType[];
  onEdit: (type: DocumentType) => void;
  onDelete: (type: DocumentType) => void;
}

const DocumentTypeList: React.FC<DocumentTypeListProps> = ({ documentTypes, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blocks</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {documentTypes.map((type) => (
            <tr key={type.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {type.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {type.description}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {type.blocks.length} blocks
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(type)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(type)}
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

export default DocumentTypeList