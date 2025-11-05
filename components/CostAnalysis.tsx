
import React, { useState } from 'react';

interface CostAnalysisProps {
  onAnalyze: (data: string) => void;
  initialData: string;
  isLoading: boolean;
}

const CostAnalysis: React.FC<CostAnalysisProps> = ({ onAnalyze, initialData, isLoading }) => {
  const [billingData, setBillingData] = useState<string>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(billingData);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">GCP Billing Data Analysis</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-4">
        Paste your GCP billing data (e.g., from a CSV export) into the text area below. Our AI will analyze it to find potential savings.
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={billingData}
          onChange={(e) => setBillingData(e.target.value)}
          className="w-full h-40 p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
          placeholder="Service,Cost..."
          disabled={isLoading}
        />
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
                Analyzing...
              </>
            ) : (
              'Analyze Costs'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CostAnalysis;
