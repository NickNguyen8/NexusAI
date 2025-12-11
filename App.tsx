
import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import AppLibrary from './components/AppLibrary';
import UpgradeModal from './components/UpgradeModal';
import AuthModal from './components/AuthModal';
import { Message, Role, ChatSession, AppType, AIApp, User, AuthProvider, Language } from './types';
import { getSystemApps } from './locales';
import { streamResponse } from './services/aiService';
import { authService } from './services/authService';

// Helper to generate UUIDs
const generateId = () => Math.random().toString(36).substring(2, 15);

function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [view, setView] = useState<'chat' | 'library'>('library');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // User State
  const [user, setUser] = useState<User | null>(null);

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Language State
  const [language, setLanguage] = useState<Language>('en');

  // Apps State (Merged System + Custom)
  const [customApps, setCustomApps] = useState<AIApp[]>([]);
  const [displayedApps, setDisplayedApps] = useState<AIApp[]>([]);

  // Initialize Auth Service (MSAL etc)
  useEffect(() => {
     authService.initialize();
  }, []);

  // Detect System Language on Mount
  useEffect(() => {
    const browserLang = navigator.language;
    if (browserLang.startsWith('vi')) {
      setLanguage('vi');
    }
    // Check local storage for preference
    const storedLang = localStorage.getItem('app_language') as Language;
    if (storedLang) {
      setLanguage(storedLang);
    }
  }, []);

  // Update Displayed Apps when Language or Custom Apps change
  useEffect(() => {
    const systemApps = getSystemApps(language);
    setDisplayedApps([...systemApps, ...customApps]);
  }, [language, customApps]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('app_language', lang);
  };

  // Initialize Auth
  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
        setUser(storedUser);
    }
  }, []);

  // Apply theme to HTML element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Optional: Load saved sessions logic here
  useEffect(() => {
    // e.g. loadSessionsFromLocalStorage();
  }, []);

  const handleLogin = async (provider: AuthProvider) => {
    try {
        const loggedInUser = await authService.loginWithProvider(provider);
        setUser(loggedInUser);
        setShowAuthModal(false);
    } catch (error) {
        console.error("Login Error:", error);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setView('library'); // Reset view on logout
  };

  const handleCreateApp = (name: string, description: string, instruction: string) => {
    const newAppId = `custom_${generateId()}`;
    const newApp: AIApp = {
        id: newAppId,
        name: name,
        description: description || 'Custom created agent.',
        icon: 'Zap', // Default icon for custom apps
        systemInstruction: instruction,
        themeColor: 'bg-indigo-500', // Default color
        welcomeMessage: `I am your custom agent ${name}. I am configured to help you with: ${description}. How can I assist you?`,
        examplePrompts: [
            "What are your main capabilities?",
            "Can you help me with a specific task?",
            "Summarize the latest context",
            "Give me an example of what you can do"
        ]
    };
    
    setCustomApps(prev => [...prev, newApp]);
    // Optionally switch to this new app immediately
    createSession(newAppId);
  };

  const createSession = useCallback((appId: string | AppType = AppType.GENERAL_CHAT) => {
    // If appId is undefined or null, default to general chat
    const targetAppId = appId || AppType.GENERAL_CHAT;
    // Search in dynamic apps state
    const appDef = displayedApps.find(a => a.id === targetAppId) || displayedApps[0];
    
    if (!appDef) return;

    const newSession: ChatSession = {
      id: generateId(),
      appId: targetAppId,
      title: language === 'vi' ? 'Cuộc trò chuyện mới' : 'New Chat',
      messages: [],
      createdAt: Date.now()
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setView('chat');
    setIsSidebarOpen(false); // Close sidebar on mobile when new chat starts
  }, [displayedApps, language]);

  const currentSession = sessions.find(s => s.id === activeSessionId);
  const currentApp = currentSession 
    ? displayedApps.find(a => a.id === currentSession.appId) 
    : displayedApps[0];

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
    // IMPORTANT: We only pass the *previous* history to the service.
    // The service takes (history, newMessage). If we include userMsg in history,
    // we duplicate the last user turn (User -> User), causing API errors.
    const sessionHistory = sessions.find(s => s.id === activeSessionId)?.messages || [];

    await streamResponse(
      sessionHistory,
      content,
      currentApp?.systemInstruction || '',
      currentApp?.id || 'unknown', // Pass the App ID for NestJS routing
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
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 overflow-hidden transition-colors duration-200">
      
      <Sidebar 
        apps={displayedApps}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => {
          setActiveSessionId(id);
          setView('chat');
          setIsSidebarOpen(false);
        }}
        onNewChat={createSession}
        onOpenApps={() => setView('library')}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        theme={theme}
        onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
        onOpenUpgrade={() => setShowUpgradeModal(true)}
        // Auth
        user={user}
        onLoginClick={() => setShowAuthModal(true)}
        onLogoutClick={handleLogout}
        // Language
        language={language}
        onSetLanguage={handleSetLanguage}
      />

      <main className="flex-1 flex flex-col h-full relative w-full shadow-2xl rounded-tl-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 transition-colors duration-200">
        {view === 'library' && (
           <>
              {/* Mobile Sidebar Toggle for Library View */}
              <div className="md:hidden flex items-center p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 sticky top-0 z-10 transition-colors duration-200">
                 <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-gray-500 dark:text-gray-400">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
                 </button>
                 <span className="ml-2 font-semibold">Library</span>
              </div>
              <AppLibrary 
                apps={displayedApps} 
                onSelectApp={createSession} 
                onCreateApp={handleCreateApp}
                language={language}
              />
           </>
        )}

        {view === 'chat' && currentApp && (
          <ChatInterface 
            app={currentApp}
            messages={currentSession?.messages || []}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onSidebarToggle={() => setIsSidebarOpen(true)}
            language={language}
          />
        )}
      </main>

      {/* Upgrade Modal */}
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)}
        language={language}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        language={language}
      />
    </div>
  );
}

export default App;
