
import React, { useState, useCallback } from 'react';
import { AnalysisResult, Currency } from './types';
import { analyzeBillingData } from './services/geminiService';
import { DEFAULT_BILLING_DATA, INITIAL_ANALYSIS_RESULT } from './constants';
import { DEFAULT_CURRENCY } from './utils/currencyUtils';
import Header from './components/Header';
import CostAnalysis from './components/CostAnalysis';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import RealTimeAlerts from './components/Alerts';
import ResultsDisplay from './components/MetricsDashboard';

type ErrorState = {
  message: string;
  severity: 'error' | 'warning';
} | null;

function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>(INITIAL_ANALYSIS_RESULT);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorState>(null);
  const [billingData, setBillingData] = useState<string>(DEFAULT_BILLING_DATA);
  const [currency, setCurrency] = useState<Currency>(DEFAULT_CURRENCY);
  // Fix: Removed API key management from UI state per Gemini API guidelines.
  // The API key should be sourced exclusively from process.env.API_KEY.

  const handleAnalyze = useCallback(async (data: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Fix: Removed apiKey argument as it's now handled by process.env in the service.
      const response = await analyzeBillingData(data, currency.code);
      setAnalysisResult(response.result);

      // Fix: Check for API key in process.env to determine if a live request was intended.
      if (response.source === 'demo' && process.env.API_KEY) {
        setError({
          message: 'Could not get a live analysis from the AI. This could be due to an invalid API key, network issue, or a malformed response. Displaying relevant demo data instead.',
          severity: 'warning'
        });
      }
    } catch (err) {
      setError({
        // Fix: Updated error message to reflect API key is sourced from the environment.
        message: 'Failed to analyze billing data. Please check your network connection and ensure the API key is correctly configured in your environment, then try again.',
        severity: 'error'
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [currency]); // Fix: Removed apiKey from dependency array.

  const handleClear = () => {
    setBillingData(DEFAULT_BILLING_DATA);
    setError(null);
    setAnalysisResult(INITIAL_ANALYSIS_RESULT);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header currency={currency} setCurrency={setCurrency} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        <RealTimeAlerts currentSpend={analysisResult.currentCost} currency={currency} />
        
        <CostAnalysis 
          onAnalyze={handleAnalyze} 
          billingData={billingData}
          setBillingData={setBillingData}
          isLoading={isLoading}
          onClear={handleClear}
          // Fix: Removed props related to API key management.
        />
        
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {error && <ErrorDisplay message={error.message} severity={error.severity} />}
            {analysisResult && <ResultsDisplay result={analysisResult} currency={currency} />}
          </>
        )}

      </main>
      {/* Fix: Removed ApiKeyModal as per Gemini API guidelines, which prohibit UI for key management. */}
    </div>
  );
}

export default App;
