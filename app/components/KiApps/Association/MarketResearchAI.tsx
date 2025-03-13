import React, { useRef } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { useMarketResearch } from './useMarketResearch';
import MarketResearchForm from './MarketResearchForm';
import MarketResearchResponse from './MarketResearchResponse';
import { MarketResearchFormData } from './types';

const MarketResearchAI: React.FC = () => {
  const { analyze, response, isAnalyzing, startNewAnalysis } = useMarketResearch();
  const [lastFormData, setLastFormData] = React.useState<MarketResearchFormData | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleNewAnalysis = () => {
    startNewAnalysis();
    setLastFormData(null);
    // Focus the first input in the form
    const firstInput = formRef.current?.querySelector('select') as HTMLElement;
    firstInput?.focus();
  };

  const handleAnalyze = (data: MarketResearchFormData) => {
    setLastFormData(data);
    analyze(data);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header */}
      <div className="bg-white border-b">
        <div className="mx-auto w-full max-w-4xl">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg text-white">
                  <Search className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Market Research AI</h2>
                  <p className="text-sm text-gray-500">Comprehensive market analysis and trends</p>
                </div>
              </div>
              {response && (
                <button
                  onClick={handleNewAnalysis}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>New Analysis</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="mx-auto w-full max-w-4xl">
          <div className="p-4">
            {!response ? (
              <MarketResearchForm 
                ref={formRef}
                onAnalyze={handleAnalyze} 
                isAnalyzing={isAnalyzing} 
              />
            ) : (
              <MarketResearchResponse 
                response={response}
                formData={lastFormData}
                isAnalyzing={isAnalyzing} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketResearchAI;