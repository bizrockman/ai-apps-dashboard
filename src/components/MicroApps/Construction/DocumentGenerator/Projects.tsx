import React, { useState, useEffect } from 'react';
import { FolderOpen, Plus } from 'lucide-react';
import { Project } from '../../../../lib/database/models/Project';
import { Client } from '../../../../lib/database/models/Client';
import { DatabaseProvider } from '../../../../lib/database/DatabaseProvider';
import ProjectList from './Projects/ProjectList';
import ProjectForm from './Projects/ProjectForm';
import DeleteConfirmationModal from './Projects/DeleteConfirmationModal';
import EmptyState from './Projects/EmptyState';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const [projectToDelete, setProjectToDelete] = useState<Project | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const projectDAO = DatabaseProvider.getInstance().getProjectDAO();
  const clientDAO = DatabaseProvider.getInstance().getClientDAO();

  const loadData = async () => {
    try {
      const [projectsData, clientsData] = await Promise.all([
        projectDAO.findAll(),
        clientDAO.findAll()
      ]);
      setProjects(projectsData);
      setClients(clientsData);
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

  const handleCreate = async (data: Omit<Project, 'id' | 'code' | 'createdAt' | 'updatedAt'>) => {
    try {
      await projectDAO.create(data);
      await loadData();
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to create project');
      console.error('Error creating project:', err);
    }
  };

  const handleUpdate = async (data: Omit<Project, 'code' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedProject) return;

    try {
      await projectDAO.update(data);
      await loadData();
      setShowForm(false);
      setSelectedProject(undefined);
      setError(null);
    } catch (err) {
      setError('Failed to update project');
      console.error('Error updating project:', err);
    }
  };

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    
    try {
      await projectDAO.delete(projectToDelete.id);
      await loadData();
      setShowDeleteModal(false);
      setProjectToDelete(undefined);
      setError(null);
    } catch (err) {
      setError('Failed to delete project');
      console.error('Error deleting project:', err);
    }
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FolderOpen className="h-8 w-8 text-blue-500" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Projects</h2>
            <p className="text-gray-600">Manage construction projects</p>
          </div>
        </div>
        <button
          onClick={() => {
            setSelectedProject(undefined);
            setShowForm(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>Add Project</span>
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
      ) : projects.length === 0 ? (
        <EmptyState onAddProject={() => setShowForm(true)} />
      ) : (
        <div className="bg-white rounded-lg border">
          <ProjectList
            projects={projects}
            clients={clients}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </div>
      )}

      {showForm && (
        <ProjectForm
          project={selectedProject}
          clients={clients}
          onSubmit={selectedProject ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setSelectedProject(undefined);
          }}
        />
      )}

      {showDeleteModal && projectToDelete && (
        <DeleteConfirmationModal
          projectName={projectToDelete.name}
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setProjectToDelete(undefined);
          }}
        />
      )}
    </div>
  );
};

export default Projects