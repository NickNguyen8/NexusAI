import React from 'react';
import { Plus, LayoutGrid, MessageSquare, History, Settings, LogOut, Code, PenTool, BarChart, Zap } from 'lucide-react';
import { AIApp, ChatSession, AppType } from '../types';
import { AVAILABLE_APPS } from '../constants';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onOpenApps: () => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const IconMap: Record<string, React.ElementType> = {
  'MessageSquare': MessageSquare,
  'Code': Code,
  'PenTool': PenTool,
  'BarChart': BarChart,
  'Zap': Zap
};

const Sidebar: React.FC<SidebarProps> = ({ 
  sessions, 
  activeSessionId, 
  onSelectSession, 
  onNewChat,
  onOpenApps,
  isOpen,
  toggleSidebar
}) => {
  
  // Group sessions by date (simplified for demo)
  const recentSessions = sessions.slice(0, 10);

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-20 bg-black/50 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-30 w-[260px] bg-gray-950 text-gray-100 flex flex-col transition-transform duration-300 ease-in-out border-r border-gray-800 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        
        {/* Header / New Chat */}
        <div className="p-3">
          <button 
            onClick={onNewChat}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            New Chat
          </button>
        </div>

        {/* Navigation / Apps */}
        <div className="px-3 py-2">
            <div className="text-xs font-semibold text-gray-500 mb-2 px-2 uppercase tracking-wider">Workspace</div>
            <button 
                onClick={onOpenApps}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm text-gray-300 hover:text-white"
            >
                <LayoutGrid size={18} />
                <span>Explore Apps</span>
            </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin scrollbar-thumb-gray-800">
          <div className="text-xs font-semibold text-gray-500 mb-2 px-2 uppercase tracking-wider">Recent</div>
          <div className="space-y-1">
            {recentSessions.map(session => {
              const appDef = AVAILABLE_APPS.find(a => a.id === session.appId) || AVAILABLE_APPS[0];
              const Icon = IconMap[appDef.icon];
              
              return (
                <button
                  key={session.id}
                  onClick={() => onSelectSession(session.id)}
                  className={`group flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors text-left truncate ${activeSessionId === session.id ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'}`}
                >
                  <Icon size={14} className={activeSessionId === session.id ? 'text-primary-500' : 'text-gray-500'} />
                  <span className="truncate flex-1">{session.title}</span>
                </button>
              );
            })}
            
            {recentSessions.length === 0 && (
                <div className="px-3 py-4 text-xs text-gray-600 text-center italic">
                    No history yet
                </div>
            )}
          </div>
        </div>

        {/* User / Settings Footer */}
        <div className="p-3 border-t border-gray-800 mt-auto">
          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold">
              U
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium">User</div>
              <div className="text-xs text-gray-500">Pro Plan</div>
            </div>
            <Settings size={16} className="text-gray-500" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
