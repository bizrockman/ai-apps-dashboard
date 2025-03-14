import React, { useState, useEffect } from 'react';
import { Users, Plus } from 'lucide-react';
import { ContactPerson } from '../../../../../lib/database/models/ContactPerson';
import { Client } from '../../../../../lib/database/models/Client';
import { Project } from '../../../../../lib/database/models/Project';
import { DatabaseProvider } from '../../../../../lib/database/DatabaseProvider';
import ContactPersonList from './ContactPersonList';
import ContactPersonForm from './ContactPersonForm';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import EmptyState from '../EmptyState';

const ContactPersons: React.FC = () => {
  const [contactPersons, setContactPersons] = useState<ContactPerson[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedContactPerson, setSelectedContactPerson] = useState<ContactPerson | undefined>();
  const [contactPersonToDelete, setContactPersonToDelete] = useState<ContactPerson | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const contactPersonDAO = DatabaseProvider.getInstance().getContactPersonDAO();
  const clientDAO = DatabaseProvider.getInstance().getClientDAO();
  const projectDAO = DatabaseProvider.getInstance().getProjectDAO();

  const loadData = async () => {
    try {
      const [contactPersonsData, clientsData, projectsData] = await Promise.all([
        contactPersonDAO.findAll(),
        clientDAO.findAll(),
        projectDAO.findAll()
      ]);

      setContactPersons(contactPersonsData);
      setClients(clientsData);
      setProjects(projectsData);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (data: any) => {
    try {
      await contactPersonDAO.create(data);
      await loadData();
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to create contact person');
      console.error('Error creating contact person:', err);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!selectedContactPerson) return;

    try {
      await contactPersonDAO.update({
        id: selectedContactPerson.id,
        ...data
      });
      await loadData();
      setShowForm(false);
      setSelectedContactPerson(undefined);
      setError(null);
    } catch (err) {
      setError('Failed to update contact person');
      console.error('Error updating contact person:', err);
    }
  };

  const handleDeleteClick = (contactPerson: ContactPerson) => {
    setContactPersonToDelete(contactPerson);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!contactPersonToDelete) return;
    
    try {
      await contactPersonDAO.delete(contactPersonToDelete.id);
      await loadData();
      setShowDeleteModal(false);
      setContactPersonToDelete(undefined);
      setError(null);
    } catch (err) {
      setError('Failed to delete contact person');
      console.error('Error deleting contact person:', err);
    }
  };

  const handleEdit = (contactPerson: ContactPerson) => {
    setSelectedContactPerson(contactPerson);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-blue-500" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Contact Persons</h2>
            <p className="text-gray-600">Manage contact persons for clients and projects</p>
          </div>
        </div>
        <button
          onClick={() => {
            setSelectedContactPerson(undefined);
            setShowForm(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>Add Contact Person</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : contactPersons.length === 0 ? (
        <EmptyState
          icon={<Users className="h-12 w-12 text-gray-400" />}
          title="No contact persons yet"
          description="Get started by adding your first contact person"
          buttonText="Add Contact Person"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="bg-white rounded-lg border">
          <ContactPersonList
            contactPersons={contactPersons}
            clients={clients}
            projects={projects}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </div>
      )}

      {showForm && (
        <ContactPersonForm
          contactPerson={selectedContactPerson}
          clients={clients}
          projects={projects}
          onSubmit={selectedContactPerson ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setSelectedContactPerson(undefined);
          }}
        />
      )}

      {showDeleteModal && contactPersonToDelete && (
        <DeleteConfirmationModal
          title="Delete Contact Person"
          message={`Are you sure you want to delete ${contactPersonToDelete.firstname} ${contactPersonToDelete.lastname}? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setContactPersonToDelete(undefined);
          }}
        />
      )}
    </div>
  );
};

export default ContactPersons;