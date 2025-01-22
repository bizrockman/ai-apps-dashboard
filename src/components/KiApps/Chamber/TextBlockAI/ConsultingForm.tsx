import React from 'react';
import { ConsultingData } from './types';
import { ArrowRight } from 'lucide-react';
import BasicDataStep from './steps/BasicDataStep';
import IntroductionStep from './steps/IntroductionStep';
import TopicsStep from './steps/TopicsStep';
import QuestionsStep from './steps/QuestionsStep';
import ConclusionStep from './steps/ConclusionStep';
import PreviewStep from './steps/PreviewStep';

interface ConsultingFormProps {
  data: ConsultingData;
  onDataChange: (data: ConsultingData) => void;
  onBack: () => void;
  step: number;
  onStepChange: (step: number) => void;
  onSaveAndContinue: () => void;
}

const STEPS = [
  { name: 'Grunddaten', component: BasicDataStep },
  { name: 'Einleitung', component: IntroductionStep },
  { name: 'Themen', component: TopicsStep },
  { name: 'Fragen', component: QuestionsStep },
  { name: 'Abschluss', component: ConclusionStep },
  { name: 'Vorschau', component: PreviewStep }
];

const ConsultingForm: React.FC<ConsultingFormProps> = ({
  data,
  onDataChange,
  onBack,
  step,
  onStepChange,
  onSaveAndContinue
}) => {
  const CurrentStepComponent = STEPS[step - 1].component;

  const handleDataChange = (updates: Partial<ConsultingData>) => {
    onDataChange({ ...data, ...updates });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Neue Beratung</h1>
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Zurück
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${(step / STEPS.length) * 100}%` }}
        />
      </div>

      {/* Step Navigation */}
      <div className="grid grid-cols-6 gap-4">
        {STEPS.map((stepItem, idx) => (
          <button
            key={idx}
            onClick={() => onStepChange(idx + 1)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              step === idx + 1
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                : 'border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {stepItem.name}
          </button>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6">
          <CurrentStepComponent
            data={data}
            onDataChange={handleDataChange}
          />
        </div>

        {/* Save & Continue Button */}
        <div className="p-6 bg-gray-50 border-t flex justify-end">
          <button
            onClick={onSaveAndContinue}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            <span>{step === STEPS.length ? 'Speichern' : 'Speichern & Weiter'}</span>
            {step < STEPS.length && <ArrowRight className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultingForm;