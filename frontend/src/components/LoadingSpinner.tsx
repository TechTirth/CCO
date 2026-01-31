import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
      <p className="mt-4 text-lg text-white font-semibold">Optimizing... This may take a few minutes.</p>
      <p className="mt-2 text-sm text-white/80">Please wait while we find the best configuration for you.</p>
    </div>
  );
};

export default LoadingSpinner;