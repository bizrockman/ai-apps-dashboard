import React, { forwardRef } from 'react';
import { Play } from 'lucide-react';
import { MarketResearchFormData } from './types';

interface MarketResearchFormProps {
  onAnalyze: (data: MarketResearchFormData) => void;
  isAnalyzing: boolean;
}

const options = {
  industries: [
    'Automobilindustrie',
    'Chemische Industrie',
    'Elektroindustrie',
    'Energiewirtschaft',
    'Finanzdienstleistungen',
    'Gesundheitswesen',
    'Handel',
    'IT und Telekommunikation',
    'Logistik',
    'Maschinenbau',
    'Sonstiges'
  ],
  regions: [
    'Baden-Württemberg',
    'Bayern',
    'Berlin',
    'Brandenburg',
    'Bremen',
    'Hamburg',
    'Hessen',
    'Mecklenburg-Vorpommern',
    'Niedersachsen',
    'Nordrhein-Westfalen',
    'Rheinland-Pfalz',
    'Saarland',
    'Sachsen',
    'Sachsen-Anhalt',
    'Schleswig-Holstein',
    'Thüringen',
    'Sonstiges'
  ],
};

const MarketResearchForm = forwardRef<HTMLFormElement, MarketResearchFormProps>(({ onAnalyze, isAnalyzing }, ref) => {
  const [formData, setFormData] = React.useState<MarketResearchFormData>({
    industry: options.industries[0],
    region: options.regions[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(formData);
  };

  const handleChange = (field: keyof MarketResearchFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      [`custom${field.charAt(0).toUpperCase()}${field.slice(1)}`]: undefined
    }));
  };

  const renderField = (
    label: string,
    field: keyof MarketResearchFormData,
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
      {renderField('Branche', 'industry', options.industries)}
      {renderField('Region', 'region', options.regions)}

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

MarketResearchForm.displayName = 'MarketResearchForm';

export default MarketResearchForm;