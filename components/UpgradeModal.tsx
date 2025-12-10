import React, { useState } from 'react';
import { X, Check, Zap, Shield, Crown, QrCode, CreditCard } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../locales';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, language }) => {
  const [payoAmount, setPayoAmount] = useState<number>(10);
  const [showQr, setShowQr] = useState(false);
  const t = TRANSLATIONS[language].upgrade;

  if (!isOpen) return null;

  const calculateTokens = (amount: number) => {
    // 0.5 $ for 1 million tokens
    // amount / 0.5 = millions of tokens
    const millions = amount / 0.5;
    return millions;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white dark:bg-gray-900 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-950">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.title}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t.subtitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50 dark:bg-gray-950">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            
            {/* Free Plan */}
            <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl p-6 flex flex-col">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Free</h3>
                <div className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">$0 <span className="text-sm font-normal text-gray-500">/ month</span></div>
                <p className="text-gray-500 text-sm mt-2">For individuals just getting started with AI.</p>
              </div>
              <button disabled className="w-full py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 font-medium text-gray-700 dark:text-gray-300 mb-6 cursor-default bg-gray-100 dark:bg-gray-800">
                {t.current}
              </button>
              <ul className="space-y-3 text-sm flex-1">
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <Check size={16} className="mt-0.5 text-gray-400" />
                  <span>Access to standard AIHub model</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <Check size={16} className="mt-0.5 text-gray-400" />
                  <span>Limited access to data analysis</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <Check size={16} className="mt-0.5 text-gray-400" />
                  <span>Standard response speed</span>
                </li>
              </ul>
            </div>

            {/* Pro Plan */}
            <div className="border-2 border-primary-500 dark:border-primary-500 bg-white dark:bg-gray-900 rounded-xl p-6 flex flex-col relative shadow-lg shadow-primary-500/10">
              <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
                {t.popular}
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  Pro <Zap size={16} className="text-yellow-500" fill="currentColor" />
                </h3>
                <div className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">$10 <span className="text-sm font-normal text-gray-500">/ month</span></div>
                <p className="text-gray-500 text-sm mt-2">For power users who need the best performance.</p>
              </div>
              <button className="w-full py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium mb-6 transition-colors shadow-sm">
                {t.upgradeBtn}
              </button>
              <ul className="space-y-3 text-sm flex-1">
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <Check size={16} className="mt-0.5 text-primary-500" />
                  <span>Access to GPT-4 class models</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <Check size={16} className="mt-0.5 text-primary-500" />
                  <span>Fast response times</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <Check size={16} className="mt-0.5 text-primary-500" />
                  <span>Advanced data analysis & uploads</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <Check size={16} className="mt-0.5 text-primary-500" />
                  <span>Early access to new features</span>
                </li>
              </ul>
            </div>

            {/* Max Plan */}
            <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl p-6 flex flex-col">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  Max <Crown size={16} className="text-purple-500" />
                </h3>
                <div className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">$100 <span className="text-sm font-normal text-gray-500">/ month</span></div>
                <p className="text-gray-500 text-sm mt-2">For teams and high-volume professionals.</p>
              </div>
              <button className="w-full py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium text-gray-900 dark:text-white mb-6 transition-colors">
                {t.contact}
              </button>
              <ul className="space-y-3 text-sm flex-1">
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <Check size={16} className="mt-0.5 text-purple-500" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <Check size={16} className="mt-0.5 text-purple-500" />
                  <span>Unlimited high-speed messages</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <Check size={16} className="mt-0.5 text-purple-500" />
                  <span>Admin console & workspace management</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <Check size={16} className="mt-0.5 text-purple-500" />
                  <span>SSO & Enterprise security</span>
                </li>
              </ul>
            </div>

            {/* PaYo Plan */}
            <div className="border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl p-6 flex flex-col">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  PaYo <CreditCard size={16} className="text-indigo-500" />
                </h3>
                <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-2 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-1 rounded w-fit">
                  {t.payo}
                </div>
                <p className="text-gray-500 text-sm mt-2">{t.payoDesc}</p>
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <div className="space-y-1">
                   <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t.amount} ($)</label>
                   <div className="flex items-center gap-2">
                      <span className="text-gray-400">$</span>
                      <input 
                        type="number" 
                        min="1"
                        value={payoAmount}
                        onChange={(e) => {
                            setPayoAmount(Number(e.target.value));
                            setShowQr(false);
                        }}
                        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      />
                   </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500">{t.estTokens}</div>
                    <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                        {calculateTokens(payoAmount).toLocaleString()} Million
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">Rate: $0.50 / 1M tokens</div>
                </div>

                {showQr ? (
                    <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-white rounded-lg animate-[fadeIn_0.3s_ease-out]">
                        {/* Placeholder QR Code */}
                        <div className="w-32 h-32 bg-gray-900 relative">
                             <div className="absolute inset-0 p-2 flex flex-wrap gap-1 content-center justify-center opacity-80">
                                 {Array.from({length: 64}).map((_, i) => (
                                     <div key={i} className={`w-3 h-3 ${Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'}`}></div>
                                 ))}
                             </div>
                             {/* Central Logo Overlay */}
                             <div className="absolute inset-0 flex items-center justify-center">
                                 <div className="bg-white p-1 rounded">
                                     <Zap size={20} className="text-black" fill="black" />
                                 </div>
                             </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">{t.scan} ${payoAmount}</p>
                    </div>
                ) : (
                    <button 
                        onClick={() => setShowQr(true)}
                        className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium mt-auto transition-colors flex items-center justify-center gap-2"
                    >
                        <QrCode size={18} />
                        {t.generate}
                    </button>
                )}
              </div>
            </div>

          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-gray-100 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-500">
            {t.footer}
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;