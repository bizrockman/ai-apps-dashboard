export interface Document {
  id: string;
  title: string;
  content: string;
  projectId: string;
  typeId: string;
  elementId: string;
  status: 'draft' | 'review' | 'approved' | 'archived' | 'generated';
  pdfContent?: string;
  pdfFileName?: string;
  pdfGeneratedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDocumentDTO {
  title: string;
  content: string;
  projectId: string;
  typeId: string;
  elementId: string;
  status: 'draft' | 'review' | 'approved' | 'archived' | 'generated';
  pdfContent?: string;
  pdfFileName?: string;
  pdfGeneratedAt?: Date;
}

export interface UpdateDocumentDTO extends Partial<CreateDocumentDTO> {
  id: string;
}