'use client';

import React, { useState, useEffect } from 'react';
import { FileStack, Plus } from 'lucide-react';
import { CreateDocumentTypeDTO, DocumentType, DocumentTypeBlock } from '../../../../../lib/database/models/DocumentType';
import { TextBlock } from '../../../../../lib/database/models/TextBlock';
import { DocumentTypeService } from '../../../../../lib/api/services/DocumentTypeService';
import { TextBlockService } from '../../../../../lib/api/services/TextBlockService';
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

  // Services für API-Zugriff
  const documentTypeService = new DocumentTypeService();
  const textBlockService = new TextBlockService();

  const saveBlocks = async (documentTypeId: string, blocks: DocumentTypeBlock[]) => {
    try {
      // Remove all existing blocks first
      const existingType = await documentTypeService.findById(documentTypeId); 
      
      if (existingType) {
        for (const block of existingType.blocks) {
          await documentTypeService.removeBlock(documentTypeId, block.id);
        }
      }
      
      // Add all new blocks with proper order
      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        await documentTypeService.addBlock({
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
      console.error('Error saving blocks:', error);
      setError('Fehler beim Speichern der Blöcke');
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [typesData, blocksData] = await Promise.all([
        documentTypeService.findAll(),
        textBlockService.findAll()
      ]);
      
      setDocumentTypes(typesData);
      setTextBlocks(blocksData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Fehler beim Laden der Daten');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (
    data: CreateDocumentTypeDTO,
    blocks: DocumentTypeBlock[]
  ) => {
    try {
      const newType = await documentTypeService.create(data);
      
      if (blocks.length > 0) {
        await saveBlocks(newType.id, blocks);
      } else {
        await loadData();
      }
      
      setShowForm(false);
      setSelectedType(undefined);
    } catch (error) {
      console.error('Error creating document type:', error);
      setError('Fehler beim Erstellen des Dokumenttyps');
    }
  };

  const handleUpdate = async (
    data: CreateDocumentTypeDTO,
    blocks: DocumentTypeBlock[]
  ) => {
    if (!selectedType) return;
    
    try {
      await documentTypeService.update(selectedType.id, {
        name: data.name,
        description: data.description,
        category: data.category
      });
      
      if (blocks) {
        await saveBlocks(selectedType.id, blocks);
      } else {
        await loadData();
      }
      
      setShowForm(false);
      setSelectedType(undefined);
    } catch (error) {
      console.error('Error updating document type:', error);
      setError('Fehler beim Aktualisieren des Dokumenttyps');
    }
  };

  const handleDeleteClick = (type: DocumentType) => {
    setTypeToDelete(type);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!typeToDelete) return;
    
    try {
      await documentTypeService.delete(typeToDelete.id);
      await loadData();
      setShowDeleteModal(false);
      setTypeToDelete(undefined);
    } catch (error) {
      console.error('Error deleting document type:', error);
      setError('Fehler beim Löschen des Dokumenttyps');
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