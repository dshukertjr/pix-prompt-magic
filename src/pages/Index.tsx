
import React, { useState } from 'react';
import { toast } from "sonner";
import ImageUploadArea from '@/components/ImageUploadArea';
import PromptInput from '@/components/PromptInput';
import GenerateButton from '@/components/GenerateButton';
import ImagePreview from '@/components/ImagePreview';
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);

  const handleImagesSelected = (images: File[]) => {
    setSelectedImages(images);
    // Reset previous uploaded image URLs when new images are selected
    setUploadedImageUrls([]);
  };

  const handlePromptChange = (value: string) => {
    setPrompt(value);
  };

  const uploadImagesToSupabase = async (files: File[]) => {
    const uploadPromises = files.map(async (file) => {
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      
      const { data, error } = await supabase.storage
        .from('user-images')
        .upload(fileName, file);
        
      if (error) {
        console.error("Error uploading file:", error);
        throw new Error(`Failed to upload ${file.name}`);
      }
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('user-images')
        .getPublicUrl(fileName);
        
      return publicUrl;
    });
    
    return await Promise.all(uploadPromises);
  };

  const handleGenerate = async () => {
    if (selectedImages.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }
    
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // First, upload the selected images to Supabase Storage
      let imageUrls: string[] = uploadedImageUrls;
      
      if (imageUrls.length === 0) {
        toast.info("Uploading images...");
        imageUrls = await uploadImagesToSupabase(selectedImages);
        setUploadedImageUrls(imageUrls);
      }
      
      // Then call our edge function with the image URLs and prompt
      toast.info("Generating image...");
      
      const { data, error } = await supabase.functions.invoke('process-image', {
        body: { 
          prompt,
          imageUrls
        }
      });
      
      if (error) {
        throw new Error(error.message || "Error calling process-image function");
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Set the generated image URL
      setGeneratedImage(data.generatedImageUrl);
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Error during image generation:", error);
      toast.error(error.message || "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
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
