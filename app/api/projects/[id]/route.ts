import { NextRequest, NextResponse } from 'next/server';
import { DatabaseProvider } from '../../../lib/database/DatabaseProvider';

/**
 * GET /api/projects/[id]
 * Gibt ein Projekt anhand seiner ID zurück
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Params als Promise behandeln
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    
    const projectDAO = DatabaseProvider.getInstance().getProjectDAO();
    const project = await projectDAO.findById(id);
    
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error(`Error fetching project with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/projects/[id]
 * Aktualisiert ein Projekt
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
    
    const projectDAO = DatabaseProvider.getInstance().getProjectDAO();
    const project = await projectDAO.update({ id, ...data });
    
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error(`Error updating project with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/projects/[id]
 * Löscht ein Projekt
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Params als Promise behandeln
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    
    const projectDAO = DatabaseProvider.getInstance().getProjectDAO();
    await projectDAO.delete(id);
    
    return NextResponse.json(
      { success: true, message: 'Project deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting project with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    );
  }
} 