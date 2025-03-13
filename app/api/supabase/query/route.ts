import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
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
    const { table, query } = body;
    
    if (!table || !query) {
      return NextResponse.json(
        { error: 'table and query are required' },
        { status: 400 }
      );
    }
    
    // Basis-Abfrage erstellen
    let supabaseQuery = supabase.from(table).select(query.select || '*');
    
    // Filter anwenden, falls vorhanden
    if (query.filters) {
      Object.entries(query.filters).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          // Komplexe Filter wie ilike
          if ('ilike' in value) {
            supabaseQuery = supabaseQuery.ilike(key, value.ilike);
          }
        } else {
          // Einfache Gleichheitsfilter
          supabaseQuery = supabaseQuery.eq(key, value);
        }
      });
    }
    
    // Sortierung anwenden, falls vorhanden
    if (query.orderBy) {
      supabaseQuery = supabaseQuery.order(query.orderBy, { 
        ascending: query.ascending !== false 
      });
    }
    
    // Limit anwenden, falls vorhanden
    if (query.limit) {
      supabaseQuery = supabaseQuery.limit(query.limit);
    }
    
    const { data, error } = await supabaseQuery;
    
    if (error) throw error;
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Supabase API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 