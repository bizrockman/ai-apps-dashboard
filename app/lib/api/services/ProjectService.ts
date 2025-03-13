'use client';

import { Project } from '../../database/models/Project';

/**
 * Service für die Verwaltung von Projekten
 * Dieser Service kommuniziert mit der API und sollte im Client verwendet werden
 */
export class ProjectService {
  /**
   * Ruft alle Projekte ab
   * @returns Eine Liste aller Projekte
   */
  async findAll(): Promise<Project[]> {
    try {
      const response = await fetch('/api/projects', {
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
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  /**
   * Ruft ein Projekt anhand seiner ID ab
   * @param id Die ID des Projekts
   * @returns Das Projekt oder null, wenn nicht gefunden
   */
  async findById(id: string): Promise<Project | null> {
    try {
      const response = await fetch(`/api/projects/${id}`, {
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
      console.error(`Error fetching project with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Ruft alle Projekte für einen Kunden ab
   * @param clientId Die ID des Kunden
   * @returns Eine Liste aller Projekte für den Kunden
   */
  async findByClient(clientId: string): Promise<Project[]> {
    try {
      const response = await fetch(`/api/projects/client/${clientId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching projects for client ${clientId}:`, error);
      throw error;
    }
  }

  /**
   * Erstellt ein neues Projekt
   * @param data Die Daten für das neue Projekt
   * @returns Das erstellte Projekt
   */
  async create(data: Omit<Project, 'id' | 'code' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    try {
      const response = await fetch('/api/projects', {
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
      console.error('Error creating project:', error);
      throw error;
    }
  }

  /**
   * Aktualisiert ein Projekt
   * @param data Die zu aktualisierenden Daten
   * @returns Das aktualisierte Projekt
   */
  async update(data: Omit<Project, 'code' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    try {
      const response = await fetch(`/api/projects/${data.id}`, {
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
      console.error(`Error updating project with ID ${data.id}:`, error);
      throw error;
    }
  }

  /**
   * Löscht ein Projekt
   * @param id Die ID des zu löschenden Projekts
   * @returns true, wenn erfolgreich gelöscht, sonst false
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/projects/${id}`, {
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
      console.error(`Error deleting project with ID ${id}:`, error);
      return false;
    }
  }
} 