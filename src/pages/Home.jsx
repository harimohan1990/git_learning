import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Line, Text } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Suspense, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { commands } from '../data/commands';
import CommandCard from '../components/ui/CommandCard';

const CATEGORIES = ['all', 'basics', 'setup', 'inspection', 'branching', 'remote', 'advanced', 'patching', 'email', 'tags', 'undoing', 'administration', 'server', 'external', 'plumbing'];

const DEMO_COMMITS = [
  { id: 'c1', x: 0, y: 0, color: '#f97316', label: 'init' },
  { id: 'c2', x: 1, y: 0, color: '#f97316', label: 'commit' },
  { id: 'c3', x: 2, y: 0, color: '#f97316', label: 'commit' },
  { id: 'c4', x: 2, y: -1, color: '#a78bfa', label: 'branch' },
  { id: 'c5', x: 3, y: -1, color: '#a78bfa', label: 'feature' },
  { id: 'c6', x: 3, y: 0, color: '#4ade80', label: 'merge' },
];

function FloatingGraph() {
  const groupRef = useRef();
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  const edges = [
    ['c1', 'c2'], ['c2', 'c3'], ['c2', 'c4'], ['c4', 'c5'], ['c3', 'c6'], ['c5', 'c6'],
  ];

  return (
    <group ref={groupRef}>
      {edges.map(([from, to]) => {
        const a = DEMO_COMMITS.find((c) => c.id === from);
        const b = DEMO_COMMITS.find((c) => c.id === to);
        return (
          <Line
            key={`${from}-${to}`}
            points={[
              new THREE.Vector3(a.x * 2, a.y * 1.8, 0),
              new THREE.Vector3(b.x * 2, b.y * 1.8, 0),
            ]}
            color="#30363d"
            lineWidth={2}
          />
        );
      })}
      {DEMO_COMMITS.map((c) => (
        <group key={c.id} position={[c.x * 2, c.y * 1.8, 0]}>
          <mesh>
            <sphereGeometry args={[0.35, 32, 32]} />
            <meshStandardMaterial color={c.color} emissive={c.color} emissiveIntensity={0.4} metalness={0.7} roughness={0.2} />
          </mesh>
          <Text position={[0, -0.6, 0]} fontSize={0.18} color="#8b949e" anchorX="center">
            {c.label}
          </Text>
        </group>
      ))}
    </group>
  );
}

const features = [
  { icon: '🎮', title: 'Interactive Playground', desc: 'Type real Git commands and watch the 3D graph update instantly.' },
  { icon: '🌿', title: 'Visual Branches', desc: 'Every branch gets a unique color. Fork and merge animations included.' },
  { icon: '📚', title: 'Step-by-Step Tutorials', desc: '7 lessons from git init to advanced remote workflows.' },
  { icon: '⚡', title: 'Real-Time Feedback', desc: 'Instant visual feedback for every command you run.' },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const filtered = activeCategory === 'all' ? commands : commands.filter((c) => c.category === activeCategory);

  return (
    <div className="min-h-screen">
      <section className="relative flex flex-col lg:flex-row items-center justify-between min-h-screen px-6 lg:px-16 pt-24 pb-12 gap-12">
        <div className="flex-1 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#161b22] border border-[#21262d] rounded-full px-4 py-2 text-sm text-[#8b949e] mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Learn Git Visually — No prior experience needed
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
              See Git,{' '}
              <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Don't Just Read It
              </span>
            </h1>

            <p className="text-lg text-[#8b949e] mb-8 leading-relaxed">
              GitVerse turns abstract Git concepts into beautiful 3D animations. Watch branches fork, commits appear, and merges happen — right in your browser.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/playground"
                className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
              >
                🚀 Open Playground
              </Link>
              <Link
                to="/learn"
                className="inline-flex items-center justify-center gap-2 border border-[#30363d] hover:border-[#6e7681] text-[#8b949e] hover:text-white font-medium px-8 py-4 rounded-xl transition-colors text-lg"
              >
                📚 Start Learning
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 w-full h-[420px] lg:h-[520px] rounded-2xl overflow-hidden border border-[#21262d] bg-[#0d1117]"
        >
          <Canvas camera={{ position: [6, -1, 10], fov: 55 }}>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#f97316" />
            <pointLight position={[-5, -5, 5]} intensity={0.5} color="#a78bfa" />
            <Stars radius={80} depth={40} count={800} factor={2} fade />
            <Suspense fallback={null}>
              <FloatingGraph />
            </Suspense>
            <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.5} />
          </Canvas>
        </motion.div>
      </section>

      <section className="px-6 lg:px-16 py-20 border-t border-[#21262d]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Why GitVerse?</h2>
          <p className="text-[#8b949e] text-lg">Everything you need to master Git, nothing you don't.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#161b22] border border-[#21262d] rounded-xl p-6 hover:border-orange-500/40 transition-colors"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-[#8b949e]">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-6 lg:px-16 py-20 border-t border-[#21262d]">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Git Commands Reference</h2>
          <p className="text-[#8b949e]">Every command from basics to advanced — click any card for full details.</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                activeCategory === cat
                  ? 'bg-orange-500 text-white'
                  : 'bg-[#21262d] text-[#8b949e] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((cmd, i) => (
            <CommandCard key={cmd.name} command={cmd} index={i} />
          ))}
        </div>
      </section>

      <section className="px-6 lg:px-16 py-20 border-t border-[#21262d]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-orange-500/20 rounded-2xl p-12 text-center"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Ready to visualize Git?</h2>
          <p className="text-[#8b949e] mb-8 text-lg">Jump into the playground and start running commands.</p>
          <Link
            to="/playground"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-10 py-4 rounded-xl transition-colors text-lg"
          >
            Open Playground →
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
