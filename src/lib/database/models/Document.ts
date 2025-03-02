export interface Document {
  id: number;
  title: string;
  content: string;
  projectId: number;
  typeId: number;
  elementId: number;
  status: 'draft' | 'review' | 'approved' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDocumentDTO {
  title: string;
  content: string;
  projectId: number;
  typeId: number;
  elementId: number;
  status: 'draft' | 'review' | 'approved' | 'archived';
}

export interface UpdateDocumentDTO extends Partial<CreateDocumentDTO> {
  id: number;
}