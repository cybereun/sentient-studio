import React, { useCallback, useState } from 'react';
import { ImageData } from '../types';

interface ImageUploaderProps {
  onImageSelect: (imageData: ImageData | null) => void;
  title: string;
  description: string;
  id: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, title, description, id }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = useCallback((file: File | null) => {
        if (file && file.type.startsWith('image/')) {
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
            onImageSelect({ file, previewUrl });
        } else {
            setPreview(null);
            onImageSelect(null);
        }
    }, [onImageSelect]);

    const onDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    const onDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
    const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileChange(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    return (
        <div className="w-full">
            <label 
                htmlFor={id} 
                className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-stone-300 border-dashed rounded-lg cursor-pointer bg-stone-50 hover:bg-stone-100 transition-colors duration-300 ${isDragging ? 'border-rose-400 bg-rose-50' : ''}`}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDrop}
            >
                {preview ? (
                    <img src={preview} alt="미리보기" className="object-contain h-full w-full rounded-lg" />
                ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                        <svg className="w-8 h-8 mb-4 text-stone-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm text-stone-500 font-semibold">{title}</p>
                        <p className="text-xs text-stone-500">{description}</p>
                    </div>
                )}
                <input 
                    id={id} 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                />
            </label>
        </div>
    );
};

export default ImageUploader;