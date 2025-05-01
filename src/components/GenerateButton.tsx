
import React from 'react';
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface GenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
  isGenerating: boolean;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ 
  onClick, 
  disabled, 
  isGenerating 
}) => {
  return (
    <Button
      className={`w-full py-6 text-base font-medium transition-all duration-300 generate-button-glow
        ${isGenerating ? 'bg-gray-700 animate-pulse' : 'bg-gray-600 hover:bg-gray-500'}`}
      disabled={disabled || isGenerating}
      onClick={onClick}
    >
      <div className="flex items-center justify-center gap-2">
        {isGenerating ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            Generate
          </>
        )}
      </div>
    </Button>
  );
};

export default GenerateButton;
