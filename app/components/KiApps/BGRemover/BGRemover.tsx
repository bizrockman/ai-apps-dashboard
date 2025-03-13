import React, { useState } from 'react';
import { useBGRemover } from './useBGRemover';
import ImageUploader from './ImageUploader';
import ImagePreview from './ImagePreview';

const BGRemover: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const { isProcessing, error, result, processImage } = useBGRemover();

  const handleImageSelect = async (imageUrl: string) => {
    setOriginalImage(imageUrl);
    await processImage(imageUrl);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="mx-auto w-full max-w-4xl">
        <div className="p-4 bg-white border-b">
          <h2 className="text-xl font-semibold text-gray-800">Background Remover</h2>
          <p className="text-sm text-gray-500">Remove background from your images using AI</p>
        </div>
        
        <div className="p-4">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <ImageUploader
            onImageSelect={handleImageSelect}
            disabled={isProcessing}
          />

          <ImagePreview
            originalImage={originalImage}
            processedImage={result?.image.url || null}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </div>
  );
};

export default BGRemover;