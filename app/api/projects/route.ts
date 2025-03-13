import { NextRequest, NextResponse } from 'next/server';
import { DatabaseProvider } from '../../lib/database/DatabaseProvider';

/**
 * GET /api/projects
 * Gibt alle Projekte zurück
 */
export async function GET(request: NextRequest) {
  try {
    const projectDAO = DatabaseProvider.getInstance().getProjectDAO();
    const projects = await projectDAO.findAll();
    
    return NextResponse.json({ 
      success: true, 
      data: projects 
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects
 * Erstellt ein neues Projekt
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validierung der Eingabedaten
    if (!data.name || !data.clientId) {
      return NextResponse.json(
        { success: false, error: 'Name and clientId are required' },
        { status: 400 }
      );
    }
    
    const projectDAO = DatabaseProvider.getInstance().getProjectDAO();
    const project = await projectDAO.create(data);
    
    return NextResponse.json(
      { success: true, data: project },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
} 