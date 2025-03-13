'use client';

import { useState } from 'react';
import { BGRemoverResult } from './types';

export const useBGRemover = () => {
  const [result, setResult] = useState<BGRemoverResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeBackground = async (imageUrl: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/fal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          modelId: 'fal-ai/background-removal',
          input: { image_url: imageUrl }
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove background');
      }
      
      const data = await response.json();
      setResult(data.result);
    } catch (err) {
      console.error('Error removing background:', err);
      setError('Failed to remove background. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { removeBackground, result, loading, error };
};