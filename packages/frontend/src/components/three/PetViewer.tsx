'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import type { PetMood, PetSpecies } from '@amigitos/shared';
import { PetModel } from './PetModel';

interface PetViewerProps {
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

export function PetViewer({ modelUrl, mood, species }: PetViewerProps) {
  return (
    <Canvas
      camera={{ position: [0, 2, 5], fov: 45 }}
      gl={{ antialias: true }}
      className="w-full h-full"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, 5, -5]} intensity={0.3} />
        <pointLight position={[0, 3, 0]} intensity={0.5} color={moodColors[mood] ?? '#ffffff'} />

        <PetModel modelUrl={modelUrl} mood={mood} species={species} />

        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2.5} />
        <Environment preset="studio" />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate
          autoRotateSpeed={2}
        />
      </Suspense>
    </Canvas>
  );
}
