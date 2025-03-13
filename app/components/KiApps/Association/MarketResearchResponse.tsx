import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { MarketResearchFormData } from './types';

interface MarketResearchResponseProps {
  response: string;
  formData: MarketResearchFormData | null;
  isAnalyzing: boolean;
}

const MarketResearchResponse: React.FC<MarketResearchResponseProps> = ({ response, formData, isAnalyzing }) => {
  const getValue = (field: keyof MarketResearchFormData) => {
    if (!formData) return '';
    return formData[field] === 'Sonstiges' 
      ? formData[`custom${field.charAt(0).toUpperCase()}${field.slice(1)}` as keyof MarketResearchFormData] || formData[field]
      : formData[field];
  };

  return (
    <div className="space-y-6">
      {/* Input Summary */}
      <div className="bg-gray-50 rounded-lg border p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Analyseparameter</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Branche:</span>
            <p className="text-gray-800">{getValue('industry')}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Region:</span>
            <p className="text-gray-800">{getValue('region')}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Land:</span>
            <p className="text-gray-800">Deutschland</p>
          </div>
        </div>
      </div>

      {/* Loading State or Analysis Results */}
      {isAnalyzing ? (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-center space-y-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 mt-4">Analysiere Marktdaten...</p>
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
                table: ({node, ...props}) => <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200 mb-4" {...props} /></div>,
                th: ({node, ...props}) => <th className="px-4 py-2 bg-gray-50 text-left text-sm font-medium text-gray-500" {...props} />,
                td: ({node, ...props}) => <td className="px-4 py-2 text-sm text-gray-900" {...props} />,
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

export default MarketResearchResponse;