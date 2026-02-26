# 3D Web Specification — Gybernaty DSP

React Three Fiber + Three.js + PostProcessing for immersive backgrounds and visualizations.

## Architecture

```
Next.js App Layer (SSR/SSG)
└── React Client Components ('use client')
    └── R3F Canvas (React.lazy + Suspense)
        ├── Scene3D
        │   ├── ambientLight (0.15)
        │   ├── pointLight (cyan, gold)
        │   ├── Stars (drei, count: 3000)
        │   ├── ParticleField (Points, count: 500-800)
        │   └── EnergyLines (torus, emissive gold)
        ├── PostProcessing
        │   ├── Bloom (threshold: 0.8, intensity: 0.8)
        │   └── ChromaticAberration (offset: [0.0005, 0.0005])
        └── Camera (position: [0,0,15], fov: 60)
```

## Canvas Setup

```tsx
<Canvas
  camera={{ position: [0, 0, 15], fov: 60 }}
  dpr={[1, 1.5]}                    // NEVER use devicePixelRatio
  frameloop="always"                 // "demand" for static scenes
  gl={{ antialias: false, alpha: true }}
>
```

## Key Components

### ParticleField

```tsx
function ParticleField({ count = 500 }) {
  const mesh = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#42b8f3" transparent opacity={0.6} sizeAttenuation depthWrite={false} />
    </points>
  );
}
```

### EnergyLines (gold torus rings)

```tsx
function EnergyLines() {
  return (
    <group>
      {Array.from({ length: 8 }).map((_, i) => (
        <Float key={i} speed={1 + i * 0.2} floatIntensity={0.5}>
          <mesh position={[Math.cos(i * Math.PI/4) * 5, Math.sin(i * Math.PI/4) * 5, -2]}>
            <torusGeometry args={[0.3, 0.02, 16, 64]} />
            <meshStandardMaterial color="#d49d32" emissive="#d49d32" emissiveIntensity={2} toneMapped={false} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}
```

### PostProcessing

```tsx
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';

<EffectComposer>
  <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.9} intensity={0.8} />
  <ChromaticAberration offset={[0.0005, 0.0005]} />
</EffectComposer>
```

## Custom Shaders (advanced)

### Particle Vertex Shader

```glsl
uniform float uTime;
attribute float aSize;
attribute vec3 aColor;
varying vec3 vColor;

void main() {
  vColor = aColor;
  vec3 pos = position;
  pos.x += sin(uTime * 0.5 + position.y * 2.0) * 0.3;
  pos.y += cos(uTime * 0.3 + position.x * 1.5) * 0.2;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = aSize * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
```

### Particle Fragment Shader

```glsl
varying vec3 vColor;
void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;
  float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
  gl_FragColor = vec4(vColor, alpha * 0.8);
}
```

## Performance Budget

| Metric | Background | Visualization |
|--------|-----------|---------------|
| Draw calls | < 100 | < 500 |
| Triangles | < 50K | < 200K |
| Texture memory | < 16MB | < 32MB |
| Shader passes | < 2 | < 3 |
| DPR | [1, 1.5] | [1, 1.5] |
| Target FPS | 60 | 60 |

## Performance Checklist

- [ ] DPR capped at [1, 1.5]
- [ ] `frameloop="demand"` for static scenes
- [ ] Instancing for repeated geometry
- [ ] Points (not individual meshes) for particles
- [ ] Lazy load with `React.lazy + Suspense`
- [ ] Dispose geometries on unmount
- [ ] KTX2/Basis compressed textures
- [ ] Draco compression for GLTF (70-95% reduction)
- [ ] `antialias: false` for background canvases
- [ ] NO realtime shadows in backgrounds
- [ ] NO more than 1000-2000 draw calls total
- [ ] Intersection Observer before loading 3D

## Lazy Loading Pattern

```tsx
const AnimatedBackground3D = lazy(() => import('./AnimatedBackground3D'));

function Background() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
      <Suspense fallback={null}>
        <AnimatedBackground3D />
      </Suspense>
    </div>
  );
}
```

## Mobile Considerations

- Reduce particle count: 800 → 200
- Simplify PostProcessing: remove ChromaticAberration
- Consider static gradient fallback for low-end devices
- Check `navigator.hardwareConcurrency` and GPU tier

## Dependencies

```json
{
  "three": "^0.159.0",
  "@react-three/fiber": "^8.15.0",
  "@react-three/drei": "^9.88.0",
  "@react-three/postprocessing": "^2.16.0",
  "maath": "^0.10.0"
}
```

## Measurement Tools

- R3F `<Stats />` for FPS monitoring (dev only)
- Chrome DevTools → Performance tab
- Spector.js for WebGL debugging
- `leva` for real-time parameter tuning (dev only)
