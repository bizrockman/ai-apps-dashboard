import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { StrategyFormData } from './StrategyForm';

interface StrategyResponseProps {
  response: string;
  formData: StrategyFormData | null;
  isAnalyzing: boolean;
}

const StrategyResponse: React.FC<StrategyResponseProps> = ({ response, formData, isAnalyzing }) => {
  const getValue = (field: keyof StrategyFormData) => {
    if (!formData) return '';
    return formData[field] === 'Sonstiges' 
      ? formData[`custom${field.charAt(0).toUpperCase()}${field.slice(1)}` as keyof StrategyFormData] || formData[field]
      : formData[field];
  };

  return (
    <div className="space-y-6">
      {/* Input Summary - Always shown */}
      <div className="bg-gray-50 rounded-lg border p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Analyseparameter</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Unternehmensziel:</span>
            <p className="text-gray-800">{getValue('goal')}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Branche:</span>
            <p className="text-gray-800">{getValue('industry')}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Herausforderung:</span>
            <p className="text-gray-800">{getValue('challenge')}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Ressourcen:</span>
            <p className="text-gray-800">{getValue('resources')}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Zeitrahmen:</span>
            <p className="text-gray-800">{getValue('timeline')}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Erfolgskriterien:</span>
            <p className="text-gray-800">{getValue('success')}</p>
          </div>
        </div>
      </div>

      {/* Loading State or Analysis Results */}
      {isAnalyzing ? (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-center space-y-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 mt-4">Analysiere und erstelle Strategievorschläge...</p>
            </div>
          </div>
        </div>
      ) : response && (
        <div className="bg-white rounded-lg border p-6">
          <div className="prose max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                p: ({node, ...props}) => <p className="mb-4" {...props} />,
                h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl font-bold mb-3" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-bold mb-2" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-4" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-4" {...props} />,
                li: ({node, ...props}) => <li className="mb-2" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
              }}
            >
              {response}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategyResponse;