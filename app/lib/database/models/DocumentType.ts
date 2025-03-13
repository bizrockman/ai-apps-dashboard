export interface DocumentType {
  id: string;
  name: string;
  description: string;
  blocks: DocumentTypeBlock[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentTypeBlock {
  id: string;
  documentTypeId: string;
  textBlockId: string | null; // null for input fields
  order: number;
  inputLabel?: string; // Label for input fields
  inputType?: 'text' | 'number' | 'date'; // Type for input fields
  required?: boolean;
}

export interface CreateDocumentTypeDTO {
  name: string;
  description: string;
}

export interface UpdateDocumentTypeDTO extends Partial<CreateDocumentTypeDTO> {
  id: string;
}

export interface CreateDocumentTypeBlockDTO {
  documentTypeId: string;
  textBlockId: string | null;
  order: number;
  inputLabel?: string;
  inputType?: 'text' | 'number' | 'date';
  required?: boolean;
}

export interface UpdateDocumentTypeBlockDTO extends Partial<CreateDocumentTypeBlockDTO> {
  id: string;
}