import React, { useState, useCallback, useEffect } from 'react';
import { AnalysisResult } from './types';
import { DEMO_ANALYSIS_RESULT, SAMPLE_BILLING_DATA } from './constants';
import { analyzeBillingData } from './services/geminiService';
import Header from './components/Header';
import CostAnalysis from './components/CostAnalysis';
import MetricsDashboard from './components/MetricsDashboard';
import Recommendations from './components/Recommendations';
import CostVisuals from './components/CostVisuals';
import Alerts from './components/Alerts';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import ApiKeyModal from './components/ApiKeyModal';

function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>(DEMO_ANALYSIS_RESULT);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Load API key from session storage on initial mount
  useEffect(() => {
    // Using sessionStorage is a safer alternative to localStorage for sensitive data like API keys.
    // The key persists for the page session but is cleared when the tab is closed.
    const storedKey = sessionStorage.getItem('gemini-api-key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    sessionStorage.setItem('gemini-api-key', key);
    setIsModalOpen(false);
  };

  const handleAnalyze = useCallback(async (data: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeBillingData(data, apiKey);
      setAnalysisResult(result);
    } catch (err) {
      setError('Failed to analyze billing data. Please check your API key and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <CostAnalysis 
          onAnalyze={handleAnalyze} 
          initialData={SAMPLE_BILLING_DATA} 
          isLoading={isLoading}
          apiKeyIsSet={!!apiKey}
          onSetApiKey={() => setIsModalOpen(true)}
        />
        
        {isLoading && <div className="flex justify-center items-center h-96"><LoadingSpinner /></div>}
        {error && <ErrorDisplay message={error} />}

        {!isLoading && !error && analysisResult && (
          <div className="mt-8 space-y-8">
            <MetricsDashboard 
              totalSpend={analysisResult.totalSpend}
              potentialSavings={analysisResult.potentialSavings}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Recommendations recommendations={analysisResult.recommendations} />
              </div>
              <div className="space-y-8">
                <CostVisuals 
                  breakdownData={analysisResult.costBreakdown}
                  forecastData={analysisResult.forecast}
                />
                <Alerts totalSpend={analysisResult.totalSpend} />
              </div>
            </div>
          </div>
        )}
      </main>
      <ApiKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveApiKey}
        currentKey={apiKey}
      />
    </div>
  );
}

export default App;