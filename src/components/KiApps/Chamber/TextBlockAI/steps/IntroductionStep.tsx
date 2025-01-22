import React, { useState } from 'react';
import { ConsultingData } from '../types';
import OpenAI from 'openai';
import { Loader2 } from 'lucide-react';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const INTRO_VARIANTS = {
  standard: {
    label: 'Standard',
    template: (data: ConsultingData) => 
      `Im Rahmen unserer Beratung für ${data.name} wurde die Geschäftsidee einer Unternehmensgründung im ${data.industry} besprochen. Die vorgestellte Idee umfasst ${data.idea}.`
  },
  detail: {
    label: 'Detailliert',
    template: (data: ConsultingData) =>
      `In einem ausführlichen Beratungsgespräch mit ${data.name} wurde das Vorhaben einer Existenzgründung im Bereich ${data.industry} erörtert. Der Gründungsansatz basiert auf folgender Geschäftsidee: ${data.idea}. Diese Dokumentation fasst die wesentlichen Aspekte und Empfehlungen aus unserem Gespräch zusammen.`
  },
  kurz: {
    label: 'Kurz',
    template: (data: ConsultingData) =>
      `Beratungsdokumentation für ${data.name}, ${data.industry}. Geschäftsidee: ${data.idea}`
  },
  personlich: {
    label: 'Persönlich',
    template: (data: ConsultingData) =>
      `Sehr geehrte(r) ${data.name},\n\nbasierend auf unserem Beratungsgespräch zur Ihrer geplanten Gründung im ${data.industry} und Ihrer vorgestellten Geschäftsidee (${data.idea}) habe ich die wichtigsten Punkte für Sie zusammengefasst.`
  }
};

interface IntroductionStepProps {
  data: ConsultingData;
  onDataChange: (updates: Partial<ConsultingData>) => void;
}

const IntroductionStep: React.FC<IntroductionStepProps> = ({ data, onDataChange }) => {
  const [selectedVariant, setSelectedVariant] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleVariantChange = (variant: string) => {
    setSelectedVariant(variant);
    if (variant) {
      const template = INTRO_VARIANTS[variant as keyof typeof INTRO_VARIANTS].template(data);
      onDataChange({ content: { ...data.content, intro: template } });
    }
  };

  const generateWithAI = async () => {
    if (!customInstructions.trim()) return;

    setIsGenerating(true);
    const currentIntro = data.content.intro;

    try {
      const prompt = `Als erfahrener Gründungsberater sollen Sie die Einleitung zu einem Gründungsdokument formulieren.

Grunddaten:
- Name: ${data.name}
- Branche: ${data.industry}
- Geschäftsidee: ${data.idea}

Aktuelle Einleitung:
${currentIntro}

Anweisungen zur Anpassung:
${customInstructions}

Bitte formulieren Sie eine professionelle Einleitung unter Berücksichtigung der Anweisungen. Das hier ist ein Textblock in einem Gesamtdokument, daher nur die Einleitung optimieren. Optimiere zu dem die Formatierung, Absätze und Leerzeilen, soweit sinnvoll`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Sie sind ein erfahrener Gründungsberater.' },
          { role: 'user', content: prompt }
        ]
      });

      const newIntro = response.choices[0]?.message?.content || '';
      onDataChange({ content: { ...data.content, intro: newIntro } });
      setCustomInstructions('');
    } catch (error) {
      console.error('Error generating intro:', error);
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
          {Object.entries(INTRO_VARIANTS).map(([key, { label }]) => (
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
          value={data.content.intro}
          onChange={(e) => onDataChange({ content: { ...data.content, intro: e.target.value } })}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-96"
          disabled={isGenerating}
        />
      </div>

      {/* AI Instructions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Welche Anpassungen für die Einleitung vornehmen?
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

export default IntroductionStep;