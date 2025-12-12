"use client";

import { useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';

// Lazy load тяжелые компоненты для code splitting
const DynamicLighting = lazy(() => import('@/shared/ui/DynamicLighting/DynamicLighting').then(module => ({ default: module.DynamicLighting })));
const ParticleSystem = lazy(() => import('@/shared/ui/ParticleSystem/ParticleSystem').then(module => ({ default: module.ParticleSystem })));

// New Ultra Components (легкие компоненты загружаем сразу)
import { OptimizedImage } from '@/shared/ui/OptimizedImage/OptimizedImage';
import { ResponsiveContainer } from '@/shared/ui/ResponsiveContainer/ResponsiveContainer';
import { InteractiveCard } from '@/shared/ui/InteractiveCard/InteractiveCard';

export default function UltraDemoPage() {
  const [lightingIntensity, setLightingIntensity] = useState(0.4);
  const [particleCount, setParticleCount] = useState(25);
  const [swipeCount, setSwipeCount] = useState(0);

  const demoCards = [
    {
      title: "🎨 Dynamic Lighting",
      description: "Освещение следует за курсором с реалистичными эффектами",
      features: ["Spring Physics", "GPU Acceleration", "Blend Modes"]
    },
    {
      title: "🌌 Smart Particles",
      description: "Интеллектуальная система частиц с физикой",
      features: ["Mouse Interaction", "Collision Detection", "Lifecycle Management"]
    },
    {
      title: "⚡ Image Optimization", 
      description: "Продвинутая оптимизация с WebP/AVIF",
      features: ["Lazy Loading", "Progressive Loading", "Error Handling"]
    },
    {
      title: "📱 Container Queries",
      description: "Современная адаптивность на уровне компонента",
      features: ["Auto-fit Layouts", "Aspect Ratios", "Fluid Typography"]
    }
  ];

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Demo Background with Dynamic Lighting */}
      <Suspense fallback={<div style={{ minHeight: '100vh', background: '#001019' }} />}>
        <DynamicLighting
          intensity={lightingIntensity}
          radius={600}
          color="212, 157, 50"
        >
          {/* Particle System Background */}
          <Suspense fallback={null}>
            <ParticleSystem
              particleCount={particleCount}
              enablePhysics={true}
              enableMouse={true}
              colors={[
                'rgba(212, 157, 50, 0.8)',
                'rgba(66, 184, 243, 0.8)',
                'rgba(225, 225, 225, 0.6)',
                'rgba(16, 144, 52, 0.7)',
              ]}
            />
          </Suspense>

        {/* Main Demo Content */}
        <ResponsiveContainer
          adaptiveLayout={true}
          enableAnimations={true}
          containerType="inline-size"
        >
          {/* Demo Header */}
          <motion.header
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              textAlign: 'center',
              padding: '2rem',
              color: 'white',
              zIndex: 10,
              position: 'relative'
            }}
          >
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontWeight: 'bold',
              marginBottom: '1rem',
              textShadow: '0 0 20px rgba(212, 157, 50, 0.5)'
            }}>
              🚀 DSP ULTRA DEMO 2025
            </h1>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.5rem)',
              opacity: 0.9,
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              Демонстрация всех передовых технологий и эффектов
            </p>
          </motion.header>

          {/* Interactive Controls */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'rgba(0, 16, 25, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '2rem',
              margin: '2rem',
              color: 'white'
            }}
          >
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              🎛️ Интерактивные настройки
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              {/* Lighting Controls */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  🌟 Интенсивность освещения: {lightingIntensity}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={lightingIntensity}
                  onChange={(e) => setLightingIntensity(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Particle Controls */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  ✨ Количество частиц: {particleCount}
                </label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={particleCount}
                  onChange={(e) => setParticleCount(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Swipe Counter */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                  👆 {swipeCount}
                </div>
                <div>Swipe interactions</div>
              </div>
            </div>
          </motion.section>

          {/* Interactive Cards Grid */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
              padding: '2rem',
              margin: '2rem 0'
            }}
          >
            {demoCards.map((card, index) => (
              <InteractiveCard
                key={index}
                enableSwipe={true}
                enableTilt={true}
                enableParallax={true}
                intensity={0.8}
                onSwipeLeft={() => setSwipeCount(prev => prev + 1)}
                onSwipeRight={() => setSwipeCount(prev => prev + 1)}
                onSwipeUp={() => setSwipeCount(prev => prev + 1)}
                onSwipeDown={() => setSwipeCount(prev => prev + 1)}
                style={{
                  background: 'rgba(0, 16, 25, 0.9)',
                  backdropFilter: 'blur(25px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '2rem',
                  color: 'white',
                  minHeight: '300px'
                }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <h3 style={{
                    fontSize: '1.5rem',
                    marginBottom: '1rem',
                    color: '#d49d32'
                  }}>
                    {card.title}
                  </h3>
                  
                  <p style={{
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    marginBottom: '1.5rem',
                    opacity: 0.9
                  }}>
                    {card.description}
                  </p>
                  
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {card.features.map((feature, featureIndex) => (
                      <li key={featureIndex} style={{
                        padding: '0.5rem 0',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        fontSize: '0.875rem'
                      }}>
                        ✓ {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </InteractiveCard>
            ))}
          </motion.section>

          {/* Optimized Images Showcase */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            style={{
              background: 'rgba(0, 16, 25, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '2rem',
              margin: '2rem',
              color: 'white'
            }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
              🖼️ Optimized Images Demo
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              {[1, 2, 3, 4].map((index) => (
                <OptimizedImage
                  key={index}
                  src={`/images/demo/image-${index}.jpg`}
                  alt={`Demo image ${index}`}
                  width={300}
                  height={200}
                  formats={['avif', 'webp', 'jpg']}
                  quality={85}
                  lazy={true}
                  showPlaceholder={true}
                  breakpoints={[300, 600, 900]}
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}
                />
              ))}
            </div>
          </motion.section>

          {/* Performance Stats */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{
              background: 'rgba(0, 16, 25, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '2rem',
              margin: '2rem',
              color: 'white',
              textAlign: 'center'
            }}
          >
            <h2 style={{ marginBottom: '2rem' }}>
              📊 Performance Metrics
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem'
            }}>
              <div>
                <div style={{ fontSize: '2rem', color: '#4ade80' }}>60</div>
                <div>FPS Target</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', color: '#60a5fa' }}>95+</div>
                <div>Lighthouse Score</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', color: '#f59e0b' }}>&lt;1.5s</div>
                <div>FCP</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', color: '#ec4899' }}>&lt;100ms</div>
                <div>FID</div>
              </div>
            </div>
          </motion.section>

          {/* Instructions */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            style={{
              background: 'rgba(212, 157, 50, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(212, 157, 50, 0.3)',
              borderRadius: '20px',
              padding: '2rem',
              margin: '2rem',
              color: 'white'
            }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              🎮 Как взаимодействовать
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              fontSize: '0.875rem'
            }}>
              <div>🖱️ <strong>Мышь:</strong> Перемещайте для динамического освещения</div>
              <div>👆 <strong>Swipe:</strong> Проведите по карточкам в любую сторону</div>
              <div>📱 <strong>Touch:</strong> Наклоняйте карточки касанием</div>
              <div>⌨️ <strong>Клавиши:</strong> Стрелки для навигации</div>
            </div>
          </motion.section>
        </ResponsiveContainer>
        </DynamicLighting>
      </Suspense>
    </div>
  );
} 