import React, { useState } from 'react';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import { useChatBot } from './useChatBot';

const ChatBot: React.FC = () => {
  const { messages, sendMessage } = useChatBot();

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="mx-auto w-full max-w-3xl">
        <div className="p-4 bg-white border-b">
          <h2 className="text-xl font-semibold text-gray-800">AI Chat Assistant</h2>
          <p className="text-sm text-gray-500">Ask me anything and I'll echo your message</p>
        </div>
        
        <div className="flex flex-col h-[calc(100vh-12rem)]">
          <ChatHistory messages={messages} />
          <ChatInput onSendMessage={sendMessage} />
        </div>
      </div>
    </div>
  );
};

export default ChatBot;