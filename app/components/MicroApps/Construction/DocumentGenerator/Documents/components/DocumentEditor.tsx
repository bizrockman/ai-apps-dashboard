import React, { useState, useEffect, useCallback } from 'react';
import { Client } from '../../../../../../lib/database/models/Client';
import { Project } from '../../../../../../lib/database/models/Project';
import { DocumentType } from '../../../../../../lib/database/models/DocumentType';
import { ConstructionElement } from '../../../../../../lib/database/models/ConstructionElement';
import { Document } from '../../../../../../lib/database/models/Document';
import { TextBlock } from '../../../../../../lib/database/models/TextBlock';
import SelectionStep from './SelectionStep';
import SelectionSummary from './SelectionSummary';
import DocumentContent from './DocumentContent';

interface DocumentEditorProps {
  clients: Client[];
  projects: Project[];
  documentTypes: DocumentType[];
  elements: ConstructionElement[];
  textBlocks: TextBlock[];
  document?: Document;
  onPreview: (data: any) => void;
  onCancel: () => void;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({
  clients,
  projects,
  documentTypes,
  elements,
  textBlocks,
  document,
  onPreview,
  onCancel
}) => {
  const [selectedClient, setSelectedClient] = useState<string | ''>('');
  const [selectedProject, setSelectedProject] = useState<string | ''>('');
  const [selectedElement, setSelectedElement] = useState<string | ''>('');
  const [selectedType, setSelectedType] = useState<string | ''>('');
  const [showSelections, setShowSelections] = useState(true);
  const [content, setContent] = useState<{ [key: string]: string }>({});
  const [title, setTitle] = useState('');

  // Reset dependent fields when parent selection changes
  const handleClientChange = (clientId: string | '') => {
    setSelectedClient(clientId);
    setSelectedProject('');
    setSelectedElement('');
    setSelectedType('');
    setContent({});
  };

  const handleProjectChange = (projectId: string | '') => {
    setSelectedProject(projectId);
    setSelectedElement('');
    setSelectedType('');
    setContent({});
  };

  const handleElementChange = (elementId: string | '') => {
    setSelectedElement(elementId);
    setSelectedType('');
    setContent({});
  };

  const handleTypeChange = useCallback((typeId: string | '') => {
    setSelectedType(typeId);
    if (typeId) {
      const type = documentTypes.find(t => t.id === typeId);
      if (type) {
        const newContent: { [key: string]: string } = {};
        
        type.blocks.forEach((block) => {
          const blockId = block.textBlockId || `input-${block.inputLabel}`;
          if (block.textBlockId) {
            const textBlock = textBlocks.find(tb => tb.id === block.textBlockId);
            if (textBlock) {
              newContent[blockId] = textBlock.content;
            }
          }
        });
        
        setContent(newContent);
        setShowSelections(false);
      }
    }
  }, [documentTypes, textBlocks]);

  const handleContentChange = (blockId: number | string, newContent: string) => {
    setContent(prev => ({
      ...prev,
      [blockId]: newContent
    }));
  };

  const handlePreview = () => {
    const selectedDocType = documentTypes.find(t => t.id === selectedType);
    const selectedProj = projects.find(p => p.id === selectedProject);
    const selectedElem = elements.find(e => e.id === selectedElement);
    
    // Generate automatic title if none provided
    const generatedTitle = title || [
      selectedDocType?.name,
      selectedProj?.name,
      selectedElem?.name,
      new Date().toLocaleDateString()
    ].filter(Boolean).join(' - ');

    // Combine all content blocks with labels
    const finalContent = selectedDocType?.blocks
      .map(block => {
        const blockId = block.textBlockId || `input-${block.inputLabel}`;
        const blockContent = content[blockId]?.trim();
        
        if (!blockContent) return null;
        
        return block.inputLabel
          ? `${block.inputLabel}\n\n${blockContent}`
          : blockContent;
      })
      .filter(Boolean)
      .join('\n\n') || '';

    // Create document data
    const documentData = {
      title: generatedTitle,
      projectId: selectedProject,
      typeId: selectedType,
      elementId: selectedElement,
      content: finalContent,
      status: 'draft'
    };

    // Log preview data for debugging
    console.log('Preview Data:', documentData);

    onPreview(documentData);
  };

  const resetForm = () => {
    setSelectedClient('');
    setSelectedProject('');
    setSelectedElement('');
    setSelectedType('');
    setContent({});
    setTitle('');
    setShowSelections(true);
  };

  useEffect(() => {
    if (document) {
      const project = projects.find(p => p.id === document.projectId);
      if (project) {
        setSelectedClient(project.clientId);
        setSelectedProject(document.projectId);
      }
      setSelectedType(document.typeId);
      setSelectedElement(document.elementId);
      setTitle(document.title);
      setContent({ 'content': document.content });
      setShowSelections(false);
    }
  }, [document, projects]);

  const isSubmitDisabled = !selectedType || Object.keys(content).length === 0 || showSelections;

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Fixed Header Section */}
      <div className="flex-none">
        {showSelections ? (
          <SelectionStep
            clients={clients}
            projects={projects}
            documentTypes={documentTypes}
            elements={elements}
            selectedClient={selectedClient}
            selectedProject={selectedProject}
            selectedElement={selectedElement}
            selectedType={selectedType}
            onClientChange={handleClientChange}
            onProjectChange={handleProjectChange}
            onElementChange={handleElementChange}
            onTypeChange={handleTypeChange}
            disabled={!!document}
          />
        ) : (
          <SelectionSummary
            clients={clients}
            projects={projects}
            documentTypes={documentTypes}
            elements={elements}
            selectedClient={selectedClient}
            selectedProject={selectedProject}
            selectedElement={selectedElement}
            selectedType={selectedType}
            onReset={resetForm}
          />
        )}
      </div>

      {/* Scrollable Content Section */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Document Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter document title"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {(selectedType || document) && (
          <DocumentContent
            selectedType={documentTypes.find(t => t.id ===selectedType)}
            textBlocks={textBlocks}
            content={content}
            onContentChange={handleContentChange}
          />
        )}
      </div>

      {/* Fixed Footer Section */}
      <div className="flex-none flex justify-between p-4 bg-white border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:text-gray-900"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handlePreview}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitDisabled}
        >
          Preview
        </button>
      </div>
    </div>
  );
};

export default DocumentEditor;