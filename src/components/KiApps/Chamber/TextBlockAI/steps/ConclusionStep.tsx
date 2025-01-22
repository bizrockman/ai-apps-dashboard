import React, { useState } from 'react';
import { ConsultingData } from '../types';
import OpenAI from 'openai';
import { Loader2 } from 'lucide-react';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const CONCLUSION_VARIANTS = {
  standard: {
    label: 'Standard',
    template: (data: ConsultingData) => 
      `Zusammenfassend lässt sich festhalten, dass die vorgestellte Geschäftsidee von ${data.name} im ${data.industry} grundsätzlich tragfähig erscheint. Die besprochenen Punkte und Empfehlungen sollten sorgfältig geprüft und umgesetzt werden.

Für die weitere Planung und Umsetzung empfehlen wir:

1. Erstellung eines detaillierten Businessplans
2. Kontaktaufnahme mit der zuständigen Handwerkskammer
3. Prüfung der Finanzierungsmöglichkeiten
4. Terminvereinbarung für ein Folgegespräch

Bei weiteren Fragen stehen wir Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen

[Name des Beraters]
Gründungsberater`
  },
  detail: {
    label: 'Detailliert',
    template: (data: ConsultingData) =>
      `Nach eingehender Analyse der vorgestellten Geschäftsidee von ${data.name} im Bereich ${data.industry} kommen wir zu einer positiven Einschätzung der Erfolgsaussichten. Die im Gespräch erörterten Aspekte zeigen sowohl Potenziale als auch Herausforderungen auf, die es im weiteren Verlauf zu berücksichtigen gilt.

Unsere konkreten Handlungsempfehlungen lauten:

1. Entwicklung eines detaillierten Businessplans unter Berücksichtigung der besprochenen Marktanalyse
2. Aufnahme von Gesprächen mit der zuständigen Handwerkskammer zur Klärung formaler Anforderungen
3. Erstellung einer detaillierten Finanzplanung und Prüfung von Förderungsmöglichkeiten
4. Ausarbeitung eines konkreten Zeitplans für die einzelnen Umsetzungsschritte
5. Vereinbarung eines Folgegesprächs zur Besprechung der nächsten Schritte

Wir stehen Ihnen bei der Umsetzung dieser Empfehlungen gerne beratend zur Seite.

Mit besten Grüßen und viel Erfolg für Ihr Vorhaben

[Name des Beraters]
Gründungsberater
Handwerkskammer`
  },
  kurz: {
    label: 'Kurz',
    template: (data: ConsultingData) =>
      `Die Geschäftsidee von ${data.name} im ${data.industry} erscheint grundsätzlich umsetzbar. 

Nächste Schritte:
- Businessplan erstellen
- Handwerkskammer kontaktieren
- Finanzierung klären

Bei Fragen stehen wir zur Verfügung.

[Name des Beraters]`
  }
};

interface ConclusionStepProps {
  data: ConsultingData;
  onDataChange: (updates: Partial<ConsultingData>) => void;
}

const ConclusionStep: React.FC<ConclusionStepProps> = ({ data, onDataChange }) => {
  const [selectedVariant, setSelectedVariant] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleVariantChange = (variant: string) => {
    setSelectedVariant(variant);
    if (variant) {
      const template = CONCLUSION_VARIANTS[variant as keyof typeof CONCLUSION_VARIANTS].template(data);
      onDataChange({ content: { ...data.content, conclusion: template } });
    }
  };

  const generateWithAI = async () => {
    if (!customInstructions.trim()) return;

    setIsGenerating(true);
    const currentConclusion = data.content.conclusion;

    try {
      const prompt = `Als erfahrener Gründungsberater sollen Sie den Abschluss zu einem Gründungsdokument formulieren.

Grunddaten:
- Name: ${data.name}
- Branche: ${data.industry}
- Geschäftsidee: ${data.idea}

Aktueller Abschluss:
${currentConclusion}

Anweisungen zur Anpassung:
${customInstructions}

Bitte formulieren Sie einen professionellen Abschluss unter Berücksichtigung der Anweisungen. Achten Sie auf eine klare Struktur mit Handlungsempfehlungen und einem formellen Abschluss. Optimiere auch die Formatierung, Absätze und Leerzeilen.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Sie sind ein erfahrener Gründungsberater.' },
          { role: 'user', content: prompt }
        ]
      });

      const newConclusion = response.choices[0]?.message?.content || '';
      onDataChange({ content: { ...data.content, conclusion: newConclusion } });
      setCustomInstructions('');
    } catch (error) {
      console.error('Error generating conclusion:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Variant Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vorlage auswählen
        </label>
        <select
          value={selectedVariant}
          onChange={(e) => handleVariantChange(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={isGenerating}
        >
          <option value="">Bitte wählen...</option>
          {Object.entries(CONCLUSION_VARIANTS).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Preview */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vorschau und Bearbeitung
        </label>
        <textarea
          value={data.content.conclusion}
          onChange={(e) => onDataChange({ content: { ...data.content, conclusion: e.target.value } })}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-96"
          disabled={isGenerating}
        />
      </div>

      {/* AI Instructions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Welche Anpassungen für den Abschluss vornehmen?
        </label>
        <textarea
          value={customInstructions}
          onChange={(e) => setCustomInstructions(e.target.value)}
          placeholder="Beschreiben Sie hier Ihre gewünschten Änderungen..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-24"
          disabled={isGenerating}
        />
      </div>

      {/* Generate Button */}
      <div className="flex justify-end">
        <button
          onClick={generateWithAI}
          disabled={!customInstructions.trim() || isGenerating}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            !customInstructions.trim() || isGenerating
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Generiere...</span>
            </>
          ) : (
            <span>Generieren</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ConclusionStep;