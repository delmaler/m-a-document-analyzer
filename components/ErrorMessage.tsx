
import React from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from './Icons';

interface ErrorMessageProps {
  message: string | null;
  onReset: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onReset }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-6 rounded-r-lg text-center animate-fade-in" role="alert">
      <div className="flex flex-col items-center">
        <ExclamationTriangleIcon className="h-12 w-12 text-red-500 dark:text-red-400 mb-4" />
        <div className="text-red-800 dark:text-red-200">
            <p className="font-bold text-xl mb-2">An Error Occurred</p>
            <p>{message || 'Something went wrong. Please try again.'}</p>
        </div>
        <button
          onClick={onReset}
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-slate-900"
        >
            <ArrowPathIcon className="w-5 h-5 mr-2" />
            Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
