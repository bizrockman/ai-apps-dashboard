import React from 'react';
import TextEditor from './TextEditor';
import Statistics from './Statistics';
import { useWordCount } from './useWordCount';

const WordCount: React.FC = () => {
  const { text, stats, handleTextChange } = useWordCount();

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="mx-auto w-full max-w-4xl">
        <div className="p-4 bg-white border-b">
          <h2 className="text-xl font-semibold text-gray-800">Word Count</h2>
          <p className="text-sm text-gray-500">Count characters, words, and paragraphs in your text</p>
        </div>
        
        <div className="p-4">
          <Statistics stats={stats} />
          <TextEditor text={text} onChange={handleTextChange} />
        </div>
      </div>
    </div>
  );
};

export default WordCount;