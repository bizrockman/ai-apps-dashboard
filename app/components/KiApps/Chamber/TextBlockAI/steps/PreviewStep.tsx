import React from 'react';
import { ConsultingData } from '../types';

interface PreviewStepProps {
  data: ConsultingData;
}

const TOPICS = {
  formal: "Gründungsformalitäten",
  legal: "Rechtliche Voraussetzungen",
  market: "Markt- und Wettbewerbssituation",
  part: "Gründung im Nebenerwerb"
} as const;

const PreviewStep: React.FC<PreviewStepProps> = ({ data }) => {
  // Get unselected topics
  const unselectedTopics = Object.entries(data.topics)
    .filter(([_, selected]) => !selected)
    .map(([key]) => TOPICS[key as keyof typeof TOPICS]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Dokumentenvorschau</h2>
        <div className="space-x-2">
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
            PDF
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
            Word
          </button>
        </div>
      </div>

      <div className="prose max-w-none">
        <div className="p-6 bg-white border rounded-lg space-y-8">
          {/* Document Header */}
          <div className="text-center border-b pb-6">
            <h1 className="text-2xl font-bold mb-2">Beratungsdokument</h1>
            <p className="text-gray-600">Dokumentation des Gründungsgesprächs</p>
          </div>

          {/* Introduction */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Einleitung</h2>
            <div className="whitespace-pre-wrap">
              {data.content.intro || 'Keine Einleitung generiert'}
            </div>
          </div>
                   
          {/* Questions and Answers */}
          {data.questions.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Besprochene Fragen</h2>
              <div className="space-y-6">
                {data.questions.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <p className="font-medium">Frage: {item.q}</p>
                    <p className="pl-4 whitespace-pre-wrap">Antwort: {item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unselected Topics */}
          {unselectedTopics.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Nicht behandelte Themen</h2>
              <ul className="list-disc pl-4 space-y-1">
                {unselectedTopics.map((topic, idx) => (
                  <li key={idx} className="text-gray-600">{topic}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Conclusion */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Abschluss</h2>
            <div className="whitespace-pre-wrap">
              {data.content.conclusion || 'Kein Abschluss generiert'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewStep;