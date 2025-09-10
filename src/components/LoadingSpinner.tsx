import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mb-4"></div>
      <h3 className="text-xl font-semibold text-yellow-500 mb-2">Generating Your Email Copy</h3>
      <p className="text-gray-400 text-center max-w-md">
        Our AI is crafting a personalized cold email that will help you connect with suppliers...
      </p>
    </div>
  );
}
