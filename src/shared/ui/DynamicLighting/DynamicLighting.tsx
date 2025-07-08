"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import cls from './DynamicLighting.module.scss';

interface DynamicLightingProps {
  intensity?: number;
  radius?: number;
  color?: string;
  children?: React.ReactNode;
  className?: string;
}

interface MousePosition {
  x: number;
  y: number;
}

export const DynamicLighting = ({ 
  intensity = 0.3, 
  radius = 800, 
  color = '212, 157, 50',
  children,
  className = ""
}: DynamicLightingProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  
  // Smooth mouse tracking with spring physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 150, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 25 });

  useEffect(() => {
    setIsClient(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseLeave = () => {
      // Smooth fade to center when mouse leaves
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(rect.width / 2);
      mouseY.set(rect.height / 2);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [mouseX, mouseY]);

  if (!isClient) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div 
      ref={containerRef}
      className={`${cls.dynamicLighting} ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Main Dynamic Light */}
      <motion.div
        className={cls.lightSource}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
          background: `radial-gradient(${radius}px circle at var(--mouse-x) var(--mouse-y), 
            rgba(${color}, ${intensity}) 0%, 
            rgba(${color}, ${intensity * 0.6}) 20%, 
            rgba(${color}, ${intensity * 0.3}) 40%, 
            transparent 70%)`,
          '--mouse-x': springX,
          '--mouse-y': springY,
        } as React.CSSProperties}
      />
      
      {/* Secondary Ambient Light */}
      <motion.div
        className={cls.ambientLight}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          background: `radial-gradient(${radius * 1.5}px circle at var(--mouse-x) var(--mouse-y), 
            rgba(66, 184, 243, ${intensity * 0.1}) 0%, 
            transparent 60%)`,
          '--mouse-x': springX,
          '--mouse-y': springY,
        } as React.CSSProperties}
      />
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
}; 