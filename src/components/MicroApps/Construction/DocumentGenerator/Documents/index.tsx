import React, { useState, useEffect } from 'react';
import { FileText, Plus } from 'lucide-react';
import { CreateDocumentDTO, Document } from '../../../../../lib/database/models/Document';
import { Client } from '../../../../../lib/database/models/Client';
import { Project } from '../../../../../lib/database/models/Project';
import { DocumentType } from '../../../../../lib/database/models/DocumentType';
import { ConstructionElement } from '../../../../../lib/database/models/ConstructionElement';
import { DatabaseProvider } from '../../../../../lib/database/DatabaseProvider';
import { TextBlock } from '../../../../../lib/database/models/TextBlock';
import DocumentList from './DocumentList';
import DocumentForm from './DocumentForm';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import EmptyState from '../EmptyState';
import { useTranslation } from 'react-i18next';

const Documents: React.FC = () => {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [elements, setElements] = useState<ConstructionElement[]>([]);
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | undefined>();
  const [documentToDelete, setDocumentToDelete] = useState<Document | undefined>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const documentDAO = DatabaseProvider.getInstance().getDocumentDAO();
  const clientDAO = DatabaseProvider.getInstance().getClientDAO();
  const projectDAO = DatabaseProvider.getInstance().getProjectDAO();
  const documentTypeDAO = DatabaseProvider.getInstance().getDocumentTypeDAO();
  const elementDAO = DatabaseProvider.getInstance().getConstructionElementDAO();
  const textBlockDAO = DatabaseProvider.getInstance().getTextBlockDAO();

  const loadData = async () => {
    try {
      const [
        documentsData,
        clientsData,
        projectsData,
        typesData,
        elementsData,
        textBlocksData
      ] = await Promise.all([
        documentDAO.findAll(),
        clientDAO.findAll(),
        projectDAO.findAll(),
        documentTypeDAO.findAll(),
        elementDAO.findAll(),
        textBlockDAO.findAll()
      ]);

      setDocuments(documentsData);
      setClients(clientsData);
      setProjects(projectsData);
      setDocumentTypes(typesData);
      setElements(elementsData);
      setTextBlocks(textBlocksData);
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
      // Create new document regardless of preview mode      
      const newDocument = await documentDAO.create(data);
      
      // Update UI based on mode
      if (newDocument) {
        setSelectedDocument(newDocument);
      } else {
        await loadData();
        setView('list');
        setSelectedDocument(undefined);
      }

      setError(null);
    } catch (err) {
      setError('Failed to create document');
      console.error('Error creating document:', err);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!selectedDocument) return;

    setIsLoading(true);
    try {
      const { ...updateData } = data;
      
      // Always update the document in the database
      await documentDAO.update({
        id: selectedDocument.id,
        ...updateData
      });
      
      // Ensure data is loaded before changing view
      await loadData();
      setSelectedDocument(undefined);
      setView('list');

      setError(null);
    } catch (err) {
      setError('Failed to update document');
      console.error('Error updating document:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (document: Document) => {
    setDocumentToDelete(document);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!documentToDelete) return;
    
    try {
      await documentDAO.delete(documentToDelete.id);
      await loadData();
      setShowDeleteModal(false);
      setDocumentToDelete(undefined);
      setError(null);
    } catch (err) {
      setError('Failed to delete document');
      console.error('Error deleting document:', err);
    }
  };

  const handleClone = async (document: Document) => {
    try {
      // Create a new document with the same data but a modified title
      const cloneData: CreateDocumentDTO = {
        title: `${document.title} (Copy)`,
        content: document.content,
        projectId: document.projectId,
        typeId: document.typeId,
        elementId: document.elementId,
        status: 'draft' // Always set status to draft for cloned documents
      };

      const clonedDocument = await documentDAO.create(cloneData);
      
      // Open the cloned document in edit mode
      setSelectedDocument({
        ...clonedDocument,
      });
      setView('form');
      
      await loadData(); // Refresh the list
    } catch (err) {
      setError('Failed to clone document');
      console.error('Error cloning document:', err);
    }
  };

  const handleEdit = (document: Document) => {
    // When editing from list, show preview directly
    setSelectedDocument({
      ...document
    });
    setView('form');
  };

  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-blue-500" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{t('documents.title')}</h2>
            <p className="text-gray-600">{t('documents.description')}</p>
          </div>
        </div>
        {view === 'list' && (
          <button
            onClick={() => {
              setSelectedDocument(undefined);
              setView('form');
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>{t('documents.singular')} {t('common.add')}</span>
          </button>
        )}
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
      ) : view === 'list' ? (
        documents.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-12 w-12 text-gray-400" />}
            title="No documents yet"
            description="Get started by creating your first document"
            buttonText="Add Document"
            onAction={() => setView('form')}
          />
        ) : (
          <div className="bg-white rounded-lg border">
            <DocumentList
              documents={documents}
              projects={projects}
              documentTypes={documentTypes}
              elements={elements}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onClone={handleClone}
            />
          </div>
        )
      ) : (
        <div className="bg-white rounded-lg border">
          <DocumentForm
            clients={clients}
            projects={projects}
            documentTypes={documentTypes}
            elements={elements}
            textBlocks={textBlocks}
            document={selectedDocument}
            onSubmit={async (data) => {
              if (selectedDocument) {
                await handleUpdate(data);
              } else {
                await handleCreate(data);
              }
            }}
            onCancel={async () => {
              setSelectedDocument(undefined);
              await loadData();
              setView('list');              
            }}
          />
        </div>
      )}

      {showDeleteModal && documentToDelete && (
        <DeleteConfirmationModal
          title="Delete Document"
          message={`Are you sure you want to delete this document? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setDocumentToDelete(undefined);
          }}
        />
      )}
    </div>
  );
};

export default Documents;