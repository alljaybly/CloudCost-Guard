
import React from 'react';
import { Currency } from '../types';
import { SUPPORTED_CURRENCIES } from '../utils/currencyUtils';

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 1.944c-1.666 0-3.12.6-4.243 1.572C4.634 4.493 4 5.69 4 7v5.111c0 1.25.333 2.333.8 3.111.467.778 1.1 1.378 1.833 1.778.734.4 1.567.6 2.367.6s1.633-.2 2.367-.6c.733-.4 1.366-.999 1.833-1.777.467-.778.8-1.861.8-3.111V7c0-1.31-.634-2.507-1.757-3.484C13.12 2.544 11.666 1.944 10 1.944zM9 13l-3-3 1.41-1.41L9 10.18l4.59-4.59L15 7l-6 6z" clipRule="evenodd" />
  </svg>
);

interface HeaderProps {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
}

const Header: React.FC<HeaderProps> = ({ currency, setCurrency }) => {

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
            <p className="hidden md:block text-sm text-slate-500 dark:text-slate-400">AI-Powered GCP Cost Optimization</p>
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
