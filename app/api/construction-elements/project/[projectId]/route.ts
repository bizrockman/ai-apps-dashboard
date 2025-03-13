import { NextRequest, NextResponse } from 'next/server';
import { DatabaseProvider } from '../../../../lib/database/DatabaseProvider';

/**
 * GET /api/construction-elements/project/[projectId]
 * Gibt alle Bauelemente für ein bestimmtes Projekt zurück
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    // Params als Promise behandeln
    const resolvedParams = await Promise.resolve(params);
    const { projectId } = resolvedParams;
    
    const elementDAO = DatabaseProvider.getInstance().getConstructionElementDAO();
    const elements = await elementDAO.findByProject(projectId);
    
    return NextResponse.json({ 
      success: true, 
      data: elements 
    });
  } catch (error) {
    console.error(`Error fetching construction elements for project ${params.projectId}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch construction elements for project' },
      { status: 500 }
    );
  }
} 