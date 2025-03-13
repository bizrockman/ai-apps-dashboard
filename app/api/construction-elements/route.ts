import { NextRequest, NextResponse } from 'next/server';
import { DatabaseProvider } from '../../lib/database/DatabaseProvider';

/**
 * GET /api/construction-elements
 * Gibt alle Bauelemente zurück
 */
export async function GET(request: NextRequest) {
  try {
    const elementDAO = DatabaseProvider.getInstance().getConstructionElementDAO();
    const elements = await elementDAO.findAll();
    
    return NextResponse.json({ 
      success: true, 
      data: elements 
    });
  } catch (error) {
    console.error('Error fetching construction elements:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch construction elements' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/construction-elements
 * Erstellt ein neues Bauelement
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validierung der Eingabedaten
    if (!data.name || !data.projectId) {
      return NextResponse.json(
        { success: false, error: 'Name and projectId are required' },
        { status: 400 }
      );
    }
    
    const elementDAO = DatabaseProvider.getInstance().getConstructionElementDAO();
    const element = await elementDAO.create(data);
    
    return NextResponse.json(
      { success: true, data: element },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating construction element:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create construction element' },
      { status: 500 }
    );
  }
} 