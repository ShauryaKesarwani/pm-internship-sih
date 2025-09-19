// React
import React from 'react';

interface GenerateButtonProps {
  isGenerating: boolean;
  onClick: () => void;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({
  isGenerating,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isGenerating}
      className='flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl'
    >
      {isGenerating ? (
        <>
          <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
          <span>Generating...</span>
        </>
      ) : (
        <>
          <span>✨</span>
          <span>Generate</span>
        </>
      )}
    </button>
  );
};

export default GenerateButton;