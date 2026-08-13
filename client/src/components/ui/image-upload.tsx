"use client";

import React, { useCallback, useState, useRef, useEffect } from "react";
import { UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value?: File | string | null;
  onChange: (file: File | null) => void;
  className?: string;
  placeholder?: string;
}

export function ImageUpload({ value, onChange, className, placeholder }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate and cleanup object URLs to prevent memory leaks
  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }

    if (typeof value === "string") {
      setPreviewUrl(value);
      return;
    }

    const objectUrl = URL.createObjectURL(value);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [value]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        onChange(file);
      }
    },
    [onChange]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        onChange(file);
      }
    },
    [onChange]
  );

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (!value) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div
      className={cn(
        "relative group flex flex-col items-center justify-center w-full min-h-[240px] border-2 border-dashed rounded-xl transition-all duration-300 overflow-hidden cursor-pointer",
        isDragging
          ? "border-accent bg-accent/5 scale-[0.98]"
          : "border-border/60 hover:border-accent/40 hover:bg-muted/40",
        value ? "border-solid border-transparent p-0 bg-transparent hover:bg-transparent" : "p-8",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {previewUrl ? (
        <div className="relative w-full h-full flex items-center justify-center bg-muted/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
            style={{ maxHeight: "320px" }}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-xl backdrop-blur-[2px]">
            <Button
              variant="destructive"
              size="icon"
              className="w-12 h-12 rounded-full shadow-xl scale-75 group-hover:scale-100 transition-transform duration-300 ease-out"
              onClick={handleRemove}
            >
              <X className="w-6 h-6 text-white" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="flex aspect-square size-16 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/20 group-hover:shadow-lg group-hover:shadow-accent/5">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-foreground">
              {placeholder || "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-muted-foreground font-medium">
              SVG, PNG, JPG or GIF (max. 5MB)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
