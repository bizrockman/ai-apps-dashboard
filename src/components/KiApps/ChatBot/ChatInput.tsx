import React, { useState, FormEvent, useEffect, forwardRef } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(({ onSendMessage, disabled }, ref) => {
  const [message, setMessage] = useState('');

  // Set focus when disabled state changes to false (after response is complete)
  useEffect(() => {
    if (!disabled && ref && 'current' in ref && ref.current) {
      ref.current.focus();
    }
  }, [disabled, ref]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 p-4 bg-white border-t">
      <input
        ref={ref}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={disabled ? 'Please wait...' : 'Type your message...'}
        disabled={disabled}
        className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-50 disabled:text-gray-500"
      />
      <button
        type="submit"
        disabled={disabled || !message.trim()}
        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        <Send className="h-5 w-5" />
      </button>
    </form>
  );
});

ChatInput.displayName = 'ChatInput';

export default ChatInput;