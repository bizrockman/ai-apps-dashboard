import React from 'react';
import { Package } from 'lucide-react';

const ProductAI: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="text-center">
        <Package className="h-16 w-16 mx-auto text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Product AI</h2>
        <p className="text-gray-600 mt-2">Smart product management and optimization</p>
      </div>
    </div>
  );
};

export default ProductAI;