import React, { forwardRef, useState } from 'react';
import { Play } from 'lucide-react';

interface StrategyFormProps {
  onAnalyze: (data: StrategyFormData) => void;
  isAnalyzing: boolean;
}

export interface StrategyFormData {
  goal: string;
  customGoal?: string;
  industry: string;
  customIndustry?: string;
  challenge: string;
  customChallenge?: string;
  resources: string;
  customResources?: string;
  timeline: string;
  customTimeline?: string;
  success: string;
  customSuccess?: string;
}

const options = {
  goals: [
    'die Marktführerschaft in der Region X sichern',
    'neue Einnahmequellen erschließen',
    'den CO₂-Fußabdruck bis 2030 um 50 % reduzieren',
    'Sonstiges'
  ],
  industries: [
    'Automobil',
    'IT-Dienstleistungen',
    'Lebensmittelhandel',
    'Sonstiges'
  ],
  challenges: [
    'steigende Rohstoffpreise',
    'Kundenzufriedenheit sinkt',
    'fehlende Skalierbarkeit der Prozesse',
    'Sonstiges'
  ],
  resources: [
    'Budget von 100.000 Euro',
    'nur internes Personal verfügbar',
    'sehr kurze Umsetzungszeit',
    'Sonstiges'
  ],
  timelines: [
    '6 Monate',
    '1 Jahr',
    'bis Ende Q4',
    'Sonstiges'
  ],
  successMetrics: [
    '10 % Umsatzwachstum',
    '50 neue Kunden',
    'Kostensenkung von 20 %',
    'Sonstiges'
  ]
};

const StrategyForm = forwardRef<HTMLFormElement, StrategyFormProps>(({ onAnalyze, isAnalyzing }, ref) => {
  const [formData, setFormData] = useState<StrategyFormData>({
    goal: options.goals[0],
    industry: options.industries[0],
    challenge: options.challenges[0],
    resources: options.resources[0],
    timeline: options.timelines[0],
    success: options.successMetrics[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(formData);
  };

  const handleChange = (field: keyof StrategyFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      [`custom${field.charAt(0).toUpperCase()}${field.slice(1)}`]: undefined
    }));
  };

  const renderField = (
    label: string,
    field: keyof StrategyFormData,
    options: string[]
  ) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        value={formData[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        disabled={isAnalyzing}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {formData[field] === 'Sonstiges' && (
        <input
          type="text"
          value={formData[`custom${field.charAt(0).toUpperCase()}${field.slice(1)}`] || ''}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            [`custom${field.charAt(0).toUpperCase()}${field.slice(1)}`]: e.target.value
          }))}
          placeholder={`Bitte ${label.toLowerCase()} eingeben`}
          className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={isAnalyzing}
        />
      )}
    </div>
  );

  return (
    <form ref={ref} onSubmit={handleSubmit} className="space-y-6">
      {renderField('Unternehmensziel', 'goal', options.goals)}
      {renderField('Branche', 'industry', options.industries)}
      {renderField('Herausforderung', 'challenge', options.challenges)}
      {renderField('Ressourcen', 'resources', options.resources)}
      {renderField('Zeitrahmen', 'timeline', options.timelines)}
      {renderField('Erfolgskriterien', 'success', options.successMetrics)}

      <div className="pt-4">
        <button
          type="submit"
          disabled={isAnalyzing}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Play className="h-5 w-5" />
          <span>{isAnalyzing ? 'Analysiere...' : 'Analyse starten'}</span>
        </button>
      </div>
    </form>
  );
});

StrategyForm.displayName = 'StrategyForm';

export default StrategyForm;