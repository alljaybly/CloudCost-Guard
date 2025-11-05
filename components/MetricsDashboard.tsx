
import React from 'react';

interface MetricCardProps {
    title: string;
    value: string;
    description: string;
    icon: React.ReactNode;
    colorClass: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, icon, colorClass }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md flex items-start space-x-4">
        <div className={`p-3 rounded-full ${colorClass}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
        </div>
    </div>
);


interface MetricsDashboardProps {
  totalSpend: number;
  potentialSavings: number;
}

const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ totalSpend, potentialSavings }) => {
  const savingsPercentage = totalSpend > 0 ? ((potentialSavings / totalSpend) * 100).toFixed(0) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <MetricCard 
        title="Total Monthly Spend"
        value={`$${totalSpend.toLocaleString()}`}
        description="Current estimated monthly cost."
        icon={<DollarIcon />}
        colorClass="bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400"
      />
      <MetricCard 
        title="Identified Savings"
        value={`$${potentialSavings.toLocaleString()}`}
        description="Actionable savings found by AI."
        icon={<SparklesIcon />}
        colorClass="bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400"
      />
      <MetricCard 
        title="Optimization Potential"
        value={`${savingsPercentage}%`}
        description="Potential reduction in monthly spend."
        icon={<ChartBarIcon />}
        colorClass="bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
      />
    </div>
  );
};

// Icons
const DollarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
  </svg>
);
const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m11-4.08V12a3 3 0 00-3-3h-1.08M17 12a3 3 0 013 3v1.08M9 3.08V7a3 3 0 01-3 3H4.92M9 7a3 3 0 003-3V3.08" />
  </svg>
);
const ChartBarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

export default MetricsDashboard;
