import { NextRequest, NextResponse } from 'next/server';
import { PDFData } from '../../../lib/api/types';
import { DatabaseProvider } from '../../../lib/database/DatabaseProvider';
import { ServerPDFService } from '../../../lib/api/serverPDFService';

/**
 * POST /api/pdf/generate
 * Generiert ein PDF-Dokument
 */
export async function POST(request: NextRequest) {
  try {
    const documentData = await request.json();

    if (!documentData) {
      return NextResponse.json(
        { success: false, error: 'Document data is required' },
        { status: 400 }
      );
    }

    // Direkter Zugriff auf die DAOs über den DatabaseProvider
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
              // Construct address with proper line breaks
              const addressParts = [];
              
              // Add name
              addressParts.push(client.name);
              
              // Add business unit if available (preserve existing line breaks)
              if (client.businessUnit) {
                addressParts.push(client.businessUnit);
              }
              
              // Add street address
              if (client.street1) {
                addressParts.push(client.street1);
              }
              if (client.street2) {
                addressParts.push(client.street2);
              }
              
              // Add city and zipcode
              if (client.zipcode || client.city) {
                addressParts.push(`${client.zipcode || ''} ${client.city || ''}`.trim());
              }
              
              // Join all parts with line breaks, filtering out empty strings
              clientAddress = addressParts
                .filter(part => part && part.trim())
                .join('\n');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching project or client data:', error);
      }
    }

    // Format the current date as dd.mm.yyyy
    const date = new Date();
    const currentDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;

    // Create the PDF data object
    const pdfData: PDFData = {
      config_name: 'becker-bau',
      address: clientAddress,
      date: currentDate,
      project: projectName,
      subject: documentData.title,
      content: documentData.content,
      // Optional fields can be set to empty strings if not available
      our_sign: documentData.our_sign || '',
      your_sign: '',
    };

    // Get the PDF service instance (server version)
    const pdfService = ServerPDFService.getInstance();

    // Generate the PDF
    const response = await pdfService.generatePDF(pdfData);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error generating PDF' 
      },
      { status: 500 }
    );
  }
} 