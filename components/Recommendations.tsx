
import React from 'react';
import { Recommendation } from '../types';

interface RecommendationItemProps {
  item: Recommendation;
}

const RecommendationItem: React.FC<RecommendationItemProps> = ({ item }) => (
  <div className="border-l-4 border-blue-500 pl-4 py-3 bg-slate-100 dark:bg-slate-800/50 rounded-r-md">
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-semibold text-slate-800 dark:text-slate-100">{item.title}</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{item.description}</p>
      </div>
      <div className="ml-4 text-right flex-shrink-0">
        <p className="text-lg font-bold text-green-600 dark:text-green-400">
          ${item.estimatedSavings.toLocaleString()}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">/ month</p>
      </div>
    </div>
  </div>
);


interface RecommendationsProps {
  recommendations: Recommendation[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ recommendations }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md h-full">
      <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">AI Recommendations</h3>
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <RecommendationItem key={index} item={rec} />
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
