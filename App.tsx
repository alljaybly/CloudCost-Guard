import React, { useState, useCallback, useEffect } from 'react';
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
import ApiKeyModal from './components/ApiKeyModal';
import { getApiKeySource, setManualApiKey, removeManualApiKey, ApiKeySource } from './utils/apiKey';

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
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKeySource, setApiKeySource] = useState<ApiKeySource>('none');

  useEffect(() => {
    setApiKeySource(getApiKeySource());
  }, []);

  const handleSaveApiKey = (key: string) => {
    setManualApiKey(key);
    setApiKeySource('manual');
    setIsApiKeyModalOpen(false);
  };

  const handleRemoveApiKey = () => {
    removeManualApiKey();
    setApiKeySource(getApiKeySource()); // Fallback to env or none
  };


  const handleAnalyze = useCallback(async (data: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await analyzeBillingData(data, currency.code);
      setAnalysisResult(response.result);

      if (response.source === 'demo' && getApiKeySource() !== 'none') {
        setError({
          message: `Could not get a live analysis. The active API key (${getApiKeySource() === 'manual' ? 'manual session' : 'environment'}) may be invalid or have network issues. Displaying relevant demo data instead.`,
          severity: 'warning'
        });
      }
    } catch (err) {
      setError({
        message: 'Failed to analyze billing data. Please check your network connection and API key, then try again.',
        severity: 'error'
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [currency]);

  const handleClear = () => {
    setBillingData(DEFAULT_BILLING_DATA);
    setError(null);
    setAnalysisResult(INITIAL_ANALYSIS_RESULT);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header
        currency={currency}
        setCurrency={setCurrency}
        apiKeySource={apiKeySource}
        onSetApiKey={() => setIsApiKeyModalOpen(true)}
        onRemoveApiKey={handleRemoveApiKey}
      />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        <RealTimeAlerts currentSpend={analysisResult.currentCost} currency={currency} />
        
        <CostAnalysis 
          onAnalyze={handleAnalyze} 
          billingData={billingData}
          setBillingData={setBillingData}
          isLoading={isLoading}
          onClear={handleClear}
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
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSave={handleSaveApiKey}
      />
    </div>
  );
}

export default App;