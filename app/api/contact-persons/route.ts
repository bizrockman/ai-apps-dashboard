import { NextRequest, NextResponse } from 'next/server';
import { DatabaseProvider } from '../../lib/database/DatabaseProvider';

/**
 * GET /api/contact-persons
 * Gibt alle Kontaktpersonen zurück
 */
export async function GET(request: NextRequest) {
  try {
    const contactPersonDAO = DatabaseProvider.getInstance().getContactPersonDAO();
    const contactPersons = await contactPersonDAO.findAll();
    
    return NextResponse.json({ 
      success: true, 
      data: contactPersons 
    });
  } catch (error) {
    console.error('Error fetching contact persons:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact persons' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/contact-persons
 * Erstellt eine neue Kontaktperson
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validierung der Eingabedaten
    if (!data.firstname || !data.lastname) {
      return NextResponse.json(
        { success: false, error: 'Firstname and lastname are required' },
        { status: 400 }
      );
    }
    
    const contactPersonDAO = DatabaseProvider.getInstance().getContactPersonDAO();
    const contactPerson = await contactPersonDAO.create(data);
    
    return NextResponse.json(
      { success: true, data: contactPerson },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating contact person:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create contact person' },
      { status: 500 }
    );
  }
} 