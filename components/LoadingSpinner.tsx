
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div
        className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"
        role="status"
        aria-label="Loading..."
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
