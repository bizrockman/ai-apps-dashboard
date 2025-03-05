import { Document } from '../database/models/Document';
import { Project } from '../database/models/Project';
import { Client } from '../database/models/Client';
import { PDFService } from './pdfService';
import { PDFData } from './types';
import { DatabaseProvider } from '../database/DatabaseProvider';

/**
 * Generate a PDF document from a Document object
 * @param documentData The document data to generate a PDF from
 * @returns A promise that resolves when the PDF has been generated and downloaded
 */
export async function generateDocumentPDF(documentData: any): Promise<void> {
  if (!documentData) {
    throw new Error('Document data is required');
  }

  // Get database access objects
  const db = DatabaseProvider.getInstance();
  const projectDAO = db.getProjectDAO();
  const clientDAO = db.getClientDAO();

  // Get project information if available
  let projectName = '';
  let clientAddress = '';
  
  if (documentData.projectId) {
    try {
      const project = await projectDAO.findById(documentData.projectId);
      if (project) {
        projectName = project.name;
        
        // Get client information if available
        if (project.clientId) {
          const client = await clientDAO.findById(project.clientId);
          if (client) {
            clientAddress = client.address;
          }
        }
      }
    } catch (error) {
      console.error('Error fetching project or client data:', error);
    }
  }

  // Format the current date as YYYY-MM-DD
  const currentDate = new Date().toISOString().split('T')[0];

  // Create the PDF data object
  const pdfData: PDFData = {
    config_name: 'becker-bau',
    address: clientAddress,
    date: currentDate,
    project: projectName,
    subject: documentData.title,
    content: documentData.content,
    // Optional fields can be set to empty strings if not available
    our_sign: '',
    your_sign: '',
  };

  // Get the PDF service instance
  const pdfService = PDFService.getInstance();

  // Generate the PDF
  const response = await pdfService.generatePDF(pdfData);

  // If successful and we have a file URL and name, download the PDF
  if (response.success && response.fileUrl && response.fileName) {
    pdfService.downloadPDF(response.fileUrl, response.fileName);
  } else {
    throw new Error(response.message || 'Failed to generate PDF');
  }
}
