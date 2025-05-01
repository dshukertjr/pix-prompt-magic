
import React from 'react';

interface ImagePreviewProps {
  generatedImage: string | null;
  isGenerating: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ generatedImage, isGenerating }) => {
  return (
    <div className="glass-card p-4 h-full min-h-[300px] flex flex-col">
      <h3 className="text-lg font-medium text-gray-700 mb-4 text-center">Generated Result</h3>
      
      <div className="flex-1 flex items-center justify-center rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
        {isGenerating ? (
          <div className="text-center p-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-400 border-t-transparent mb-4"></div>
            <p className="text-gray-500">Creating your masterpiece...</p>
          </div>
        ) : generatedImage ? (
          <img 
            src={generatedImage} 
            alt="Generated image" 
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-center p-8">
            <div className="w-24 h-24 mx-auto mb-4 opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-500">Your generated image will appear here</p>
            <p className="text-gray-500 text-xs mt-2">Upload images and provide a prompt to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;
