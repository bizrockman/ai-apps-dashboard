import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import {
  ContactPerson,
  CreateContactPersonDTO,
} from '../../../../../lib/database/models/ContactPerson';
import { Client } from '../../../../../lib/database/models/Client';
import { Project } from '../../../../../lib/database/models/Project';

interface ContactPersonFormProps {
  contactPerson?: ContactPerson;
  clients: Client[];
  projects: Project[];
  onSubmit: (data: CreateContactPersonDTO) => void;
  onCancel: () => void;
}

const ContactPersonForm: React.FC<ContactPersonFormProps> = ({
  contactPerson,
  clients,
  projects,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = React.useState<CreateContactPersonDTO>(
    () => ({
      salutation: '',
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      clientIds: [],
    })
  );

  const [availableProjects, setAvailableProjects] = React.useState<Project[]>(
    []
  );

  useEffect(() => {
    if (contactPerson) {      
      // Log warning if more than one client
      if (contactPerson.clients?.length > 1) {
        console.warn('Contact person has multiple clients. Only the first one will be shown in the form.');
      }

      const firstClientId = contactPerson.clients?.[0]?.id;

      setFormData({
        salutation: contactPerson.salutation || '',
        firstname: contactPerson.firstname || '',
        lastname: contactPerson.lastname || '',
        email: contactPerson.email || '',
        phone: contactPerson.phone || '',
        clientIds: firstClientId ? [firstClientId] : [],
      });
    }
  }, [contactPerson]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            {contactPerson ? 'Edit Contact Person' : 'Add New Contact Person'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salutation
            </label>
            <select
              value={formData.salutation}
              onChange={(e) => setFormData(prev => ({ ...prev, salutation: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Salutation</option>              
              <option value="Frau">Frau</option>
              <option value="Herr">Herr</option>
            </select>
          </div>          

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstname}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, firstname: e.target.value }))
              }
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastname}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, lastname: e.target.value }))
              }
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client (Optional)
            </label>
            <select
              value={formData.clientIds[0] || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                clientIds: e.target.value ? [e.target.value] : [] 
              }))}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {contactPerson ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPersonForm;
