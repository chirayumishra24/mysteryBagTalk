import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useSpring, a } from "@react-spring/three";
import { RoundedBox, Sparkles, Text } from "@react-three/drei";
import * as THREE from "three";

/**
 * Cartoon MysteryBag - Brown bag with a large question mark.
 */
export default function MysteryBag({ onClick, isOpened = false }) {
  const outerRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Floating animations
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (outerRef.current && !isOpened) {
      outerRef.current.position.y = Math.sin(time * 2) * 0.1;
      outerRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
    }
  });

  // Dramatic spring states
  const { scale, positionY } = useSpring({
    scale: isOpened ? 0 : hovered ? 1.1 : 1,
    positionY: isOpened ? 5 : 0,
    config: { mass: 2, tension: 350, friction: 40 },
  });

  return (
    <group>
      <a.group
        ref={outerRef}
        onClick={(e) => {
          e.stopPropagation();
          if (!isOpened) onClick?.();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={scale}
        position-y={positionY}
      >
        {/* The Bag Shell */}
        <RoundedBox args={[2.5, 2.8, 2.5]} radius={0.4} smoothness={4}>
          <meshStandardMaterial 
            color="#92400e" 
            roughness={0.8}
            metalness={0.1}
          />
        </RoundedBox>

        {/* The Question Mark */}
        <Text
          position={[0, 0, 1.3]}
          fontSize={1.8}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          ?
        </Text>

        {/* Sparkles on hover */}
        {!isOpened && hovered && (
          <Sparkles
            count={40}
            scale={4}
            size={5}
            speed={0.4}
            opacity={0.6}
            color="#facc15"
          />
        )}
      </a.group>
      
      {/* Explosive particles when opened */}
      {isOpened && (
         <Sparkles
          count={150}
          scale={10}
          size={6}
          speed={3}
          opacity={1}
          color="#facc15"
          position={[0, 0, 0]}
        />
      )}
    </group>
  );
}
