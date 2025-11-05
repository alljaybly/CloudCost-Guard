import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Alert } from '../types';

interface AlertsProps {
  totalSpend: number;
}

const WarningIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const CriticalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9a1 1 0 012 0v4a1 1 0 11-2 0V9zm1-4a1 1 0 110-2 1 1 0 010 2z" clipRule="evenodd" />
    </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const AlertItem: React.FC<{ alert: Alert; onDismiss: (id: number) => void }> = ({ alert, onDismiss }) => {
  const isCritical = alert.level === 'critical';
  const bgColor = isCritical ? 'bg-red-100 dark:bg-red-500/20' : 'bg-yellow-100 dark:bg-yellow-500/20';
  const iconColor = isCritical ? 'text-red-500' : 'text-yellow-500';
  const borderColor = isCritical ? 'border-red-500' : 'border-yellow-500';

  return (
    <div className={`relative flex items-start p-3 pr-8 rounded-md border-l-4 ${borderColor} ${bgColor}`}>
      <div className={`flex-shrink-0 ${iconColor}`}>
        {isCritical ? <CriticalIcon /> : <WarningIcon />}
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{alert.message}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{alert.timestamp}</p>
      </div>
       <button
        onClick={() => onDismiss(alert.id)}
        className="absolute top-1/2 right-2 -translate-y-1/2 p-1 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        aria-label={`Dismiss alert: ${alert.message}`}
      >
        <XIcon />
      </button>
    </div>
  );
};


const Alerts: React.FC<AlertsProps> = ({ totalSpend }) => {
  const [budget, setBudget] = useState(5000);
  const [warningThreshold, setWarningThreshold] = useState(50);
  const [criticalThreshold, setCriticalThreshold] = useState(90);

  const [budgetInput, setBudgetInput] = useState(String(budget));
  const [warningThresholdInput, setWarningThresholdInput] = useState(String(warningThreshold));
  const [criticalThresholdInput, setCriticalThresholdInput] = useState(String(criticalThreshold));
  
  const [alertHistory, setAlertHistory] = useState<Alert[]>([]);
  const [draggingHandle, setDraggingHandle] = useState<'warning' | 'critical' | null>(null);
  const [hoveredHandle, setHoveredHandle] = useState<'warning' | 'critical' | null>(null);
  const [isBarHovered, setIsBarHovered] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const spendPercentage = budget > 0 ? (totalSpend / budget) * 100 : 0;
  
  let progressBarColor = 'bg-green-500';
  if (spendPercentage >= criticalThreshold) {
    progressBarColor = 'bg-red-500';
  } else if (spendPercentage >= warningThreshold) {
    progressBarColor = 'bg-yellow-500';
  }

  useEffect(() => {
    let latestAlert: Alert | null = null;
    if (spendPercentage >= criticalThreshold) {
      latestAlert = { id: Date.now(), level: 'critical', message: `Budget usage is at ${spendPercentage.toFixed(0)}%, exceeding the critical threshold of ${criticalThreshold}%.`, timestamp: new Date().toLocaleString() };
    } else if (spendPercentage >= warningThreshold) {
      latestAlert = { id: Date.now(), level: 'warning', message: `Budget usage is at ${spendPercentage.toFixed(0)}%, exceeding the warning threshold of ${warningThreshold}%.`, timestamp: new Date().toLocaleString() };
    }
    
    if (latestAlert) {
      setAlertHistory(prev => (prev[0]?.message === latestAlert?.message) ? prev : [latestAlert, ...prev].slice(0, 5));
    }
  }, [totalSpend, budget, warningThreshold, criticalThreshold, spendPercentage]);

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const newBudget = parseInt(budgetInput, 10);
    const newWarning = parseInt(warningThresholdInput, 10);
    const newCritical = parseInt(criticalThresholdInput, 10);
    
    if (!isNaN(newBudget) && newBudget > 0 && !isNaN(newWarning) && newWarning > 0 && newWarning < 100 && !isNaN(newCritical) && newCritical > 0 && newCritical <= 100 && newWarning < newCritical) {
      setBudget(newBudget);
      setWarningThreshold(newWarning);
      setCriticalThreshold(newCritical);
    } else {
        setBudgetInput(String(budget));
        setWarningThresholdInput(String(warningThreshold));
        setCriticalThresholdInput(String(criticalThreshold));
    }
  };

  const handleDragMove = useCallback((event: MouseEvent | TouchEvent) => {
    if (!draggingHandle || !progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const offsetX = clientX - rect.left;
    const percentage = Math.round(Math.max(0, Math.min(100, (offsetX / rect.width) * 100)));

    if (draggingHandle === 'warning') {
        const newWarning = Math.min(percentage, criticalThreshold - 1);
        setWarningThreshold(newWarning);
        setWarningThresholdInput(String(newWarning));
    } else if (draggingHandle === 'critical') {
        const newCritical = Math.max(percentage, warningThreshold + 1);
        setCriticalThreshold(newCritical);
        setCriticalThresholdInput(String(newCritical));
    }
  }, [draggingHandle, criticalThreshold, warningThreshold]);

  const handleDragEnd = useCallback(() => {
    setDraggingHandle(null);
  }, []);

  useEffect(() => {
    if (draggingHandle) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('touchmove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchend', handleDragEnd);
    }
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [draggingHandle, handleDragMove, handleDragEnd]);
  
  const handleClearHistory = () => setAlertHistory([]);
  const handleDismissAlert = (id: number) => setAlertHistory(prev => prev.filter(alert => alert.id !== id));
  
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Real-time Alerts</h3>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          <span>{`$${totalSpend.toLocaleString()} / $${budget.toLocaleString()}`}</span>
          <span className="font-bold">{`${spendPercentage.toFixed(1)}%`}</span>
        </div>
        <div
          ref={progressBarRef}
          className="relative w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 cursor-pointer"
          onMouseEnter={() => setIsBarHovered(true)}
          onMouseLeave={() => setIsBarHovered(false)}
        >
          <div className="absolute top-0 left-0 h-full bg-green-500 rounded-l-full" style={{ width: `${warningThreshold}%` }}></div>
          <div className="absolute top-0 h-full bg-yellow-500" style={{ left: `${warningThreshold}%`, width: `${criticalThreshold - warningThreshold}%` }}></div>
          <div className="absolute top-0 h-full bg-red-500 rounded-r-full" style={{ left: `${criticalThreshold}%`, width: `${100 - criticalThreshold}%` }}></div>
          <div
            className={`absolute top-0 left-0 h-4 rounded-full transition-all duration-500 ease-out border-2 border-white dark:border-slate-900 ${progressBarColor}`}
            style={{ width: `${Math.min(spendPercentage, 100)}%` }}
            role="progressbar" aria-valuenow={spendPercentage} aria-valuemin={0} aria-valuemax={100}
          ></div>
          
          {isBarHovered && !draggingHandle && !hoveredHandle && (
            <div
              className="absolute bottom-full mb-2 p-2 text-xs text-white bg-slate-800 dark:bg-slate-900 rounded-md shadow-lg whitespace-nowrap"
              style={{
                left: `${Math.min(spendPercentage, 100)}%`,
                transform: 'translateX(-50%)',
                pointerEvents: 'none',
              }}
            >
              <div className="font-bold text-center">{`${spendPercentage.toFixed(1)}%`}</div>
              <div className="text-slate-300">{`$${totalSpend.toLocaleString()} of $${budget.toLocaleString()}`}</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800 dark:border-t-slate-900"></div>
            </div>
          )}

          {/* Handle Tooltips */}
          {(draggingHandle === 'warning' || hoveredHandle === 'warning') && (
            <div className="absolute bottom-full mb-2 p-1 px-2 text-xs font-semibold text-white bg-slate-800 dark:bg-slate-900 rounded-md shadow-lg pointer-events-none" style={{ left: `${warningThreshold}%`, transform: 'translateX(-50%)' }}>
              {warningThreshold}%
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800 dark:border-t-slate-900"></div>
            </div>
          )}
          {(draggingHandle === 'critical' || hoveredHandle === 'critical') && (
            <div className="absolute bottom-full mb-2 p-1 px-2 text-xs font-semibold text-white bg-slate-800 dark:bg-slate-900 rounded-md shadow-lg pointer-events-none" style={{ left: `${criticalThreshold}%`, transform: 'translateX(-50%)' }}>
              {criticalThreshold}%
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800 dark:border-t-slate-900"></div>
            </div>
          )}

          {/* Draggable Handles */}
          <div
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-slate-300 rounded-full border-2 border-yellow-500 cursor-ew-resize z-10 transition-transform ${draggingHandle === 'warning' ? 'scale-125 shadow-lg' : 'shadow-md'}`}
              style={{ left: `${warningThreshold}%` }}
              onMouseDown={(e) => { e.preventDefault(); setDraggingHandle('warning'); }}
              onTouchStart={(e) => { e.preventDefault(); setDraggingHandle('warning'); }}
              onMouseEnter={() => setHoveredHandle('warning')}
              onMouseLeave={() => setHoveredHandle(null)}
          />
          <div
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-slate-300 rounded-full border-2 border-red-500 cursor-ew-resize z-10 transition-transform ${draggingHandle === 'critical' ? 'scale-125 shadow-lg' : 'shadow-md'}`}
              style={{ left: `${criticalThreshold}%` }}
              onMouseDown={(e) => { e.preventDefault(); setDraggingHandle('critical'); }}
              onTouchStart={(e) => { e.preventDefault(); setDraggingHandle('critical'); }}
              onMouseEnter={() => setHoveredHandle('critical')}
              onMouseLeave={() => setHoveredHandle(null)}
          />
        </div>
      </div>
      
      <form onSubmit={handleUpdateSettings} className="mb-6 space-y-4">
        <div>
          <label htmlFor="budget-input" className="block text-sm font-medium text-slate-600 dark:text-slate-400">Monthly Budget</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center"><span className="text-gray-500 sm:text-sm">$</span></div>
            <input id="budget-input" type="number" value={budgetInput} onChange={(e) => setBudgetInput(e.target.value)}
                className="w-full pl-7 p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="5000" aria-label="Set monthly budget" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="warning-threshold" className="block text-sm font-medium text-slate-600 dark:text-slate-400">Warning (%)</label>
            <input id="warning-threshold" type="number" min="1" max="99" value={warningThresholdInput}
              onChange={(e) => setWarningThresholdInput(e.target.value)}
              className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" aria-label="Set warning threshold" />
          </div>
          <div>
            <label htmlFor="critical-threshold" className="block text-sm font-medium text-slate-600 dark:text-slate-400">Critical (%)</label>
            <input id="critical-threshold" type="number" min="2" max="100" value={criticalThresholdInput}
              onChange={(e) => setCriticalThresholdInput(e.target.value)}
              className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" aria-label="Set critical threshold" />
          </div>
        </div>
        <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-slate-400 transition-colors">Update Settings</button>
        </div>
      </form>

      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-md font-semibold text-slate-800 dark:text-slate-200">Alert History</h4>
          {alertHistory.length > 0 && (
            <button onClick={handleClearHistory} className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 dark:bg-blue-500/20 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-500/30" aria-label="Clear alert history">Clear All</button>
          )}
        </div>
        <div className="space-y-3">
          {alertHistory.length > 0 ? (
            alertHistory.map(alert => <AlertItem key={alert.id} alert={alert} onDismiss={handleDismissAlert} />)
          ) : (
            <p className="text-sm text-center text-slate-500 dark:text-slate-400 py-4">No active alerts. The alert history will appear here.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;