import React from 'react';
import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`flex items-start space-x-3 ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        message.isUser ? 'bg-blue-500' : 'bg-gray-600'
      }`}>
        {message.isUser ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-white" />}
      </div>
      <div className={`flex-1 max-w-[80%] ${message.isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block rounded-2xl px-4 py-2 ${
          message.isUser ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
        }`}>
          <div className={`prose ${message.isUser ? 'prose-invert' : ''} max-w-none text-sm`}>
            <ReactMarkdown 
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                // Override default styling for specific elements
                p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                a: ({node, ...props}) => <a className="text-blue-400 hover:underline" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                code: ({node, inline, ...props}) => 
                  inline ? 
                    <code className="bg-gray-100 text-gray-800 px-1 rounded" {...props} /> :
                    <code className="block bg-gray-100 text-gray-800 p-2 rounded my-2 whitespace-pre-wrap" {...props} />
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
        <div className="mt-1">
          <span className="text-xs text-gray-500">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;