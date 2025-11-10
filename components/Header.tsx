import React from 'react';
import { Currency } from '../types';
import { SUPPORTED_CURRENCIES } from '../utils/currencyUtils';
import { ApiKeySource } from '../utils/apiKey';

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 1.944c-1.666 0-3.12.6-4.243 1.572C4.634 4.493 4 5.69 4 7v5.111c0 1.25.333 2.333.8 3.111.467.778 1.1 1.378 1.833 1.778.734.4 1.567.6 2.367.6s1.633-.2 2.367-.6c.733-.4 1.366-.999 1.833-1.777.467-.778.8-1.861.8-3.111V7c0-1.31-.634-2.507-1.757-3.484C13.12 2.544 11.666 1.944 10 1.944zM9 13l-3-3 1.41-1.41L9 10.18l4.59-4.59L15 7l-6 6z" clipRule="evenodd" />
  </svg>
);

const KeyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L4.257 19.743A1 1 0 013 19.172V15a1 1 0 011-1h.172l3.086-3.086A6 6 0 1118 8zm-6-4a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
    </svg>
);


interface HeaderProps {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    apiKeySource: ApiKeySource;
    onSetApiKey: () => void;
    onRemoveApiKey: () => void;
}

const KeyStatusIndicator: React.FC<{ source: ApiKeySource; onRemove: () => void }> = ({ source, onRemove }) => {
    const baseClasses = "flex items-center gap-x-2 text-xs font-semibold px-2.5 py-1 rounded-full";
    let statusText: string;
    let colorClasses: string;
  
    switch (source) {
      case 'manual':
        statusText = 'Live (Manual Key)';
        colorClasses = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        break;
      case 'env':
        statusText = 'Live (Env Key)';
        colorClasses = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        break;
      default:
        statusText = 'Demo Mode';
        colorClasses = 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
    }
  
    return (
        <div className="flex items-center gap-2">
            <span className={`${baseClasses} ${colorClasses}`} title={`The application is currently using ${statusText}.`}>{statusText}</span>
            {source === 'manual' && (
                <button 
                    onClick={onRemove} 
                    className="text-xs text-red-600 dark:text-red-400 hover:underline font-medium"
                    title="Remove manual API key and revert to environment key or demo mode."
                >
                    Remove
                </button>
            )}
        </div>
    );
};


const Header: React.FC<HeaderProps> = ({ currency, setCurrency, apiKeySource, onSetApiKey, onRemoveApiKey }) => {

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrency = SUPPORTED_CURRENCIES.find(c => c.code === event.target.value);
    if (selectedCurrency) {
      setCurrency(selectedCurrency);
    }
  };

  return (
    <header className="bg-white dark:bg-slate-800/50 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <ShieldIcon />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              CloudCost Guard
            </h1>
          </div>
          <div className="flex items-center gap-x-4">
            <KeyStatusIndicator source={apiKeySource} onRemove={onRemoveApiKey} />
             <button
                onClick={onSetApiKey}
                className="hidden sm:inline-flex items-center gap-x-1.5 px-3 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
             >
                <KeyIcon />
                Set API Key
            </button>
            <div className="relative">
                <select 
                    value={currency.code} 
                    onChange={handleCurrencyChange}
                    className="pl-3 pr-8 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none cursor-pointer"
                    aria-label="Select currency"
                >
                    {SUPPORTED_CURRENCIES.map(c => (
                        <option key={c.code} value={c.code}>
                            {c.code} ({c.symbol})
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;