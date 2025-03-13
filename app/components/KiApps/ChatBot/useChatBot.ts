'use client';

import { useState } from 'react';

export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export const useChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: 'Du bist ein hilfreicher KI-Assistent.' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message to state
    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: content,
          model: 'gpt-4o',
          maxTokens: 1000
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from assistant');
      }
      
      const data = await response.json();
      
      // Add assistant response to state
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: data.result || 'Sorry, I could not generate a response.'
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error in chat:', err);
      setError('Failed to get response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading, error };
};