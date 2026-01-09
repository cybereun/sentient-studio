
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
        <div className="w-full group">
            <label 
                htmlFor={id} 
                className={`relative flex flex-col items-center justify-center w-full h-72 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden
                    ${preview ? 'border-0' : 'border border-stone-200 bg-stone-50/50 hover:bg-stone-50 hover:border-stone-300'}
                    ${isDragging ? 'ring-2 ring-rose-500 bg-rose-50 border-transparent' : ''}
                `}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDrop}
            >
                {preview ? (
                    <>
                        <img src={preview} alt="미리보기" className="object-contain w-full h-full p-2" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 bg-white/90 px-4 py-2 rounded-full text-xs font-bold text-stone-800 shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-all">
                                Change Image
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center p-6">
                        <div className={`w-12 h-12 mb-4 rounded-full flex items-center justify-center transition-colors ${isDragging ? 'bg-rose-100 text-rose-500' : 'bg-white text-stone-400 shadow-sm'}`}>
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        </div>
                        <p className="mb-1 text-sm text-stone-700 font-bold">{title}</p>
                        <p className="text-xs text-stone-400">{description}</p>
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
