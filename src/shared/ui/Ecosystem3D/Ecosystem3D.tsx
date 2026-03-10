// @ts-nocheck
"use client";

import { Suspense, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import cls from './Ecosystem3D.module.scss';

// ─── Types ───────────────────────────────────────────

interface ProjectNode {
  id: string;
  name: string;
  status: 'production' | 'development' | 'testnet';
  category: string;
  cluster?: string;
  position: [number, number, number];
  connections?: string[];
  categoryColor?: string;
  isCore?: boolean;
}

interface ClusterData {
  id: string;
  name: string;
  color: string;
  position: [number, number, number];
  radius: number;
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
  clusters?: ClusterData[];
  enableControls?: boolean;
  autoRotate?: boolean;
  className?: string;
}

// ─── Helpers ─────────────────────────────────────────

function getStatusColor(status: string): string {
  if (status === 'testnet') return '#ff9800';
  if (status === 'development') return '#f5576c';
  return '#00f2fe';
}

// ─── Cluster Contour ─────────────────────────────────
// Transparent boundary shell around each cluster with animated ring

const ClusterContour = ({ cluster }: { cluster: ClusterData }) => {
  const shellRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const color = new THREE.Color(cluster.color);

  useFrame((state) => {
    if (shellRef.current) {
      const mat = shellRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.04 + Math.sin(state.clock.elapsedTime * 0.5 + cluster.position[0]) * 0.015;
    }
    if (ringRef.current) {
      ringRef.current.rotation.y += 0.003;
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group position={cluster.position}>
      {/* Transparent sphere boundary */}
      <mesh ref={shellRef}>
        <sphereGeometry args={[cluster.radius, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.04}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Wireframe contour */}
      <mesh>
        <sphereGeometry args={[cluster.radius, 16, 12]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.06}
          wireframe
          depthWrite={false}
        />
      </mesh>

      {/* Equatorial ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[cluster.radius * 0.95, cluster.radius * 1.0, 64]} />
        <meshBasicMaterial
          color={cluster.color}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Cluster label */}
      <Html
        center
        distanceFactor={12}
        position={[0, cluster.radius + 0.3, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div style={{
          color: cluster.color,
          fontSize: '9px',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          opacity: 0.6,
          textShadow: `0 0 8px ${cluster.color}60, 0 0 16px rgba(0,0,0,0.9)`,
        }}>
          {cluster.name}
        </div>
      </Html>
    </group>
  );
};

// ─── Data Flow Particles ─────────────────────────────
// Animated particles moving along connection paths

const DataFlowParticle = ({
  from,
  to,
  color,
  speed,
  offset,
}: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  speed: number;
  offset: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = ((state.clock.elapsedTime * speed + offset) % 1);
    ref.current.position.set(
      from[0] + (to[0] - from[0]) * t,
      from[1] + (to[1] - from[1]) * t,
      from[2] + (to[2] - from[2]) * t,
    );
    // Fade at edges
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = Math.sin(t * Math.PI) * 0.7;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </mesh>
  );
};

const DataFlowLines = ({ projects }: { projects: ProjectNode[] }) => {
  const flows = useMemo(() => {
    const result: { from: [number, number, number]; to: [number, number, number]; color: string }[] = [];
    const projectMap = new Map(projects.map(p => [p.id, p]));
    const seen = new Set<string>();

    projects.forEach(project => {
      (project.connections ?? []).forEach(targetId => {
        const key = [project.id, targetId].sort().join('-');
        if (seen.has(key)) return;
        seen.add(key);
        const target = projectMap.get(targetId);
        if (target) {
          const isCross = project.cluster !== target.cluster;
          if (isCross || project.isCore || target.isCore) {
            result.push({
              from: project.position,
              to: target.position,
              color: project.isCore || target.isCore ? '#ff6b35' : '#42b8f3',
            });
          }
        }
      });
    });
    return result;
  }, [projects]);

  return (
    <>
      {flows.map((flow, i) => (
        <DataFlowParticle
          key={`flow-${i}`}
          from={flow.from}
          to={flow.to}
          color={flow.color}
          speed={0.15 + (i % 5) * 0.04}
          offset={i * 0.37}
        />
      ))}
    </>
  );
};

// ─── Project Node ────────────────────────────────────

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
  const size = isCore ? 0.4 : 0.22;

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

      {/* Glow shell */}
      <mesh>
        <sphereGeometry args={[size * 1.5, 16, 16]} />
        <meshStandardMaterial
          color={baseColor}
          transparent
          opacity={hovered ? 0.3 : (isCore ? 0.18 : 0.08)}
          emissive={baseColor}
          emissiveIntensity={isCore ? 1.0 : 0.6}
          depthWrite={false}
        />
      </mesh>

      {/* Core orbital ring */}
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

      {/* Label */}
      <Html
        center
        distanceFactor={10}
        position={[0, size + 0.2, 0]}
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

      {/* Status tooltip on hover */}
      {hovered && (
        <Html
          center
          distanceFactor={8}
          position={[0, size + 0.55, 0]}
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

// ─── Core Node (Octahedron) ──────────────────────────

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

      {/* Wireframe shell */}
      <mesh>
        <sphereGeometry args={[0.55, 8, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.15 : 0.05}
          wireframe
        />
      </mesh>

      {/* Label */}
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

// ─── Neural Connections (core-to-core) ───────────────

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

// ─── Connection Lines (project-to-project) ───────────

const ConnectionLines = ({ projects }: { projects: ProjectNode[] }) => {
  const lines = useMemo(() => {
    const result: { from: [number, number, number]; to: [number, number, number]; color: string; isCore: boolean; isCross: boolean }[] = [];
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
          const isCross = project.cluster !== target.cluster;
          result.push({
            from: project.position,
            to: target.position,
            color: isCoreConn ? '#ff6b35' : (isCross ? '#42b8f3' : (project.categoryColor || '#42b8f3')),
            isCore: isCoreConn,
            isCross,
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
          lineWidth={line.isCore ? 1.5 : (line.isCross ? 1.0 : 0.6)}
          transparent
          opacity={line.isCore ? 0.3 : (line.isCross ? 0.2 : 0.12)}
          dashed={line.isCross}
          dashScale={line.isCross ? 3 : 1}
          dashSize={0.08}
          dashOffset={0}
        />
      ))}
    </>
  );
};

// ─── Background Particles ────────────────────────────

const BackgroundParticles = () => {
  const mesh = useRef<THREE.Points>(null);
  const particles = useMemo(() => {
    const positions = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) {
      const seed = i * 1.618033988749;
      positions[i * 3] = Math.sin(seed * 127.1) * 18;
      positions[i * 3 + 1] = Math.cos(seed * 311.7) * 18;
      positions[i * 3 + 2] = Math.sin(seed * 74.7 + 1.3) * 18;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.012;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={600}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#42b8f3"
        size={0.03}
        sizeAttenuation
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </points>
  );
};

// ─── Main Scene ──────────────────────────────────────

const Scene3D = ({
  projects,
  coreComponents,
  clusters,
  enableControls,
  autoRotate,
}: {
  projects: ProjectNode[];
  coreComponents?: CoreNode[];
  clusters?: ClusterData[];
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

      <Stars
        radius={30}
        depth={50}
        count={500}
        factor={4}
        saturation={0.5}
        fade
        speed={0.3}
      />

      <BackgroundParticles />

      {/* Cluster contours */}
      {clusters && clusters.map((cluster) => (
        <ClusterContour key={cluster.id} cluster={cluster} />
      ))}

      {/* Core infrastructure */}
      {coreComponents && coreComponents.length > 0 && (
        <>
          <NeuralConnections components={coreComponents} />
          {coreComponents.map((component) => (
            <CoreNode3D key={component.id} {...component} />
          ))}
        </>
      )}

      {/* Project connections */}
      <ConnectionLines projects={projects} />

      {/* Data flow particles on cross-cluster connections */}
      <DataFlowLines projects={projects} />

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
          autoRotateSpeed={0.3}
          minDistance={5}
          maxDistance={16}
          enableDamping
          dampingFactor={0.05}
        />
      )}
    </>
  );
};

// ─── Export ──────────────────────────────────────────

export const Ecosystem3D = ({
  projects = [],
  coreComponents,
  clusters,
  enableControls = true,
  autoRotate = true,
  className = '',
}: Ecosystem3DProps) => {
  return (
    <div className={`${cls.container} ${className}`}>
      <Canvas
        camera={{ position: [6, 4, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <Scene3D
            projects={projects}
            coreComponents={coreComponents}
            clusters={clusters}
            enableControls={enableControls}
            autoRotate={autoRotate}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
