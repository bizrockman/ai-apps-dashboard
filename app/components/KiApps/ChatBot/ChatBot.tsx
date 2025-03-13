import React, { useRef } from 'react';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import { useChatBot } from './useChatBot';
import { RefreshCw } from 'lucide-react';

const ChatBot: React.FC = () => {
  const { messages, sendMessage, isTyping, startNewChat } = useChatBot();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNewChat = () => {
    startNewChat();
    // Focus the input field after clearing the chat
    inputRef.current?.focus();
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="mx-auto w-full max-w-3xl">
        <div className="p-4 bg-white border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">AI Chat Assistant</h2>
              <p className="text-sm text-gray-500">Powered by GPT-4</p>
            </div>
            <button
              onClick={handleNewChat}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>New Chat</span>
            </button>
          </div>
        </div>
        
        <div className="flex flex-col h-[calc(100vh-12rem)]">
          <ChatHistory messages={messages} isTyping={isTyping} />
          <ChatInput 
            ref={inputRef}
            onSendMessage={sendMessage} 
            disabled={isTyping} 
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBot;