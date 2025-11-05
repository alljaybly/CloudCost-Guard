
import React, { useState, useCallback, useEffect } from 'react';
import { AnalysisResult } from './types';
import { DEMO_DATASETS, SAMPLE_BILLING_DATA } from './constants';
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

type ErrorState = {
  message: string;
  severity: 'error' | 'warning';
} | null;

function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>(DEMO_DATASETS.DEFAULT);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorState>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
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
      const response = await analyzeBillingData(data, apiKey);
      setAnalysisResult(response.result);

      if (response.source === 'demo' && !!apiKey) {
        setError({
          message: 'Could not get a live analysis from the AI due to a response formatting issue. Displaying relevant demo data instead.',
          severity: 'warning'
        });
      }
    } catch (err) {
      setError({
        message: 'Failed to analyze billing data. Please check your API key and network connection, then try again.',
        severity: 'error'
      });
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
        {error && <ErrorDisplay message={error.message} severity={error.severity} />}

        {!isLoading && analysisResult && (
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
