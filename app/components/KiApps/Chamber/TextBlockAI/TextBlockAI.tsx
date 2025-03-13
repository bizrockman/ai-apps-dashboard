import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import ConsultingDashboard from './ConsultingDashboard';
import ConsultingForm from './ConsultingForm';
import { ConsultingData, Consultation } from './types';

const initialData: ConsultingData = {
  industry: '',
  name: '',
  idea: '',
  topics: {
    formal: false,
    legal: false,
    market: false,
    part: false
  },
  questions: [],
  notes: '',
  content: {
    intro: '',
    formal: '',
    legal: '',
    market: '',
    part: '',
    next: [],
    conclusion: ''
  }
};

const STORAGE_KEY = 'textblock_consultation_data';

const TextBlockAI: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'form'>('dashboard');
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ConsultingData>(initialData);
  const [consultations, setConsultations] = useState<Consultation[]>([
    { id: 1, name: "Max Mustermann", industry: "Elektrohandwerk", progress: 60, status: "In Bearbeitung" },
    { id: 2, name: "Lisa Schmidt", industry: "Friseurhandwerk", progress: 30, status: "Neu" }
  ]);

  // Load saved data when component mounts
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setData(parsedData);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  const handleNewConsultation = () => {
    setView('form');
    setStep(1);
    setData(initialData);
    localStorage.removeItem(STORAGE_KEY); // Clear saved data when starting new consultation
  };

  const handleEdit = (id: number) => {
    // TODO: Load consultation data
    setView('form');
  };

  const handleBack = () => {
    setView('dashboard');
  };

  const handleSaveAndContinue = () => {
    // Save current data to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    // Move to next step if not on last step
    if (step < 6) { // Changed from 5 to 6 to allow progression to the preview step
      setStep(step + 1);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Fixed Header */}
      <div className="bg-white border-b">
        <div className="mx-auto w-full max-w-4xl">
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg text-white">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Text Block AI</h2>
                <p className="text-sm text-gray-500">AI-powered text block generation for consultations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto w-full max-w-4xl p-6">
          {view === 'dashboard' ? (
            <ConsultingDashboard
              consultations={consultations}
              onNewConsultation={handleNewConsultation}
              onEdit={handleEdit}
            />
          ) : (
            <ConsultingForm
              data={data}
              onDataChange={setData}
              onBack={handleBack}
              step={step}
              onStepChange={setStep}
              onSaveAndContinue={handleSaveAndContinue}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TextBlockAI;