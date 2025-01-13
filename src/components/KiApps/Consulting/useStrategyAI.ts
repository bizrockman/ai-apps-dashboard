import { useState, useCallback } from 'react';
import OpenAI from 'openai';
import { StrategyFormData } from './StrategyForm';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const STRATEGY_PROMPT = `Du bist ein erfahrener Strategieberater und Experte für Unternehmensentwicklung. Dein Ziel ist es, [Unternehmensziel] zu erreichen, indem du innovative und umsetzbare Strategien entwickelst. Analysiere die folgenden Informationen und liefere drei konkrete Vorschläge, die auf diese Situation zugeschnitten sind:

1. **Branche:** [Branche des Unternehmens]  
2. **Herausforderung:** [Herausforderung oder Problem]  
3. **Ressourcen:** [Vorhandene Ressourcen oder Einschränkungen]  
4. **Zeitrahmen:** [Zeitraum für die Umsetzung]  
5. **Erfolgskriterien:** [Wie Erfolg gemessen wird]  

Berücksichtige aktuelle Trends und bewährte Praktiken in der Branche. Jeder Vorschlag sollte eine kurze Begründung enthalten, warum er geeignet ist.`;

export const useStrategyAI = () => {
  const [response, setResponse] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const startNewAnalysis = useCallback(() => {
    setResponse('');
  }, []);

  const analyze = useCallback(async (data: StrategyFormData) => {
    setIsAnalyzing(true);
    setResponse('');

    try {
      const prompt = STRATEGY_PROMPT
        .replace('[Unternehmensziel]', data.goal === 'Sonstiges' ? data.customGoal || data.goal : data.goal)
        .replace('[Branche des Unternehmens]', data.industry === 'Sonstiges' ? data.customIndustry || data.industry : data.industry)
        .replace('[Herausforderung oder Problem]', data.challenge === 'Sonstiges' ? data.customChallenge || data.challenge : data.challenge)
        .replace('[Vorhandene Ressourcen oder Einschränkungen]', data.resources === 'Sonstiges' ? data.customResources || data.resources : data.resources)
        .replace('[Zeitraum für die Umsetzung]', data.timeline === 'Sonstiges' ? data.customTimeline || data.timeline : data.timeline)
        .replace('[Wie Erfolg gemessen wird]', data.success === 'Sonstiges' ? data.customSuccess || data.success : data.success);

      const stream = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Du bist ein erfahrener Strategieberater.' },
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
      console.error('Error in strategy analysis:', error);
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