export interface DocumentType {
  id: number;
  name: string;
  description: string;
  blocks: DocumentTypeBlock[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentTypeBlock {
  id: number;
  documentTypeId: number;
  textBlockId: number | null; // null for input fields
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
  id: number;
}

export interface CreateDocumentTypeBlockDTO {
  documentTypeId: number;
  textBlockId: number | null;
  order: number;
  inputLabel?: string;
  inputType?: 'text' | 'number' | 'date';
  required?: boolean;
}