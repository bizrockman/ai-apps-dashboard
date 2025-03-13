# Supabase API-Routen

Diese Dokumentation beschreibt die sicheren API-Routen für die Kommunikation mit Supabase. Diese Routen wurden entwickelt, um die Supabase-Schlüssel ausschließlich auf dem Server zu verwenden und nicht im Client-Code zu exponieren.

## Sicherheitskonzept

- **Keine Client-Schlüssel**: Der `NEXT_PUBLIC_SUPABASE_ANON_KEY` wird nicht mehr im Client verwendet.
- **Authentifizierungsprüfung**: Alle API-Routen prüfen die Authentifizierung des Benutzers.
- **CSRF-Schutz**: Das Middleware prüft den Origin-Header, um CSRF-Angriffe zu verhindern.
- **Zentrale Fehlerbehandlung**: Alle API-Routen haben eine einheitliche Fehlerbehandlung.

## Verfügbare Routen

### 1. Query-Route (`/api/supabase/query`)

Diese Route wird für Leseoperationen (SELECT) verwendet.

**Anfrage-Format:**
```json
{
  "table": "table_name",
  "query": {
    "select": "*",
    "filters": {
      "column1": "value1",
      "column2": { "ilike": "%value2%" }
    },
    "orderBy": "column_name",
    "ascending": true,
    "limit": 10
  }
}
```

**Antwort-Format:**
```json
{
  "data": [
    // Abfrageergebnisse
  ]
}
```

### 2. Mutation-Route (`/api/supabase/mutation`)

Diese Route wird für Schreiboperationen (INSERT, UPDATE, DELETE) verwendet.

**Anfrage-Format für CREATE:**
```json
{
  "table": "table_name",
  "operation": "create",
  "data": {
    "column1": "value1",
    "column2": "value2"
  }
}
```

**Anfrage-Format für UPDATE:**
```json
{
  "table": "table_name",
  "operation": "update",
  "data": {
    "column1": "new_value1"
  },
  "filters": {
    "id": "record_id"
  }
}
```

**Anfrage-Format für DELETE:**
```json
{
  "table": "table_name",
  "operation": "delete",
  "filters": {
    "id": "record_id"
  }
}
```

**Antwort-Format:**
```json
{
  "data": [
    // Betroffene Datensätze
  ]
}
```

## Verwendung im Client-Code

Verwenden Sie den `SupabaseClientWrapper` für alle Supabase-Operationen im Client-Code. Dieser Wrapper kümmert sich um die Kommunikation mit den API-Routen und die Fehlerbehandlung.

```typescript
import SupabaseClientWrapper from 'app/lib/database/supabase/SupabaseClientWrapper';

// Singleton-Instanz abrufen
const supabaseWrapper = SupabaseClientWrapper.getInstance();

// Daten abfragen
const users = await supabaseWrapper.query('users', {
  select: 'id, name, email',
  filters: { role: 'admin' },
  orderBy: 'name',
  limit: 10
});

// Datensatz erstellen
const newUser = await supabaseWrapper.create('users', {
  name: 'Max Mustermann',
  email: 'max@example.com'
});

// Datensatz aktualisieren
const updatedUser = await supabaseWrapper.update('users', '123', {
  name: 'Maximilian Mustermann'
});

// Datensatz löschen
const deletedUser = await supabaseWrapper.delete('users', '123');
```

## Fehlerbehandlung

Alle API-Routen geben standardisierte Fehlerantworten zurück:

- 400: Bad Request (fehlende oder ungültige Parameter)
- 401: Unauthorized (nicht authentifiziert)
- 403: Forbidden (CSRF-Prüfung fehlgeschlagen)
- 500: Internal Server Error (Serverfehler)

Der `SupabaseClientWrapper` fängt diese Fehler ab und wirft entsprechende Exceptions, die in Ihrer Anwendung behandelt werden können. 