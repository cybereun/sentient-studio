
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
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {images.map((img, index) => (
          <div key={`${img.previewUrl}-${index}`} className="relative group aspect-square rounded-xl overflow-hidden shadow-sm border border-stone-100 bg-white">
            <img 
              src={img.previewUrl} 
              alt={`Uploaded ${index}`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            <button
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 bg-white text-stone-800 rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-rose-500 hover:text-white transform scale-90 group-hover:scale-100"
              aria-label="Remove"
            >
              &times;
            </button>
          </div>
        ))}

        <label 
          className={`relative flex flex-col items-center justify-center aspect-square rounded-xl cursor-pointer transition-all duration-300
            ${isDragging 
              ? 'ring-2 ring-rose-500 bg-rose-50' 
              : 'border border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm'
            }`}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <div className="flex flex-col items-center justify-center p-2 text-center overflow-hidden">
            <svg className={`w-6 h-6 mb-1 ${isDragging ? 'text-rose-500' : 'text-stone-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-wide text-stone-500">{title}</span>
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
