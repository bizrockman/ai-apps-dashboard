import React, { useEffect, useState } from 'react';
import { X, GripVertical } from 'lucide-react';
import { DocumentType, DocumentTypeBlock, CreateDocumentTypeDTO } from '../../../../../lib/database/models/DocumentType';
import { TextBlock } from '../../../../../lib/database/models/TextBlock';

interface DocumentTypeFormProps {
  type?: DocumentType;
  textBlocks: TextBlock[];
  onSubmit: (data: CreateDocumentTypeDTO, blocks: DocumentTypeBlock[]) => void;
  onCancel: () => void;
}

const DocumentTypeForm: React.FC<DocumentTypeFormProps> = ({ type, textBlocks, onSubmit, onCancel }) => {
  const [formData, setFormData] = React.useState<CreateDocumentTypeDTO>({    
    name: '',
    description: '',
  });

  const [blocks, setBlocks] = useState<DocumentTypeBlock[]>([]);

  useEffect(() => {
    if (type) {
      setFormData({        
        name: type.name,
        description: type.description,
      });
      setBlocks(type.blocks);
    }
  }, [type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({      
      name: formData.name,
      description: formData.description
    }, blocks);
  };

  const addTextBlock = (textBlockId: string) => {
    const newBlock: DocumentTypeBlock = {            
      id: crypto.randomUUID(),
      documentTypeId: type?.id || '-1',
      textBlockId,
      order: blocks.length,
    };
    setBlocks([...blocks, newBlock]);
  };

  const addInputField = () => {
    const newBlock: DocumentTypeBlock = {     
      id: crypto.randomUUID(), 
      documentTypeId: type?.id || '-1',
      textBlockId: null,
      order: blocks.length,
      inputLabel: '',
      inputType: 'text',
      required: false,
    };
    setBlocks([...blocks, newBlock]);
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, movedBlock);
    
    // Update order values
    newBlocks.forEach((block, index) => {
      block.order = index;
    });
    
    setBlocks(newBlocks);
  };

  const removeBlock = (index: number) => {
    const newBlocks = [...blocks];
    newBlocks.splice(index, 1);
    setBlocks(newBlocks);
  };

  const updateInputField = (index: number, updates: Partial<DocumentTypeBlock>) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], ...updates };
    setBlocks(newBlocks);
  };

  // Get available text blocks (not already used)
  const availableTextBlocks = textBlocks.filter(
    block => !blocks.some(b => b.textBlockId === block.id)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            {type ? 'Edit Document Type' : 'Add New Document Type'}
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
              Name
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

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-900">Blocks</h4>
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={addInputField}
                  className="px-3 py-1 border rounded-lg hover:bg-gray-50"
                >
                  Add Input Field
                </button>
                {availableTextBlocks.length > 0 && (
                  <select
                    onChange={(e) => addTextBlock(e.target.value)}
                    className="px-3 py-1 border rounded-lg hover:bg-gray-50"
                    value=""
                  >
                    <option value="">Add Text Block...</option>
                    {availableTextBlocks.map((block) => (
                      <option key={block.id} value={block.id}>
                        {block.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {blocks.map((block, index) => (
                <div
                  key={block.id}
                  className="flex items-center space-x-2 p-2 border rounded-lg bg-gray-50"
                >
                  <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                  
                  {block.textBlockId !== null ? (
                    // Text Block
                    <div className="flex-1">
                      <span className="font-medium">
                        {textBlocks.find(b => b.id === block.textBlockId)?.name}
                      </span>
                    </div>
                  ) : (
                    // Input Field
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={block.inputLabel || ''}
                        onChange={(e) => updateInputField(index, { inputLabel: e.target.value })}
                        placeholder="Label"
                        className="p-1 border rounded"
                      />
                      <select
                        value={block.inputType || 'text'}
                        onChange={(e) => updateInputField(index, { inputType: e.target.value as 'text' | 'number' | 'date' })}
                        className="p-1 border rounded"
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                      </select>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={block.required || false}
                          onChange={(e) => updateInputField(index, { required: e.target.checked })}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">Required</span>
                      </label>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => removeBlock(index)}
                    className="p-1 text-red-600 hover:text-red-700 rounded-full hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
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
              {type ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentTypeForm;