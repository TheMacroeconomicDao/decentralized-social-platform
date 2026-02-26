// @ts-nocheck
"use client";

import { Suspense, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Stars, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import cls from './Ecosystem3D.module.scss';

interface ProjectNode {
  id: string;
  name: string;
  status: 'production' | 'development';
  category: string;
  position: [number, number, number];
  connections?: string[];
  categoryColor?: string;
}

interface Ecosystem3DProps {
  projects?: ProjectNode[];
  enableControls?: boolean;
  autoRotate?: boolean;
  className?: string;
}

// 3D Node with hover interaction, pulse animation, HTML tooltip
const ProjectNode3D = ({
  position,
  name,
  status,
  categoryColor,
}: {
  position: [number, number, number];
  name: string;
  status: string;
  categoryColor?: string;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const color = categoryColor || (status === 'production' ? '#00f2fe' : '#f5576c');
  const baseColor = new THREE.Color(color);

  // Animate emissive intensity + hover scale
  useFrame((state) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.2;

    const targetScale = hovered ? 1.4 : 1.0;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );
  });

  return (
    <group position={position}>
      {/* Core sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Outer glow shell */}
      <mesh>
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshStandardMaterial
          color={baseColor}
          transparent
          opacity={hovered ? 0.35 : 0.15}
          emissive={baseColor}
          emissiveIntensity={0.8}
          depthWrite={false}
        />
      </mesh>

      {/* Orbital ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.48, 0.52, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.5 : 0.12}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* HTML tooltip on hover */}
      {hovered && (
        <Html
          center
          distanceFactor={8}
          position={[0, 0.7, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            background: 'rgba(7, 43, 64, 0.92)',
            border: '1px solid rgba(66, 184, 243, 0.6)',
            borderRadius: '8px',
            padding: '6px 12px',
            color: '#e1e1e1',
            fontSize: '12px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            letterSpacing: '0.05em',
          }}>
            {name}
          </div>
        </Html>
      )}
    </group>
  );
};

// Enhanced central node with animated rings
const CentralNode = () => {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ring1Ref.current) ring1Ref.current.rotation.z += 0.008;
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x += 0.005;
      ring2Ref.current.rotation.y += 0.003;
    }
    if (coreRef.current) {
      const mat = coreRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Inner core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#d49d32"
          emissive="#ff6b35"
          emissiveIntensity={0.5}
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>

      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshStandardMaterial
          color="#d49d32"
          transparent
          opacity={0.2}
          emissive="#d49d32"
          emissiveIntensity={1.0}
          depthWrite={false}
        />
      </mesh>

      {/* Equatorial ring */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.04, 16, 100]} />
        <meshStandardMaterial
          color="#42b8f3"
          emissive="#00d4ff"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Polar ring */}
      <mesh ref={ring2Ref} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[1.1, 0.025, 16, 100]} />
        <meshStandardMaterial
          color="#d49d32"
          emissive="#ff9800"
          emissiveIntensity={0.4}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
};

// Background particles
const BackgroundParticles = () => {
  const mesh = useRef<THREE.Points>(null);
  const particles = useMemo(() => {
    const positions = new Float32Array(1200 * 3);
    for (let i = 0; i < 1200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={1200}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#42b8f3"
        size={0.04}
        sizeAttenuation={true}
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </points>
  );
};

// Connection lines between projects
const ConnectionLines = ({ projects }: { projects: ProjectNode[] }) => {
  const lines = useMemo(() => {
    const result: { from: [number, number, number]; to: [number, number, number]; color: string }[] = [];
    const projectMap = new Map(projects.map(p => [p.id, p]));

    projects.forEach(project => {
      (project.connections ?? []).forEach(targetId => {
        const target = projectMap.get(targetId);
        if (target) {
          result.push({
            from: project.position,
            to: target.position,
            color: project.categoryColor || '#42b8f3',
          });
        }
      });
    });
    return result;
  }, [projects]);

  return (
    <>
      {lines.map((line, i) => (
        <Line
          key={i}
          points={[line.from, line.to]}
          color={line.color}
          lineWidth={0.8}
          transparent
          opacity={0.15}
        />
      ))}
    </>
  );
};

// Main 3D scene
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
      {/* Lighting */}
      <ambientLight intensity={0.25} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#42b8f3" />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#d49d32" />
      <directionalLight position={[0, 10, 0]} intensity={0.4} />

      {/* Background stars */}
      <Stars
        radius={20}
        depth={50}
        count={800}
        factor={4}
        saturation={0.5}
        fade
        speed={0.3}
      />

      <BackgroundParticles />
      <CentralNode />
      <ConnectionLines projects={projects} />

      {/* Project nodes */}
      {projects.map((project) => (
        <ProjectNode3D
          key={project.id}
          position={project.position}
          name={project.name}
          status={project.status}
          categoryColor={project.categoryColor}
        />
      ))}

      {/* Camera controls */}
      {enableControls && (
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate={autoRotate}
          autoRotateSpeed={0.4}
          minDistance={5}
          maxDistance={15}
          enableDamping
          dampingFactor={0.05}
        />
      )}

      <Environment preset="night" />
    </>
  );
};

// Main component
export const Ecosystem3D = ({
  projects = [],
  enableControls = true,
  autoRotate = true,
  className = '',
}: Ecosystem3DProps) => {
  const positionedProjects = useMemo(() => {
    return projects.map((project, index) => {
      if (project.position[0] !== 0 || project.position[1] !== 0 || project.position[2] !== 0) {
        return project;
      }
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
        camera={{ position: [6, 4, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
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
