import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense } from 'react';
import BranchScene from './BranchScene';

function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#f97316" />
      <pointLight position={[-10, -10, -10]} intensity={0.6} color="#a78bfa" />
    </>
  );
}

export default function GraphView({ commits, branches, tags = {}, HEAD, height = '100%', onSelectCommit, selectedCommit }) {
  if (!commits || commits.length === 0) return null;

  return (
    <Canvas
      style={{ height }}
      camera={{ position: [5, -2, 14], fov: 55 }}
      gl={{ antialias: true }}
    >
      <Lights />
      <Stars radius={100} depth={50} count={1000} factor={2} fade />
      <Suspense fallback={null}>
        <BranchScene
          commits={commits}
          branches={branches}
          tags={tags}
          HEAD={HEAD}
          onSelectCommit={onSelectCommit}
          selectedCommit={selectedCommit}
        />
      </Suspense>
      <OrbitControls enablePan enableZoom enableRotate minDistance={3} maxDistance={50} />
    </Canvas>
  );
}
