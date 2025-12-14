"use client";

import { Suspense, useMemo } from 'react';
import { Canvas, extend } from '@react-three/fiber';
import { OrbitControls, Environment, Stars, Text3D } from '@react-three/drei';
import * as THREE from 'three';
import cls from './Ecosystem3D.module.scss';

// Расширяем типы для React Three Fiber JSX элементов
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      sphereGeometry: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      ringGeometry: any;
      torusGeometry: any;
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      pointsMaterial: any;
      ambientLight: any;
      pointLight: any;
      directionalLight: any;
    }
  }
}

interface ProjectNode {
  id: number;
  name: string;
  status: 'production' | 'development';
  category: string;
  position: [number, number, number];
}

interface Ecosystem3DProps {
  projects?: ProjectNode[];
  enableControls?: boolean;
  autoRotate?: boolean;
  className?: string;
}

// 3D Node компонент для проектов
const ProjectNode3D = ({ 
  position, 
  name, 
  status 
}: { 
  position: [number, number, number]; 
  name: string; 
  status: string;
}) => {
  const color = status === 'production' ? '#00f2fe' : '#f5576c';
  const emissiveColor = status === 'production' ? '#00d4ff' : '#ff6b7d';
  
  return (
    <group position={position}>
      {/* Основная сфера проекта */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={emissiveColor}
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Свечение вокруг */}
      <mesh>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial
          color={emissiveColor}
          transparent
          opacity={0.2}
          emissive={emissiveColor}
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Орбитальная линия */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.45, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

// Центральный узел экосистемы
const CentralNode = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* Внутреннее ядро */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#d49d32"
          emissive="#ff6b35"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Внешнее свечение */}
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial
          color="#d49d32"
          transparent
          opacity={0.3}
          emissive="#d49d32"
          emissiveIntensity={0.8}
        />
      </mesh>
      
      {/* Вращающиеся кольца */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.7, 0.05, 16, 100]} />
        <meshStandardMaterial
          color="#42b8f3"
          emissive="#00d4ff"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
};

// Фоновые частицы
const BackgroundParticles = () => {
  const particles = useMemo(() => {
    const positions = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={1000}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#42b8f3"
        size={0.05}
        sizeAttenuation={true}
        transparent
        opacity={0.6}
      />
    </points>
  );
};

// Основная 3D сцена
const Scene3D = ({ 
  projects, 
  enableControls, 
  autoRotate 
}: { 
  projects: ProjectNode[]; 
  enableControls: boolean; 
  autoRotate: boolean;
}) => {
  return (
    <>
      {/* Освещение */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#42b8f3" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#d49d32" />
      <directionalLight position={[0, 10, 0]} intensity={0.5} />
      
      {/* Фоновые звезды */}
      <Stars
        radius={15}
        depth={50}
        count={500}
        factor={4}
        saturation={0.5}
        fade
        speed={0.5}
      />
      
      {/* Фоновые частицы */}
      <BackgroundParticles />
      
      {/* Центральный узел */}
      <CentralNode />
      
      {/* Проекты как узлы */}
      {projects.map((project) => (
        <ProjectNode3D
          key={project.id}
          position={project.position}
          name={project.name}
          status={project.status}
        />
      ))}
      
      {/* Управление камерой */}
      {enableControls && (
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
          minDistance={5}
          maxDistance={15}
          enableDamping
          dampingFactor={0.05}
        />
      )}
      
      {/* Окружающая среда */}
      <Environment preset="night" />
    </>
  );
};

// Основной компонент
export const Ecosystem3D = ({
  projects = [],
  enableControls = true,
  autoRotate = true,
  className = '',
}: Ecosystem3DProps) => {
  // Генерируем позиции для проектов в сферическом распределении
  const positionedProjects = useMemo(() => {
    return projects.map((project, index) => {
      const angle = (index / projects.length) * Math.PI * 2;
      const radius = 3 + Math.random() * 2;
      const height = (Math.random() - 0.5) * 2;
      
      return {
        ...project,
        position: [
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius,
        ] as [number, number, number],
      };
    });
  }, [projects]);

  return (
    <div className={`${cls.container} ${className}`}>
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene3D
            projects={positionedProjects}
            enableControls={enableControls}
            autoRotate={autoRotate}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

