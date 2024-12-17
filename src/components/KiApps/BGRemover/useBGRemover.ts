import { useState, useCallback } from 'react';
import { fal } from '@fal-ai/client';
import { BGRemoverResult, BGRemoverOptions } from './types';

// Initialize FAL client with credentials
const initializeFal = () => {
  try {
    fal.config({
      credentials: import.meta.env.VITE_FAL_KEY,
    });
  } catch (error) {
    console.error('Failed to initialize FAL client:', error);
  }
};

// Initialize on module load
initializeFal();

export const useBGRemover = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BGRemoverResult | null>(null);

  const processImage = useCallback(async (imageUrl: string, options: Partial<BGRemoverOptions> = {}) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await fal.subscribe('fal-ai/birefnet/v2', {
        input: {
          image_url: imageUrl,
          model: options.model || 'General Use (Light)',
          operating_resolution: options.operating_resolution || '1024x1024',
          output_format: options.output_format || 'png',
          refine_foreground: options.refine_foreground ?? true,
        },
        logs: true,
      });

      setResult(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error processing image:', err);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    isProcessing,
    error,
    result,
    processImage,
  };
};