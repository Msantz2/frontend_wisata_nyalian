"use client";

import Image, { ImageProps } from "next/image";
import { useState, useCallback, useMemo } from "react";
import React from "react";
import { ImageOff } from "lucide-react";
import { isValidImageUrl } from "@/lib/placeholderImage";

type SafeImageProps = Omit<ImageProps, 'src'> & {
  src: string | null | undefined;
  onImageError?: (error: Error) => void;
};

export default function SafeImage({ alt, onImageError, src, ...props }: SafeImageProps) {
  const [error, setError] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const MAX_ATTEMPTS = 2; // Allow 2 attempts before showing error

  // Validate src using our utility function
  const isValidSrc = useMemo(() => {
    return isValidImageUrl(src);
  }, [src]);

  const handleError = useCallback((err: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    
    // Only show error placeholder after multiple failed attempts
    if (newAttemptCount >= MAX_ATTEMPTS) {
      const errorMsg = `Image failed to load: ${src || 'unknown source'}`;
      
      console.error(`[SafeImage] ${errorMsg}`, {
        src,
        alt,
        attempts: newAttemptCount,
      });
      
      setError(true);
      
      if (onImageError) {
        const nativeEvent = err.nativeEvent;
        onImageError(nativeEvent instanceof Error ? nativeEvent : new Error(errorMsg));
      }
    }
  }, [attemptCount, src, alt, onImageError]);

  // Show placeholder if src is invalid or if image failed to load
  if (!isValidSrc || error) {
    return (
      <div 
        className="w-full h-full bg-gray-100 flex items-center justify-center" 
        role="img" 
        aria-label={`Failed to load: ${alt}`}
      >
        <div className="flex flex-col items-center gap-2 text-gray-500">
          <ImageOff className="w-8 h-8" aria-hidden="true" />
          <span className="text-xs text-center px-2 line-clamp-2">{alt}</span>
          <span className="text-xs text-gray-400">(image unavailable)</span>
        </div>
      </div>
    );
  }

  return (
    <Image
      {...props}
      src={src as string}
      alt={alt}
      onError={handleError}
      priority={false}
    />
  );
}
