"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import cls from './ParticleSystem.module.scss';

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  lifetime: number;
  maxLifetime: number;
  type: 'icon' | 'dot' | 'star';
  rotation: number;
  rotationSpeed: number;
}

interface ParticleSystemProps {
  particleCount?: number;
  enablePhysics?: boolean;
  enableMouse?: boolean;
  colors?: string[];
  className?: string;
}

const PARTICLE_ICONS = [
  '⚡', '🔗', '💎', '🚀', '⭐', '💫', '🔮', '⚙️', '🎯', '💻'
];

const PARTICLE_COLORS = [
  'rgba(212, 157, 50, 0.8)',   // Orange
  'rgba(66, 184, 243, 0.8)',   // Blue  
  'rgba(225, 225, 225, 0.6)',  // White
  'rgba(16, 144, 52, 0.7)',    // Green
];

export const ParticleSystem = ({
  particleCount = 30,
  enablePhysics = true,
  enableMouse = true,
  colors = PARTICLE_COLORS,
  className = ""
}: ParticleSystemProps) => {
  const containerRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  // Create initial particles
  const createParticle = useCallback((id: string): Particle => {
    const canvas = containerRef.current;
    if (!canvas) return {} as Particle;

    const types: Particle['type'][] = ['icon', 'dot', 'star'];
    const type = types[Math.floor(Math.random() * types.length)];

    return {
      id,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 8 + 4,
      opacity: Math.random() * 0.8 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      lifetime: 0,
      maxLifetime: Math.random() * 10000 + 5000,
      type,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
    };
  }, [colors]);

  // Initialize particles
  useEffect(() => {
    setIsClient(true);
    const newParticles = Array.from({ length: particleCount }, (_, i) => 
      createParticle(`particle-${i}`)
    );
    setParticles(newParticles);
  }, [particleCount, createParticle]);

  // Mouse tracking
  useEffect(() => {
    if (!enableMouse) return;

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = containerRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      setMouse({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enableMouse]);

  // Physics animation loop
  useEffect(() => {
    if (!enablePhysics || !isClient) return;

    const animate = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          const canvas = containerRef.current;
          if (!canvas) return particle;

          let { x, y, vx, vy } = particle;

          // Mouse interaction
          if (enableMouse) {
            const dx = mouse.x - x;
            const dy = mouse.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
              const force = (100 - distance) / 100;
              vx += (dx / distance) * force * 0.01;
              vy += (dy / distance) * force * 0.01;
            }
          }

          // Update position
          x += vx;
          y += vy;

          // Boundary collision with smooth bouncing
          if (x <= 0 || x >= canvas.width) {
            vx *= -0.8;
            x = x <= 0 ? 0 : canvas.width;
          }
          if (y <= 0 || y >= canvas.height) {
            vy *= -0.8;
            y = y <= 0 ? 0 : canvas.height;
          }

          // Friction
          vx *= 0.99;
          vy *= 0.99;

          // Update lifetime
          const newLifetime = particle.lifetime + 16; // ~60fps
          
          // Respawn particle if lifetime exceeded
          if (newLifetime > particle.maxLifetime) {
            return createParticle(particle.id);
          }

          return {
            ...particle,
            x,
            y,
            vx,
            vy,
            lifetime: newLifetime,
            rotation: particle.rotation + particle.rotationSpeed,
            opacity: Math.sin((newLifetime / particle.maxLifetime) * Math.PI) * 0.8 + 0.2
          };
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enablePhysics, enableMouse, mouse, createParticle, isClient]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const canvas = containerRef.current;
      if (!canvas) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderParticle = (particle: Particle) => {
    const style = {
      position: 'absolute' as const,
      left: particle.x,
      top: particle.y,
      width: particle.size,
      height: particle.size,
      opacity: particle.opacity,
      color: particle.color,
      transform: `translate(-50%, -50%) rotate(${particle.rotation}deg)`,
      pointerEvents: 'none' as const,
      userSelect: 'none' as const,
      fontSize: particle.size,
      zIndex: 1,
    };

    switch (particle.type) {
      case 'icon':
        return (
          <motion.div
            key={particle.id}
            style={style}
            className={cls.particleIcon}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            {PARTICLE_ICONS[Math.floor(Math.random() * PARTICLE_ICONS.length)]}
          </motion.div>
        );
      case 'star':
        return (
          <motion.div
            key={particle.id}
            style={style}
            className={cls.particleStar}
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            ⭐
          </motion.div>
        );
      default:
        return (
          <motion.div
            key={particle.id}
            style={style}
            className={cls.particleDot}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          />
        );
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className={`${cls.particleSystem} ${className}`}>
      <canvas
        ref={containerRef}
        className={cls.particleCanvas}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      
      {/* Render particles as DOM elements for better control */}
      <div className={cls.particleContainer}>
        {particles.map(renderParticle)}
      </div>
    </div>
  );
}; 