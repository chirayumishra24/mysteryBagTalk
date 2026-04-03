import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import GlowingHollow from "./GlowingHollow";

/**
 * Scene - 3D Canvas wrapper for the Discovery Tree Hollow.
 * Sits in the background globally.
 */
export default function Scene() {
  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
        className="w-full h-screen fixed top-0 left-0 z-0 pointer-events-none"
      >
        <Canvas
          camera={{ position: [0, 1, 8], fov: 45 }}
          dpr={[1, 2]}
          gl={{ preserveDrawingBuffer: true, antialias: true }}
        >
          <ambientLight intensity={0.4} />
          <spotLight
            position={[10, 15, 10]}
            angle={0.3}
            penumbra={1}
            intensity={2}
            color="#86efac"
          />
          <spotLight
            position={[-10, 10, -10]}
            angle={0.3}
            penumbra={1}
            intensity={1}
            color="#059669"
          />

          <Suspense fallback={null}>
            <GlowingHollow />
            <Environment preset="forest" />
            <ContactShadows
              position={[0, -2.5, 0]}
              opacity={0.6}
              scale={25}
              blur={3}
              far={5}
              color="#022c22"
            />
          </Suspense>

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </motion.div>
    </AnimatePresence>
  );
}
