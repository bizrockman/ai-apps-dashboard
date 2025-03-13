'use client';

import { useState } from 'react';

export const useMarketResearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const generateResearch = async (prompt: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate market research');
      }
      
      const data = await response.json();
      setResult(data.result);
    } catch (err) {
      console.error('Error generating market research:', err);
      setError('Failed to generate market research. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { generateResearch, loading, error, result };
};