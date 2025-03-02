import React, { useState } from 'react';
import { Document } from '../../../../../../lib/database/models/Document';
import { DatabaseProvider } from '../../../../../../lib/database/DatabaseProvider';

interface DocumentPreviewProps {
  document?: Document;
  onBack: () => void;
  onGenerate: (data: any) => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  onBack,
  onGenerate
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(document?.title || '');
  const [editedContent, setEditedContent] = useState(document?.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const documentDAO = DatabaseProvider.getInstance().getDocumentDAO();

  const handleTitleChange = async () => {
    if (!document) return;
    
    try {
      setIsSaving(true);
      await documentDAO.update({
        id: document.id,
        title: editedTitle,
        status: document.status,
        projectId: document.projectId,
        typeId: document.typeId,
        elementId: document.elementId,
        content: document.content
      });
      setIsEditingTitle(false);
    } catch (error) {
      console.error('Failed to update document title:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleContentChange = async () => {
    if (!document) return;
    
    try {
      setIsSaving(true);
      await documentDAO.update({
        id: document.id,
        title: document.title,
        content: editedContent,
        status: document.status,
        projectId: document.projectId,
        typeId: document.typeId,
        elementId: document.elementId
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update document content:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerate = () => {
    if (!document) return;
    onGenerate({
      ...document,
      content: editedContent
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Scrollable Content Section */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-white rounded-lg border p-6 mb-4">
          <div className="prose max-w-none">
            {isEditingTitle ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleTitleChange}
                className="w-full text-3xl font-bold p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                autoFocus
              />
            ) : (
              <h1 
                onClick={() => setIsEditingTitle(true)}
                className="text-3xl font-bold cursor-text"
              >
                {editedTitle}
              </h1>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6 flex flex-col flex-1 h-full">
          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              onBlur={handleContentChange}
              //className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[400px]"
              className="w-full flex-1 h-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-0"
              autoFocus
            />
          ) : (
            <div
              onClick={() => setIsEditing(true)}
              className="whitespace-pre-wrap leading-relaxed text-gray-800 cursor-text min-h-[400px]"
            >
              {editedContent}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Footer Section */}
      <div className="flex-none flex justify-between p-4 bg-white border-t">
        <button
          type="button"
          onClick={onBack}
          disabled={isSaving}
          className="px-4 py-2 text-gray-700 hover:text-gray-900"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isSaving}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Generate
        </button>
        {isSaving && (
          <span className="text-sm text-gray-500">Saving changes...</span>
        )}
      </div>
    </div>
  );
};

export default DocumentPreview;