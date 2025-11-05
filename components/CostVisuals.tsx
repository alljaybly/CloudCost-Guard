
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LineChart, Line } from 'recharts';
import { CostBreakdownItem, ForecastDataPoint } from '../types';

interface CostVisualsProps {
  breakdownData: CostBreakdownItem[];
  forecastData: ForecastDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-lg">
        <p className="font-bold">{label}</p>
        <p className="text-blue-500">{`${payload[0].name}: $${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

const ForecastTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-lg">
          <p className="font-bold">{label}</p>
          {payload.map((pld: any, index: number) => (
             <p key={index} style={{ color: pld.color }}>
                {`${pld.name}: $${pld.value.toLocaleString()}`}
             </p>
          ))}
        </div>
      );
    }
    return null;
  };


const CostVisuals: React.FC<CostVisualsProps> = ({ breakdownData, forecastData }) => {
  const formattedForecastData = forecastData.map(d => ({
    ...d,
    'Historical Cost': d.cost,
    'Forecasted Cost': d.predictedCost
  }));
    
  return (
    <>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Cost Breakdown</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={breakdownData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.3)" />
              <XAxis type="number" tick={{ fill: '#64748b' }} />
              <YAxis dataKey="service" type="category" width={80} tick={{ fill: '#64748b' }} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(203, 213, 225, 0.1)'}}/>
              <Bar dataKey="cost" fill="#3b82f6" name="Cost" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md mt-8">
        <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Cost Forecast</h3>
        <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedForecastData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.3)" />
                <XAxis dataKey="month" tick={{ fill: '#64748b' }} />
                <YAxis tick={{ fill: '#64748b' }}/>
                <Tooltip content={<ForecastTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="Historical Cost" stroke="#3b82f6" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="Forecasted Cost" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
        </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default CostVisuals;
