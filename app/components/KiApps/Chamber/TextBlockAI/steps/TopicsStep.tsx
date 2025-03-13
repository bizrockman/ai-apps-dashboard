import React from 'react';
import { ConsultingData } from '../types';

const TOPICS = {
  formal: {
    label: "Gründungsformalitäten",
    questions: [
      "Welche Rechtsform planen Sie für Ihr Unternehmen?",
      "Haben Sie bereits Kontakt zur Handwerkskammer aufgenommen?",
      "Wann planen Sie die Gewerbeanmeldung?"
    ]
  },
  legal: {
    label: "Rechtliche Voraussetzungen",
    questions: [
      "Verfügen Sie über die notwendigen Qualifikationen und Zulassungen?",
      "Sind spezielle Genehmigungen für Ihre Tätigkeit erforderlich?",
      "Wie ist die Haftung in Ihrem Gewerk geregelt?"
    ]
  },
  market: {
    label: "Markt- und Wettbewerbssituation",
    questions: [
      "Wie schätzen Sie die Konkurrenzsituation in Ihrer Region ein?",
      "Welche Zielgruppe möchten Sie hauptsächlich ansprechen?",
      "Was sind Ihre geplanten Alleinstellungsmerkmale?"
    ]
  },
  part: {
    label: "Gründung im Nebenerwerb",
    questions: [
      "Wie planen Sie die zeitliche Aufteilung zwischen Haupt- und Nebenerwerb?",
      "Haben Sie die steuerlichen Aspekte einer Nebentätigkeit geprüft?",
      "Welche maximale Arbeitszeit können Sie für den Nebenerwerb aufbringen?"
    ]
  }
} as const;

interface TopicsStepProps {
  data: ConsultingData;
  onDataChange: (updates: Partial<ConsultingData>) => void;
}

const TopicsStep: React.FC<TopicsStepProps> = ({ data, onDataChange }) => {
  const handleTopicChange = (key: keyof typeof TOPICS, checked: boolean) => {
    const newTopics = { ...data.topics };
    newTopics[key] = checked;

    // If topic is checked, add its questions to the questions array
    if (checked) {
      const newQuestions = [...data.questions];
      TOPICS[key].questions.forEach(question => {
        if (!newQuestions.some(q => q.q === question)) {
          newQuestions.push({ q: question, a: '', done: false });
        }
      });
      onDataChange({ topics: newTopics, questions: newQuestions });
    } else {
      // If topic is unchecked, remove its questions
      const newQuestions = data.questions.filter(q => 
        !TOPICS[key].questions.includes(q.q)
      );
      onDataChange({ topics: newTopics, questions: newQuestions });
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(TOPICS).map(([key, { label, questions }]) => (
        <div key={key} className="p-4 border rounded-lg bg-white">
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={data.topics[key as keyof typeof TOPICS]}
              onChange={(e) => handleTopicChange(key as keyof typeof TOPICS, e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-400"
            />
            <label className="font-medium text-gray-800">{label}</label>
          </div>
          <div className="ml-6 text-sm text-gray-600">
            <p className="mb-2">Beispielfragen:</p>
            <ul className="list-disc pl-4 space-y-1">
              {questions.map((q, idx) => (
                <li key={idx}>{q}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopicsStep;