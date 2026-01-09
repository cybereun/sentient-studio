
import React, { useCallback, useState } from 'react';
import { ImageData } from '../types';

interface MultiImageUploaderProps {
  images: ImageData[];
  onImagesChange: (newImages: ImageData[]) => void;
  title?: string;
  description?: string;
}

const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({ 
  images, 
  onImagesChange,
  title = "이미지 추가",
  description = "다중 선택 가능" 
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = useCallback((fileList: FileList) => {
    const newImages: ImageData[] = [];
    Array.from(fileList).forEach(file => {
      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        newImages.push({ file, previewUrl });
      }
    });
    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
    }
  }, [images, onImagesChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    // Reset input value to allow selecting the same file again if needed
    e.target.value = '';
  };

  const handleRemove = (index: number) => {
    const newImages = [...images];
    const removed = newImages.splice(index, 1);
    if (removed[0] && removed[0].previewUrl) {
        URL.revokeObjectURL(removed[0].previewUrl); 
    }
    onImagesChange(newImages);
  };

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {images.map((img, index) => (
          <div key={`${img.previewUrl}-${index}`} className="relative group aspect-square">
            <img 
              src={img.previewUrl} 
              alt={`Uploaded ${index}`} 
              className="w-full h-full object-cover rounded-lg shadow-sm border border-stone-200" 
            />
            <button
              onClick={() => handleRemove(index)}
              className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-rose-600 focus:opacity-100"
              aria-label="이미지 삭제"
            >
              &times;
            </button>
          </div>
        ))}

        <label 
          className={`relative flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300
            ${isDragging 
              ? 'border-rose-500 bg-rose-50 scale-105' 
              : 'border-stone-300 bg-white hover:bg-stone-50 hover:border-rose-400'
            }`}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <div className="flex flex-col items-center justify-center p-2 text-center overflow-hidden">
            <svg className={`w-8 h-8 mb-2 ${isDragging ? 'text-rose-500' : 'text-stone-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs font-medium text-stone-600 break-words w-full px-1">{title}</span>
          </div>
          <input 
            type="file" 
            className="hidden" 
            multiple 
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
};

export default MultiImageUploader;
