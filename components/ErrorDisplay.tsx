
import React from 'react';

interface ErrorDisplayProps {
  message: string;
  severity: 'error' | 'warning';
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, severity }) => {
  const isError = severity === 'error';

  const containerClasses = isError 
    ? 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300' 
    : 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500 text-yellow-800 dark:text-yellow-300';
  
  const titleText = isError ? 'An Error Occurred' : 'Please Note';

  return (
    <div className={`border-l-4 p-4 rounded-md my-6 ${containerClasses}`} role="alert">
      <p className="font-bold">{titleText}</p>
      <p>{message}</p>
    </div>
  );
};

export default ErrorDisplay;
