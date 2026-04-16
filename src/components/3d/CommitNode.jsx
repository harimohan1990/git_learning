import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

export default function CommitNode({ commit, isHEAD, isSelected, color = '#f97316', branchLabels = [], tagLabels = [], onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    if (isHEAD) {
      meshRef.current.material.emissiveIntensity = 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.35;
    } else if (hovered) {
      meshRef.current.material.emissiveIntensity = 0.5;
    } else {
      meshRef.current.material.emissiveIntensity = isSelected ? 0.7 : 0.2;
    }
  });

  const x = commit.x * 2.5;
  const y = commit.y * -2;
  const radius = commit.isMerge ? 0.38 : 0.35;

  // label stack above the node
  const labelLines = [
    ...branchLabels.map((b) => ({ text: b.name, color: b.color })),
    ...tagLabels.map((t) => ({ text: `🏷 ${t}`, color: '#facc15' })),
  ];

  return (
    <group
      position={[x, y, 0]}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { setHovered(false); document.body.style.cursor = 'default'; }}
    >
      {/* main sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={isSelected ? '#ffffff' : color}
          emissive={color}
          emissiveIntensity={0.2}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>

      {/* HEAD glow ring */}
      {isHEAD && (
        <mesh>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial color={color} transparent opacity={0.12} emissive={color} emissiveIntensity={0.5} />
        </mesh>
      )}

      {/* selected ring */}
      {isSelected && !isHEAD && (
        <mesh>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.08} emissive="#ffffff" emissiveIntensity={0.3} />
        </mesh>
      )}

      {/* commit message below */}
      <Text
        position={[0, -0.65, 0]}
        fontSize={0.2}
        color={hovered ? '#ffffff' : '#c9d1d9'}
        anchorX="center"
        anchorY="top"
        maxWidth={3}
      >
        {commit.message.length > 18 ? commit.message.slice(0, 18) + '…' : commit.message}
      </Text>

      {/* short hash below message */}
      <Text position={[0, -0.95, 0]} fontSize={0.15} color="#6e7681" anchorX="center" anchorY="top">
        {commit.id.slice(0, 7)}
      </Text>

      {/* HEAD label above */}
      {isHEAD && (
        <Text position={[0, 0.75, 0]} fontSize={0.2} color="#facc15" anchorX="center" fontWeight="bold">
          HEAD
        </Text>
      )}

      {/* branch / tag labels above (stacked) */}
      {labelLines.map((label, i) => (
        <Text
          key={label.text}
          position={[0, (isHEAD ? 1.05 : 0.75) + i * 0.32, 0]}
          fontSize={0.18}
          color={label.color}
          anchorX="center"
        >
          {label.text}
        </Text>
      ))}
    </group>
  );
}
