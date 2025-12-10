
import React, { useState } from 'react';
import { AIApp, AppType, Language } from '../types';
import { MessageSquare, Code, PenTool, BarChart, Zap, ArrowRight, PlusCircle, Search, X, Image, Video, Headphones } from 'lucide-react';
import { TRANSLATIONS } from '../locales';

interface AppLibraryProps {
  apps: AIApp[];
  onSelectApp: (appId: AppType) => void;
  onCreateApp: (name: string, description: string, instruction: string) => void;
  language: Language;
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

const AppLibrary: React.FC<AppLibraryProps> = ({ apps, onSelectApp, onCreateApp, language }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppDesc, setNewAppDesc] = useState('');
  const [newAppInst, setNewAppInst] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const t = TRANSLATIONS[language].library;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAppName && newAppInst) {
        onCreateApp(newAppName, newAppDesc, newAppInst);
        setShowCreateModal(false);
        // Reset form
        setNewAppName('');
        setNewAppDesc('');
        setNewAppInst('');
    }
  };

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 h-full overflow-y-auto bg-white dark:bg-gray-900 animate-[fadeIn_0.3s_ease-out] relative transition-colors duration-200">
      
      {/* Header Banner */}
      <div className="bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 p-8 md:p-12 transition-colors">
         <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t.title}</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl">
                {t.subtitle}
            </p>
            
            <div className="mt-8 relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input 
                    type="text" 
                    placeholder={t.searchPlaceholder} 
                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg pl-10 pr-4 py-3 text-gray-900 dark:text-gray-200 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 transition-all shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
         </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 md:p-10">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {searchQuery ? `${t.searchResults} "${searchQuery}"` : t.recommended}
            </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          
          {/* Create New App Card */}
          <button 
            onClick={() => setShowCreateModal(true)}
            className="group flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:border-primary-500/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 text-center min-h-[200px]"
          >
            <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-gray-300 dark:group-hover:bg-gray-700 shadow-sm">
              <PlusCircle size={28} className="text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">{t.createCardTitle}</h3>
            <p className="text-gray-500 dark:text-gray-500 text-sm px-4">{t.createCardDesc}</p>
          </button>

          {filteredApps.map((app) => {
            const Icon = IconMap[app.icon] || Zap;
            return (
              <button
                key={app.id}
                onClick={() => onSelectApp(app.id as AppType)}
                className="group relative flex flex-col p-6 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 text-left hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg ${app.themeColor} bg-opacity-20 flex items-center justify-center transition-all`}>
                        <Icon size={24} className={app.themeColor.replace('bg-', 'text-')} />
                    </div>
                    <span className="bg-gray-200 dark:bg-gray-900 text-gray-600 dark:text-gray-500 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">{t.installed}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{app.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">{app.description}</p>
                
                <div className="flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium mt-auto">
                  {t.launch}
                  <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
          
          {filteredApps.length === 0 && searchQuery && (
             <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 py-12 text-center text-gray-500">
                <p>{t.noResults} "{searchQuery}".</p>
             </div>
          )}
        </div>
      </div>

      {/* Simple Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{t.createModalTitle}</h3>
                    <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleCreate} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">{t.labelName}</label>
                        <input 
                            required
                            type="text" 
                            value={newAppName}
                            onChange={(e) => setNewAppName(e.target.value)}
                            className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                            placeholder={t.placeholderName}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">{t.labelDesc}</label>
                        <input 
                            type="text" 
                            value={newAppDesc}
                            onChange={(e) => setNewAppDesc(e.target.value)}
                            className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                            placeholder={t.placeholderDesc}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">{t.labelInstr}</label>
                        <textarea 
                            required
                            value={newAppInst}
                            onChange={(e) => setNewAppInst(e.target.value)}
                            className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 h-32 resize-none transition-colors"
                            placeholder={t.placeholderInstr}
                        />
                    </div>
                    <div className="pt-2 flex justify-end gap-3">
                        <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">{t.btnCancel}</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-500 transition-colors shadow-sm">{t.btnCreate}</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default AppLibrary;
