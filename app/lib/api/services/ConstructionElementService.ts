'use client';

import { ConstructionElement } from '../../database/models/ConstructionElement';

/**
 * Service für die Verwaltung von Bauelementen
 * Dieser Service kommuniziert mit der API und sollte im Client verwendet werden
 */
export class ConstructionElementService {
  /**
   * Ruft alle Bauelemente ab
   * @returns Eine Liste aller Bauelemente
   */
  async findAll(): Promise<ConstructionElement[]> {
    try {
      const response = await fetch('/api/construction-elements', {
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
      console.error('Error fetching construction elements:', error);
      throw error;
    }
  }

  /**
   * Ruft ein Bauelement anhand seiner ID ab
   * @param id Die ID des Bauelements
   * @returns Das Bauelement oder null, wenn nicht gefunden
   */
  async findById(id: string): Promise<ConstructionElement | null> {
    try {
      const response = await fetch(`/api/construction-elements/${id}`, {
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
      console.error(`Error fetching construction element with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Ruft alle Bauelemente für ein Projekt ab
   * @param projectId Die ID des Projekts
   * @returns Eine Liste aller Bauelemente für das Projekt
   */
  async findByProject(projectId: string): Promise<ConstructionElement[]> {
    try {
      const response = await fetch(`/api/construction-elements/project/${projectId}`, {
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
      console.error(`Error fetching construction elements for project ${projectId}:`, error);
      throw error;
    }
  }

  /**
   * Erstellt ein neues Bauelement
   * @param data Die Daten für das neue Bauelement
   * @returns Das erstellte Bauelement
   */
  async create(data: Omit<ConstructionElement, 'id' | 'createdAt' | 'updatedAt'>): Promise<ConstructionElement> {
    try {
      const response = await fetch('/api/construction-elements', {
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
      console.error('Error creating construction element:', error);
      throw error;
    }
  }

  /**
   * Aktualisiert ein Bauelement
   * @param data Die zu aktualisierenden Daten
   * @returns Das aktualisierte Bauelement
   */
  async update(data: Omit<ConstructionElement, 'createdAt' | 'updatedAt'>): Promise<ConstructionElement> {
    try {
      const response = await fetch(`/api/construction-elements/${data.id}`, {
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
      console.error(`Error updating construction element with ID ${data.id}:`, error);
      throw error;
    }
  }

  /**
   * Löscht ein Bauelement
   * @param id Die ID des zu löschenden Bauelements
   * @returns true, wenn erfolgreich gelöscht, sonst false
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/construction-elements/${id}`, {
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
      console.error(`Error deleting construction element with ID ${id}:`, error);
      return false;
    }
  }
} 