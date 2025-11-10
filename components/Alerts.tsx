import React, { useState, useEffect } from 'react';
import { AlertSettings, AlertStatus, Currency } from '../types';

const STORAGE_KEYS = {
  ALERT_SETTINGS: 'cloudcost_alert_settings',
};

// Type for temporary form state that holds strings from inputs
type TempSettings = {
    [K in keyof AlertSettings]: string;
};

// Type for validation error state, including which fields are invalid
type ValidationError = {
  fields: Array<keyof AlertSettings>;
  message: string;
} | null;

const loadSettings = (): AlertSettings => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ALERT_SETTINGS);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validate the loaded settings to ensure they are in a good state
      if (typeof parsed.budget === 'number' && parsed.budget > 0 &&
          typeof parsed.warningThreshold === 'number' && parsed.warningThreshold > 0 && parsed.warningThreshold < 100 &&
          typeof parsed.criticalThreshold === 'number' && parsed.criticalThreshold > 0 && parsed.criticalThreshold <= 100 &&
          parsed.warningThreshold < parsed.criticalThreshold) {
        console.log('✅ Loaded settings from localStorage:', parsed);
        return parsed;
      }
    }
  } catch (error) {
    console.error("❌ Error loading settings:", error);
  }
  // Return defaults if nothing is saved or the data is invalid
  return { budget: 5000, warningThreshold: 70, criticalThreshold: 90 };
};

interface RealTimeAlertsProps {
  currentSpend: number;
  currency: Currency;
}

const RealTimeAlerts: React.FC<RealTimeAlertsProps> = ({ currentSpend, currency }) => {
  const [settings, setSettings] = useState<AlertSettings>(loadSettings);
  const [tempSettings, setTempSettings] = useState<TempSettings>({
    budget: String(settings.budget),
    warningThreshold: String(settings.warningThreshold),
    criticalThreshold: String(settings.criticalThreshold),
  });
  const [validationError, setValidationError] = useState<ValidationError>(null);
  const [lastChecked, setLastChecked] = useState(new Date());

  // Auto-refresh mechanism to re-evaluate alerts periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      setLastChecked(new Date());
    }, 60000); // 60 seconds

    return () => clearInterval(intervalId);
  }, []);

  // Auto-save settings with a debounce when inputs change
  useEffect(() => {
    // Clear previous validation errors on new input
    setValidationError(null);

    const handler = setTimeout(() => {
      const budget = Number(tempSettings.budget);
      const warningThreshold = Number(tempSettings.warningThreshold);
      const criticalThreshold = Number(tempSettings.criticalThreshold);
      
      const emptyFields = Object.keys(tempSettings).filter(key => tempSettings[key as keyof TempSettings] === '') as (keyof AlertSettings)[];
      if (emptyFields.length > 0) {
        setValidationError({ fields: emptyFields, message: "All fields are required." });
        return;
      }
      
      if (isNaN(budget) || budget <= 0) {
        setValidationError({ fields: ['budget'], message: 'Budget must be a positive number.' });
        return;
      }
      if (isNaN(warningThreshold) || warningThreshold < 1 || warningThreshold >= 100) {
        setValidationError({ fields: ['warningThreshold'], message: 'Warning threshold must be between 1 and 99.' });
        return;
      }
      if (isNaN(criticalThreshold) || criticalThreshold < 1 || criticalThreshold > 100) {
          setValidationError({ fields: ['criticalThreshold'], message: 'Critical threshold must be between 1 and 100.' });
          return;
      }
      if (warningThreshold >= criticalThreshold) {
        setValidationError({ fields: ['warningThreshold', 'criticalThreshold'], message: 'Warning threshold must be less than critical threshold.' });
        return;
      }

      // If validation passes, create new settings object
      const newSettings: AlertSettings = { budget, warningThreshold, criticalThreshold };

      // Only update state and localStorage if the values have actually changed
      if(JSON.stringify(newSettings) !== JSON.stringify(settings)) {
        setSettings(newSettings);
        try {
          localStorage.setItem(STORAGE_KEYS.ALERT_SETTINGS, JSON.stringify(newSettings));
          console.log('✅ Settings auto-saved to localStorage:', newSettings);
        } catch (error) {
          console.error('❌ Failed to auto-save settings:', error);
          setValidationError({ fields: [], message: 'Could not save settings to local storage.' });
        }
      }
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [tempSettings, settings]);

  // Calculate alert status on every render to ensure it's always up-to-date
  const progressPercentage = settings.budget > 0 ? (currentSpend / settings.budget) * 100 : 0;
  let alertStatus: AlertStatus;
  if (progressPercentage >= settings.criticalThreshold) {
    alertStatus = { level: 'critical', color: '#ef4444', message: '🚨 Critical: Budget exceeded!' };
  } else if (progressPercentage >= settings.warningThreshold) {
    alertStatus = { level: 'warning', color: '#f97316', message: '⚠️ Warning: Approaching budget limit' };
  } else {
    alertStatus = { level: 'normal', color: '#22c55e', message: '✅ Budget on track' };
  }

  const handleInputChange = (field: keyof AlertSettings, value: string) => {
    setTempSettings((prev) => ({ ...prev, [field]: value }));
  };

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(progressPercentage, 100) / 100) * circumference;

  const getInputClassName = (field: keyof AlertSettings): string => {
    const baseClasses = "mt-1 block w-full p-2 bg-slate-100 dark:bg-slate-700 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500";
    const errorClasses = "border-red-500 dark:border-red-500";
    const normalClasses = "border-slate-300 dark:border-slate-600";
    
    return `${baseClasses} ${validationError?.fields.includes(field) ? errorClasses : normalClasses}`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Real-Time Budget Alerts</h3>
        <div 
          className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400" 
          title={`Alerts automatically refresh every 60 seconds. Last refresh: ${lastChecked.toLocaleTimeString()}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span>Auto-refresh enabled</span>
        </div>
      </div>
      <div className={`p-4 rounded-lg mb-4 text-center text-white font-bold transition-colors`} style={{ backgroundColor: alertStatus.color }}>
        {alertStatus.message}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="relative flex justify-center items-center">
          <svg className="w-52 h-52 transform -rotate-90" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r={radius} strokeWidth="12" className="stroke-slate-200 dark:stroke-slate-700" fill="none" />
            <circle
              cx="100"
              cy="100"
              r={radius}
              strokeWidth="12"
              stroke={alertStatus.color}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500 ease-in-out"
            />
          </svg>
          <div className="absolute text-center">
            <div className="text-4xl font-bold text-slate-900 dark:text-white" style={{fontVariantNumeric: 'tabular-nums'}}>
              {progressPercentage.toFixed(1)}%
            </div>
            <div className="text-slate-500 dark:text-slate-400">
              {currency.symbol}{currentSpend.toLocaleString()} / {currency.symbol}{settings.budget.toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Monthly Budget ({currency.code})</label>
            <input
              type="number"
              id="budget"
              value={tempSettings.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              className={getInputClassName('budget')}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="warningThreshold" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Warning (%)</label>
              <input
                type="number"
                id="warningThreshold"
                min="1" max="99"
                value={tempSettings.warningThreshold}
                onChange={(e) => handleInputChange('warningThreshold', e.target.value)}
                className={getInputClassName('warningThreshold')}
              />
            </div>
            <div>
              <label htmlFor="criticalThreshold" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Critical (%)</label>
              <input
                type="number"
                id="criticalThreshold"
                min="2" max="100"
                value={tempSettings.criticalThreshold}
                onChange={(e) => handleInputChange('criticalThreshold', e.target.value)}
                className={getInputClassName('criticalThreshold')}
              />
            </div>
          </div>
           <div className="h-5 text-right">
            {validationError ? (
              <p className="text-red-500 text-sm font-medium" role="alert">{validationError.message}</p>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-sm" role="status">Changes are saved automatically.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeAlerts;