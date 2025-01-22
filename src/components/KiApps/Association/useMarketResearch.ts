import { useState, useCallback } from 'react';
import OpenAI from 'openai';
import { MarketResearchFormData } from './types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const MARKET_RESEARCH_PROMPT = `Ich möchte eine detaillierte Marktanalyse durchführen, die sich auf [Branche/Industrie] konzentriert, mit besonderem Fokus auf den Standort [Standort/Region]. Bitte analysiere folgende Aspekte ausführlich:

1. Branchenübersicht:

    Allgemeiner Überblick über die Branche, aktuelle Trends und Wachstumsprognosen.
    Relevante Marktsegmente und deren Anteile am Gesamtmarkt.
    Hauptakteure (Unternehmen, Marken) und ihre Position im Markt.

2. Standortanalyse:

    Stärken und Schwächen des Standorts in Bezug auf diese Branche.
    Regionale Besonderheiten, die sich auf die Marktbedingungen auswirken (z. B. Infrastruktur, gesetzliche Rahmenbedingungen, Nachfrage).
    Potenzielle Chancen und Risiken für Unternehmen in dieser Region.

3. Zielgruppe und Kundenverhalten:

    Wer sind die Hauptzielgruppen? Bitte aufschlüsseln nach Demografie, Interessen und Bedürfnissen.
    Wie verhält sich die Zielgruppe bei Kaufentscheidungen? Gibt es regionale oder kulturelle Unterschiede?
    Wie entwickelt sich die Nachfrage in diesem Markt?

4. Wettbewerbsanalyse:

    Übersicht der größten Wettbewerber und ihre Strategien.
    Marktanteile der wichtigsten Akteure.
    Analyse der Stärken und Schwächen der Wettbewerber.

5. Potenziale und Herausforderungen:

    Welche Potenziale bietet der Markt für neue oder bestehende Unternehmen?
    Welche Herausforderungen bestehen, und wie könnten sie bewältigt werden?

6. Weitere Variablen:

    Technologische Entwicklungen, die Einfluss auf die Branche haben.
    Nachhaltigkeit und Umweltfaktoren, die den Markt beeinflussen.
    Gesetzliche oder politische Rahmenbedingungen, die beachtet werden müssen.`;

export const useMarketResearch = () => {
  const [response, setResponse] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const startNewAnalysis = useCallback(() => {
    setResponse('');
  }, []);

  const analyze = useCallback(async (data: MarketResearchFormData) => {
    setIsAnalyzing(true);
    setResponse('');

    try {
      const prompt = MARKET_RESEARCH_PROMPT
        .replace('[Branche/Industrie]', data.industry === 'Sonstiges' ? data.customIndustry || data.industry : data.industry)
        .replace('[Standort/Region]', data.region === 'Sonstiges' ? data.customRegion || data.region : data.region);

      const stream = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Du bist ein erfahrener Marktanalyst.' },
          { role: 'user', content: prompt }
        ],
        stream: true,
      });

      let fullResponse = '';

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        fullResponse += content;
        setResponse(fullResponse);
      }
    } catch (error) {
      console.error('Error in market analysis:', error);
      setResponse('Entschuldigung, bei der Analyse ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    response,
    isAnalyzing,
    analyze,
    startNewAnalysis
  };
};