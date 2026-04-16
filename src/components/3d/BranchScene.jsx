import { useMemo } from 'react';
import * as THREE from 'three';
import { Line, Text } from '@react-three/drei';
import CommitNode from './CommitNode';

export default function BranchScene({ commits, branches, tags = {}, HEAD, onSelectCommit, selectedCommit }) {
  const branchColorMap = useMemo(() => {
    const map = {};
    Object.values(branches).forEach((b) => { map[b.name] = b.color; });
    return map;
  }, [branches]);

  const tagMap = useMemo(() => {
    const map = {};
    Object.entries(tags).forEach(([name, id]) => {
      if (!map[id]) map[id] = [];
      map[id].push(name);
    });
    return map;
  }, [tags]);

  const branchHeadMap = useMemo(() => {
    const map = {};
    Object.values(branches).forEach((b) => {
      if (!map[b.headCommit]) map[b.headCommit] = [];
      map[b.headCommit].push({ name: b.name, color: b.color });
    });
    return map;
  }, [branches]);

  const edges = useMemo(() => {
    const lines = [];
    commits.forEach((commit) => {
      if (commit.parent) {
        const parent = commits.find((c) => c.id === commit.parent);
        if (parent) {
          lines.push({
            id: `${parent.id}-${commit.id}`,
            points: [
              new THREE.Vector3(parent.x * 2.5, parent.y * -2, 0),
              new THREE.Vector3(commit.x * 2.5, commit.y * -2, 0),
            ],
            color: branchColorMap[commit.branch] || '#6e7681',
            dashed: false,
          });
        }
      }
      if (commit.mergeParent) {
        const src = commits.find((c) => c.id === commit.mergeParent);
        if (src) {
          lines.push({
            id: `merge-${commit.id}`,
            points: [
              new THREE.Vector3(src.x * 2.5, src.y * -2, 0),
              new THREE.Vector3(commit.x * 2.5, commit.y * -2, 0),
            ],
            color: '#f43f5e',
            dashed: true,
          });
        }
      }
    });
    return lines;
  }, [commits, branchColorMap]);

  return (
    <group>
      {edges.map((edge) => (
        <Line
          key={edge.id}
          points={edge.points}
          color={edge.color}
          lineWidth={edge.dashed ? 1.5 : 2.5}
          opacity={edge.dashed ? 0.5 : 0.85}
          transparent
        />
      ))}

      {commits.map((commit) => (
        <CommitNode
          key={commit.id}
          commit={commit}
          isHEAD={commit.id === HEAD}
          isSelected={commit.id === selectedCommit}
          color={branchColorMap[commit.branch] || '#6e7681'}
          branchLabels={branchHeadMap[commit.id] || []}
          tagLabels={tagMap[commit.id] || []}
          onClick={() => onSelectCommit?.(commit.id)}
        />
      ))}
    </group>
  );
}
