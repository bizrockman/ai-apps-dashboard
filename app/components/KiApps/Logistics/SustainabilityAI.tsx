import React from 'react';
import { Leaf } from 'lucide-react';

const SustainabilityAI: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="text-center">
        <Leaf className="h-16 w-16 mx-auto text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Sustainability AI</h2>
        <p className="text-gray-600 mt-2">Environmental impact and sustainability management</p>
      </div>
    </div>
  );
};

export default SustainabilityAI;