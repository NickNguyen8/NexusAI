import React, { useRef, useEffect, useState } from 'react';
import { Send, StopCircle, Sparkles, User, Bot, Menu, ArrowRight } from 'lucide-react';
import { Message, Role, AIApp, Language } from '../types';
import { TRANSLATIONS } from '../locales';

interface ChatInterfaceProps {
  app: AIApp;
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  onSidebarToggle: () => void;
  language: Language;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  app, 
  messages, 
  isLoading, 
  onSendMessage,
  onSidebarToggle,
  language
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const t = TRANSLATIONS[language].chat;

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
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-900 relative transition-colors duration-200">
      
      {/* Top Bar (Mobile) */}
      <div className="md:hidden flex items-center p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
        <button onClick={onSidebarToggle} className="p-2 -ml-2 text-gray-500 dark:text-gray-400">
            <Menu size={24} />
        </button>
        <span className="ml-2 font-semibold text-gray-900 dark:text-white">{app.name}</span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-800">
        
        {messages.length === 0 ? (
          /* Empty State - Centered Layout */
          <div className="h-full flex flex-col items-center justify-center max-w-3xl mx-auto animate-[fadeIn_0.5s_ease-out_forwards] px-4">
              <div className={`w-16 h-16 rounded-2xl ${app.themeColor} flex items-center justify-center mb-6 shadow-xl shadow-${app.themeColor.split('-')[1]}-500/20`}>
                 <Sparkles size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
                {app.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8 leading-relaxed text-center transition-colors">
                {app.welcomeMessage || t.emptyState}
              </p>

              {/* Starter Prompts Grid */}
              {app.examplePrompts && app.examplePrompts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                  {app.examplePrompts.map((prompt, index) => (
                    <button 
                      key={index}
                      onClick={() => onSendMessage(prompt)}
                      className="text-left p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all group flex items-start justify-between"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white line-clamp-2">{prompt}</span>
                      <ArrowRight size={14} className="text-gray-400 dark:text-gray-600 group-hover:text-primary-600 dark:group-hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-all translate-x-[-5px] group-hover:translate-x-0 mt-1" />
                    </button>
                  ))}
                </div>
              )}
          </div>
        ) : (
          /* Conversation History */
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-4 ${msg.role === Role.USER ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                  msg.role === Role.USER ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200' : `${app.themeColor} text-white`
                }`}>
                  {msg.role === Role.USER ? <User size={16} /> : <Bot size={16} />}
                </div>
                
                <div className={`relative px-5 py-3.5 rounded-2xl max-w-[85%] sm:max-w-[75%] leading-relaxed shadow-sm ${
                  msg.role === Role.USER 
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tr-sm' 
                    : 'bg-transparent text-gray-900 dark:text-gray-100 -ml-2'
                }`}>
                  {msg.role === Role.MODEL ? (
                      <div className="whitespace-pre-wrap font-light text-gray-800 dark:text-gray-200">
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
                      <Bot size={16} className="text-white" />
                  </div>
                  <div className="flex items-center space-x-2 h-10">
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                  </div>
               </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-200">
        <div className="max-w-3xl mx-auto relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`${t.inputPlaceholder} ${app.name}...`}
            className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl pl-4 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 resize-none overflow-hidden max-h-48 placeholder-gray-400 dark:placeholder-gray-500 border border-transparent focus:border-transparent shadow-sm leading-relaxed transition-colors"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`absolute right-3 bottom-3 p-2 rounded-lg transition-all duration-200 ${
              input.trim() && !isLoading
                ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md' 
                : 'bg-transparent text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? <StopCircle size={20} /> : <Send size={20} />}
          </button>
        </div>
        <div className="text-center mt-2">
            <p className="text-[10px] text-gray-400 dark:text-gray-500">{t.disclaimer}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;