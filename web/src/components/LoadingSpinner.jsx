import React from 'react';

const LoadingSpinner = ({ text = 'Đang xử lý...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin"></div>
      <p className="mt-4 text-sm text-gray-600">{text}</p>
    </div>
  );
};

export default LoadingSpinner;