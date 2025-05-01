
import React, { useState } from 'react';
import { toast } from "sonner";
import ImageUploadArea from '@/components/ImageUploadArea';
import PromptInput from '@/components/PromptInput';
import GenerateButton from '@/components/GenerateButton';
import ImagePreview from '@/components/ImagePreview';

const Index = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleImagesSelected = (images: File[]) => {
    setSelectedImages(images);
  };

  const handlePromptChange = (value: string) => {
    setPrompt(value);
  };

  const handleGenerate = () => {
    if (selectedImages.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }
    
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    
    // Simulate generation process
    setIsGenerating(true);
    
    // This would be replaced with actual API call in a real implementation
    setTimeout(() => {
      setIsGenerating(false);
      // For demo purposes, we'll use the first uploaded image as the "generated" result
      setGeneratedImage(URL.createObjectURL(selectedImages[0]));
      toast.success("Image generated successfully!");
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Pix Prompt Magic
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Transform your images using AI. Upload, describe, and create!
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-6">
            <div className="space-y-8">
              <ImageUploadArea onImagesSelected={handleImagesSelected} />
              
              <div className="pt-4">
                <PromptInput 
                  value={prompt}
                  onChange={handlePromptChange}
                />
              </div>
              
              <div className="pt-2">
                <GenerateButton 
                  onClick={handleGenerate}
                  disabled={selectedImages.length === 0 || !prompt.trim()}
                  isGenerating={isGenerating}
                />
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <ImagePreview 
              generatedImage={generatedImage}
              isGenerating={isGenerating}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
