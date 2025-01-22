import React, { useState } from 'react';
import { ConsultingData } from '../types';
import { Loader2, Plus } from 'lucide-react';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface QuestionsStepProps {
  data: ConsultingData;
  onDataChange: (updates: Partial<ConsultingData>) => void;
}

interface AIGeneratedQuestion {
  question: string;
  selected: boolean;
}

const QuestionsStep: React.FC<QuestionsStepProps> = ({ data, onDataChange }) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual');
  const [newQuestion, setNewQuestion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiQuestions, setAiQuestions] = useState<AIGeneratedQuestion[]>([]);

  const allQuestionsAnswered = data.questions.every(q => q.a.trim() !== '');

  const addQuestion = () => {
    if (!newQuestion.trim()) return;
    const newQuestions = [...data.questions, { q: newQuestion, a: '', done: false }];
    onDataChange({ questions: newQuestions });
    setNewQuestion('');
  };

  const removeQuestion = (index: number) => {
    const newQuestions = data.questions.filter((_, i) => i !== index);
    onDataChange({ questions: newQuestions });
  };

  const updateAnswer = (index: number, answer: string) => {
    const newQuestions = [...data.questions];
    newQuestions[index] = { ...newQuestions[index], a: answer };
    onDataChange({ questions: newQuestions });
  };

  const generateQuestions = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Als erfahrener Gründungsberater, generiere 5 weitere relevante Fragen für einen Gründer im ${data.industry}.

Kontext:
- Name: ${data.name}
- Branche: ${data.industry}
- Geschäftsidee: ${data.idea}
- Einleitung: ${data.content.intro}

Bisherige Fragen:
${data.questions.map(q => `- ${q.q}`).join('\n')}

Bitte generiere die Fragen im folgenden JSON-Format:
{
  "questions": [
    "Frage 1",
    "Frage 2",
    "Frage 3",
    "Frage 4",
    "Frage 5"
  ]
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Du bist ein erfahrener Gründungsberater.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0]?.message?.content || '{"questions": []}';
      const { questions } = JSON.parse(content);
      
      setAiQuestions(questions.map((q: string) => ({ question: q, selected: false })));
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const addSelectedAIQuestions = () => {
    const selectedQuestions = aiQuestions
      .filter(q => q.selected)
      .map(q => ({ q: q.question, a: '', done: false }));
    
    onDataChange({ questions: [...data.questions, ...selectedQuestions] });
    setAiQuestions([]);
    setActiveTab('manual');
  };

  return (
    <div className="space-y-6">
      {/* Questions List */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-800">Fragenkatalog</h2>
        {data.questions.map((question, idx) => (
          <div key={idx} className="p-4 bg-white border rounded-lg space-y-3">
            <div className="font-medium text-gray-800">{question.q}</div>
            <textarea
              value={question.a}
              onChange={(e) => updateAnswer(idx, e.target.value)}
              placeholder="Antwort eingeben..."
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-24"
            />
            <div className="flex justify-end">
              <button
                onClick={() => removeQuestion(idx)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Löschen
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Questions Section */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-4 border-b">
          <h3 className="font-medium text-gray-800">Fragen hinzufügen</h3>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === 'manual'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Manuell
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === 'ai'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            KI gestützt
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'manual' ? (
            <div className="flex space-x-2">
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Neue Frage eingeben..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={addQuestion}
                disabled={!newQuestion.trim()}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {!isGenerating && aiQuestions.length === 0 && (
                <button
                  onClick={generateQuestions}
                  className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Fragen generieren
                </button>
              )}

              {isGenerating && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                </div>
              )}

              {aiQuestions.length > 0 && (
                <>
                  <div className="space-y-2">
                    {aiQuestions.map((q, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <input
                          type="checkbox"
                          checked={q.selected}
                          onChange={() => {
                            const newQuestions = [...aiQuestions];
                            newQuestions[idx].selected = !newQuestions[idx].selected;
                            setAiQuestions(newQuestions);
                          }}
                          className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-400"
                        />
                        <span className="text-gray-800">{q.question}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={addSelectedAIQuestions}
                      disabled={!aiQuestions.some(q => q.selected)}
                      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Übernehmen
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionsStep;