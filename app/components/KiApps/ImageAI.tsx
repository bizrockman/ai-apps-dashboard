import React from 'react';
import { Brain } from 'lucide-react';

const ImageAI: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="text-center">
        <Brain className="h-16 w-16 mx-auto text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">AI Analysis</h2>
        <p className="text-gray-600 mt-2">Placeholder for AI Analysis Implementation</p>
      </div>
    </div>
  );
};

export default ImageAI;