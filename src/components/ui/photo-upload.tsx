"use client";

import { useRef } from "react";
import { Button } from "@components/ui";
import { uploadImage } from "@lib/api/upload";

interface PhotoUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  disabled?: boolean;
}

export default function PhotoUpload({ value, onChange, disabled }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    onChange?.(url);
  };

  return (
    <div className="flex items-center space-x-4">
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt="Preview"
          className="h-20 w-20 rounded-md object-cover"
        />
      )}
      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          Upload Photo
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
