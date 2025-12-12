"use client";

import { useRef, useEffect, useState, ReactNode } from 'react';
import { motion, useMotionValue, useTransform, useSpring, PanInfo, Variants } from 'framer-motion';
import cls from './InteractiveCard.module.scss';

interface InteractiveCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  enableSwipe?: boolean;
  enableParallax?: boolean;
  enableTilt?: boolean;
  enableScrollEffects?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onClick?: () => void;
  intensity?: number;
}

export const InteractiveCard = ({
  children,
  className = "",
  style,
  enableSwipe = true,
  enableParallax = true,
  enableTilt = true,
  enableScrollEffects = true,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onClick,
  intensity = 1
}: InteractiveCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Motion values for interactions
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scrollYMotion = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30 * intensity, -30 * intensity]);
  const rotateY = useTransform(x, [-100, 100], [-30 * intensity, 30 * intensity]);
  
  // Spring physics for smooth animations
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });
  
  // Parallax effect based on scroll
  const scrollTransform = useTransform(
    scrollYMotion,
    [0, 1000],
    [0, -200 * intensity]
  );

  // Handle mouse move for tilt effect
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;
    
    x.set(mouseX * 0.1);
    y.set(mouseY * 0.1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Handle pan gestures for swipe
  const handlePan = (event: any, info: PanInfo) => {
    if (!enableSwipe) return;

    const { offset, velocity } = info;
    const swipeThreshold = 50;
    const velocityThreshold = 500;

    // Horizontal swipes
    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      if (offset.x > swipeThreshold || velocity.x > velocityThreshold) {
        onSwipeRight?.();
      } else if (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) {
        onSwipeLeft?.();
      }
    } 
    // Vertical swipes
    else {
      if (offset.y > swipeThreshold || velocity.y > velocityThreshold) {
        onSwipeDown?.();
      } else if (offset.y < -swipeThreshold || velocity.y < -velocityThreshold) {
        onSwipeUp?.();
      }
    }
  };

  // Scroll effect handler
  useEffect(() => {
    if (!enableScrollEffects) return;

    const handleScroll = () => {
      const newScrollY = window.scrollY;
      setScrollY(newScrollY);
      scrollYMotion.set(newScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enableScrollEffects, scrollYMotion]);

  // Touch gesture handlers
  const touchHandlers = {
    onTouchStart: (e: React.TouchEvent) => {
      // Prepare for gesture recognition
      e.preventDefault();
    },
    onTouchMove: (e: React.TouchEvent) => {
      if (!enableTilt) return;
      
      const touch = e.touches[0];
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const touchX = touch.clientX - centerX;
      const touchY = touch.clientY - centerY;
      
      x.set(touchX * 0.05);
      y.set(touchY * 0.05);
    },
    onTouchEnd: () => {
      x.set(0);
      y.set(0);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        onSwipeLeft?.();
        break;
      case 'ArrowRight':
        onSwipeRight?.();
        break;
      case 'ArrowUp':
        onSwipeUp?.();
        break;
      case 'ArrowDown':
        onSwipeDown?.();
        break;
      case 'Enter':
      case ' ':
        onClick?.();
        break;
    }
  };

  // Card variants for different states
  const cardVariants: Variants = {
    initial: {
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <div 
      ref={cardRef} 
      className={`${cls.interactiveCard} ${className}`} 
      style={style}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="Interactive card"
      {...touchHandlers}
    >
      <motion.div
        style={{
          x: enableSwipe ? springX : 0,
          y: enableParallax ? scrollTransform : (enableSwipe ? springY : 0),
          rotateX: enableTilt ? rotateX : 0,
          rotateY: enableTilt ? rotateY : 0,
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
          width: '100%',
          height: '100%'
        }}
        variants={cardVariants}
        initial="initial"
        animate={isHovered ? "hover" : "initial"}
        whileTap="tap"
        onPan={handlePan}
        {...(enableSwipe && {
          drag: true,
          dragConstraints: { left: 0, right: 0, top: 0, bottom: 0 },
          dragElastic: 0.2
        })}
      >
        {/* Shine effect on hover */}
        <div className={cls.shineEffect} style={{
          background: `linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)`,
          transform: `translateX(${x.get() * 2}px) translateY(${y.get() * 2}px)`
        }}>
          <motion.div
            animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        
        {/* Content */}
        <div className={cls.cardContent}>
          {children}
        </div>
        
        {/* Interactive indicators */}
        {enableSwipe && (
          <div className={cls.swipeIndicators}>
            <div className={cls.swipeHint}>
              <span>⟷</span>
              <span>Swipe</span>
            </div>
          </div>
        )}
        
        {/* Glow effect */}
        <div className={cls.glowEffect}>
          <motion.div
            animate={isHovered ? { 
              opacity: 0.6,
              scale: 1.1 
            } : { 
              opacity: 0,
              scale: 1 
            }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </motion.div>
    </div>
  );
}; 