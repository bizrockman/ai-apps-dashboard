import React from 'react';

interface ImagePreviewProps {
  originalImage: string | null;
  processedImage: string | null;
  isProcessing: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ originalImage, processedImage, isProcessing }) => {
  if (!originalImage && !processedImage) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      {originalImage && (
        <div className="relative">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Original Image</h3>
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={originalImage}
              alt="Original"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
      
      {(processedImage || isProcessing) && (
        <div className="relative">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Processed Image</h3>
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            {isProcessing ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : processedImage && (
              <img
                src={processedImage}
                alt="Processed"
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;