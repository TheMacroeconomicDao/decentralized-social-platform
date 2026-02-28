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
  status: 'production' | 'development' | 'testnet';
  category: string;
  position: [number, number, number];
  connections?: string[];
  categoryColor?: string;
  isCore?: boolean;
}

interface CoreNode {
  id: string;
  name: string;
  fullName: string;
  description: string;
  function: string;
  layer: string;
  color: string;
  position: [number, number, number];
  concept: string;
  value: string;
  connections: string[];
}

interface Ecosystem3DProps {
  projects?: ProjectNode[];
  coreComponents?: CoreNode[];
  enableControls?: boolean;
  autoRotate?: boolean;
  className?: string;
}

// Status color helper
function getStatusColor(status: string): string {
  if (status === 'testnet') return '#ff9800';
  if (status === 'development') return '#f5576c';
  return '#00f2fe';
}

// Project node — sphere with always-visible label
const ProjectNode3D = ({
  position,
  name,
  status,
  categoryColor,
  isCore,
}: {
  position: [number, number, number];
  name: string;
  status: string;
  categoryColor?: string;
  isCore?: boolean;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const color = isCore ? '#ff6b35' : (categoryColor || '#00f2fe');
  const baseColor = new THREE.Color(color);
  const size = isCore ? 0.4 : 0.25;

  useFrame((state) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 1.5 + position[0] * 2) * 0.15;

    const targetScale = hovered ? 1.35 : 1.0;
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
        <sphereGeometry args={[size, 24, 24]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={isCore ? 0.7 : 0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Outer glow shell */}
      <mesh>
        <sphereGeometry args={[size * 1.5, 16, 16]} />
        <meshStandardMaterial
          color={baseColor}
          transparent
          opacity={hovered ? 0.3 : (isCore ? 0.2 : 0.1)}
          emissive={baseColor}
          emissiveIntensity={isCore ? 1.0 : 0.6}
          depthWrite={false}
        />
      </mesh>

      {/* Orbital ring for core */}
      {isCore && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 1.7, size * 1.85, 48]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={hovered ? 0.5 : 0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Always-visible label */}
      <Html
        center
        distanceFactor={10}
        position={[0, size + 0.25, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div style={{
          color: '#e1e1e1',
          fontSize: '10px',
          fontWeight: 700,
          whiteSpace: 'nowrap',
          textShadow: '0 0 6px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.6)',
          letterSpacing: '0.04em',
          opacity: hovered ? 1 : 0.85,
          transition: 'opacity 0.2s',
        }}>
          {name}
        </div>
      </Html>

      {/* Extended tooltip on hover */}
      {hovered && (
        <Html
          center
          distanceFactor={8}
          position={[0, size + 0.65, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            background: 'rgba(7, 43, 64, 0.92)',
            border: `1px solid ${color}80`,
            borderRadius: '8px',
            padding: '4px 10px',
            color: '#e1e1e1',
            fontSize: '10px',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(10px)',
            boxShadow: `0 4px 16px rgba(0,0,0,0.5), 0 0 8px ${color}30`,
          }}>
            <span style={{
              color: getStatusColor(status),
              fontWeight: 600,
              fontSize: '9px',
            }}>
              {status.toUpperCase()}
            </span>
          </div>
        </Html>
      )}
    </group>
  );
};

// Core infrastructure node with octahedron shape
const CoreNode3D = ({
  position,
  name,
  fullName,
  description,
  function: func,
  color,
  concept,
  value,
}: CoreNode) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const baseColor = new THREE.Color(color);

  useFrame((state) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.4 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.2;

    if (ringRef.current) {
      ringRef.current.rotation.z += 0.012;
    }
  });

  return (
    <group position={position}>
      {/* Main core octahedron */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <octahedronGeometry args={[0.28, 0]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color={baseColor}
          transparent
          opacity={hovered ? 0.35 : 0.15}
          emissive={baseColor}
          emissiveIntensity={1.0}
          depthWrite={false}
        />
      </mesh>

      {/* Rotating ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.45, 0.018, 8, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Neural pulse wireframe */}
      <mesh>
        <sphereGeometry args={[0.55, 8, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.15 : 0.05}
          wireframe
        />
      </mesh>

      {/* Always-visible label */}
      <Html
        center
        distanceFactor={8}
        position={[0, 0.65, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div style={{
          color,
          fontSize: '11px',
          fontWeight: 800,
          whiteSpace: 'nowrap',
          textShadow: `0 0 8px ${color}80, 0 0 16px rgba(0,0,0,0.8)`,
          letterSpacing: '0.06em',
        }}>
          {name}
        </div>
      </Html>

      {/* Detail tooltip on hover */}
      {hovered && (
        <Html
          center
          distanceFactor={6}
          position={[0, 1.0, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            background: 'rgba(7, 43, 64, 0.95)',
            border: `1px solid ${color}`,
            borderRadius: '10px',
            padding: '12px 16px',
            color: '#e1e1e1',
            fontSize: '11px',
            minWidth: '240px',
            backdropFilter: 'blur(12px)',
            boxShadow: `0 4px 24px ${color}40`,
            textAlign: 'left',
          }}>
            <div style={{ fontWeight: 800, color, marginBottom: '2px', fontSize: '13px' }}>
              {name}
            </div>
            <div style={{ color: '#aaa', fontSize: '9px', marginBottom: '8px' }}>
              {fullName}
            </div>
            <div style={{
              background: `${color}15`,
              borderRadius: '6px',
              padding: '6px 10px',
              marginBottom: '8px',
              borderLeft: `2px solid ${color}`
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color, marginBottom: '2px' }}>
                {concept}
              </div>
              <div style={{ fontSize: '9px', color: '#ccc', lineHeight: 1.4 }}>
                {value}
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${color}30`, paddingTop: '8px' }}>
              <div style={{ color: '#888', fontSize: '8px', marginBottom: '2px' }}>{description}</div>
              <div style={{ fontSize: '10px', color: '#fff', marginTop: '4px' }}>
                <span style={{ color, fontWeight: 600 }}>Функция:</span> {func}
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Neural connections between core components
const NeuralConnections = ({ components }: { components: CoreNode[] }) => {
  const connectionSet = new Set<string>();
  const connections: [number, number][] = [];

  components.forEach((component, idx) => {
    component.connections.forEach((connId) => {
      const connIdx = components.findIndex(c => c.id === connId);
      if (connIdx !== -1 && connIdx > idx) {
        const key = `${idx}-${connIdx}`;
        if (!connectionSet.has(key)) {
          connectionSet.add(key);
          connections.push([idx, connIdx]);
        }
      }
    });
  });

  return (
    <>
      {connections.map(([from, to], i) => {
        const fromNode = components[from];
        const toNode = components[to];
        if (!fromNode || !toNode) return null;

        // Gradient: use average of two colors
        const midColor = new THREE.Color(fromNode.color).lerp(new THREE.Color(toNode.color), 0.5);

        return (
          <Line
            key={i}
            points={[fromNode.position, toNode.position]}
            color={`#${midColor.getHexString()}`}
            lineWidth={2}
            transparent
            opacity={0.4}
            dashed
            dashScale={2}
            dashSize={0.06}
            dashOffset={0}
          />
        );
      })}
    </>
  );
};

// Layer visualization rings
const LayerRings = () => {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ring1Ref.current) ring1Ref.current.rotation.y += 0.002;
    if (ring2Ref.current) ring2Ref.current.rotation.y -= 0.0015;
    if (ring3Ref.current) ring3Ref.current.rotation.y += 0.001;
  });

  return (
    <group>
      {/* Inner core ring */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2.2, 0, Math.PI / 8]}>
        <ringGeometry args={[1.0, 1.08, 64]} />
        <meshBasicMaterial color="#ff6b35" transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>

      {/* Middle ring */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 2.5, 0, 0]}>
        <ringGeometry args={[2.2, 2.32, 64]} />
        <meshBasicMaterial color="#42b8f3" transparent opacity={0.05} side={THREE.DoubleSide} />
      </mesh>

      {/* Outer ring */}
      <mesh ref={ring3Ref} rotation={[Math.PI / 3, 0, Math.PI / 5]}>
        <ringGeometry args={[3.8, 3.95, 64]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.04} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// Background particles
const BackgroundParticles = () => {
  const mesh = useRef<THREE.Points>(null);
  const particles = useMemo(() => {
    const positions = new Float32Array(800 * 3);
    // Deterministic seed-based positions
    for (let i = 0; i < 800; i++) {
      const seed = i * 1.618033988749; // golden ratio
      const x = Math.sin(seed * 127.1) * 15;
      const y = Math.cos(seed * 311.7) * 15;
      const z = Math.sin(seed * 74.7 + 1.3) * 15;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.015;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={800}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#42b8f3"
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </points>
  );
};

// Connection lines between projects
const ConnectionLines = ({ projects }: { projects: ProjectNode[] }) => {
  const lines = useMemo(() => {
    const result: { from: [number, number, number]; to: [number, number, number]; color: string; isCore: boolean }[] = [];
    const projectMap = new Map(projects.map(p => [p.id, p]));
    const seen = new Set<string>();

    projects.forEach(project => {
      (project.connections ?? []).forEach(targetId => {
        const key = [project.id, targetId].sort().join('-');
        if (seen.has(key)) return;
        seen.add(key);

        const target = projectMap.get(targetId);
        if (target) {
          const isCoreConn = project.isCore || target.isCore;
          result.push({
            from: project.position,
            to: target.position,
            color: isCoreConn ? '#ff6b35' : (project.categoryColor || '#42b8f3'),
            isCore: isCoreConn,
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
          lineWidth={line.isCore ? 1.5 : 0.8}
          transparent
          opacity={line.isCore ? 0.35 : 0.18}
        />
      ))}
    </>
  );
};

// Main 3D scene
const Scene3D = ({
  projects,
  coreComponents,
  enableControls,
  autoRotate
}: {
  projects: ProjectNode[];
  coreComponents?: CoreNode[];
  enableControls: boolean;
  autoRotate: boolean;
}) => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.7} color="#42b8f3" />
      <pointLight position={[-10, -10, -10]} intensity={0.35} color="#d49d32" />
      <directionalLight position={[0, 10, 0]} intensity={0.3} />

      {/* Background stars */}
      <Stars
        radius={25}
        depth={50}
        count={600}
        factor={4}
        saturation={0.5}
        fade
        speed={0.3}
      />

      <BackgroundParticles />

      {/* Core infrastructure */}
      {coreComponents && coreComponents.length > 0 && (
        <>
          <LayerRings />
          <NeuralConnections components={coreComponents} />
          {coreComponents.map((component) => (
            <CoreNode3D key={component.id} {...component} />
          ))}
        </>
      )}

      <ConnectionLines projects={projects} />

      {/* Project nodes */}
      {projects.map((project) => (
        <ProjectNode3D
          key={project.id}
          position={project.position}
          name={project.name}
          status={project.status}
          categoryColor={project.categoryColor}
          isCore={project.isCore}
        />
      ))}

      {/* Camera controls */}
      {enableControls && (
        <OrbitControls
          enableZoom
          enablePan={false}
          autoRotate={autoRotate}
          autoRotateSpeed={0.35}
          minDistance={4}
          maxDistance={14}
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
  coreComponents,
  enableControls = true,
  autoRotate = true,
  className = '',
}: Ecosystem3DProps) => {
  return (
    <div className={`${cls.container} ${className}`}>
      <Canvas
        camera={{ position: [5, 3.5, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <Scene3D
            projects={projects}
            coreComponents={coreComponents}
            enableControls={enableControls}
            autoRotate={autoRotate}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
