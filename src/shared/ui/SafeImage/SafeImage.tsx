"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
  onError?: (error: any) => void;
}

export const SafeImage = ({ 
  src, 
  fallbackSrc = "/images/teams/member-placeholder.png", 
  onError,
  alt,
  ...props 
}: SafeImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = (error: any) => {
    if (!hasError) {
      console.warn(`SafeImage: Failed to load ${src}, using fallback`);
      setImgSrc(fallbackSrc);
      setHasError(true);
      onError?.(error);
    }
  };

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={handleError}
    />
  );
};
