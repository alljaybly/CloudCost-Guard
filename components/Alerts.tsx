import React, { useState, useEffect, useMemo } from 'react';
import { AlertSettings, AlertStatus } from '../types';

const STORAGE_KEYS = {
  ALERT_SETTINGS: 'cloudcost_alert_settings',
};

// Type for temporary form state that holds strings from inputs
type TempSettings = {
    [K in keyof AlertSettings]: string;
};

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
}

const RealTimeAlerts: React.FC<RealTimeAlertsProps> = ({ currentSpend }) => {
  const [settings, setSettings] = useState<AlertSettings>(loadSettings);
  const [tempSettings, setTempSettings] = useState<TempSettings>({
    budget: String(settings.budget),
    warningThreshold: String(settings.warningThreshold),
    criticalThreshold: String(settings.criticalThreshold),
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  // Auto-save settings with a debounce when inputs change
  useEffect(() => {
    // Clear previous validation errors on new input
    setValidationError(null);

    const handler = setTimeout(() => {
      const budget = Number(tempSettings.budget);
      const warningThreshold = Number(tempSettings.warningThreshold);
      const criticalThreshold = Number(tempSettings.criticalThreshold);
      
      if (tempSettings.budget === '' || tempSettings.warningThreshold === '' || tempSettings.criticalThreshold === '') {
        setValidationError("All fields are required.");
        return;
      }
      
      if (isNaN(budget) || budget <= 0) {
        setValidationError('Budget must be a positive number.');
        return;
      }
      if (isNaN(warningThreshold) || warningThreshold < 1 || warningThreshold >= 100) {
        setValidationError('Warning threshold must be between 1 and 99.');
        return;
      }
      if (isNaN(criticalThreshold) || criticalThreshold < 1 || criticalThreshold > 100) {
          setValidationError('Critical threshold must be between 1 and 100.');
          return;
      }
      if (warningThreshold >= criticalThreshold) {
        setValidationError('Warning threshold must be less than critical threshold.');
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
          setValidationError('Could not save settings to local storage.');
        }
      }
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [tempSettings, settings]);

  const { progressPercentage, alertStatus } = useMemo(() => {
    const percentage = settings.budget > 0 ? (currentSpend / settings.budget) * 100 : 0;
    let status: AlertStatus;
    if (percentage >= settings.criticalThreshold) {
      status = { level: 'critical', color: '#ef4444', message: '🚨 Critical: Budget exceeded!' };
    } else if (percentage >= settings.warningThreshold) {
      status = { level: 'warning', color: '#f97316', message: '⚠️ Warning: Approaching budget limit' };
    } else {
      status = { level: 'normal', color: '#22c55e', message: '✅ Budget on track' };
    }
    return { progressPercentage: percentage, alertStatus: status };
  }, [currentSpend, settings]);

  const handleInputChange = (field: keyof AlertSettings, value: string) => {
    setTempSettings((prev) => ({ ...prev, [field]: value }));
  };

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(progressPercentage, 100) / 100) * circumference;

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Real-Time Budget Alerts</h3>
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
              ${currentSpend.toLocaleString()} / ${settings.budget.toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Monthly Budget ($)</label>
            <input
              type="number"
              id="budget"
              value={tempSettings.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              className="mt-1 block w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                className="mt-1 block w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                className="mt-1 block w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
           <div className="h-5 text-right">
            {validationError ? (
              <p className="text-red-500 text-sm font-medium" role="alert">{validationError}</p>
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