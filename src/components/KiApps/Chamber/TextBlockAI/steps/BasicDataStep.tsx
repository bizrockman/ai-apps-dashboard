import React from 'react';
import { ConsultingData } from '../types';

const INDUSTRIES = [
  "Bauhandwerk",
  "Elektrohandwerk",
  "Friseurhandwerk",
  "Metallhandwerk",
  "Kraftfahrzeughandwerk",
  "Tischlerhandwerk",
  "Sanitär-Heizung-Klima",
  "Andere"
];

interface BasicDataStepProps {
  data: ConsultingData;
  onDataChange: (updates: Partial<ConsultingData>) => void;
}

const BasicDataStep: React.FC<BasicDataStepProps> = ({ data, onDataChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Branche
        </label>
        <select
          value={data.industry}
          onChange={(e) => onDataChange({ industry: e.target.value })}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Branche auswählen</option>
          {INDUSTRIES.map((industry) => (
            <option key={industry} value={industry}>{industry}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name des Gründers
        </label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => onDataChange({ name: e.target.value })}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Geschäftsidee
        </label>
        <textarea
          value={data.idea}
          onChange={(e) => onDataChange({ idea: e.target.value })}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-32"
        />
      </div>
    </div>
  );
};

export default BasicDataStep;