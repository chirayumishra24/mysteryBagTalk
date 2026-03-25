import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Stars,
} from "@react-three/drei";
import MysteryBag from "./MysteryBag";

/**
 * Scene - 3D Canvas wrapper for the Mystery Bag.
 */
export default function Scene({ onBagClick, isBagOpened }) {
  // Prevent hydration mismatch / ensure client-side rendering
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="w-full h-full absolute inset-0 z-10">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 45 }}
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
      {/* Transparent background is handled by canvas alpha naturally */}
        <ambientLight intensity={0.7} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={2}
          color="#fffbeb"
          castShadow
        />
        <spotLight
          position={[-10, 10, -10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          color="#fef3c7"
        />

        <Suspense fallback={null}>
          <MysteryBag onClick={onBagClick} isOpened={isBagOpened} />
          <Environment preset="apartment" />
          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.4}
            scale={20}
            blur={2}
            far={4.5}
            color="#92400e"
          />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
          autoRotate={!isBagOpened}
          autoRotateSpeed={0.5}
        />
      </Canvas>

    </div>
  );
}
