# AI Apps Dashboard

Ein Dashboard für KI-Anwendungen, das mit Next.js entwickelt wurde.

## Funktionen

- Sichere Authentifizierung
- Serverbasierte API-Aufrufe für OpenAI, Fal.ai und Supabase
- Responsive Benutzeroberfläche mit Tailwind CSS

## Erste Schritte

1. Klonen Sie das Repository
2. Installieren Sie die Abhängigkeiten mit `npm install`
3. Erstellen Sie eine `.env.local`-Datei mit den erforderlichen Umgebungsvariablen
4. Starten Sie den Entwicklungsserver mit `npm run dev`

## Umgebungsvariablen

Die folgenden Umgebungsvariablen werden benötigt:

```
# Nur auf dem Server verfügbar
FAL_KEY=your-fal-key
OPENAI_API_KEY=your-openai-key
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_URL=your-supabase-url
LETTER_PRESS_API_ENDPOINT=your-letterpress-endpoint

# Auch im Browser verfügbar
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
```

## Deployment

Das Projekt kann mit Vercel, Netlify oder einem anderen Next.js-kompatiblen Hosting-Dienst bereitgestellt werden.

```bash