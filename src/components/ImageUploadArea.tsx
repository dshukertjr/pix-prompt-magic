
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface ImageUploadAreaProps {
  onImagesSelected: (images: File[]) => void;
}

const ImageUploadArea: React.FC<ImageUploadAreaProps> = ({ onImagesSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      const imageFiles = filesArray.filter(file => file.type.startsWith('image/'));
      handleFiles(imageFiles);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      handleFiles(filesArray);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFiles = (files: File[]) => {
    const newImages = [...uploadedImages, ...files];
    setUploadedImages(newImages);
    onImagesSelected(newImages);
  };

  const removeImage = (index: number) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    setUploadedImages(newImages);
    onImagesSelected(newImages);
  };

  return (
    <div className="w-full space-y-4">
      <div 
        className={`image-upload-drop rounded-xl p-8 text-center cursor-pointer ${isDragging ? 'active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          multiple 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileSelect} 
        />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            <Upload className={`w-8 h-8 text-gray-500 ${isDragging ? 'upload-animation' : ''}`} />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Upload Images</h3>
            <p className="text-sm text-gray-500">
              Drag & drop images or <span className="text-gray-700">browse</span>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              PNG, JPG, WEBP, SVG up to 10MB
            </p>
          </div>
        </div>
      </div>

      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {uploadedImages.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img 
                  src={URL.createObjectURL(image)} 
                  alt={`Uploaded ${index}`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <button 
                className="absolute -top-2 -right-2 bg-red-500/80 hover:bg-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploadArea;
