'use client';

import { CreateDocumentTypeDTO, DocumentType, DocumentTypeBlock, CreateDocumentTypeBlockDTO } from '../../database/models/DocumentType';

/**
 * Service für die Verwaltung von Dokumenttypen
 * Dieser Service kommuniziert mit der API und sollte im Client verwendet werden
 */
export class DocumentTypeService {
  /**
   * Ruft alle Dokumenttypen ab
   * @returns Eine Liste aller Dokumenttypen
   */
  async findAll(): Promise<DocumentType[]> {
    try {
      const response = await fetch('/api/document-types', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // Die API gibt die Daten in einem data-Feld zurück
      return result.data || [];
    } catch (error) {
      console.error('Error fetching document types:', error);
      throw error;
    }
  }

  /**
   * Ruft einen Dokumenttyp anhand seiner ID ab
   * @param id Die ID des Dokumenttyps
   * @returns Der Dokumenttyp oder null, wenn nicht gefunden
   */
  async findById(id: string): Promise<DocumentType | null> {
    try {
      const response = await fetch(`/api/document-types/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // Die API gibt die Daten in einem data-Feld zurück
      return result.data || null;
    } catch (error) {
      console.error(`Error fetching document type with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Erstellt einen neuen Dokumenttyp
   * @param data Die Daten für den neuen Dokumenttyp
   * @returns Der erstellte Dokumenttyp
   */
  async create(data: CreateDocumentTypeDTO): Promise<DocumentType> {
    try {
      const response = await fetch('/api/document-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // Die API gibt die Daten in einem data-Feld zurück
      return result.data;
    } catch (error) {
      console.error('Error creating document type:', error);
      throw error;
    }
  }

  /**
   * Aktualisiert einen Dokumenttyp
   * @param id Die ID des zu aktualisierenden Dokumenttyps
   * @param data Die neuen Daten für den Dokumenttyp
   * @returns Der aktualisierte Dokumenttyp
   */
  async update(id: string, data: Partial<Omit<DocumentType, 'id' | 'createdAt' | 'updatedAt'>>): Promise<DocumentType> {
    try {
      const response = await fetch(`/api/document-types/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // Die API gibt die Daten in einem data-Feld zurück
      return result.data;
    } catch (error) {
      console.error(`Error updating document type with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Löscht einen Dokumenttyp
   * @param id Die ID des zu löschenden Dokumenttyps
   * @returns true, wenn erfolgreich gelöscht, sonst false
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/document-types/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error(`Error deleting document type with ID ${id}:`, error);
      return false;
    }
  }

  /**
   * Fügt einen Block zu einem Dokumenttyp hinzu
   * @param data Die Daten für den neuen Block
   */
  async addBlock(data: CreateDocumentTypeBlockDTO): Promise<void> {
    try {
      const response = await fetch(`/api/document-types/${data.documentTypeId}/blocks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error adding block to document type:', error);
      throw error;
    }
  }

  /**
   * Entfernt einen Block aus einem Dokumenttyp
   * @param documentTypeId Die ID des Dokumenttyps
   * @param blockId Die ID des zu entfernenden Blocks
   */
  async removeBlock(documentTypeId: string, blockId: string): Promise<void> {
    try {
      const response = await fetch(`/api/document-types/${documentTypeId}/blocks/${blockId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error removing block ${blockId} from document type ${documentTypeId}:`, error);
      throw error;
    }
  }

  /**
   * Ändert die Reihenfolge der Blöcke eines Dokumenttyps
   * @param documentTypeId Die ID des Dokumenttyps
   * @param blockIds Die IDs der Blöcke in der neuen Reihenfolge
   */
  async reorderBlocks(documentTypeId: string, blockIds: string[]): Promise<void> {
    try {
      const response = await fetch(`/api/document-types/${documentTypeId}/blocks/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blockIds }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error reordering blocks for document type ${documentTypeId}:`, error);
      throw error;
    }
  }

  /**
   * Ruft alle Blöcke für einen Dokumenttyp ab
   * @param documentTypeId Die ID des Dokumenttyps
   * @returns Eine Liste aller Blöcke für den Dokumenttyp
   */
  async findBlocksByDocumentTypeId(documentTypeId: string): Promise<DocumentTypeBlock[]> {
    try {
      const response = await fetch(`/api/document-types/${documentTypeId}/blocks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // Die API gibt die Daten in einem data-Feld zurück
      return result.data || [];
    } catch (error) {
      console.error(`Error fetching blocks for document type with ID ${documentTypeId}:`, error);
      throw error;
    }
  }

  /**
   * Erstellt einen neuen Block für einen Dokumenttyp
   * @param documentTypeId Die ID des Dokumenttyps
   * @param data Die Daten für den neuen Block
   * @returns Der erstellte Block
   */
  async createBlock(documentTypeId: string, data: CreateDocumentTypeBlockDTO): Promise<DocumentTypeBlock> {
    try {
      const response = await fetch(`/api/document-types/${documentTypeId}/blocks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // Die API gibt die Daten in einem data-Feld zurück
      return result.data;
    } catch (error) {
      console.error(`Error creating block for document type with ID ${documentTypeId}:`, error);
      throw error;
    }
  }
} 