'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { PetMood } from '@amigitos/shared';

interface PetModelProps {
  modelUrl?: string | null;
  mood: PetMood;
}

function DefaultPet() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#22c55e" roughness={0.3} metalness={0.1} />

      {/* Eyes */}
      <mesh position={[-0.35, 0.2, 0.9]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.35, 0.2, 0.9]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Pupils */}
      <mesh position={[-0.35, 0.2, 1.02]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.35, 0.2, 1.02]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </mesh>
  );
}

export function PetModel({ modelUrl, mood }: PetModelProps) {
  if (modelUrl) {
    return <LoadedModel url={modelUrl} mood={mood} />;
  }

  return <DefaultPet />;
}

function LoadedModel({ url, mood }: { url: string; mood: PetMood }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (modelRef.current) {
      modelRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.15;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={1.5}
      position={[0, -0.5, 0]}
    />
  );
}
