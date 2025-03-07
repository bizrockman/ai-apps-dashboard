import React, { useMemo } from 'react';
import { Copy, Trash2, ArrowUpDown } from 'lucide-react';
import { Document } from '../../../../../lib/database/models/Document';
import { Project } from '../../../../../lib/database/models/Project';
import { DocumentType } from '../../../../../lib/database/models/DocumentType';
import { ConstructionElement } from '../../../../../lib/database/models/ConstructionElement';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

interface DocumentListProps {
  documents: Document[];
  projects: Project[];
  documentTypes: DocumentType[];
  elements: ConstructionElement[];
  onEdit: (document: Document) => void;
  onDelete: (document: Document) => void;
  onClone: (document: Document) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  projects,
  documentTypes,
  elements,
  onEdit,
  onDelete,
  onClone
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const getTypeName = (typeId: string) => {
    const type = documentTypes.find(t => t.id === typeId);
    return type ? type.name : 'Unknown Type';
  };

  const getElementName = (elementId: string) => {
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

  const columnHelper = createColumnHelper<Document>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            <span>Title</span>
            <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
        cell: ({ row }) => (
          <button
            onClick={() => onEdit(row.original)}
            className="text-gray-900 hover:text-blue-600 font-medium max-w-md truncate block"
            title={row.original.title}
          >
            {row.original.title}
          </button>
        ),
        size: 300,
      }),
      columnHelper.accessor('projectId', {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            <span>Project</span>
            <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
        cell: ({ getValue }) => getProjectName(getValue()),
        size: 200,
      }),
      columnHelper.accessor('typeId', {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            <span>Type</span>
            <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
        cell: ({ getValue }) => getTypeName(getValue()),
        size: 150,
      }),
      columnHelper.accessor('elementId', {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            <span>Element</span>
            <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
        cell: ({ getValue }) => getElementName(getValue()),
        size: 150,
      }),
      columnHelper.accessor('status', {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            <span>Status</span>
            <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
        cell: ({ getValue }) => {
          const status = getValue();
          return (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(status)}`}>
              {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
            </span>
          );
        },
        size: 100,
      }),
      columnHelper.display({
        id: 'actions',
        header: () => (
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
            Actions
          </span>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClone(row.original);
              }}
              className="text-blue-600 hover:text-blue-900 mr-3"
              title="Clone document"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(row.original);
              }}
              className="text-red-600 hover:text-red-900"
              title="Delete document"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ),
        size: 100,
      }),
    ],
    [projects, documentTypes, elements, onClone, onDelete]
  );

  const table = useReactTable({
    data: documents,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-y-auto max-w-[83vw]">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="px-6 py-3 text-left">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map(cell => (
                <td 
                  key={cell.id} 
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate"
                  style={{ maxWidth: cell.column.getSize() }}
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentList;