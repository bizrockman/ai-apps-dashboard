import React, { useEffect, useState } from 'react';
import { X, XCircle } from 'lucide-react';
import { Project } from '../../../../../lib/database/models/Project';
import { Client } from '../../../../../lib/database/models/Client';
import { ContactPerson } from '../../../../../lib/database/models/ContactPerson';
import { DatabaseProvider } from '../../../../../lib/database/DatabaseProvider';

interface ProjectFormProps {
  project?: Project;
  clients: Client[];
  contactPersons: ContactPerson[];
  onSubmit: (data: Omit<Project, 'id' | 'code' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ 
  project, 
  clients, 
  contactPersons,
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    clientId: '',
    costCenter: '',
    boqNumber: '',
    status: 'planned' as Project['status'],
    contactPersonIds: [] as string[],
    projectManagerIds: [] as string[]
  });

  const [selectedClient, setSelectedClient] = useState<string>('');
  const [availableContactPersons, setAvailableContactPersons] = useState<ContactPerson[]>([]);
  const [availableProjectManagers, setAvailableProjectManagers] = useState<ContactPerson[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedContactPersons, setSelectedContactPersons] = useState<ContactPerson[]>([]);
  const [selectedProjectManagers, setSelectedProjectManagers] = useState<ContactPerson[]>([]);

  useEffect(() => {    
    if (project) {      
      setFormData({
        name: project.name,
        description: project.description,
        clientId: project.clientId,
        costCenter: project.costCenter || '',
        boqNumber: project.boqNumber || '',
        status: project.status,
        contactPersonIds: project.contactPersons?.map(cp => cp.id) || [],
        projectManagerIds: project.projectManagers?.map(pm => pm.id) || []
      });
      setSelectedClient(project.clientId);
      setSelectedContactPersons(project.contactPersons || []);
      setSelectedProjectManagers(project.projectManagers || []);
    }
  }, [project]);

  useEffect(() => {
    setLoading(true);
    if (selectedClient) {
      // Filter contact persons for selected client     
      const clientContactPersons = contactPersons?.filter(cp => 
        cp.clients && cp.clients.length > 0 && cp.clients[0].id === selectedClient
      ) || [];
      setAvailableContactPersons(clientContactPersons);

      // Filter project managers (contact persons without clients)
      const managers = contactPersons?.filter(cp => 
        !cp.clients || cp.clients.length === 0
      ) || [];
      setAvailableProjectManagers(managers);
    } else {
      setAvailableContactPersons([]);
      setAvailableProjectManagers([]);
    }
    setLoading(false);
  }, [selectedClient, contactPersons]);

  const handleClientChange = async (clientId: string) => {
    setSelectedClient(clientId);
    
    // Reset form data for contact persons
    setFormData(prev => ({
      ...prev,
      clientId,
      contactPersonIds: [],
      projectManagerIds: []
    }));
    
    // Reset lists and set loading state
    setLoading(true);
    setAvailableContactPersons([]);
    setAvailableProjectManagers([]);
    setSelectedContactPersons([]);
    setSelectedProjectManagers([]);

    try {
      const contactPersonDAO = DatabaseProvider.getInstance().getContactPersonDAO();
      
      // Get contact persons for the selected client
      const clientContactPersons = await contactPersonDAO.findByClient(clientId);
      setAvailableContactPersons(clientContactPersons);     
   
      // Get all contact persons and filter for those without clients
      const allContactPersons = await contactPersonDAO.findAll();
      const managers = allContactPersons.filter(cp => 
        !cp.clients || cp.clients.length === 0
      );
      setAvailableProjectManagers(managers);
      
    } catch (error) {
      console.error('Error fetching contact persons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddContactPerson = (contactPersonId: string) => {
    if (!formData.contactPersonIds.includes(contactPersonId)) {
      const person = availableContactPersons.find(cp => cp.id === contactPersonId);
      if (person) {
        setSelectedContactPersons(prev => [...prev, person]);
        // Remove from available options
        setAvailableContactPersons(prev => prev.filter(cp => cp.id !== contactPersonId));
      }
      setFormData(prev => ({
        ...prev,
        contactPersonIds: [...prev.contactPersonIds, contactPersonId]
      }));
    }
  };

  const handleRemoveContactPerson = (contactPersonId: string) => {    
    const removedPerson = selectedContactPersons.find(cp => cp.id === contactPersonId);    
    setSelectedContactPersons(prev => prev.filter(cp => cp.id !== contactPersonId));
    // Add the removed person back to available options    
    console.log(availableContactPersons)
    if (removedPerson && !availableContactPersons.some(cp => cp.id === contactPersonId)) {
      setAvailableContactPersons(prev => [...prev, removedPerson]);
    }
    setFormData(prev => ({
      ...prev,
      contactPersonIds: prev.contactPersonIds.filter(id => id !== contactPersonId)
    }));
  };

  const handleAddProjectManager = (managerId: string) => {
    if (!formData.projectManagerIds.includes(managerId)) {
      const manager = availableProjectManagers.find(pm => pm.id === managerId);
      if (manager) {
        setSelectedProjectManagers(prev => [...prev, manager]);
        // Remove from available options
        setAvailableProjectManagers(prev => prev.filter(pm => pm.id !== managerId));
      }
      setFormData(prev => ({
        ...prev,
        projectManagerIds: [...prev.projectManagerIds, managerId]
      }));
    }
  };

  const handleRemoveProjectManager = (managerId: string) => {
    const removedManager = selectedProjectManagers.find(pm => pm.id === managerId);
    setSelectedProjectManagers(prev => prev.filter(pm => pm.id !== managerId));
    // Add the removed manager back to available options
    
    if (removedManager && !availableProjectManagers.some(pm => pm.id === managerId)) {
      setAvailableProjectManagers(prev => [...prev, removedManager]);
    }
    setFormData(prev => ({
      ...prev,
      projectManagerIds: prev.projectManagerIds.filter(id => id !== managerId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {    
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            {project ? 'Edit Project' : 'Add New Project'}
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
              Client
            </label>
            <select
              value={formData.clientId}
              onChange={(e) => handleClientChange(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

        {selectedClient && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Persons
                </label>
                <div className="space-y-2">
                  {formData.contactPersonIds.map(id => {
                    const person = selectedContactPersons.find(cp => cp.id === id);
                    return person && (
                      <div key={id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span>{person.firstname} {person.lastname}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveContactPerson(id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                    );
                  })}
              {availableContactPersons.length > 0 && (
                  <select
                    value=""
                    onChange={(e) => handleAddContactPerson(e.target.value)}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${loading ? 'opacity-50' : ''}`}
                    disabled={loading}
                  >
                    <option value="">{loading ? 'Loading...' : 'Add Contact Person...'}</option>
                    {availableContactPersons
                      .filter(cp => !formData.contactPersonIds.includes(cp.id))
                      .map(cp => (
                        <option key={cp.id} value={cp.id}>
                          {cp.firstname} {cp.lastname}
                        </option>
                      ))
                    }
                  </select>
              )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Managers
                </label>
                <div className="space-y-2">
                  {formData.projectManagerIds.map(id => {
                    const manager = selectedProjectManagers.find(cp => cp.id === id);
                    return manager && (
                      <div key={id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span>{manager.firstname} {manager.lastname}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveProjectManager(id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                    );
                  })}
              {availableProjectManagers.length > 0 && (
                  <select
                    value=""
                    onChange={(e) => handleAddProjectManager(e.target.value)}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${loading ? 'opacity-50' : ''}`}
                    disabled={loading}
                  >
                    <option value="">{loading ? 'Loading...' : 'Add Project Manager...'}</option>
                    {availableProjectManagers
                      .filter(pm => !formData.projectManagerIds.includes(pm.id))
                      .map(pm => (
                        <option key={pm.id} value={pm.id}>
                          {pm.firstname} {pm.lastname}
                        </option>
                      ))
                    }
                  </select>
              )}
                </div>
              </div>
            </>
          )}

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cost Center
            </label>
            <input
              type="text"
              value={formData.costCenter}
              onChange={(e) => setFormData({ ...formData, costCenter: e.target.value })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              BOQ Number (Leistungsverzeichnis)
            </label>
            <input
              type="text"
              value={formData.boqNumber}
              onChange={(e) => setFormData({ ...formData, boqNumber: e.target.value })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>          

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
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
              {project ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm