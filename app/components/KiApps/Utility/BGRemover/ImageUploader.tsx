import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (imageUrl: string) => void;
  disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, disabled }) => {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  return (
    <div className="w-full">
      <label className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer 
        ${disabled ? 'bg-gray-100 border-gray-300' : 'hover:bg-gray-50 border-gray-300 hover:border-blue-500'}`}>
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className={`w-12 h-12 mb-3 ${disabled ? 'text-gray-400' : 'text-blue-500'}`} />
          <p className={`mb-2 text-sm ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className={`text-xs ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>PNG, JPG or WEBP</p>
        </div>
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
          disabled={disabled}
        />
      </label>
    </div>
  );
};

export default ImageUploader;