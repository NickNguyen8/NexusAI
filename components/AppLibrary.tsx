import React from 'react';
import { AVAILABLE_APPS } from '../constants';
import { AppType } from '../types';
import { MessageSquare, Code, PenTool, BarChart, Zap, ArrowRight } from 'lucide-react';

interface AppLibraryProps {
  onSelectApp: (appId: AppType) => void;
}

const IconMap: Record<string, React.ElementType> = {
  'MessageSquare': MessageSquare,
  'Code': Code,
  'PenTool': PenTool,
  'BarChart': BarChart,
  'Zap': Zap
};

const AppLibrary: React.FC<AppLibraryProps> = ({ onSelectApp }) => {
  return (
    <div className="flex-1 h-full overflow-y-auto bg-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">What do you want to create?</h1>
          <p className="text-gray-400 text-lg">Choose a specialized AI agent to get started.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AVAILABLE_APPS.map((app) => {
            const Icon = IconMap[app.icon];
            return (
              <button
                key={app.id}
                onClick={() => onSelectApp(app.id)}
                className="group relative flex flex-col p-6 rounded-2xl bg-gray-850 border border-gray-800 hover:border-gray-600 hover:bg-gray-800 transition-all duration-200 text-left shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl ${app.themeColor} bg-opacity-20 flex items-center justify-center mb-4 group-hover:bg-opacity-30 transition-all`}>
                  <Icon size={24} className={app.themeColor.replace('bg-', 'text-')} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{app.name}</h3>
                <p className="text-gray-400 text-sm mb-6 flex-1">{app.description}</p>
                <div className="flex items-center text-primary-500 text-sm font-medium">
                  Launch App
                  <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
          
          {/* Placeholder for "Add New" to signify extensibility */}
          <button className="group flex flex-col items-center justify-center p-6 rounded-2xl border border-dashed border-gray-700 hover:border-gray-500 hover:bg-gray-800/50 transition-all duration-200 text-center min-h-[240px]">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-4 group-hover:bg-gray-700">
              <Zap size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-1">Create Custom Agent</h3>
            <p className="text-gray-500 text-xs">Connect external API or Dataset</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppLibrary;
