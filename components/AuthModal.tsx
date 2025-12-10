import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { AuthProvider, Language } from '../types';
import { TRANSLATIONS } from '../locales';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (provider: AuthProvider) => Promise<void>;
  language: Language;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, language }) => {
  const [isLoading, setIsLoading] = useState<AuthProvider | null>(null);
  const t = TRANSLATIONS[language].auth;

  if (!isOpen) return null;

  const handleLoginClick = async (provider: AuthProvider) => {
    setIsLoading(provider);
    try {
      await onLogin(provider);
      // Modal closes automatically via parent state change usually, 
      // but we wait here to show loading state
    } catch (error) {
      console.error("Login failed", error);
      setIsLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 relative">
        
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8 text-center">
          <div className="w-12 h-12 bg-primary-600 rounded-xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-primary-600/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.welcome}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">{t.subtitle}</p>

          <div className="space-y-3">
            {/* Google */}
            <button 
              onClick={() => handleLoginClick('google')}
              disabled={isLoading !== null}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading === 'google' ? (
                <Loader2 size={20} className="animate-spin text-gray-500" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>{t.google}</span>
                </>
              )}
            </button>

            {/* Apple */}
            <button 
               onClick={() => handleLoginClick('apple')}
               disabled={isLoading !== null}
               className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading === 'apple' ? (
                <Loader2 size={20} className="animate-spin text-white" />
              ) : (
                <>
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 384 512">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 79.4c14.2 39.6 47.5 90.4 82.2 91 25.5.4 43-16.1 66.5-16.1 23 0 43.1 16.4 69.8 16.1 31.8-.4 63.6-50.1 79.3-75.1-66.7-27-81.6-96.1-81.6-116.5zM205 100c14.5-17.4 30.2-30.8 51.5-31.5 1.5 18.2-3.8 38.8-16.6 52.7-13.6 15.1-32.8 29.8-52.9 29.8-1.5-19.9 4.3-39.2 18-51z"/>
                  </svg>
                  <span>{t.apple}</span>
                </>
              )}
            </button>

            {/* Microsoft */}
            <button 
               onClick={() => handleLoginClick('microsoft')}
               disabled={isLoading !== null}
               className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading === 'microsoft' ? (
                <Loader2 size={20} className="animate-spin text-gray-500" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 23 23">
                    <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                    <path fill="#f35325" d="M1 1h10v10H1z"/>
                    <path fill="#81bc06" d="M12 1h10v10H12z"/>
                    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                    <path fill="#ffba08" d="M12 12h10v10H12z"/>
                  </svg>
                  <span>{t.microsoft}</span>
                </>
              )}
            </button>
          </div>
          
          <p className="mt-8 text-xs text-gray-400 dark:text-gray-500">
            {t.agreement}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;