import React, { useState, useCallback } from 'react';
import { Pencil, Save } from 'lucide-react';

interface TextBlockProps {
  name: string;
  required: boolean;
  content: string;
  onEdit: (newContent: string) => void;
}

const TextBlock: React.FC<TextBlockProps> = ({ name, required, content, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [isProcessingClick, setIsProcessingClick] = useState(false);

  const handleSave = () => {
    onEdit(editedContent);
    setIsEditing(false);
  };

  const handleClick = useCallback(() => {
    // Prevent click handling if already processing a click
    if (isProcessingClick) {
      return;
    }

    const now = Date.now();
    // Prevent clicks within 500ms of each other
    if (now - lastClickTime < 500) {
      return;
    }

    setIsProcessingClick(true);
    setLastClickTime(now);

    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }

    // Release click lock after 500ms
    setTimeout(() => {
      setIsProcessingClick(false);
    }, 500);
  }, [isEditing, lastClickTime, isProcessingClick, handleSave]);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          <span className="text-xs text-gray-500">{name}</span>
          {required && <span className="text-red-500 ml-1">*</span>}
        </div>
        <button
          onClick={handleClick}
          className={`p-1 rounded transition-colors ${
            isProcessingClick
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          disabled={isProcessingClick}
        >
          {isEditing ? (
            <Save className="h-4 w-4 text-green-600" />
          ) : (
            <Pencil className="h-4 w-4" />
          )}
        </button>
      </div>
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          rows={5}
          autoFocus
          onBlur={handleSave}
        />
      ) : (
        <div className="w-full p-4 border rounded-lg whitespace-pre-wrap bg-gray-50">
          {content}
        </div>
      )}
    </div>
  );
};

export default TextBlock;