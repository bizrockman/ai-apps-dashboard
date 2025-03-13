'use client';

import { ContactPerson } from '../../database/models/ContactPerson';

/**
 * Service für die Verwaltung von Kontaktpersonen
 * Dieser Service kommuniziert mit der API und sollte im Client verwendet werden
 */
export class ContactPersonService {
  /**
   * Ruft alle Kontaktpersonen ab
   * @returns Eine Liste aller Kontaktpersonen
   */
  async findAll(): Promise<ContactPerson[]> {
    try {
      const response = await fetch('/api/contact-persons', {
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
      console.error('Error fetching contact persons:', error);
      throw error;
    }
  }

  /**
   * Ruft eine Kontaktperson anhand ihrer ID ab
   * @param id Die ID der Kontaktperson
   * @returns Die Kontaktperson oder null, wenn nicht gefunden
   */
  async findById(id: string): Promise<ContactPerson | null> {
    try {
      const response = await fetch(`/api/contact-persons/${id}`, {
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
      console.error(`Error fetching contact person with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Ruft alle Kontaktpersonen für ein Projekt ab
   * @param projectId Die ID des Projekts
   * @returns Eine Liste aller Kontaktpersonen für das Projekt
   */
  async findByProject(projectId: string): Promise<ContactPerson[]> {
    try {
      const response = await fetch(`/api/contact-persons/project/${projectId}`, {
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
      console.error(`Error fetching contact persons for project ${projectId}:`, error);
      throw error;
    }
  }

  /**
   * Ruft alle Kontaktpersonen für einen Kunden ab
   * @param clientId Die ID des Kunden
   * @returns Eine Liste aller Kontaktpersonen für den Kunden
   */
  async findByClient(clientId: string): Promise<ContactPerson[]> {
    try {
      const response = await fetch(`/api/contact-persons/client/${clientId}`, {
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
      console.error(`Error fetching contact persons for client ${clientId}:`, error);
      throw error;
    }
  }

  /**
   * Erstellt eine neue Kontaktperson
   * @param data Die Daten für die neue Kontaktperson
   * @returns Die erstellte Kontaktperson
   */
  async create(data: Omit<ContactPerson, 'id' | 'createdAt' | 'updatedAt' | 'clients' | 'projects'>): Promise<ContactPerson> {
    try {
      const response = await fetch('/api/contact-persons', {
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
      console.error('Error creating contact person:', error);
      throw error;
    }
  }

  /**
   * Aktualisiert eine Kontaktperson
   * @param data Die zu aktualisierenden Daten
   * @returns Die aktualisierte Kontaktperson
   */
  async update(data: Partial<Omit<ContactPerson, 'createdAt' | 'updatedAt' | 'clients' | 'projects'>> & { id: string }): Promise<ContactPerson> {
    try {
      const response = await fetch(`/api/contact-persons/${data.id}`, {
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
      console.error(`Error updating contact person with ID ${data.id}:`, error);
      throw error;
    }
  }

  /**
   * Löscht eine Kontaktperson
   * @param id Die ID der zu löschenden Kontaktperson
   * @returns true, wenn erfolgreich gelöscht, sonst false
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/contact-persons/${id}`, {
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
      console.error(`Error deleting contact person with ID ${id}:`, error);
      return false;
    }
  }
} 