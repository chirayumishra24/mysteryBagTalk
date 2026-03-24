import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useSpring, a } from "@react-spring/three";
import { RoundedBox, Sparkles, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * Premium MysteryBag - Advanced glassmorphism 3D effect with internal glowing core.
 */
export default function MysteryBag({ onClick, isOpened = false }) {
  const outerRef = useRef();
  const innerRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Floating & heartbeat animations
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (outerRef.current && !isOpened) {
      outerRef.current.position.y = Math.sin(time * 2) * 0.1;
      outerRef.current.rotation.y += 0.005;
      outerRef.current.rotation.x = Math.sin(time * 0.5) * 0.05;
    }
    
    if (innerRef.current) {
      // Rapid pulse for inner core
      const pulse = Math.sin(time * (hovered && !isOpened ? 12 : 3)) * 0.1 + 0.9;
      innerRef.current.scale.set(pulse, pulse, pulse);
      innerRef.current.rotation.x += 0.02;
      innerRef.current.rotation.y += 0.03;
    }
  });

  // Dramatic spring states
  const { scale, positionY, blur } = useSpring({
    scale: isOpened ? 0 : hovered ? 1.05 : 1,
    positionY: isOpened ? 5 : 0,
    blur: hovered ? 0.1 : 0.8, // Frosting clears on hover
    config: { mass: 2, tension: 350, friction: 40 },
  });

  return (
    <group>
      {/* The Glass Shell */}
      <a.mesh
        ref={outerRef}
        onClick={(e) => {
          e.stopPropagation();
          if (!isOpened) onClick?.();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={scale}
        position-y={positionY}
        castShadow
        receiveShadow
        className={!isOpened ? "cursor-pointer" : ""}
      >
        <RoundedBox args={[2.2, 2.2, 2.2]} radius={0.3} smoothness={8}>
          <MeshTransmissionMaterial
            backside={true}
            samples={4}
            thickness={0.5}
            chromaticAberration={0.05}
            anisotropy={0.3}
            roughness={hovered ? 0.1 : 0.3}
            clearcoat={1}
            clearcoatRoughness={0.1}
            color="#a78bfa"
            envMapIntensity={2}
          />
        </RoundedBox>

        {/* The Internal Magical Core */}
        <mesh ref={innerRef}>
          <octahedronGeometry args={[0.8, 1]} />
          <meshPhysicalMaterial 
            color={hovered ? "#ff71ce" : "#01cdfe"}
            emissive={hovered ? "#ff71ce" : "#01cdfe"}
            emissiveIntensity={hovered ? 4 : 1.5}
            roughness={0}
            metalness={0.8}
            wireframe={true}
          />
        </mesh>
        <mesh scale={[0.6, 0.6, 0.6]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial 
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={5}
          />
        </mesh>

        {/* Hover Sparkles */}
        {!isOpened && hovered && (
          <Sparkles
            count={60}
            scale={4}
            size={3}
            speed={0.6}
            opacity={0.8}
            color="#05ffa1"
          />
        )}
      </a.mesh>
      
      {/* Explosive particles when opened */}
      {isOpened && (
         <Sparkles
          count={200}
          scale={8}
          size={5}
          speed={4}
          opacity={1}
          color="#f472b6"
          position={[0, 0, 0]}
        />
      )}
    </group>
  );
}
