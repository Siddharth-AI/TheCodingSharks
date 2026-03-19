'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  currentImageUrl?: string | null;
  onFileSelect: (file: File | null) => void;
  label?: string;
}

export function ImageUpload({ currentImageUrl, onFileSelect, label = 'Cover Image' }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    onFileSelect(file);
  }

  function handleRemove() {
    setPreview(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="space-y-2">
      <label className="text-zinc-400 text-sm">{label}</label>
      {preview ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-zinc-700">
          <Image src={preview} alt="Cover preview" fill className="object-cover" unoptimized />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white rounded-full p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full aspect-video border-2 border-dashed border-zinc-700 hover:border-[#ff6b2c] rounded-lg flex flex-col items-center justify-center gap-2 text-zinc-500 hover:text-[#ff6b2c] transition-colors"
        >
          <Upload className="w-6 h-6" />
          <span className="text-sm">Click to upload image</span>
          <span className="text-xs">PNG, JPG, WEBP up to 5MB</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
