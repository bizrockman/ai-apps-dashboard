'use client';

import { TextBlock } from '../../database/models/TextBlock';

/**
 * Service für die Verwaltung von Textbausteinen
 * Dieser Service kommuniziert mit der API und sollte im Client verwendet werden
 */
export class TextBlockService {
  /**
   * Ruft alle Textbausteine ab
   * @returns Eine Liste aller Textbausteine
   */
  async findAll(): Promise<TextBlock[]> {
    try {
      const response = await fetch('/api/text-blocks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching text blocks:', error);
      throw error;
    }
  }

  /**
   * Ruft einen Textbaustein anhand seiner ID ab
   * @param id Die ID des Textbausteins
   * @returns Der Textbaustein oder null, wenn nicht gefunden
   */
  async findById(id: string): Promise<TextBlock | null> {
    try {
      const response = await fetch(`/api/text-blocks/${id}`, {
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
      return result.data || null;
    } catch (error) {
      console.error(`Error fetching text block with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Erstellt einen neuen Textbaustein
   * @param data Die Daten für den neuen Textbaustein
   * @returns Der erstellte Textbaustein
   */
  async create(data: Omit<TextBlock, 'id' | 'createdAt' | 'updatedAt'>): Promise<TextBlock> {
    try {
      const response = await fetch('/api/text-blocks', {
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
      console.error('Error creating text block:', error);
      throw error;
    }
  }

  /**
   * Aktualisiert einen Textbaustein
   * @param data Die zu aktualisierenden Daten
   * @returns Der aktualisierte Textbaustein
   */
  async update(data: CreateTextBlockDTO & { id: string }): Promise<TextBlock> {
    try {
      const response = await fetch(`/api/text-blocks/${data.id}`, {
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
      console.error(`Error updating text block with ID ${data.id}:`, error);
      throw error;
    }
  }

  /**
   * Löscht einen Textbaustein
   * @param id Die ID des zu löschenden Textbausteins
   * @returns true, wenn erfolgreich gelöscht, sonst false
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/text-blocks/${id}`, {
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
      console.error(`Error deleting text block with ID ${id}:`, error);
      return false;
    }
  }

  /**
   * Sucht einen Textbaustein anhand seines Kürzels
   * @param shortcut Das Kürzel des Textbausteins
   * @returns Der Textbaustein oder null, wenn nicht gefunden
   */
  async findByShortcut(shortcut: string): Promise<TextBlock | null> {
    try {
      const response = await fetch(`/api/text-blocks/shortcut/${shortcut}`, {
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

      return await response.json();
    } catch (error) {
      console.error(`Error fetching text block with shortcut ${shortcut}:`, error);
      return null;
    }
  }
} 