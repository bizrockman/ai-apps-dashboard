import { useState, useCallback } from 'react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export const useChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = useCallback((content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    // Add bot response
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: `This is an answer to your question: ${content}`,
      isUser: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
  }, []);

  return {
    messages,
    sendMessage,
  };
};