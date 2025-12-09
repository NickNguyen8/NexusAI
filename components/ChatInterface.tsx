import React, { useRef, useEffect, useState } from 'react';
import { Send, StopCircle, Sparkles, User, Bot, Menu } from 'lucide-react';
import { Message, Role, AIApp } from '../types';

interface ChatInterfaceProps {
  app: AIApp;
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  onSidebarToggle: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  app, 
  messages, 
  isLoading, 
  onSendMessage,
  onSidebarToggle
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-900 relative">
      
      {/* Top Bar (Mobile) */}
      <div className="md:hidden flex items-center p-4 border-b border-gray-800 bg-gray-950">
        <button onClick={onSidebarToggle} className="p-2 -ml-2 text-gray-400">
            <Menu size={24} />
        </button>
        <span className="ml-2 font-semibold text-white">{app.name}</span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-gray-800">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
              <div className={`w-16 h-16 rounded-2xl ${app.themeColor} flex items-center justify-center mb-6 shadow-xl shadow-${app.themeColor.split('-')[1]}-500/20`}>
                 <Sparkles size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Hello! I'm {app.name}.
              </h2>
              <p className="text-gray-400 max-w-md">
                {app.description}
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-4 ${msg.role === Role.USER ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                msg.role === Role.USER ? 'bg-gray-700' : app.themeColor
              }`}>
                {msg.role === Role.USER ? <User size={16} /> : <Bot size={16} />}
              </div>
              
              <div className={`relative px-5 py-3.5 rounded-2xl max-w-[85%] sm:max-w-[75%] leading-relaxed shadow-sm ${
                msg.role === Role.USER 
                  ? 'bg-gray-800 text-gray-100 rounded-tr-sm' 
                  : 'bg-transparent text-gray-100 -ml-2'
              }`}>
                {msg.role === Role.MODEL ? (
                    // Simple text rendering for AI to keep it file-limited.
                    // In a full app, use react-markdown here.
                    <div className="whitespace-pre-wrap font-light text-gray-200">
                        {msg.content}
                    </div>
                ) : (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
             <div className="flex gap-4">
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${app.themeColor} animate-pulse`}>
                    <Bot size={16} />
                </div>
                <div className="flex items-center space-x-2 h-10">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                </div>
             </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-900 border-t border-gray-800">
        <div className="max-w-3xl mx-auto relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${app.name}...`}
            className="w-full bg-gray-800 text-white rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-1 focus:ring-gray-600 resize-none overflow-hidden max-h-48 placeholder-gray-500 border border-transparent focus:border-gray-700 shadow-sm"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`absolute right-2 bottom-2 p-2 rounded-lg transition-all duration-200 ${
              input.trim() && !isLoading
                ? 'bg-white text-black hover:bg-gray-200' 
                : 'bg-transparent text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? <StopCircle size={20} /> : <Send size={20} />}
          </button>
        </div>
        <div className="text-center mt-2">
            <p className="text-[10px] text-gray-500">NexusAI can make mistakes. Check important info.</p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
