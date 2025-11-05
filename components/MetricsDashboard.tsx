import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { AnalysisResult, ForecastDataPoint } from '../types';

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
        const dataPoint = payload[0];
        const value = dataPoint.value;
        const name = dataPoint.name || 'Cost';
      return (
        <div className="p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-lg">
          <p className="font-bold capitalize">{label}</p>
          <p style={{ color: dataPoint.color || dataPoint.stroke || dataPoint.fill }}>
              {`${name}: $${value.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
};

const generateGranularData = (service: string, totalCost: number): { name: string; cost: number }[] => {
    const normalizeCosts = (items: { name: string; cost: number }[]) => {
      const currentTotal = items.reduce((sum, item) => sum + item.cost, 0);
      const scale = totalCost / currentTotal;
      return items.map(item => ({ ...item, cost: Math.round(item.cost * scale) }));
    };

    switch (service.toLowerCase()) {
      case 'compute':
        return normalizeCosts([
          { name: 'VM Instances', cost: totalCost * 0.6 },
          { name: 'Kubernetes Engine', cost: totalCost * 0.3 },
          { name: 'Serverless', cost: totalCost * 0.1 },
        ]);
      case 'storage':
        return normalizeCosts([
          { name: 'Cloud Storage', cost: totalCost * 0.7 },
          { name: 'Persistent Disk', cost: totalCost * 0.25 },
          { name: 'Archives', cost: totalCost * 0.05 },
        ]);
      case 'network':
        return normalizeCosts([
          { name: 'Egress Traffic', cost: totalCost * 0.5 },
          { name: 'Load Balancing', cost: totalCost * 0.3 },
          { name: 'Cloud CDN', cost: totalCost * 0.2 },
        ]);
      case 'other':
        return normalizeCosts([
          { name: 'BigQuery', cost: totalCost * 0.4 },
          { name: 'Logging & Monitoring', cost: totalCost * 0.3 },
          { name: 'Cloud SQL', cost: totalCost * 0.3 },
        ]);
      default:
        return [{ name: 'General Usage', cost: totalCost }];
    }
};

const generateForecastData = (currentCost: number): ForecastDataPoint[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIndex = new Date().getMonth();
    const forecast: ForecastDataPoint[] = [];
    let lastCost = currentCost;
    const baseGrowthRate = 1.02; // A steady 2% month-over-month growth assumption
  
    for (let i = 1; i <= 3; i++) {
        const monthIndex = (currentMonthIndex + i) % 12;
        
        // Simulate realistic volatility by adding a random variation (-1.5% to +1.5%) to the base growth rate
        const randomVariation = (Math.random() - 0.5) * 0.03; // A number between -0.015 and 0.015
        const monthlyGrowth = baseGrowthRate + randomVariation;
        
        // Calculate the next month's predicted cost
        lastCost *= monthlyGrowth;

        forecast.push({
            month: months[monthIndex],
            predictedCost: Math.round(lastCost),
        });
    }
    return forecast;
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  
  const breakdownData = Object.entries(result.breakdown).map(([service, cost]) => ({
    name: service,
    cost,
  }));

  const forecastData = generateForecastData(result.currentCost);

  const handleBarClick = (data: any) => {
    if (data && data.activeLabel) {
      setSelectedService(data.activeLabel);
    }
  };

  const selectedServiceData = selectedService 
    ? breakdownData.find(d => d.name === selectedService) 
    : null;
    
  const granularData = selectedServiceData 
    ? generateGranularData(selectedServiceData.name, selectedServiceData.cost)
    : [];

  return (
    <div className="space-y-8">
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
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
          <ul className="space-y-4">
            {result.recommendations.map((rec, index) => (
              <li key={index} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow-sm transition-shadow hover:shadow-md">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-grow">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100">{rec.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{rec.description}</p>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">~${rec.estimatedSavings.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">/ month</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">3-Month Cost Forecast</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={forecastData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="month" tick={{ fill: '#9ca3af' }} axisLine={{ stroke: '#374151' }} tickLine={{ stroke: '#374151' }} />
                    <YAxis tick={{ fill: '#9ca3af' }} axisLine={{ stroke: '#374151' }} tickLine={{ stroke: '#374151' }} tickFormatter={(value) => `$${(Number(value) / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569' }} />
                    <Legend wrapperStyle={{ color: '#9ca3af' }}/>
                    <Line type="monotone" dataKey="predictedCost" name="Predicted Cost" stroke="#8884d8" strokeWidth={2} dot={{ r: 4, fill: '#8884d8' }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
            {!selectedService ? (
                 <div className="animate-fade-in">
                    <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Cost Breakdown</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 -mt-2">Click a bar to see details</p>
                    <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={breakdownData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }} onClick={handleBarClick}>
                        <XAxis type="number" tick={{ fill: '#64748b' }} axisLine={{ stroke: '#374151' }} tickLine={{ stroke: '#374151' }} />
                        <YAxis dataKey="name" type="category" width={80} tick={{ fill: '#9ca3af', textTransform: 'capitalize' }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(203, 213, 225, 0.1)' }} />
                        <Bar dataKey="cost" fill="#3b82f6" name="Cost" style={{cursor: 'pointer'}} />
                        </BarChart>
                    </ResponsiveContainer>
                    </div>
                </div>
            ) : (
                <div className="animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white capitalize">{selectedService} Details</h3>
                        <button onClick={() => setSelectedService(null)} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                            &larr; Back
                        </button>
                    </div>
                    <ul className="space-y-4">
                        {granularData.map(item => (
                            <li key={item.name}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-slate-600 dark:text-slate-300">{item.name}</span>
                                    <span className="text-sm font-medium text-slate-800 dark:text-slate-100">${item.cost.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(item.cost / selectedServiceData.cost) * 100}%` }}></div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;