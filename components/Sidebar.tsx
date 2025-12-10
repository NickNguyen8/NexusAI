
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Settings, Code, PenTool, BarChart, Zap, LayoutGrid, PlusCircle, Sun, Moon, LogOut, ChevronUp, Sparkles, LogIn, Globe, Image, Video, Headphones } from 'lucide-react';
import { ChatSession, AppType, AIApp, User, Language } from '../types';
import { TRANSLATIONS } from '../locales';

interface SidebarProps {
  apps: AIApp[];
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: (appId?: AppType) => void;
  onOpenApps: () => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenUpgrade: () => void;
  
  // Auth Props
  user: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;

  // Language Props
  language: Language;
  onSetLanguage: (lang: Language) => void;
}

const IconMap: Record<string, React.ElementType> = {
  'MessageSquare': MessageSquare,
  'Code': Code,
  'PenTool': PenTool,
  'BarChart': BarChart,
  'Zap': Zap,
  'Image': Image,
  'Video': Video,
  'Headphones': Headphones
};

const Sidebar: React.FC<SidebarProps> = ({ 
  apps,
  sessions, 
  activeSessionId, 
  onSelectSession, 
  onNewChat,
  onOpenApps,
  isOpen,
  toggleSidebar,
  theme,
  onToggleTheme,
  onOpenUpgrade,
  user,
  onLoginClick,
  onLogoutClick,
  language,
  onSetLanguage
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const recentSessions = sessions.slice(0, 15);
  const t = TRANSLATIONS[language].sidebar;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-20 bg-black/50 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-30 w-[260px] bg-gray-50 dark:bg-gray-950 flex flex-col transition-transform duration-300 ease-in-out border-r border-gray-200 dark:border-gray-800 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        
        {/* App Title Area */}
        <div className="p-4 flex items-center gap-2 border-b border-gray-200 dark:border-gray-800/50">
          <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-900/20">
             <Zap size={16} className="text-white" fill="currentColor" />
          </div>
          <span className="font-bold text-gray-900 dark:text-gray-100 tracking-tight text-lg">AIHub</span>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-800">
            
            {/* Navigation / Apps Section */}
            <div className="p-3 pb-0">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 mb-2">{t.workspace}</div>
                
                <button 
                    onClick={onOpenApps}
                    className="flex items-center gap-3 w-full px-2 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium text-left mb-1"
                >
                    <LayoutGrid size={18} className="text-indigo-500 dark:text-indigo-400" />
                    <span>{t.library}</span>
                </button>

                <div className="space-y-0.5 mt-2">
                    {apps.map(app => {
                         const Icon = IconMap[app.icon] || Zap;
                         return (
                            <button 
                                key={app.id}
                                onClick={() => onNewChat(app.id as AppType)}
                                className="group flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-900/80 transition-colors text-sm text-left"
                            >
                                <Icon size={18} className="text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200" />
                                <span className="text-gray-700 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200">{app.name}</span>
                            </button>
                         )
                    })}
                    
                    {/* Create App Button */}
                    <button 
                        onClick={onOpenApps}
                        className="flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-900 transition-colors text-sm text-left group mt-1"
                    >
                         <div className="flex items-center justify-center w-[18px]">
                            <PlusCircle size={18} className="text-gray-400 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                         </div>
                         <span className="text-gray-500 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400">{t.create}</span>
                    </button>
                </div>
            </div>

            {/* History List */}
            <div className="mt-8 px-3">
                <div className="flex items-center justify-between px-2 mb-2">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t.history}</div>
                </div>
                
                <div className="space-y-0.5">
                    {recentSessions.map(session => {
                        return (
                            <button
                                key={session.id}
                                onClick={() => onSelectSession(session.id)}
                                className={`group flex items-center gap-3 w-full px-2 py-2 rounded-lg text-sm transition-all text-left truncate ${
                                    activeSessionId === session.id 
                                    ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white' 
                                    : 'text-gray-600 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-300'
                                }`}
                            >
                                <MessageSquare size={16} className={activeSessionId === session.id ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600 group-hover:text-gray-500'} />
                                <span className="truncate flex-1">{session.title}</span>
                            </button>
                        );
                    })}
                    
                    {recentSessions.length === 0 && (
                        <div className="px-2 py-2 text-xs text-gray-400 dark:text-gray-600 italic">
                            {t.noHistory}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* User Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800 mt-auto bg-gray-50 dark:bg-gray-950 relative" ref={userMenuRef}>
          
          {user ? (
            /* Logged In State */
            <>
                {/* Settings Popup Menu */}
                {showUserMenu && (
                    <div className="absolute bottom-full left-3 right-3 mb-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden animate-[fadeIn_0.2s_ease-out]">
                        <div className="p-1">
                            <button 
                                onClick={() => {
                                    onOpenUpgrade();
                                    setShowUserMenu(false);
                                }}
                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-200 group"
                            >
                                <Sparkles size={16} className="text-yellow-500" fill="currentColor" />
                                <span className="font-semibold text-gray-900 dark:text-white">{t.upgrade}</span>
                            </button>
                            <div className="h-px bg-gray-200 dark:bg-gray-800 my-1" />

                            <button 
                                onClick={onToggleTheme}
                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-200"
                            >
                                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                                <span>{theme === 'dark' ? t.lightMode : t.darkMode}</span>
                            </button>

                            {/* Language Toggle */}
                            <button 
                                onClick={() => onSetLanguage(language === 'en' ? 'vi' : 'en')}
                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-200"
                            >
                                <Globe size={16} />
                                <div className="flex-1 flex items-center justify-between">
                                    <span>{t.language}</span>
                                    <span className="text-xs font-bold text-primary-600 bg-primary-100 dark:bg-primary-900/30 px-1.5 py-0.5 rounded uppercase">
                                        {language === 'en' ? 'EN' : 'VI'}
                                    </span>
                                </div>
                            </button>

                            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-200">
                                <Settings size={16} />
                                <span>{t.settings}</span>
                            </button>
                            <div className="h-px bg-gray-200 dark:bg-gray-800 my-1" />
                            <button 
                                onClick={() => {
                                    onLogoutClick();
                                    setShowUserMenu(false);
                                }}
                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors text-sm"
                            >
                                <LogOut size={16} />
                                <span>{t.logout}</span>
                            </button>
                        </div>
                    </div>
                )}

                <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex items-center gap-3 w-full px-2 py-2 rounded-lg transition-colors text-sm group ${showUserMenu ? 'bg-gray-200 dark:bg-gray-900' : 'hover:bg-gray-200 dark:hover:bg-gray-900'}`}
                >
                    {user.avatar ? (
                         <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                            {user.name.substring(0, 2)}
                        </div>
                    )}
                    
                    <div className="flex-1 text-left overflow-hidden">
                        <div className="font-medium text-gray-900 dark:text-gray-300 truncate">{user.name}</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-500 capitalize">{user.plan} {t.plan}</div>
                    </div>
                    <ChevronUp size={16} className={`text-gray-500 dark:text-gray-600 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
            </>
          ) : (
            /* Logged Out State */
            <button 
                onClick={onLoginClick}
                className="flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-primary-600 hover:text-white transition-all text-sm group bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-300"
            >
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-800 group-hover:bg-primary-500 flex items-center justify-center">
                    <LogIn size={14} className="group-hover:text-white transition-colors" />
                </div>
                <span className="font-semibold">{t.login}</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
