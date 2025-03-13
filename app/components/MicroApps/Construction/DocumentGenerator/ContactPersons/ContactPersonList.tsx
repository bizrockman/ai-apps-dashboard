import React, { useMemo } from 'react';
import { Edit, Trash2, ArrowUpDown } from 'lucide-react';
import { ContactPerson } from '../../../../../lib/database/models/ContactPerson';
import { Client } from '../../../../../lib/database/models/Client';
import { Project } from '../../../../../lib/database/models/Project';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

interface ContactPersonListProps {
  contactPersons: ContactPerson[];
  clients: Client[];
  projects: Project[];
  onEdit: (contactPerson: ContactPerson) => void;
  onDelete: (contactPerson: ContactPerson) => void;
}

const ContactPersonList: React.FC<ContactPersonListProps> = ({
  contactPersons,
  clients,
  projects,
  onEdit,
  onDelete
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const getProjectName = (projectId: string | null) => {
    if (!projectId) return '-';
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const columnHelper = createColumnHelper<ContactPerson>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('lastname', {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            <span>Last Name</span>
            <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
        cell: info => info.getValue(),
        size: 150,
      }),
      columnHelper.accessor('firstname', {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            <span>First Name</span>
            <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
        cell: info => info.getValue(),
        size: 150,
      }),
      columnHelper.accessor('email', {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            <span>Email</span>
            <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
        cell: info => info.getValue(),
        size: 200,
      }),
      columnHelper.accessor('phone', {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            <span>Phone</span>
            <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
        cell: info => info.getValue(),
        size: 150,
      }),
      columnHelper.display({
        id: 'client',
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            <span>Client</span>
            <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
        cell: () => '-', // Client relationship is now handled through junction table
        size: 200,
      }),
      columnHelper.display({
        id: 'project',
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            <span>Project</span>
            <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
        cell: () => '-', // Project relationship is now handled through junction table
        size: 200,
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
              onClick={() => onEdit(row.original)}
              className="text-blue-600 hover:text-blue-900 mr-3"
              title="Edit contact person"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(row.original)}
              className="text-red-600 hover:text-red-900"
              title="Delete contact person"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ),
        size: 100,
      }),
    ],
    [clients, projects]
  );

  const table = useReactTable({
    data: contactPersons,
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
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salutation</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {contactPersons.map((person) => (
            <tr key={person.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {person.salutation || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {person.lastname}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {person.firstname}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {person.clients?.[0]?.name || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {person.projects?.[0]?.name || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(person)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                  title="Edit contact person"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(person)}
                  className="text-red-600 hover:text-red-900"
                  title="Delete contact person"
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

export default ContactPersonList;