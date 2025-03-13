import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '../auth';
import ServerSupabaseClient from '../../../lib/database/supabase/ServerSupabaseClient';

export async function POST(request: NextRequest) {
  // Authentifizierung prüfen
  if (!await isAuthenticated(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    // Supabase-Client für den Server abrufen
    const supabase = ServerSupabaseClient.getInstance();
    
    const body = await request.json();
    const { table, operation, data, filters } = body;
    
    if (!table || !operation) {
      return NextResponse.json(
        { error: 'table and operation are required' },
        { status: 400 }
      );
    }
    
    let result;
    
    switch (operation) {
      case 'create':
        if (!data) {
          return NextResponse.json(
            { error: 'data is required for create operation' },
            { status: 400 }
          );
        }
        result = await supabase.from(table).insert(data).select();
        break;
        
      case 'update':
        if (!data || !filters) {
          return NextResponse.json(
            { error: 'data and filters are required for update operation' },
            { status: 400 }
          );
        }
        
        let updateQuery = supabase.from(table).update(data);
        
        // Filter anwenden
        Object.entries(filters).forEach(([key, value]) => {
          updateQuery = updateQuery.eq(key, value);
        });
        
        result = await updateQuery.select();
        break;
        
      case 'delete':
        if (!filters) {
          return NextResponse.json(
            { error: 'filters are required for delete operation' },
            { status: 400 }
          );
        }
        
        let deleteQuery = supabase.from(table).delete();
        
        // Filter anwenden
        Object.entries(filters).forEach(([key, value]) => {
          deleteQuery = deleteQuery.eq(key, value);
        });
        
        result = await deleteQuery.select();
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid operation. Must be one of: create, update, delete' },
          { status: 400 }
        );
    }
    
    if (result.error) throw result.error;
    
    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error('Supabase API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 