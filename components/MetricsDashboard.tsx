
import React, { useState, useEffect, useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Legend, Area } from 'recharts';
import { AnalysisResult, ForecastDataPoint, Recommendation, Currency } from '../types';
import { formatCurrency } from '../utils/currencyUtils';

interface ResultsDisplayProps {
  result: AnalysisResult;
  currency: Currency;
}

const MetricCard: React.FC<{ title: string; value: string; color: string }> = ({ title, value, color }) => (
    <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
);

const CustomTooltip = ({ active, payload, label, currency }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-lg text-left">
          <p className="font-bold capitalize mb-1">{label}</p>
          <p className="text-sm" style={{ color: '#8884d8' }}>
              Predicted Cost: {formatCurrency(data.predictedCost, currency)}
          </p>
          <p className="text-xs" style={{ color: '#8884d8', opacity: 0.7 }}>
              Est. Range: {formatCurrency(data.lowerBound, currency)} - {formatCurrency(data.upperBound, currency)}
          </p>
        </div>
      );
    }
    return null;
};

const BreakdownTooltip = ({ active, payload, label, totalCost, totalLabel, currency }: any) => {
    if (active && payload && payload.length) {
        const dataPoint = payload[0];
        const value = Number(dataPoint.value);

        if (isNaN(value)) {
            return null;
        }

        const percentage = totalCost > 0 ? ((value / totalCost) * 100).toFixed(1) : '0.0';

        return (
            <div className="p-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg">
              <p className="text-sm font-bold capitalize mb-1">{label}</p>
              <p className="text-lg font-semibold" style={{ color: dataPoint.fill }}>
                  {formatCurrency(value, currency)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {percentage}% of {totalLabel}
              </p>
            </div>
        );
    }
    return null;
};

const ThumbsUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333V17a1 1 0 001 1h6.364a1 1 0 00.949-.684l2.158-6.474A1 1 0 0015.472 9H12V5.5A2.5 2.5 0 009.5 3h-1A1.5 1.5 0 007 4.5v5.833z" />
    </svg>
);
  
const ThumbsDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667V3a1 1 0 00-1-1h-6.364a1 1 0 00-.949.684L3.528 9H6v4.5A2.5 2.5 0 008.5 16h1a1.5 1.5 0 001.5-1.5v-5.833z" />
    </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 9.707a1 1 0 011.414 0L9 11.086V3a1 1 0 112 0v8.086l1.293-1.379a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const SearchIcon = () => (
    <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
);

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
        
        const randomVariation = (Math.random() - 0.5) * 0.03;
        const monthlyGrowth = baseGrowthRate + randomVariation;
        
        lastCost *= monthlyGrowth;

        const predictedCost = Math.round(lastCost);
        // +/- 10% confidence interval
        const lowerBound = Math.round(predictedCost * 0.9);
        const upperBound = Math.round(predictedCost * 1.1);

        forecast.push({
            month: months[monthIndex],
            predictedCost: predictedCost,
            lowerBound: lowerBound,
            upperBound: upperBound,
            confidenceRange: upperBound - lowerBound, // For stacking the area
        });
    }
    return forecast;
};

type SortOrder = 'default' | 'savings' | 'title';

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, currency }) => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<'pending' | 'submitted'>('pending');
  const [sortOrder, setSortOrder] = useState<SortOrder>('default');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setFeedbackState('pending');
    setSelectedService(null);
    setSortOrder('default');
    setSearchQuery('');
  }, [result]);

  const handleFeedback = () => {
    setFeedbackState('submitted');
  };
  
  const filteredAndSortedRecommendations = useMemo(() => {
    let recommendations = [...result.recommendations];

    // 1. Filter by search query
    if (searchQuery.trim() !== '') {
        const lowercasedQuery = searchQuery.toLowerCase();
        recommendations = recommendations.filter(rec =>
            rec.title.toLowerCase().includes(lowercasedQuery) ||
            rec.description.toLowerCase().includes(lowercasedQuery)
        );
    }

    // 2. Sort the filtered results
    switch (sortOrder) {
      case 'savings':
        return recommendations.sort((a, b) => b.estimatedSavings - a.estimatedSavings);
      case 'title':
        return recommendations.sort((a, b) => a.title.localeCompare(b.title));
      case 'default':
      default:
        return recommendations;
    }
  }, [result.recommendations, sortOrder, searchQuery]);


  const handleExportCsv = () => {
    if (!result) {
      return;
    }

    const escapeCsvField = (field: string | number): string => {
      const stringField = String(field);
      if (/[",\n]/.test(stringField)) {
        const escapedField = stringField.replace(/"/g, '""');
        return `"${escapedField}"`;
      }
      return stringField;
    };

    const csvRows: string[] = [];

    // 1. Summary Section
    csvRows.push('Category,Value,Unit');
    csvRows.push(`Current Monthly Cost,${escapeCsvField(result.currentCost)},${escapeCsvField(currency.code)}`);
    csvRows.push(`Optimized Monthly Cost,${escapeCsvField(result.optimizedCost)},${escapeCsvField(currency.code)}`);
    csvRows.push(`Total Potential Savings,${escapeCsvField(result.savings)},${escapeCsvField(currency.code)}`);
    csvRows.push(''); // Blank separator line

    // 2. Breakdown Section
    csvRows.push('--- Cost Breakdown ---');
    csvRows.push('Service,Cost');
    Object.entries(result.breakdown).forEach(([service, cost]) => {
      const capitalizedService = service.charAt(0).toUpperCase() + service.slice(1);
      // Fix: Argument of type 'unknown' is not assignable to parameter of type 'string | number'.
      // Cast cost to number, as Object.entries can sometimes produce an 'unknown' type for values.
      csvRows.push(`${escapeCsvField(capitalizedService)},${escapeCsvField(cost as number)}`);
    });
    csvRows.push(''); // Blank separator line

    // 3. Recommendations Section
    csvRows.push('--- Recommendations ---');
    if (result.recommendations && result.recommendations.length > 0) {
      const recHeaders = ['Title', 'Description', `Estimated Savings (${currency.code})`];
      csvRows.push(recHeaders.join(','));

      result.recommendations.forEach(rec => {
        const row = [
          escapeCsvField(rec.title),
          escapeCsvField(rec.description),
          escapeCsvField(rec.estimatedSavings),
        ];
        csvRows.push(row.join(','));
      });
    } else {
      csvRows.push('No recommendations available.');
    }

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'cost_analysis_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const breakdownData = Object.entries(result.breakdown).map(([service, cost]) => ({
    name: service,
    cost: Number(cost),
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

  const renderBreakdownTooltip = (props: any) => (
      <BreakdownTooltip {...props} totalCost={result.currentCost} totalLabel="total" currency={currency} />
  );

  const renderGranularTooltip = (props: any) => {
      if (!selectedServiceData) return null;
      return <BreakdownTooltip {...props} totalCost={selectedServiceData.cost} totalLabel={selectedServiceData.name} currency={currency} />;
  };


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
        <MetricCard title="Current Monthly Cost" value={formatCurrency(result.currentCost, currency)} color="text-red-500" />
        <MetricCard title="Optimized Monthly Cost" value={formatCurrency(result.optimizedCost, currency)} color="text-green-500" />
        <MetricCard title="Total Potential Savings" value={formatCurrency(result.savings, currency)} color="text-blue-500" />
      </div>

      {/* Recommendations & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Actionable Recommendations</h3>
                <div className="relative">
                    <label htmlFor="sort-recommendations" className="sr-only">Sort recommendations</label>
                    <select
                        id="sort-recommendations"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                        className="pl-3 pr-8 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 border border-transparent dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none cursor-pointer"
                    >
                        <option value="default">Sort by Default</option>
                        <option value="savings">Sort by Savings</option>
                        <option value="title">Sort by Title (A-Z)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            </div>
          <div className="relative mb-4">
                <label htmlFor="search-recommendations" className="sr-only">Search recommendations</label>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    id="search-recommendations"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 py-2 pl-10 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    placeholder="Filter recommendations by keyword..."
                />
            </div>
          <ul className="space-y-4">
            {filteredAndSortedRecommendations.length > 0 ? (
                 filteredAndSortedRecommendations.map((rec, index) => (
                    <li key={index} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow-sm transition-shadow hover:shadow-md animate-fade-in" style={{animationDelay: `${index * 50}ms`}}>
                        <div className="flex justify-between items-start gap-4">
                        <div className="flex-grow">
                            <h4 className="font-semibold text-slate-800 dark:text-slate-100">{rec.title}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{rec.description}</p>
                        </div>
                        <div className="text-right ml-4 flex-shrink-0">
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">~{formatCurrency(rec.estimatedSavings, currency)}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">/ month</p>
                        </div>
                        </div>
                    </li>
                ))
            ) : (
                <li className="p-4 text-center text-slate-500 dark:text-slate-400">
                    No recommendations match your search.
                </li>
            )}
          </ul>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col items-center gap-y-4">
            {feedbackState === 'pending' ? (
              <div className="animate-fade-in text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Was this analysis helpful?</p>
                <div className="flex justify-center items-center gap-x-3">
                  <button 
                    onClick={handleFeedback}
                    className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    aria-label="Helpful"
                  >
                    <ThumbsUpIcon />
                  </button>
                  <button 
                    onClick={handleFeedback} 
                    className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    aria-label="Not helpful"
                  >
                    <ThumbsDownIcon />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm font-medium text-green-600 dark:text-green-400 animate-fade-in">Thanks for your feedback!</p>
            )}

            <button
                onClick={handleExportCsv}
                className="inline-flex items-center gap-x-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                aria-label="Export recommendations to CSV"
              >
                <DownloadIcon />
                Export Full Report (CSV)
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">3-Month Cost Forecast</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={forecastData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="month" tick={{ fill: '#9ca3af' }} axisLine={{ stroke: '#374151' }} tickLine={{ stroke: '#374151' }} />
                    <YAxis
                      tick={{ fill: '#9ca3af' }}
                      axisLine={{ stroke: '#374151' }}
                      tickLine={{ stroke: '#374151' }}
                      tickFormatter={(value: any) => {
                        const num = parseFloat(String(value));
                        if (isNaN(num)) {
                          return '';
                        }
                        return `${currency.symbol}${(num / 1000).toFixed(0)}k`;
                      }}
                    />
                    <Tooltip content={<CustomTooltip currency={currency} />} cursor={{ stroke: '#475569' }} />
                    <Legend wrapperStyle={{ color: '#9ca3af' }}/>
                    <Area dataKey="lowerBound" stackId="confidence" stroke="none" fill="transparent" />
                    <Area
                      type="monotone"
                      dataKey="confidenceRange"
                      name="Confidence Interval"
                      stackId="confidence"
                      stroke="none"
                      fill="#8884d8"
                      fillOpacity={0.2}
                    />
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
                        <Tooltip content={renderBreakdownTooltip} cursor={{ fill: 'rgba(203, 213, 225, 0.1)' }} />
                        <Bar dataKey="cost" fill="#3b82f6" name="Cost" style={{cursor: 'pointer'}} />
                        </BarChart>
                    </ResponsiveContainer>
                    </div>
                </div>
            ) : (
                <div className="animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white capitalize">{selectedService} Breakdown</h3>
                        <button onClick={() => setSelectedService(null)} className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                            &larr; Back to Overview
                        </button>
                    </div>
                     <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={granularData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis 
                                  type="number" 
                                  tick={{ fill: '#9ca3af' }} 
                                  axisLine={{ stroke: '#374151' }} 
                                  tickLine={{ stroke: '#374151' }} 
                                  tickFormatter={(value) => {
                                      const num = Number(value);
                                      if (isNaN(num)) return '';
                                      return formatCurrency(num, currency);
                                  }} 
                                  domain={[0, 'dataMax + 100']} 
                                />
                                <YAxis dataKey="name" type="category" width={120} tick={{ fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                <Tooltip content={renderGranularTooltip} cursor={{ fill: 'rgba(203, 213, 225, 0.1)' }} />
                                <Bar dataKey="cost" fill="#8884d8" name="Cost" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
