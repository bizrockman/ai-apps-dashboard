import { PDFData, PDFResponse } from './types';

export class ServerPDFService {
  private static instance: ServerPDFService;
  private apiEndpoint: string;

  private constructor() {
    // Get the API endpoint from environment variables
    // In server components, we can use process.env directly
    this.apiEndpoint = process.env.LETTER_PRESS_API_ENDPOINT || 'https://letterpress.coolify.alsdienst.de/generate-pdf';
    
    if (!this.apiEndpoint) {
      console.error('LETTER_PRESS_API_ENDPOINT environment variable is not set');
    }
  }

  public static getInstance(): ServerPDFService {
    if (!ServerPDFService.instance) {
      ServerPDFService.instance = new ServerPDFService();
    }
    return ServerPDFService.instance;
  }

  /**
   * Generate a PDF document using the Letter Press API
   * @param data The data to send to the API
   * @returns A promise that resolves to the PDF response
   */
  public async generatePDF(data: PDFData): Promise<PDFResponse> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      // Check if the response is a PDF file
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/pdf')) {
        // Get the PDF as an ArrayBuffer
        const arrayBuffer = await response.arrayBuffer();
        
        // Convert ArrayBuffer to base64 for easier handling
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        
        // Get filename from Content-Disposition header or use default
        const contentDisposition = response.headers.get('content-disposition');
        const fileName = this.getFilenameFromContentDisposition(contentDisposition) || 'document.pdf';
        
        return {
          success: true,
          // fileUrl is not needed on the server
          fileUrl: '',
          fileName,
          fileData: base64,
        };
      } else {
        // If not a PDF, try to parse as JSON
        const jsonResponse = await response.json();
        return {
          success: true,
          ...jsonResponse,
        };
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Helper method to extract filename from Content-Disposition header
   */
  private getFilenameFromContentDisposition(contentDisposition: string | null): string | null {
    if (!contentDisposition) return null;
    
    const filenameMatch = contentDisposition.match(/filename="(.+)"/);
    if (filenameMatch && filenameMatch[1]) {
      return filenameMatch[1];
    }
    
    return null;
  }
} 