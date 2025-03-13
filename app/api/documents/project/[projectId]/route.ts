import { NextRequest, NextResponse } from 'next/server';
import { DatabaseProvider } from '../../../../lib/database/DatabaseProvider';

/**
 * GET /api/documents/project/[projectId]
 * Gibt alle Dokumente für ein bestimmtes Projekt zurück
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    // Params als Promise behandeln
    const resolvedParams = await Promise.resolve(params);
    const { projectId } = resolvedParams;
    
    const documentDAO = DatabaseProvider.getInstance().getDocumentDAO();
    const documents = await documentDAO.findByProject(projectId);
    
    return NextResponse.json({ 
      success: true, 
      data: documents 
    });
  } catch (error) {
    console.error(`Error fetching documents for project ${params.projectId}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documents for project' },
      { status: 500 }
    );
  }
} 