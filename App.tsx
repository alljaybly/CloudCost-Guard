import React, { useState, useCallback, useEffect } from 'react';
import { AnalysisResult, Recommendation } from './types';
import { analyzeBillingData } from './services/geminiService';
import Header from './components/Header';
import CostAnalysis from './components/CostAnalysis';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import ApiKeyModal from './components/ApiKeyModal';
import RealTimeAlerts from './components/Alerts';
import ResultsDisplay from './components/MetricsDashboard';

const STORAGE_KEYS = {
  API_KEY: 'cloudcost_api_key',
};

const DEFAULT_BILLING_DATA = `Service,Cost
Compute Engine VM instances,$4847.00
Cloud Storage buckets,$3250.00
Network egress bandwidth,$5620.00
Small test workload,$2100.00
`;

// Initial default result to show on first load
const INITIAL_ANALYSIS_RESULT: AnalysisResult = {
    currentCost: 6850,
    optimizedCost: 3120,
    savings: 3730,
    recommendations: [
      { title: 'Automated Resource Scheduling', description: 'Automatically shut down non-production resources during off-hours to reduce idle costs.', estimatedSavings: 1500 },
      { title: 'Migrate to Cloud Run', description: 'For containerized, stateless workloads, migrating from VMs to serverless Cloud Run can lower costs and improve scalability.', estimatedSavings: 1200 },
      { title: 'Use Sustained/Committed Discounts', description: 'Leverage Google\'s automatic sustained use discounts or purchase committed use discounts for predictable workloads.', estimatedSavings: 1030 }
    ],
    breakdown: { compute: 3800, storage: 1650, network: 1200, other: 200 }
};


type ErrorState = {
  message: string;
  severity: 'error' | 'warning';
} | null;

function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>(INITIAL_ANALYSIS_RESULT);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorState>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [billingData, setBillingData] = useState<string>(DEFAULT_BILLING_DATA);

  useEffect(() => {
    const storedKey = sessionStorage.getItem(STORAGE_KEYS.API_KEY);
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    sessionStorage.setItem(STORAGE_KEYS.API_KEY, key);
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
          message: 'Could not get a live analysis from the AI. This could be due to an invalid API key, network issue, or a malformed response. Displaying relevant demo data instead.',
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
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        <RealTimeAlerts currentSpend={analysisResult.currentCost} />
        
        <CostAnalysis 
          onAnalyze={handleAnalyze} 
          billingData={billingData}
          setBillingData={setBillingData}
          isLoading={isLoading}
          apiKeyIsSet={!!apiKey}
          onSetApiKey={() => setIsModalOpen(true)}
        />
        
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {error && <ErrorDisplay message={error.message} severity={error.severity} />}
            {analysisResult && <ResultsDisplay result={analysisResult} />}
          </>
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