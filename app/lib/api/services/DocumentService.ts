'use client';

import { Document } from '../../database/models/Document';

/**
 * Service für die Verwaltung von Dokumenten
 * Dieser Service kommuniziert mit der API und sollte im Client verwendet werden
 */
export class DocumentService {
  /**
   * Ruft alle Dokumente ab
   * @returns Eine Liste aller Dokumente
   */
  async findAll(): Promise<Document[]> {
    try {
      const response = await fetch('/api/documents', {
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
      console.error('Error fetching documents:', error);
      throw error;
    }
  }

  /**
   * Ruft ein Dokument anhand seiner ID ab
   * @param id Die ID des Dokuments
   * @returns Das Dokument oder null, wenn nicht gefunden
   */
  async findById(id: string): Promise<Document | null> {
    try {
      const response = await fetch(`/api/documents/${id}`, {
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
      console.error(`Error fetching document with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Ruft alle Dokumente für ein Projekt ab
   * @param projectId Die ID des Projekts
   * @returns Eine Liste aller Dokumente für das Projekt
   */
  async findByProject(projectId: string): Promise<Document[]> {
    try {
      const response = await fetch(`/api/documents/project/${projectId}`, {
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
      console.error(`Error fetching documents for project ${projectId}:`, error);
      throw error;
    }
  }

  /**
   * Erstellt ein neues Dokument
   * @param data Die Daten für das neue Dokument
   * @returns Das erstellte Dokument
   */
  async create(data: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Promise<Document> {
    try {
      const response = await fetch('/api/documents', {
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
      console.error('Error creating document:', error);
      throw error;
    }
  }

  /**
   * Aktualisiert ein Dokument
   * @param data Die zu aktualisierenden Daten
   * @returns Das aktualisierte Dokument
   */
  async update(data: Partial<Document> & { id: string }): Promise<Document> {
    try {
      const response = await fetch(`/api/documents/${data.id}`, {
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
      console.error(`Error updating document with ID ${data.id}:`, error);
      throw error;
    }
  }

  /**
   * Löscht ein Dokument
   * @param id Die ID des zu löschenden Dokuments
   * @returns true, wenn erfolgreich gelöscht, sonst false
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/documents/${id}`, {
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
      console.error(`Error deleting document with ID ${id}:`, error);
      return false;
    }
  }
} 