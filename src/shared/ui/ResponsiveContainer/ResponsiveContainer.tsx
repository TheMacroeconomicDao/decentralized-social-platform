"use client";

import { ReactNode, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import cls from './ResponsiveContainer.module.scss';

interface ResponsiveContainerProps {
  children: ReactNode;
  breakpoints?: {
    small?: number;
    medium?: number;
    large?: number;
    xlarge?: number;
  };
  className?: string;
  adaptiveLayout?: boolean;
  enableAnimations?: boolean;
  containerType?: 'inline-size' | 'size' | 'normal';
}

const DEFAULT_BREAKPOINTS = {
  small: 320,
  medium: 768,
  large: 1024,
  xlarge: 1440,
};

export const ResponsiveContainer = ({
  children,
  breakpoints = DEFAULT_BREAKPOINTS,
  className = "",
  adaptiveLayout = true,
  enableAnimations = true,
  containerType = 'inline-size'
}: ResponsiveContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('');

  // ResizeObserver for container size tracking
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
        
        // Determine current breakpoint
        let breakpoint = 'small';
        if (width >= breakpoints.xlarge!) breakpoint = 'xlarge';
        else if (width >= breakpoints.large!) breakpoint = 'large';
        else if (width >= breakpoints.medium!) breakpoint = 'medium';
        
        setCurrentBreakpoint(breakpoint);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [breakpoints]);

  // Generate container query CSS custom properties
  const containerStyles = {
    '--container-width': `${containerSize.width}px`,
    '--container-height': `${containerSize.height}px`,
    '--breakpoint-small': `${breakpoints.small}px`,
    '--breakpoint-medium': `${breakpoints.medium}px`,
    '--breakpoint-large': `${breakpoints.large}px`,
    '--breakpoint-xlarge': `${breakpoints.xlarge}px`,
    containerType: containerType,
  } as React.CSSProperties;

  // Adaptive layout classes
  const adaptiveClasses = [
    cls.responsiveContainer,
    currentBreakpoint && cls[`breakpoint-${currentBreakpoint}`],
    adaptiveLayout && cls.adaptiveLayout,
    enableAnimations && cls.animated,
    className
  ].filter(Boolean).join(' ');

  // Animation variants for different breakpoints
  const containerVariants = {
    small: {
      padding: 'var(--spacing-sm)',
      gap: 'var(--spacing-xs)',
    },
    medium: {
      padding: 'var(--spacing-md)',
      gap: 'var(--spacing-sm)',
    },
    large: {
      padding: 'var(--spacing-lg)',
      gap: 'var(--spacing-md)',
    },
    xlarge: {
      padding: 'var(--spacing-xl)',
      gap: 'var(--spacing-lg)',
    }
  };

  const MotionDiv = enableAnimations ? motion.div : 'div';

  return (
    <MotionDiv
      ref={containerRef}
      className={adaptiveClasses}
      style={containerStyles}
      data-breakpoint={currentBreakpoint}
      data-container-width={containerSize.width}
      data-container-height={containerSize.height}
      {...(enableAnimations && {
        initial: false,
        animate: currentBreakpoint,
        variants: containerVariants,
        transition: { duration: 0.3, ease: 'easeInOut' }
      })}
    >
      {children}
    </MotionDiv>
  );
}; 