import React, { useState, useEffect } from 'react';
import { Image, Plus } from 'lucide-react';
import { ConstructionElement } from '../../../../../lib/database/models/ConstructionElement';
import { Project } from '../../../../../lib/database/models/Project';
import ElementList from './ElementList';
import ElementForm from './ElementForm';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import EmptyState from './EmptyState';
import ProjectSelector from './ProjectSelector';
import { ConstructionElementService } from '../../../../../lib/api/services/ConstructionElementService';
import { ProjectService } from '../../../../../lib/api/services/ProjectService';
import { useTranslation } from 'react-i18next';

const Assets: React.FC = () => {
  const { t } = useTranslation();
  
  const [elements, setElements] = useState<ConstructionElement[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedElement, setSelectedElement] = useState<ConstructionElement | undefined>();
  const [elementToDelete, setElementToDelete] = useState<ConstructionElement | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const elementService = new ConstructionElementService();
  const projectService = new ProjectService();

  const loadData = async () => {
    try {
      const projectsData = await projectService.findAll();
      const elementsData = await elementService.findAll();
      setProjects(projectsData);
      setElements(elementsData);
      
      setError(null);
    } catch (err) {
      setError(t('assets.errors.loadFailed', 'Fehler beim Laden der Daten'));
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (data: Omit<ConstructionElement, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await elementService.create(data);
      await loadData();
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError(t('assets.errors.createFailed', 'Fehler beim Erstellen des Bauelements'));
      console.error('Error creating construction element:', err);
    }
  };

  const handleUpdate = async (data: Omit<ConstructionElement, 'createdAt' | 'updatedAt'>) => {
    if (!selectedElement) return;

    try {     
      await elementService.update(data);
      await loadData();
      setShowForm(false);
      setSelectedElement(undefined);
      setError(null);
    } catch (err) {
      setError(t('assets.errors.updateFailed', 'Fehler beim Aktualisieren des Bauelements'));
      console.error('Error updating construction element:', err);
    }
  };

  const handleDeleteClick = (element: ConstructionElement) => {
    setElementToDelete(element);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!elementToDelete) return;
    
    try {
      await elementService.delete(elementToDelete.id);
      await loadData();
      setShowDeleteModal(false);
      setElementToDelete(undefined);
      setError(null);
    } catch (err) {
      setError(t('assets.errors.deleteFailed', 'Fehler beim Löschen des Bauelements'));
      console.error('Error deleting construction element:', err);
    }
  };

  const handleEdit = (element: ConstructionElement) => {
    setSelectedElement(element);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Image className="h-8 w-8 text-blue-500" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{t('assets.title', 'Bauelemente')}</h2>
            <p className="text-gray-600">{t('assets.description', 'Verwalten Sie Bauelemente und Gewerke')}</p>
          </div>
        </div>
        <div>
          <button
            onClick={() => {
              setSelectedElement(undefined);
              setShowForm(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            <span>{t('assets.singular', 'Bauelement')} {t('common.add', 'hinzufügen')}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {isLoading || !projects ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : elements.length === 0 ? (
        <EmptyState onAddElement={() => setShowForm(true)} />
      ) : (
        <div className="bg-white rounded-lg border">
          <ElementList
            elements={elements}
            projects={projects}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </div>
      )}

      {showForm && (
        <ElementForm
          element={selectedElement}
          projects={projects}
          onSubmit={selectedElement ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setSelectedElement(undefined);
          }}
        />
      )}

      {showDeleteModal && elementToDelete && (
        <DeleteConfirmationModal
          elementName={elementToDelete.name}
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setElementToDelete(undefined);
          }}
        />
      )}
    </div>
  );
};

export default Assets