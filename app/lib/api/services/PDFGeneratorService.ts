'use client';

import { PDFResponse } from '../types';

/**
 * Service für die Generierung von PDFs
 * Dieser Service kommuniziert mit der API und sollte im Client verwendet werden
 */
export class PDFGeneratorService {
  /**
   * Generiert ein PDF für ein Dokument
   * @param documentData Die Daten für das PDF
   * @returns Das generierte PDF
   */
  async generatePDF(documentData: any): Promise<PDFResponse> {
    try {
      const response = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unbekannter Fehler bei der PDF-Generierung'
      };
    }
  }
} 