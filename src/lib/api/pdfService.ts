import { PDFData, PDFResponse } from './types';

export class PDFService {
  private static instance: PDFService;
  private apiEndpoint: string;

  private constructor() {
    // Get the API endpoint from environment variables
    this.apiEndpoint = import.meta.env.VITE_LETTER_PRESS_API_ENDPOINT || '';
    
    if (!this.apiEndpoint) {
      console.error('VITE_LETTER_PRESS_API_ENDPOINT environment variable is not set');
    }
  }

  public static getInstance(): PDFService {
    if (!PDFService.instance) {
      PDFService.instance = new PDFService();
    }
    return PDFService.instance;
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
        // Get the PDF as a blob
        const blob = await response.blob();
        
        // Convert blob to base64 for easier handling
        const base64 = await this.blobToBase64(blob);
        
        // Create a download URL
        const url = URL.createObjectURL(blob);
        
        // Get filename from Content-Disposition header or use default
        const contentDisposition = response.headers.get('content-disposition');
        const fileName = this.getFilenameFromContentDisposition(contentDisposition) || 'document.pdf';
        
        return {
          success: true,
          fileUrl: url,
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
   * Helper method to convert a Blob to a base64 string
   */
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = base64String.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
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

  /**
   * Download PDF from base64 data
   * @param base64Data The base64 encoded PDF data
   * @param fileName The name to save the file as
   */
  public downloadPDFFromBase64(base64Data: string, fileName: string): void {
    // Create blob from base64
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    
    // Create download URL and trigger download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Download the PDF file
   * @param fileUrl The URL of the file to download
   * @param fileName The name to save the file as
   * @deprecated Use downloadPDFFromBase64 instead
   */
  public downloadPDF(fileUrl: string, fileName: string): void {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export default PDFService;
