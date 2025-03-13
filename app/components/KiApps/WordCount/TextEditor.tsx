import React, { useEffect, useRef } from 'react';

interface TextEditorProps {
  text: string;
  onChange: (text: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ text, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div className="mt-4">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type or paste your text here..."
        className="w-full h-[calc(100vh-20rem)] p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none bg-white"
      />
    </div>
  );
};

export default TextEditor;