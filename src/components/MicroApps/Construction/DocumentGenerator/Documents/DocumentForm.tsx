import React, { useState, useEffect } from 'react';
import { Client } from '../../../../../lib/database/models/Client';
import { Project } from '../../../../../lib/database/models/Project';
import { DocumentType } from '../../../../../lib/database/models/DocumentType';
import { ConstructionElement } from '../../../../../lib/database/models/ConstructionElement';
import { Document } from '../../../../../lib/database/models/Document';
import { TextBlock } from '../../../../../lib/database/models/TextBlock';
import DocumentEditor from './components/DocumentEditor';
import DocumentPreview from './components/DocumentPreview';

interface DocumentFormProps {
  clients: Client[];
  projects: Project[];
  documentTypes: DocumentType[];
  elements: ConstructionElement[];
  textBlocks: TextBlock[];
  document?: Document;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const DocumentForm: React.FC<DocumentFormProps> = ({
  clients,
  projects,
  documentTypes,
  elements,
  textBlocks,
  document,
  onSubmit,
  onCancel
}) => {
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    // Show preview immediately if document has showPreview flag
    if (document?.showPreview) {
      setShowPreview(true);
    }
  }, [document]);

  const handlePreview = (documentData: any) => {
    onSubmit({ ...documentData, showPreview: true });
    setShowPreview(true);
  };

  const handleGenerate = (documentData: any) => {
    onSubmit({ ...documentData, showPreview: false });
    onCancel();
  };

  const handleBack = () => {
    onCancel();
  };

  return showPreview ? (
    <DocumentPreview
      document={document}
      onBack={handleBack}
      onGenerate={handleGenerate}
    />
  ) : (
    <DocumentEditor
      clients={clients}
      projects={projects}
      documentTypes={documentTypes}
      elements={elements}
      textBlocks={textBlocks}
      document={document}
      onPreview={handlePreview}
      onCancel={onCancel}
    />
  );
};

export default DocumentForm;