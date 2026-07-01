import React from 'react';

interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner: React.FC<SpinnerProps> = ({ className = '', size = 'md' }) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex justify-center items-center py-4">
      <div
        className={`animate-spin rounded-full border-solid border-gray-300 border-t-gov-blue ${sizeMap[size]} ${className}`}
        style={{
          borderTopColor: 'var(--color-gov-blue)',
          animation: 'spin 0.8s linear infinite',
        }}
      />
    </div>
  );
};
