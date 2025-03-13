import React, { useState, useEffect } from 'react';
import { Blocks, Plus } from 'lucide-react';
import { TextBlock, CreateTextBlockDTO } from '../../../../../lib/database/models/TextBlock';
import { TextBlockService } from '../../../../../lib/api/services/TextBlockService';
import TextBlockList from './TextBlockList';
import TextBlockForm from './TextBlockForm';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import EmptyState from './EmptyState';
import { useTranslation } from 'react-i18next';

const TextBlocks: React.FC = () => {
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<TextBlock | undefined>();
  const [blockToDelete, setBlockToDelete] = useState<TextBlock | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  // Service-Instanz erstellen
  const textBlockService = new TextBlockService();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const blocksData = await textBlockService.findAll();
      setTextBlocks(blocksData);
      setError(null);
    } catch (err) {
      setError('Fehler beim Laden der Daten');
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (data: Omit<TextBlock, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await textBlockService.create(data);
      await loadData();
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to create text block');
      console.error('Error creating text block:', err);
    }
  };

  const handleUpdate = async (data: CreateTextBlockDTO) => {
    if (!selectedBlock) return;

    try {
      await textBlockService.update({id: selectedBlock.id, ...data});
      await loadData();
      setShowForm(false);
      setSelectedBlock(undefined);
      setError(null);
    } catch (err) {
      setError('Failed to update text block');
      console.error('Error updating text block:', err);
    }
  };

  const handleDeleteClick = (block: TextBlock) => {
    setBlockToDelete(block);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!blockToDelete) return;
    
    try {
      await textBlockService.delete(blockToDelete.id);
      await loadData();
      setShowDeleteModal(false);
      setBlockToDelete(undefined);
      setError(null);
    } catch (err) {
      setError('Failed to delete text block');
      console.error('Error deleting text block:', err);
    }
  };

  const handleEdit = (block: TextBlock) => {
    setSelectedBlock(block);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Blocks className="h-8 w-8 text-blue-500" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{t('textBlocks.title')}</h2>
            <p className="text-gray-600">{t('textBlocks.description')}</p>
          </div>
        </div>
        <button
          onClick={() => {
            setSelectedBlock(undefined);
            setShowForm(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>{t('textBlocks.singular')} {t('common.add')}</span>
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
      ) : textBlocks.length === 0 ? (
        <EmptyState
          icon={<Blocks className="h-12 w-12 text-gray-400" />}
          title={t('textBlocks.noTextBlocks')}
          description={t('textBlocks.startMessage')}
          buttonText={t('textBlocks.addTextBlock')}
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="bg-white rounded-lg border">
          <TextBlockList
            textBlocks={textBlocks}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </div>
      )}

      {showForm && (
        <TextBlockForm
          block={selectedBlock}
          onSubmit={selectedBlock ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setSelectedBlock(undefined);
          }}
        />
      )}

      {showDeleteModal && blockToDelete && (
        <DeleteConfirmationModal
          title={`${t('common.delete')} ${blockToDelete.name}`}
          message={t('textBlocks.deleteConfirm', { name: blockToDelete.name })}
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setBlockToDelete(undefined);
          }}
        />
      )}
    </div>
  );
};

export default TextBlocks;