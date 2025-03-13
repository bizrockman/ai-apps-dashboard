'use client';

/**
 * Ein einfacher API-Client für die Client-Seite, der HTTP-Anfragen an die API-Routen sendet.
 * Dieser Client ist unabhängig von der Backend-Implementierung und kennt nur die API-Routen.
 */
class ApiClient {
  private static instance: ApiClient;

  private constructor() {}

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  /**
   * Sendet eine GET-Anfrage an die API
   * @param endpoint Der API-Endpunkt
   * @param params Optionale Query-Parameter
   * @returns Die Antwort der API
   */
  public async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`/api/${endpoint}`, window.location.origin);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Wichtig für Cookies
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }
    
    return response.json();
  }

  /**
   * Sendet eine POST-Anfrage an die API
   * @param endpoint Der API-Endpunkt
   * @param data Die zu sendenden Daten
   * @returns Die Antwort der API
   */
  public async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include', // Wichtig für Cookies
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }
    
    return response.json();
  }

  /**
   * Sendet eine PUT-Anfrage an die API
   * @param endpoint Der API-Endpunkt
   * @param data Die zu sendenden Daten
   * @returns Die Antwort der API
   */
  public async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`/api/${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include', // Wichtig für Cookies
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }
    
    return response.json();
  }

  /**
   * Sendet eine DELETE-Anfrage an die API
   * @param endpoint Der API-Endpunkt
   * @param params Optionale Query-Parameter
   * @returns Die Antwort der API
   */
  public async delete<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`/api/${endpoint}`, window.location.origin);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    
    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Wichtig für Cookies
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }
    
    return response.json();
  }
}

export default ApiClient; 