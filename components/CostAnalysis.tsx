import React from 'react';

interface CostAnalysisProps {
  onAnalyze: (data: string) => void;
  billingData: string;
  setBillingData: (data: string) => void;
  isLoading: boolean;
  apiKeyIsSet: boolean;
  onSetApiKey: () => void;
}

const KeyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-slate-500 dark:text-slate-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L4.22 19.78a2 2 0 01-2.828-2.828l7.037-7.037A6 6 0 1118 8zm-8 2a4 4 0 100-8 4 4 0 000 8z" clipRule="evenodd" />
    </svg>
);

const CostAnalysis: React.FC<CostAnalysisProps> = ({ onAnalyze, billingData, setBillingData, isLoading, apiKeyIsSet, onSetApiKey }) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(billingData);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">AI-Powered Cost Analysis</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-4">
        Paste your GCP billing data (CSV or JSON). Provide a Gemini API key for live analysis, or use our demo mode to see different scenarios based on your input.
      </p>
      
      <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <KeyIcon />
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">API Key Status</span>
            <p className={`text-sm font-bold ${apiKeyIsSet ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
              {apiKeyIsSet ? 'Active (Live Analysis)' : 'Not Set (Demo Mode)'}
            </p>
          </div>
        </div>
        <button 
          type="button" 
          onClick={onSetApiKey} 
          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors"
        >
          {apiKeyIsSet ? 'Change Key' : 'Set API Key'}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="billing-data" className="sr-only">Billing Data</label>
          <textarea
            id="billing-data"
            value={billingData}
            onChange={(e) => setBillingData(e.target.value)}
            className="w-full h-40 p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
            placeholder="e.g., Service,Cost or JSON data..."
            disabled={isLoading}
            aria-label="GCP Billing Data Input"
          />
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !billingData.trim()}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing with AI...
              </>
            ) : (
              'Analyze with AI'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CostAnalysis;
