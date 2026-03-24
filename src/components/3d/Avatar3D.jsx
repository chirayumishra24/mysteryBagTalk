/**
 * Avatar3D - Procedural 3D character models built from R3F primitives.
 */
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const AVATAR_CONFIGS = {
  Wizard: {
    bodyColor: "#7c3aed",
    headColor: "#a78bfa",
    accentColor: "#f472b6",
    hatHeight: 0.6,
  },
  Astronaut: {
    bodyColor: "#e2e8f0",
    headColor: "#94a3b8",
    accentColor: "#3b82f6",
    hatHeight: 0,
  },
  Superhero: {
    bodyColor: "#dc2626",
    headColor: "#fbbf24",
    accentColor: "#1d4ed8",
    hatHeight: 0,
  },
  Fairy: {
    bodyColor: "#f472b6",
    headColor: "#fda4af",
    accentColor: "#d946ef",
    hatHeight: 0,
  },
  Robot: {
    bodyColor: "#64748b",
    headColor: "#94a3b8",
    accentColor: "#22d3ee",
    hatHeight: 0,
  },
  Unicorn: {
    bodyColor: "#e9d5ff",
    headColor: "#f5d0fe",
    accentColor: "#a855f7",
    hatHeight: 0.5,
  },
  Cat: {
    bodyColor: "#fb923c",
    headColor: "#fdba74",
    accentColor: "#f97316",
    hatHeight: 0,
  },
  Fox: {
    bodyColor: "#ea580c",
    headColor: "#fed7aa",
    accentColor: "#f97316",
    hatHeight: 0,
  },
};

export default function Avatar3D({ name, isSelected }) {
  const group = useRef();
  const config = AVATAR_CONFIGS[name] || AVATAR_CONFIGS.Wizard;

  useFrame((state) => {
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      group.current.rotation.y += isSelected ? 0.03 : 0.01;
    }
  });

  return (
    <group ref={group} scale={isSelected ? 1.5 : 1.2} position={[0, -0.2, 0]}>
      {/* Body */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 0.7, 16]} />
        <meshStandardMaterial color={config.bodyColor} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={config.headColor} roughness={0.2} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.1, 0.35, 0.25]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#1e1b4b" />
      </mesh>
      <mesh position={[0.1, 0.35, 0.25]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#1e1b4b" />
      </mesh>

      {/* Smile */}
      <mesh position={[0, 0.22, 0.27]} rotation={[0.3, 0, 0]}>
        <torusGeometry args={[0.06, 0.015, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#1e1b4b" />
      </mesh>

      {/* Hat */}
      {config.hatHeight > 0 && (
        <mesh position={[0, 0.65, 0]}>
          <coneGeometry args={[0.2, config.hatHeight, 8]} />
          <meshStandardMaterial
            color={config.accentColor}
            emissive={config.accentColor}
            emissiveIntensity={0.2}
          />
        </mesh>
      )}

      {/* Belt */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.08, 16]} />
        <meshStandardMaterial
          color={config.accentColor}
          emissive={config.accentColor}
          emissiveIntensity={isSelected ? 0.4 : 0.1}
        />
      </mesh>
    </group>
  );
}
