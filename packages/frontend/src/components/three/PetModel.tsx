'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { PetMood, PetSpecies } from '@amigitos/shared';

interface PetModelProps {
  modelUrl?: string | null;
  mood: PetMood;
  species?: PetSpecies;
}

const moodColors: Record<string, string> = {
  HAPPY: '#fbbf24',
  NEUTRAL: '#9ca3af',
  SAD: '#60a5fa',
  SLEEPING: '#8b5cf6',
  SICK: '#ef4444',
};

function Body({ color, ...props }: { color: string; [key: string]: unknown }) {
  return (
    <mesh {...props}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.05} />
    </mesh>
  );
}

function Eye({ position, pupilColor = '#1e293b' }: { position: [number, number, number]; pupilColor?: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0, 0.1]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={pupilColor} />
      </mesh>
    </group>
  );
}

function CatModel({ mood }: { mood: PetMood }) {
  const groupRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);
  const accentColor = moodColors[mood] ?? '#fbbf24';

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.08;
    }
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(Date.now() * 0.003) * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Body */}
      <mesh position={[0, 0.3, 0]} scale={[1.1, 0.9, 0.8]}>
        <sphereGeometry args={[0.7, 24, 24]} />
        <meshStandardMaterial color="#f97316" roughness={0.5} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.0, 0.55]}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshStandardMaterial color="#f97316" roughness={0.5} />
      </mesh>
      {/* Ears */}
      <mesh position={[-0.35, 1.4, 0.45]} rotation={[-0.2, 0, -0.3]}>
        <coneGeometry args={[0.2, 0.3, 8]} />
        <meshStandardMaterial color="#f97316" roughness={0.5} />
      </mesh>
      <mesh position={[0.35, 1.4, 0.45]} rotation={[-0.2, 0, 0.3]}>
        <coneGeometry args={[0.2, 0.3, 8]} />
        <meshStandardMaterial color="#f97316" roughness={0.5} />
      </mesh>
      {/* Inner ears */}
      <mesh position={[-0.35, 1.38, 0.5]} rotation={[-0.2, 0, -0.3]} scale={[0.5, 0.5, 0.5]}>
        <coneGeometry args={[0.15, 0.2, 8]} />
        <meshStandardMaterial color="#fecdd3" roughness={0.5} />
      </mesh>
      <mesh position={[0.35, 1.38, 0.5]} rotation={[-0.2, 0, 0.3]} scale={[0.5, 0.5, 0.5]}>
        <coneGeometry args={[0.15, 0.2, 8]} />
        <meshStandardMaterial color="#fecdd3" roughness={0.5} />
      </mesh>
      {/* Eyes */}
      <Eye position={[-0.18, 1.05, 0.85]} />
      <Eye position={[0.18, 1.05, 0.85]} />
      {/* Nose */}
      <mesh position={[0, 0.92, 0.95]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#f472b6" />
      </mesh>
      {/* Whiskers */}
      <mesh position={[-0.3, 0.92, 0.9]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.01, 0.01, 0.25, 4]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>
      <mesh position={[-0.35, 0.85, 0.9]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.01, 0.01, 0.25, 4]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>
      <mesh position={[0.3, 0.92, 0.9]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.01, 0.01, 0.25, 4]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>
      <mesh position={[0.35, 0.85, 0.9]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.01, 0.01, 0.25, 4]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>
      {/* Tail */}
      <group ref={tailRef} position={[0, 0.2, -0.6]}>
        <mesh position={[0, 0.3, 0]} rotation={[0.5, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.08, 0.5, 8]} />
          <meshStandardMaterial color="#f97316" roughness={0.5} />
        </mesh>
      </group>
      {/* Legs */}
      {[[-0.4, -0.2, 0.4], [0.4, -0.2, 0.4], [-0.4, -0.2, -0.4], [0.4, -0.2, -0.4]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.06, 0.08, 0.3, 8]} />
          <meshStandardMaterial color="#f97316" roughness={0.5} />
        </mesh>
      ))}
      {/* Mood glow */}
      <pointLight position={[0, 0.5, 0]} intensity={0.3} color={accentColor} />
    </group>
  );
}

function DogModel({ mood }: { mood: PetMood }) {
  const groupRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);
  const accentColor = moodColors[mood] ?? '#fbbf24';

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.08;
    }
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(Date.now() * 0.005) * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Body */}
      <mesh position={[0, 0.3, 0]} scale={[1.2, 0.8, 0.7]}>
        <sphereGeometry args={[0.7, 24, 24]} />
        <meshStandardMaterial color="#d4a574" roughness={0.6} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.9, 0.6]}>
        <sphereGeometry args={[0.45, 24, 24]} />
        <meshStandardMaterial color="#d4a574" roughness={0.6} />
      </mesh>
      {/* Snout */}
      <mesh position={[0, 0.8, 0.95]} scale={[0.6, 0.5, 0.6]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#c4956a" roughness={0.6} />
      </mesh>
      {/* Ears (floppy) */}
      <mesh position={[-0.45, 1.1, 0.3]} rotation={[-0.5, 0, -0.3]} scale={[0.8, 0.4, 0.3]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#a67c52" roughness={0.6} />
      </mesh>
      <mesh position={[0.45, 1.1, 0.3]} rotation={[-0.5, 0, 0.3]} scale={[0.8, 0.4, 0.3]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#a67c52" roughness={0.6} />
      </mesh>
      {/* Eyes */}
      <Eye position={[-0.18, 0.95, 0.85]} />
      <Eye position={[0.18, 0.95, 0.85]} />
      {/* Nose */}
      <mesh position={[0, 0.78, 1.1]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Tail */}
      <group ref={tailRef} position={[0, 0.3, -0.65]}>
        <mesh position={[0, 0.3, 0]} rotation={[0.8, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.06, 0.4, 8]} />
          <meshStandardMaterial color="#d4a574" roughness={0.6} />
        </mesh>
      </group>
      {/* Legs */}
      {[[-0.4, -0.15, 0.3], [0.4, -0.15, 0.3], [-0.4, -0.15, -0.3], [0.4, -0.15, -0.3]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.07, 0.09, 0.3, 8]} />
          <meshStandardMaterial color="#d4a574" roughness={0.6} />
        </mesh>
      ))}
      <pointLight position={[0, 0.5, 0]} intensity={0.3} color={accentColor} />
    </group>
  );
}

function RabbitModel({ mood }: { mood: PetMood }) {
  const groupRef = useRef<THREE.Group>(null);
  const earLRef = useRef<THREE.Group>(null);
  const earRRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.1;
    }
    const wiggle = Math.sin(Date.now() * 0.004) * 0.1;
    if (earLRef.current) earLRef.current.rotation.z = wiggle;
    if (earRRef.current) earRRef.current.rotation.z = -wiggle;
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* Body */}
      <mesh position={[0, 0.2, 0]} scale={[1, 0.9, 0.7]}>
        <sphereGeometry args={[0.65, 24, 24]} />
        <meshStandardMaterial color="#f3f4f6" roughness={0.5} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.85, 0.5]}>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshStandardMaterial color="#f3f4f6" roughness={0.5} />
      </mesh>
      {/* Ears */}
      <group ref={earLRef} position={[-0.2, 1.2, 0.35]}>
        <mesh position={[0, 0.5, 0]} scale={[0.4, 1, 0.3]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#f3f4f6" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.5, 0.05]} scale={[0.25, 0.8, 0.2]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#fce7f3" roughness={0.5} />
        </mesh>
      </group>
      <group ref={earRRef} position={[0.2, 1.2, 0.35]}>
        <mesh position={[0, 0.5, 0]} scale={[0.4, 1, 0.3]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#f3f4f6" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.5, 0.05]} scale={[0.25, 0.8, 0.2]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#fce7f3" roughness={0.5} />
        </mesh>
      </group>
      {/* Eyes */}
      <Eye position={[-0.15, 0.9, 0.7]} />
      <Eye position={[0.15, 0.9, 0.7]} />
      {/* Nose */}
      <mesh position={[0, 0.78, 0.78]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#f472b6" />
      </mesh>
      {/* Cheeks */}
      <mesh position={[-0.25, 0.8, 0.65]} scale={[0.5, 0.3, 0.3]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#fce7f3" />
      </mesh>
      <mesh position={[0.25, 0.8, 0.65]} scale={[0.5, 0.3, 0.3]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#fce7f3" />
      </mesh>
      {/* Tail */}
      <mesh position={[0, 0.1, -0.6]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </mesh>
      <pointLight position={[0, 0.5, 0]} intensity={0.3} color={moodColors[mood] ?? '#fbbf24'} />
    </group>
  );
}

function HamsterModel({ mood }: { mood: PetMood }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(Date.now() * 0.003) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* Body (very round) */}
      <mesh position={[0, 0.3, 0]} scale={[1.1, 1, 0.9]}>
        <sphereGeometry args={[0.6, 24, 24]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.6} />
      </mesh>
      {/* Belly */}
      <mesh position={[0, 0.2, 0.3]} scale={[0.7, 0.6, 0.5]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.6} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.7, 0.55]}>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.6} />
      </mesh>
      {/* Cheeks (puffy) */}
      <mesh position={[-0.3, 0.65, 0.55]} scale={[0.6, 0.5, 0.4]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.6} />
      </mesh>
      <mesh position={[0.3, 0.65, 0.55]} scale={[0.6, 0.5, 0.4]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.6} />
      </mesh>
      {/* Ears */}
      <mesh position={[-0.25, 0.95, 0.4]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.6} />
      </mesh>
      <mesh position={[0.25, 0.95, 0.4]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.6} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.12, 0.75, 0.78]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.12, 0.75, 0.78]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.65, 0.82]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#f472b6" />
      </mesh>
      {/* Legs (tiny stubs) */}
      {[[-0.25, -0.1, 0.3], [0.25, -0.1, 0.3], [-0.25, -0.1, -0.3], [0.25, -0.1, -0.3]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.6} />
        </mesh>
      ))}
      <pointLight position={[0, 0.5, 0]} intensity={0.3} color={moodColors[mood] ?? '#fbbf24'} />
    </group>
  );
}

function FoxModel({ mood }: { mood: PetMood }) {
  const groupRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.08;
    }
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(Date.now() * 0.003) * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Body */}
      <mesh position={[0, 0.3, 0]} scale={[1.1, 0.8, 0.7]}>
        <sphereGeometry args={[0.65, 24, 24]} />
        <meshStandardMaterial color="#f97316" roughness={0.5} />
      </mesh>
      {/* Chest */}
      <mesh position={[0, 0.3, 0.4]} scale={[0.6, 0.6, 0.4]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.5} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.9, 0.6]}>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshStandardMaterial color="#f97316" roughness={0.5} />
      </mesh>
      {/* Snout */}
      <mesh position={[0, 0.78, 0.95]} scale={[0.5, 0.4, 0.6]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.5} />
      </mesh>
      {/* Ears (large pointy) */}
      <mesh position={[-0.3, 1.25, 0.4]} rotation={[-0.2, 0, -0.4]}>
        <coneGeometry args={[0.15, 0.35, 8]} />
        <meshStandardMaterial color="#f97316" roughness={0.5} />
      </mesh>
      <mesh position={[0.3, 1.25, 0.4]} rotation={[-0.2, 0, 0.4]}>
        <coneGeometry args={[0.15, 0.35, 8]} />
        <meshStandardMaterial color="#f97316" roughness={0.5} />
      </mesh>
      {/* Ear tips */}
      <mesh position={[-0.3, 1.35, 0.42]} rotation={[-0.2, 0, -0.4]}>
        <coneGeometry args={[0.08, 0.15, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.3, 1.35, 0.42]} rotation={[-0.2, 0, 0.4]}>
        <coneGeometry args={[0.08, 0.15, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Eyes */}
      <Eye position={[-0.15, 0.92, 0.85]} pupilColor="#1e293b" />
      <Eye position={[0.15, 0.92, 0.85]} pupilColor="#1e293b" />
      {/* Nose */}
      <mesh position={[0, 0.78, 1.08]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Tail (bushy) */}
      <group ref={tailRef} position={[0, 0.3, -0.6]}>
        <mesh position={[0, 0.4, 0]} rotation={[0.6, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.12, 0.6, 8]} />
          <meshStandardMaterial color="#f97316" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.65, 0.05]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.5} />
        </mesh>
      </group>
      <pointLight position={[0, 0.5, 0]} intensity={0.3} color={moodColors[mood] ?? '#fbbf24'} />
    </group>
  );
}

function PandaModel({ mood }: { mood: PetMood }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Body */}
      <mesh position={[0, 0.3, 0]} scale={[1.1, 0.9, 0.8]}>
        <sphereGeometry args={[0.7, 24, 24]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.0, 0.5]}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      {/* Eye patches (black) */}
      <mesh position={[-0.25, 1.05, 0.8]} scale={[0.6, 0.5, 0.3]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.25, 1.05, 0.8]} scale={[0.6, 0.5, 0.3]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.25, 1.05, 0.95]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.25, 1.05, 0.95]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Pupils */}
      <mesh position={[-0.25, 1.05, 1.0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.25, 1.05, 1.0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.9, 0.9]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Ears */}
      <mesh position={[-0.35, 1.4, 0.3]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.35, 1.4, 0.3]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Arms (black) */}
      <mesh position={[-0.6, 0.4, 0.2]} rotation={[0.3, 0, 0.2]}>
        <cylinderGeometry args={[0.08, 0.1, 0.4, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.6, 0.4, 0.2]} rotation={[0.3, 0, -0.2]}>
        <cylinderGeometry args={[0.08, 0.1, 0.4, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Legs (black) */}
      <mesh position={[-0.3, -0.1, 0.3]}>
        <cylinderGeometry args={[0.1, 0.12, 0.25, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.3, -0.1, 0.3]}>
        <cylinderGeometry args={[0.1, 0.12, 0.25, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <pointLight position={[0, 0.5, 0]} intensity={0.3} color={moodColors[mood] ?? '#fbbf24'} />
    </group>
  );
}

function PenguinModel({ mood }: { mood: PetMood }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.06;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* Body (egg shape) */}
      <mesh position={[0, 0.3, 0]} scale={[0.9, 1.1, 0.7]}>
        <sphereGeometry args={[0.65, 24, 24]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} />
      </mesh>
      {/* Belly (white) */}
      <mesh position={[0, 0.3, 0.35]} scale={[0.6, 0.8, 0.4]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#f3f4f6" roughness={0.4} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.9, 0.4]}>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} />
      </mesh>
      {/* Face (white) */}
      <mesh position={[0, 0.85, 0.55]} scale={[0.6, 0.5, 0.3]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#f3f4f6" roughness={0.4} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.1, 0.95, 0.6]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.1, 0.95, 0.6]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Beak */}
      <mesh position={[0, 0.85, 0.7]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.05, 0.15, 6]} />
        <meshStandardMaterial color="#f97316" />
      </mesh>
      {/* Flippers */}
      <mesh position={[-0.65, 0.3, 0]} rotation={[0, 0, 0.5]} scale={[0.3, 0.7, 0.2]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} />
      </mesh>
      <mesh position={[0.65, 0.3, 0]} rotation={[0, 0, -0.5]} scale={[0.3, 0.7, 0.2]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} />
      </mesh>
      {/* Feet */}
      <mesh position={[-0.2, -0.2, 0.1]} scale={[0.5, 0.2, 0.4]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#f97316" />
      </mesh>
      <mesh position={[0.2, -0.2, 0.1]} scale={[0.5, 0.2, 0.4]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#f97316" />
      </mesh>
      <pointLight position={[0, 0.5, 0]} intensity={0.3} color={moodColors[mood] ?? '#fbbf24'} />
    </group>
  );
}

function DragonModel({ mood }: { mood: PetMood }) {
  const groupRef = useRef<THREE.Group>(null);
  const wingLRef = useRef<THREE.Group>(null);
  const wingRRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.1;
    }
    const flap = Math.sin(Date.now() * 0.003) * 0.2;
    if (wingLRef.current) wingLRef.current.rotation.z = flap;
    if (wingRRef.current) wingRRef.current.rotation.z = -flap;
    if (tailRef.current) tailRef.current.rotation.y = Math.sin(Date.now() * 0.002) * 0.3;
  });

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      {/* Body */}
      <mesh position={[0, 0.3, 0]} scale={[1.1, 0.8, 0.8]}>
        <sphereGeometry args={[0.7, 24, 24]} />
        <meshStandardMaterial color="#22c55e" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Belly */}
      <mesh position={[0, 0.2, 0.35]} scale={[0.6, 0.5, 0.4]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#86efac" roughness={0.4} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.8, 0.7]}>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshStandardMaterial color="#22c55e" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Snout */}
      <mesh position={[0, 0.7, 1.0]} scale={[0.5, 0.4, 0.5]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#16a34a" roughness={0.4} />
      </mesh>
      {/* Horns */}
      <mesh position={[-0.2, 1.1, 0.55]} rotation={[-0.5, 0, -0.3]}>
        <coneGeometry args={[0.05, 0.25, 6]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.5} />
      </mesh>
      <mesh position={[0.2, 1.1, 0.55]} rotation={[-0.5, 0, 0.3]}>
        <coneGeometry args={[0.05, 0.25, 6]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.5} />
      </mesh>
      {/* Eyes (slitted) */}
      <mesh position={[-0.15, 0.85, 0.9]} scale={[0.7, 0.3, 0.3]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[0.15, 0.85, 0.9]} scale={[0.7, 0.3, 0.3]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      {/* Wings */}
      <group ref={wingLRef} position={[-0.6, 0.6, 0]}>
        <mesh position={[-0.2, 0, 0]} rotation={[0, 0, 0.3]}>
          <planeGeometry args={[0.5, 0.3]} />
          <meshStandardMaterial color="#16a34a" side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      </group>
      <group ref={wingRRef} position={[0.6, 0.6, 0]}>
        <mesh position={[0.2, 0, 0]} rotation={[0, 0, -0.3]}>
          <planeGeometry args={[0.5, 0.3]} />
          <meshStandardMaterial color="#16a34a" side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      </group>
      {/* Tail */}
      <group ref={tailRef} position={[0, 0.2, -0.65]}>
        <mesh position={[0, 0.3, 0]} rotation={[0.5, 0, 0]}>
          <coneGeometry args={[0.06, 0.35, 8]} />
          <meshStandardMaterial color="#22c55e" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.55, 0.1]}>
          <coneGeometry args={[0.04, 0.12, 6]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
      </group>
      {/* Spikes on back */}
      {[-0.3, 0, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.65, -0.1]} rotation={[0.2, 0, 0]}>
          <coneGeometry args={[0.04, 0.12, 6]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
      ))}
      <pointLight position={[0, 0.5, 0]} intensity={0.5} color={moodColors[mood] ?? '#fbbf24'} />
    </group>
  );
}

function UnicornModel({ mood }: { mood: PetMood }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Body */}
      <mesh position={[0, 0.3, 0]} scale={[1.1, 0.8, 0.7]}>
        <sphereGeometry args={[0.65, 24, 24]} />
        <meshStandardMaterial color="#fdf2f8" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.85, 0.65]}>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshStandardMaterial color="#fdf2f8" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Snout */}
      <mesh position={[0, 0.75, 0.95]} scale={[0.5, 0.4, 0.5]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#fce7f3" roughness={0.3} />
      </mesh>
      {/* Horn */}
      <mesh position={[0, 1.2, 0.55]} rotation={[-0.1, 0, 0]}>
        <coneGeometry args={[0.04, 0.3, 8]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Mane (colorful) */}
      {[0.3, 0.5, 0.7].map((y, i) => (
        <mesh key={i} position={[0, y, -0.2]} scale={[1, 0.3, 0.3]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color={['#ec4899', '#8b5cf6', '#3b82f6'][i] ?? '#ec4899'} roughness={0.5} />
        </mesh>
      ))}
      {/* Eyes */}
      <Eye position={[-0.15, 0.9, 0.85]} />
      <Eye position={[0.15, 0.9, 0.85]} />
      {/* Eyelashes */}
      {[-0.18, -0.12].map((x, i) => (
        <mesh key={i} position={[x, 0.95, 0.85]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.005, 0.005, 0.06, 4]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      ))}
      {/* Tail (colorful) */}
      <mesh position={[0, 0.2, -0.6]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ec4899" roughness={0.5} />
      </mesh>
      <mesh position={[0.05, 0.1, -0.65]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#8b5cf6" roughness={0.5} />
      </mesh>
      <pointLight position={[0, 0.5, 0]} intensity={0.4} color={moodColors[mood] ?? '#fbbf24'} />
    </group>
  );
}

const speciesModels: Record<string, React.FC<{ mood: PetMood }>> = {
  CAT: CatModel,
  DOG: DogModel,
  RABBIT: RabbitModel,
  HAMSTER: HamsterModel,
  FOX: FoxModel,
  PANDA: PandaModel,
  PENGUIN: PenguinModel,
  DRAGON: DragonModel,
  UNICORN: UnicornModel,
  CUSTOM: CatModel,
};

export function PetModel({ modelUrl, mood, species }: PetModelProps) {
  if (modelUrl) {
    return <LoadedModel url={modelUrl} mood={mood} />;
  }

  const SpeciesComponent = species ? speciesModels[species] : null;
  if (SpeciesComponent) {
    return <SpeciesComponent mood={mood} />;
  }

  return <DefaultPet />;
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
      <mesh position={[-0.35, 0.2, 0.9]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.35, 0.2, 0.9]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
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

function LoadedModel({ url }: { url: string; mood: PetMood }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);

  useFrame(() => {
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
