import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useSpring, a } from "@react-spring/three";
import { Icosahedron, Sparkles, Sphere } from "@react-three/drei";
import * as THREE from "three";

/**
 * Glowing Hollow
 * An ethereal floating energy orb inside a stylized tree hollow.
 */
export default function GlowingHollow({ isOpened = false }) {
  const outerRef = useRef();

  // Floating animations
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (outerRef.current) {
      outerRef.current.position.y = Math.sin(time * 1.5) * 0.2;
      outerRef.current.rotation.y += 0.01;
      outerRef.current.rotation.z = Math.sin(time * 0.5) * 0.05;
    }
  });

  const { scale, energyOpacity } = useSpring({
    scale: isOpened ? 2 : 1,
    energyOpacity: isOpened ? 0 : 0.8,
    config: { mass: 2, tension: 200, friction: 30 },
  });

  return (
    <group position={[0, -0.5, 0]}>
      <a.group ref={outerRef} scale={scale}>
        
        {/* Core Energy Orb */}
        <Sphere args={[1.2, 32, 32]}>
          <a.meshBasicMaterial 
            color="#86efac" 
            transparent 
            opacity={energyOpacity} 
            blending={THREE.AdditiveBlending} 
          />
        </Sphere>
        
        {/* Geometric Magic Shell */}
        <Icosahedron args={[1.5, 1]} wireframe>
          <a.meshBasicMaterial 
            color="#fef08a" 
            transparent 
            opacity={energyOpacity} 
          />
        </Icosahedron>

        <Sparkles
          count={100}
          scale={3}
          size={4}
          speed={0.5}
          opacity={isOpened ? 0 : 0.8}
          color="#10b981"
        />

      </a.group>

      {/* Explosive particles on spell cast (opened) */}
      {isOpened && (
         <Sparkles
          count={250}
          scale={15}
          size={6}
          speed={4}
          opacity={1}
          color="#34d399"
          position={[0, 0, 0]}
        />
      )}
    </group>
  );
}
