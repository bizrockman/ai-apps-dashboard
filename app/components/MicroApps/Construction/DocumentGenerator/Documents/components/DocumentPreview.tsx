import React, { useState, useEffect } from 'react';
import { Document } from '../../../../../../lib/database/models/Document';
import { Project } from '../../../../../../lib/database/models/Project';
import { Client } from '../../../../../../lib/database/models/Client';
import { PDFService } from '../../../../../../lib/api/pdfService';
import { DocumentFilter } from '../../../../../../lib/utils/DocumentFilter';
import { useAuth } from '../../../../../../contexts/AuthContext';
import { DocumentService } from '../../../../../../lib/api/services/DocumentService';
import { ProjectService } from '../../../../../../lib/api/services/ProjectService';
import { ClientService } from '../../../../../../lib/api/services/ClientService';
import { ContactPersonService } from '../../../../../../lib/api/services/ContactPersonService';
import { PDFGeneratorService } from '../../../../../../lib/api/services/PDFGeneratorService';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(document?.title || '');
  const [editedContent, setEditedContent] = useState(document?.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const [documentFilter, setDocumentFilter] = useState<DocumentFilter | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  
  const documentService = new DocumentService();
  const projectService = new ProjectService();
  const clientService = new ClientService();
  const contactPersonService = new ContactPersonService();
  const pdfService = PDFService.getInstance();
  const pdfGeneratorService = new PDFGeneratorService();
  
  const { user } = useAuth();

  useEffect(() => {
    const initializeContent = async () => {
      if (!document || !user) return;

      try {
        // Get project and contact persons
        const project = await projectService.findById(document.projectId);
        setProject(project);
        
        // Get client if project exists
        if (project) {
          const client = await clientService.findById(project.clientId);
          setClient(client);
        }
        
        const contactPersons = project ? await contactPersonService.findByProject(project.id) : [];
        // Filter contact persons to only include those with clients
        const contactPersonsWithClients = contactPersons.filter(person => 
          person.clients && person.clients.length > 0
        );

        // Create filter and process content
        const filter = new DocumentFilter(user, project || undefined, contactPersonsWithClients);
        setDocumentFilter(filter);
        const processedContent = await filter.processContent(document.content);

        setEditedTitle(document.title);
        setEditedContent(processedContent);
      } catch (error) {
        console.error('Error processing document content:', error);
        setEditedTitle(document.title);
        setEditedContent(document.content);
      }
    };

    initializeContent();
  }, [document]);

  const handleTitleChange = async () => {
    if (!document) return;
    
    // Create update data with only the title change
    const updateData = {
      id: document.id,
      title: editedTitle,
      content: document.content,
      status: document.status,
      projectId: document.projectId,
      typeId: document.typeId,
      elementId: document.elementId
    };
    
    try {
      setIsSaving(true);
      await documentService.update(updateData);
      setIsEditingTitle(false);
    } catch (error) {
      console.error('Failed to update document title:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleContentChange = async () => {
    if (!document) return;
    
    // Create update data with only the content change
    const updateData = {
      id: document.id,
      content: editedContent,
      title: document.title,
      status: document.status,
      projectId: document.projectId,
      typeId: document.typeId,
      elementId: document.elementId
    };
    
    try {
      setIsSaving(true);
      await documentService.update(updateData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update document content:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerate = async () => {
    if (!document) return;

    try {
        // Ensure all pending changes are saved **before** generating the PDF
        if (isEditing) {
            await handleContentChange();
            setIsEditing(false);
        }
        if (isEditingTitle) {
            await handleTitleChange();
            setIsEditingTitle(false);
        }

        // Ensure documentFilter is available before accessing userSign
        const our_sign = documentFilter?.userSign || '';

        // Prepare document data for PDF generation
        const documentData = {
            ...document,
            title: editedTitle,
            content: editedContent,
            our_sign
        };

        // Generate the PDF using the service
        const pdfResponse = await pdfGeneratorService.generatePDF(documentData);
        
        console.log('pdfResponse', pdfResponse);
        // Ensure the response is valid
        if (!pdfResponse || !pdfResponse.success) {
            throw new Error(pdfResponse?.message || 'Failed to generate PDF');
        }

        // Ensure `pdfGeneratedAt` uses a **consistent** timestamp
        const pdfGeneratedAt = new Date();
       
        // Download the PDF
        if (pdfResponse.fileData && pdfResponse.fileName) {
            pdfService.downloadPDFFromBase64(pdfResponse.fileData, pdfResponse.fileName);
        }

        // Call onGenerate **only after everything is completed**
        onGenerate({
            ...document,
            title: editedTitle,
            content: editedContent,
            status: 'generated',
            pdfContent: pdfResponse.fileData,
            pdfFileName: pdfResponse.fileName,
            pdfGeneratedAt
        });

    } catch (error) {
        console.error('Error generating PDF:', error);

        // Verwende einen gültigen Status-Wert anstelle von 'error'
        onGenerate({
            ...document,
            title: editedTitle,
            content: editedContent,
            status: 'draft' // Änderung von 'error' zu 'draft'
        });
    }
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
          {t('common.back', 'Zurück')}
        </button>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isSaving}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          {t('documents.generate', 'Generieren')}
        </button>
        {isSaving && (
          <span className="text-sm text-gray-500">{t('documents.saving', 'Änderungen werden gespeichert...')}</span>
        )}
      </div>
    </div>
  );
};

export default DocumentPreview;
