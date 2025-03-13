import { NextRequest, NextResponse } from 'next/server';
import { DatabaseProvider } from '../../../../lib/database/DatabaseProvider';

/**
 * GET /api/contact-persons/project/[projectId]
 * Gibt alle Kontaktpersonen für ein bestimmtes Projekt zurück
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    // Params als Promise behandeln
    const resolvedParams = await Promise.resolve(params);
    const { projectId } = resolvedParams;
    
    const contactPersonDAO = DatabaseProvider.getInstance().getContactPersonDAO();
    const contactPersons = await contactPersonDAO.findByProject(projectId);
    
    return NextResponse.json({ 
      success: true, 
      data: contactPersons 
    });
  } catch (error) {
    console.error(`Error fetching contact persons for project ${params.projectId}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact persons for project' },
      { status: 500 }
    );
  }
} 