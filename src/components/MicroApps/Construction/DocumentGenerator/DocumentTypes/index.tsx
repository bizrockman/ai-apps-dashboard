import React, { useState, useEffect } from 'react';
import { FileStack, Plus } from 'lucide-react';
import { DocumentType } from '../../../../../lib/database/models/DocumentType';
import { TextBlock } from '../../../../../lib/database/models/TextBlock';
import { DatabaseProvider } from '../../../../../lib/database/DatabaseProvider';
import DocumentTypeList from './DocumentTypeList';
import DocumentTypeForm from './DocumentTypeForm';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import EmptyState from './EmptyState';

const DocumentTypes: React.FC = () => {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedType, setSelectedType] = useState<DocumentType | undefined>();
  const [typeToDelete, setTypeToDelete] = useState<DocumentType | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const documentTypeDAO = DatabaseProvider.getInstance().getDocumentTypeDAO();
  const textBlockDAO = DatabaseProvider.getInstance().getTextBlockDAO();

  const saveBlocks = async (documentTypeId: number, blocks: DocumentTypeBlock[]) => {
    try {
      // Remove all existing blocks first
      const existingType = await documentTypeDAO.findById(documentTypeId); 
      
      if (existingType) {
        for (const block of existingType.blocks) {
          await documentTypeDAO.removeBlock(documentTypeId, block.id);
        }
      }
      
      // Add all new blocks with proper order
      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        await documentTypeDAO.addBlock({
          documentTypeId,
          textBlockId: block.textBlockId,
          order: i,
          inputLabel: block.inputLabel,
          inputType: block.inputType,
          required: block.required
        });
      } 
      
      // Reload data to get updated state
      await loadData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error saving blocks:', message, error);
      throw new Error(`Failed to save blocks: ${message}`);
    }
  };

  const loadData = async () => {
    try {
      const [typesData, blocksData] = await Promise.all([
        documentTypeDAO.findAll(),
        textBlockDAO.findAll()
      ]);
      setDocumentTypes(typesData);
      setTextBlocks(blocksData);
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

  const handleCreate = async (
    data: Omit<DocumentType, 'id' | 'blocks' | 'createdAt' | 'updatedAt'>,
    blocks: DocumentTypeBlock[]
  ) => {
    setError(null);
    try {
      const newType = await documentTypeDAO.create(data);
      console.log('Created document type:', newType);
      
      await saveBlocks(newType.id, blocks);
      console.log('Saved blocks for document type:', blocks);
      
      await loadData();
      setShowForm(false);
    } catch (err) {
      console.error('Error creating document type:', err);
      setError('Failed to create document type');
    }
  };

  const handleUpdate = async (
    data: Omit<DocumentType, 'blocks' | 'createdAt' | 'updatedAt'>,
    blocks: DocumentTypeBlock[]
  ) => {
    setError(null);
    if (!selectedType) return;

    try {
      // First update the document type
      await documentTypeDAO.update(data);

      // Update blocks after document type is updated
      await saveBlocks(data.id, blocks);
      
      // Reload data to get fresh state
      await loadData();
      
      // Reset form state
      setShowForm(false);
      setSelectedType(undefined);
      setError(null);
    } catch (err) {
      console.error('Error updating document type:', err);
      setError(err instanceof Error ? err.message : 'Failed to update document type');
    }
  };

  const handleDeleteClick = (type: DocumentType) => {
    setTypeToDelete(type);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!typeToDelete) return;
    
    try {
      await documentTypeDAO.delete(typeToDelete.id);
      await loadData();
      setShowDeleteModal(false);
      setTypeToDelete(undefined);
      setError(null);
    } catch (err) {
      setError('Failed to delete document type');
      console.error('Error deleting document type:', err);
    }
  };

  const handleEdit = (type: DocumentType) => {
    setSelectedType(type);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileStack className="h-8 w-8 text-blue-500" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Document Types</h2>
            <p className="text-gray-600">Manage document templates and types</p>
          </div>
        </div>
        <button
          onClick={() => {
            setSelectedType(undefined);
            setShowForm(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>Add Document Type</span>
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
      ) : documentTypes.length === 0 ? (
        <EmptyState onAddType={() => setShowForm(true)} />
      ) : (
        <div className="bg-white rounded-lg border">
          <DocumentTypeList
            documentTypes={documentTypes}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </div>
      )}

      {showForm && (
        <DocumentTypeForm
          type={selectedType}
          textBlocks={textBlocks}
          onSubmit={selectedType ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setSelectedType(undefined);
          }}
        />
      )}

      {showDeleteModal && typeToDelete && (
        <DeleteConfirmationModal
          typeName={typeToDelete.name}
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setTypeToDelete(undefined);
          }}
        />
      )}
    </div>
  );
};

export default DocumentTypes;