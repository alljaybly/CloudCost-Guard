import React, { useRef } from 'react';

interface CostAnalysisProps {
  onAnalyze: (data: string) => void;
  billingData: string;
  setBillingData: (data: string) => void;
  isLoading: boolean;
  onClear: () => void;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const CostAnalysis: React.FC<CostAnalysisProps> = ({ onAnalyze, billingData, setBillingData, isLoading, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(billingData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setBillingData(text);
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4 flex-wrap gap-y-2">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">AI-Powered Cost Analysis</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Paste your GCP billing data or upload a CSV file. For a live analysis, use the "Set API Key" button in the header. If no key is provided, demo data will be shown.
          </p>
        </div>
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
        
        <div className="mt-4 flex flex-wrap justify-end items-center gap-3">
           <input
              type="file"
              id="csv-upload"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              aria-hidden="true"
              disabled={isLoading}
            />
            <label
              htmlFor="csv-upload"
              className={`inline-flex items-center justify-center px-6 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              aria-disabled={isLoading}
            >
              <UploadIcon />
              Upload CSV
            </label>
           <button
            type="button"
            onClick={onClear}
            disabled={isLoading}
            className="px-6 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Clear
          </button>
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