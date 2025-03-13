import { NextRequest, NextResponse } from 'next/server';
import { DatabaseProvider } from '../../../lib/database/DatabaseProvider';

/**
 * GET /api/contact-persons/[id]
 * Gibt eine Kontaktperson anhand ihrer ID zurück
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Params als Promise behandeln
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    
    const contactPersonDAO = DatabaseProvider.getInstance().getContactPersonDAO();
    const contactPerson = await contactPersonDAO.findById(id);
    
    if (!contactPerson) {
      return NextResponse.json(
        { success: false, error: 'Contact person not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: contactPerson });
  } catch (error) {
    console.error(`Error fetching contact person with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact person' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/contact-persons/[id]
 * Aktualisiert eine Kontaktperson
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Params als Promise behandeln
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    
    const data = await request.json();
    
    const contactPersonDAO = DatabaseProvider.getInstance().getContactPersonDAO();
    const contactPerson = await contactPersonDAO.update({ id, ...data });
    
    return NextResponse.json({ success: true, data: contactPerson });
  } catch (error) {
    console.error(`Error updating contact person with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to update contact person' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/contact-persons/[id]
 * Löscht eine Kontaktperson
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Params als Promise behandeln
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    
    const contactPersonDAO = DatabaseProvider.getInstance().getContactPersonDAO();
    await contactPersonDAO.delete(id);
    
    return NextResponse.json(
      { success: true, message: 'Contact person deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting contact person with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete contact person' },
      { status: 500 }
    );
  }
} 