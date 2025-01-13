import { useState, useCallback } from 'react';
import OpenAI from 'openai';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const useChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const startNewChat = useCallback(() => {
    setMessages([]);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Create a temporary message for streaming
      const tempMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, tempMessage]);

      // Create the chat completion with streaming
      const stream = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful AI assistant.' },
          ...messages.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant' as const,
            content: msg.content
          })),
          { role: 'user', content }
        ],
        stream: true,
      });

      let fullResponse = '';

      // Process the stream
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        fullResponse += content;
        
        // Update the temporary message with the accumulated response
        setMessages(prev => prev.map(msg =>
          msg.id === tempMessage.id
            ? { ...msg, content: fullResponse }
            : msg
        ));
      }
    } catch (error) {
      console.error('Error in chat completion:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [messages]);

  return {
    messages,
    sendMessage,
    isTyping,
    startNewChat
  };
};