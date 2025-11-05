import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { AnalysisResult } from '../types';

interface ResultsDisplayProps {
  result: AnalysisResult;
}

const MetricCard: React.FC<{ title: string; value: string; color: string }> = ({ title, value, color }) => (
    <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-lg">
          <p className="font-bold capitalize">{label}</p>
          <p className="text-blue-500">{`Cost: $${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const breakdownData = Object.entries(result.breakdown).map(([service, cost]) => ({
    name: service,
    cost,
  }));

  return (
    <div className="space-y-8">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Current Monthly Cost" value={`$${result.currentCost.toLocaleString()}`} color="text-red-500" />
        <MetricCard title="Optimized Monthly Cost" value={`$${result.optimizedCost.toLocaleString()}`} color="text-green-500" />
        <MetricCard title="Total Potential Savings" value={`$${result.savings.toLocaleString()}`} color="text-blue-500" />
      </div>

      {/* Recommendations & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Actionable Recommendations</h3>
          <ul className="space-y-3 list-disc list-inside text-slate-600 dark:text-slate-300">
            {result.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Cost Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdownData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <XAxis type="number" tick={{ fill: '#64748b' }} axisLine={{ stroke: '#374151' }} tickLine={{ stroke: '#374151' }} />
                <YAxis dataKey="name" type="category" width={80} tick={{ fill: '#9ca3af', textTransform: 'capitalize' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(203, 213, 225, 0.1)' }} />
                <Bar dataKey="cost" fill="#3b82f6" name="Cost" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
