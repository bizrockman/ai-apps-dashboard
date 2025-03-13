'use client';

import { useState } from 'react';

export const useStrategyAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const generateStrategy = async (prompt: string) => {
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
        throw new Error('Failed to generate strategy');
      }
      
      const data = await response.json();
      setResult(data.result);
    } catch (err) {
      console.error('Error generating strategy:', err);
      setError('Failed to generate strategy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { generateStrategy, loading, error, result };
};