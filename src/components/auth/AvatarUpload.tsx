"use client";

import { ChangeEvent } from "react";
import Image from "next/image";

interface AvatarUploadProps {
  preview: string | null;
  onChange: (file: File) => void;
  onError: (msg: string | null) => void;
}

export const AvatarUpload = ({
  preview,
  onChange,
  onError,
}: AvatarUploadProps) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        onError("Invalid image format. Please use JPG, PNG, or WEBP");
        return;
      }
      onError(null);
      onChange(file);
    }
  };

  return (
    <div className="flex items-center gap-3.5 mb-8 rounded-2xl">
      <label className="relative w-12 h-12 rounded-xl bg-[#2A2C3D] flex items-center justify-center cursor-pointer overflow-hidden transition-colors flex-shrink-0">
        {preview ? (
          <Image
            src={preview}
            alt="Avatar preview"
            fill
            className="object-cover"
          />
        ) : (
          <Image
            src="/images/icons/upload.svg"
            alt="Upload"
            width={18}
            height={18}
            className="opacity-60"
          />
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
      <div>
        <span className="text-[13px] font-bold text-white block">
          Upload avatar (optional)
        </span>
        <span className="text-[11px] text-[#808398]">JPG, PNG or WEBP</span>
      </div>
    </div>
  );
};
