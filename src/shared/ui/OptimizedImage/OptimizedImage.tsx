"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import Image, { ImageProps } from 'next/image';
import { motion } from 'framer-motion';
import cls from './OptimizedImage.module.scss';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  src: string;
  alt: string;
  fallback?: string;
  lazy?: boolean;
  quality?: number;
  formats?: ('avif' | 'webp' | 'jpg' | 'png')[];
  breakpoints?: number[];
  onLoadComplete?: () => void;
  onError?: () => void;
  showPlaceholder?: boolean;
  className?: string;
}

const DEFAULT_BREAKPOINTS = [480, 768, 1024, 1440, 1920];
const DEFAULT_FORMATS: ('avif' | 'webp' | 'jpg' | 'png')[] = ['avif', 'webp', 'jpg'];

export const OptimizedImage = ({
  src,
  alt,
  fallback,
  lazy = true,
  quality = 85,
  formats = DEFAULT_FORMATS,
  breakpoints = DEFAULT_BREAKPOINTS,
  onLoadComplete,
  onError,
  showPlaceholder = true,
  className = "",
  priority = false,
  ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, priority, isInView]);

  // Generate optimized sources
  const generateSources = useCallback(() => {
    const sources: React.JSX.Element[] = [];
    
    formats.forEach(format => {
      if (format === 'avif' || format === 'webp') {
        // Generate responsive sources for modern formats
        const srcSet = breakpoints
          .map(width => {
            const optimizedSrc = `${src}?format=${format}&w=${width}&q=${quality}`;
            return `${optimizedSrc} ${width}w`;
          })
          .join(', ');

        sources.push(
          <source
            key={format}
            type={`image/${format}`}
            srcSet={srcSet}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        );
      }
    });

    return sources;
  }, [src, formats, breakpoints, quality]);

  // Handle load success
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setIsError(false);
    onLoadComplete?.();
  }, [onLoadComplete]);

  // Handle load error with fallback
  const handleError = useCallback(() => {
    if (fallback && currentSrc !== fallback) {
      setCurrentSrc(fallback);
      setIsError(false);
    } else {
      setIsError(true);
      onError?.();
    }
  }, [fallback, currentSrc, onError]);

  // Preload critical images - only for above-the-fold priority images
  useEffect(() => {
    if (priority && isInView && !lazy) {
      // Only preload if image is definitely going to be used
      // Check if link already exists to avoid duplicates
      const existingLink = document.querySelector(`link[rel="preload"][href="${currentSrc}"]`);
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = currentSrc;
        // Add crossorigin if needed for CORS images
        if (currentSrc.startsWith('http')) {
          link.crossOrigin = 'anonymous';
        }
        document.head.appendChild(link);

        return () => {
          // Clean up preload link
          const linkToRemove = document.querySelector(`link[rel="preload"][href="${currentSrc}"]`);
          if (linkToRemove) {
            document.head.removeChild(linkToRemove);
          }
        };
      }
    }
  }, [priority, currentSrc, isInView, lazy]);

  // Loading placeholder component
  const LoadingPlaceholder = () => (
    <div className={cls.placeholder} style={{
        width: props.width || '100%',
        height: props.height || '200px',
        background: 'linear-gradient(90deg, var(--glass-bg) 25%, rgba(255,255,255,0.1) 50%, var(--glass-bg) 75%)',
        backgroundSize: '200% 100%',
      }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ width: '100%', height: '100%' }}
      >
        <div className={cls.shimmer}>
          <motion.div
            animate={{ x: ['0%', '100%'] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: 'easeInOut' 
            }}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </motion.div>
    </div>
  );

  // Error fallback component
  const ErrorFallback = () => (
    <div 
      className={cls.error}
      style={{
        width: props.width || '100%',
        height: props.height || '200px',
      }}
    >
      <div className={cls.errorContent}>
        <span>📷</span>
        <p>Изображение недоступно</p>
      </div>
    </div>
  );

  return (
    <div 
      ref={imgRef}
      className={`${cls.optimizedImage} ${className}`}
      style={{ position: 'relative' }}
    >
      {/* Show placeholder while loading */}
      {!isLoaded && !isError && showPlaceholder && <LoadingPlaceholder />}
      
      {/* Show error fallback */}
      {isError && <ErrorFallback />}
      
      {/* Main image with progressive enhancement */}
      {isInView && !isError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <picture>
            {/* Modern format sources */}
            {generateSources()}
            
            {/* Fallback image */}
            <Image
              {...props}
              src={currentSrc}
              alt={alt}
              quality={quality}
              priority={priority}
              onLoad={handleLoad}
              onError={handleError}
              className={cls.image}
              sizes={props.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
            />
          </picture>
        </motion.div>
      )}
      
      {/* Progressive enhancement indicator */}
      {isLoaded && (
        <div className={cls.loaded}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}
    </div>
  );
}; 