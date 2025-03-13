import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { TextBlock } from '../../../../../lib/database/models/TextBlock';

interface TextBlockListProps {
  textBlocks: TextBlock[];
  onEdit: (block: TextBlock) => void;
  onDelete: (block: TextBlock) => void;
}

const TextBlockList: React.FC<TextBlockListProps> = ({ textBlocks, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shortcut</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {textBlocks.map((block) => (
            <tr key={block.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {block.shortcut}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {block.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {block.content.length > 100 ? `${block.content.substring(0, 100)}...` : block.content}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(block)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(block)}
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

export default TextBlockList