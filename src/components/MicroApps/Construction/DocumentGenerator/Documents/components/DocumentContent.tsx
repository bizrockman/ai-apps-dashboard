import React, { useCallback } from 'react';
import { DocumentType } from '../../../../../../lib/database/models/DocumentType';
import { TextBlock as TextBlockModel } from '../../../../../../lib/database/models/TextBlock';
import TextBlock from './TextBlock';

interface DocumentContentProps {
  selectedType: DocumentType | undefined;
  textBlocks: TextBlockModel[];
  content: { [key: string]: string };
  onContentChange: (blockId: number | string, content: string) => void;
}

const DocumentContent: React.FC<DocumentContentProps> = ({
  selectedType,
  textBlocks,
  content,
  onContentChange
}) => {
  const getBlockName = useCallback((blockId: number | null) => {
    if (!blockId) return 'Input Field';
    const block = textBlocks.find(b => b.id === blockId);
    return block ? block.name : 'Unknown Block';
  }, [textBlocks]);

  return (
    <div className="p-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Document Content
      </label>
      <div className="space-y-4">
        {selectedType?.blocks.map((block, index) => {
          const blockId = block.textBlockId || `input-${block.inputLabel}`;
          const blockContent = content[blockId] || '';
          
          return (
            <TextBlock
              key={index}
              name={block.textBlockId ? getBlockName(block.textBlockId) : block.inputLabel || 'Input Field'}
              required={block.required || false}
              content={blockContent}
              onEdit={(newContent) => onContentChange(blockId, newContent)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default DocumentContent;