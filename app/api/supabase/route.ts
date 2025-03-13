import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Erstellen Sie den Supabase-Client mit den serverseitigen Umgebungsvariablen
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

export async function GET(request: Request) {
  // Hier können Sie sichere Operationen mit Supabase durchführen
  // und nur die notwendigen Daten an den Client zurückgeben
  
  try {
    // Beispiel: Daten aus einer Tabelle abrufen
    const { data, error } = await supabase
      .from('your_table')
      .select('*');
    
    if (error) throw error;
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { table, query } = body;
    
    if (!table || !query) {
      return NextResponse.json(
        { error: 'table and query are required' },
        { status: 400 }
      );
    }
    
    // Führen Sie die Abfrage basierend auf den Parametern durch
    const { data, error } = await supabase
      .from(table)
      .select(query.select || '*')
      .order(query.orderBy || 'id', { ascending: query.ascending !== false });
    
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