import React, { useState, useEffect } from 'react';
import { Users, Plus } from 'lucide-react';
import { Client, CreateClientDTO } from '../../../../../lib/database/models/Client';
import { DatabaseProvider } from '../../../../../lib/database/DatabaseProvider';
import ClientList from './ClientList';
import ClientForm from './ClientForm';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import EmptyState from './EmptyState';

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>();
  const [clientToDelete, setClientToDelete] = useState<Client | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clientDAO = DatabaseProvider.getInstance().getClientDAO();

  const loadClients = async () => {
    try {
      const data = await clientDAO.findAll();
      setClients(data);
      setError(null);
    } catch (err) {
      setError('Failed to load clients');
      console.error('Error loading clients:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleCreate = async (data: CreateClientDTO) => {
    try {
      await clientDAO.create(data);
      await loadClients();
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to create client');
      console.error('Error creating client:', err);
    }
  };

  const handleUpdate = async (data: CreateClientDTO) => {
    if (!selectedClient) return;

    try {
      await clientDAO.update({ id: selectedClient.id, ...data });
      await loadClients();
      setShowForm(false);
      setSelectedClient(undefined);
      setError(null);
    } catch (err) {
      setError('Failed to update client');
      console.error('Error updating client:', err);
    }
  };

  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!clientToDelete) return;
    
    try {
      await clientDAO.delete(clientToDelete.id);
      await loadClients();
      setShowDeleteModal(false);
      setClientToDelete(undefined);
      setError(null);
    } catch (err) {
      setError('Failed to delete client');
      console.error('Error deleting client:', err);
    }
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-blue-500" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Clients</h2>
            <p className="text-gray-600">Manage construction clients and contacts</p>
          </div>
        </div>
        <button
          onClick={() => {
            setSelectedClient(undefined);
            setShowForm(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>Add Client</span>
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
      ) : clients.length === 0 ? (
        <EmptyState onAddClient={() => setShowForm(true)} />
      ) : (
        <div className="bg-white rounded-lg border">
          <ClientList
            clients={clients}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </div>
      )}

      {showForm && (
        <ClientForm
          client={selectedClient}
          onSubmit={selectedClient ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setSelectedClient(undefined);
          }}
        />
      )}

      {showDeleteModal && clientToDelete && (
        <DeleteConfirmationModal
          clientName={clientToDelete.name}
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setClientToDelete(undefined);
          }}
        />
      )}
    </div>
  );
};

export default Clients;