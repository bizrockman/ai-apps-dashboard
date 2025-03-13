import { useState, useCallback } from 'react';
import { TextStatistics } from './types';

export const useWordCount = () => {
  const [text, setText] = useState('');

  const calculateStats = useCallback((text: string): TextStatistics => {
    return {
      characters: text.length,
      words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
      withoutSpaces: text.replace(/\s/g, '').length,
      paragraphs: text.trim() === '' ? 0 : text.trim().split(/\n\s*\n/).length,
    };
  }, []);

  const handleTextChange = useCallback((newText: string) => {
    setText(newText);
  }, []);

  return {
    text,
    stats: calculateStats(text),
    handleTextChange,
  };
};