import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import AppLibrary from './components/AppLibrary';
import { Message, Role, ChatSession, AppType } from './types';
import { AVAILABLE_APPS, MOCK_INITIAL_SESSION_ID } from './constants';
import { streamResponse } from './services/aiService';

// Helper to generate UUIDs
const generateId = () => Math.random().toString(36).substring(2, 15);

function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [view, setView] = useState<'chat' | 'library'>('library');

  // Initialize with no sessions or load from localstorage in real app
  useEffect(() => {
    // Optional: Load saved sessions logic here
  }, []);

  const createSession = useCallback((appId: AppType) => {
    const appDef = AVAILABLE_APPS.find(a => a.id === appId);
    if (!appDef) return;

    const newSession: ChatSession = {
      id: generateId(),
      appId,
      title: 'New Chat',
      messages: [],
      createdAt: Date.now()
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setView('chat');
    setIsSidebarOpen(false); // Close sidebar on mobile when new chat starts
  }, []);

  const currentSession = sessions.find(s => s.id === activeSessionId);
  const currentApp = currentSession 
    ? AVAILABLE_APPS.find(a => a.id === currentSession.appId) 
    : AVAILABLE_APPS[0];

  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!activeSessionId) return;

    // 1. Add User Message
    const userMsg: Message = {
      id: generateId(),
      role: Role.USER,
      content,
      timestamp: Date.now()
    };

    setSessions(prev => prev.map(session => {
      if (session.id === activeSessionId) {
        // Update title if it's the first message
        const title = session.messages.length === 0 ? content.slice(0, 30) : session.title;
        return {
          ...session,
          title,
          messages: [...session.messages, userMsg]
        };
      }
      return session;
    }));

    setIsLoading(true);

    // 2. Prepare for Stream
    const aiMsgId = generateId();
    let fullResponse = "";

    // Insert empty AI message to stream into
    setSessions(prev => prev.map(session => {
        if (session.id === activeSessionId) {
            return {
                ...session,
                messages: [...session.messages, {
                    id: aiMsgId,
                    role: Role.MODEL,
                    content: '',
                    timestamp: Date.now()
                }]
            };
        }
        return session;
    }));

    // 3. Call Service
    const sessionHistory = sessions.find(s => s.id === activeSessionId)?.messages || [];
    const fullHistory = [...sessionHistory, userMsg]; // include the one just sent

    // NestJS Backend Simulation Note:
    // In a real implementation, we would call: await nestBackendService.sendMessage(fullHistory)
    await streamResponse(
      fullHistory,
      content,
      currentApp?.systemInstruction || '',
      (chunk) => {
        fullResponse += chunk;
        setSessions(prev => prev.map(session => {
            if (session.id === activeSessionId) {
                return {
                    ...session,
                    messages: session.messages.map(msg => 
                        msg.id === aiMsgId ? { ...msg, content: fullResponse } : msg
                    )
                };
            }
            return session;
        }));
      },
      () => {
        setIsLoading(false);
      }
    );

  }, [activeSessionId, sessions, currentApp]);

  return (
    <div className="flex h-screen bg-gray-950 font-sans text-gray-100 overflow-hidden">
      
      <Sidebar 
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => {
          setActiveSessionId(id);
          setView('chat');
          setIsSidebarOpen(false);
        }}
        onNewChat={() => setView('library')}
        onOpenApps={() => setView('library')}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="flex-1 flex flex-col h-full relative w-full">
        {view === 'library' && (
           <>
              {/* Mobile Sidebar Toggle for Library View */}
              <div className="md:hidden flex items-center p-4 border-b border-gray-800 bg-gray-950 sticky top-0 z-10">
                 <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-gray-400">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
                 </button>
                 <span className="ml-2 font-semibold">Library</span>
              </div>
              <AppLibrary onSelectApp={createSession} />
           </>
        )}

        {view === 'chat' && currentApp && (
          <ChatInterface 
            app={currentApp}
            messages={currentSession?.messages || []}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onSidebarToggle={() => setIsSidebarOpen(true)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
