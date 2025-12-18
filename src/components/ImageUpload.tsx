'use client';

import React, { useState, useCallback } from 'react';

interface ImageUploadProps {
    onImageSelect: (file: File) => void;
    isUploading: boolean;
}

export default function ImageUpload({ onImageSelect, isUploading }: ImageUploadProps) {
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    }, []);

    const handleFile = (file: File) => {
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload a PNG or JPEG image');
            return;
        }
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('File size must be less than 10MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        onImageSelect(file);
    };

    const clearSelection = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
    }

    return (
        <div
            className={`relative group border-2 border-dashed rounded-xl transition-all duration-200 overflow-hidden
        ${dragActive ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'}
        ${isUploading ? 'opacity-70 pointer-events-none' : ''}
        ${preview ? 'border-solid border-slate-200 p-0' : 'p-8'}
        `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleChange}
                disabled={isUploading}
            />

            {preview ? (
                <div className="relative w-full h-64 bg-slate-900 flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                    <img src={preview} alt="Preview" className="h-full w-full object-contain opacity-90" />

                    {isUploading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10">
                            <div className="spinner mb-2 border-white/20 border-t-white"></div>
                            <p className="text-white text-sm font-medium">Processing...</p>
                        </div>
                    )}

                    {!isUploading && (
                        <button
                            onClick={clearSelection}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"
                            title="Remove image"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            ) : (
                <label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer text-center">
                    <div className="w-12 h-12 mb-3 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-800">Upload Ultrasound</h3>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 10MB</p>
                </label>
            )}
        </div>
    );
}
