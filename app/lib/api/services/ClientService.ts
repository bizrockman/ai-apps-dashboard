'use client';

import { Client } from '../../database/models/Client';

/**
 * Service für die Verwaltung von Kunden
 * Dieser Service kommuniziert mit der API und sollte im Client verwendet werden
 */
export class ClientService {
  /**
   * Ruft alle Kunden ab
   * @returns Eine Liste aller Kunden
   */
  async findAll(): Promise<Client[]> {
    try {
      const response = await fetch('/api/clients', {
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
      console.error('Error fetching clients:', error);
      throw error;
    }
  }

  /**
   * Ruft einen Kunden anhand seiner ID ab
   * @param id Die ID des Kunden
   * @returns Der Kunde oder null, wenn nicht gefunden
   */
  async findById(id: string): Promise<Client | null> {
    try {
      const response = await fetch(`/api/clients/${id}`, {
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
      console.error(`Error fetching client with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Erstellt einen neuen Kunden
   * @param data Die Daten für den neuen Kunden
   * @returns Der erstellte Kunde
   */
  async create(data: { id: string } & Partial<CreateClientDTO>): Promise<Client> {
    try {
      const response = await fetch('/api/clients', {
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
      console.error('Error creating client:', error);
      throw error;
    }
  }

  /**
   * Aktualisiert einen Kunden
   * @param data Die zu aktualisierenden Daten
   * @returns Der aktualisierte Kunde
   */
  async update(data: { id: string } & Partial<CreateClientDTO>): Promise<Client> {
    try {
      const response = await fetch(`/api/clients/${data.id}`, {
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
      console.error(`Error updating client with ID ${data.id}:`, error);
      throw error;
    }
  }

  /**
   * Löscht einen Kunden
   * @param id Die ID des zu löschenden Kunden
   * @returns true, wenn erfolgreich gelöscht, sonst false
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/clients/${id}`, {
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
      console.error(`Error deleting client with ID ${id}:`, error);
      return false;
    }
  }
} 