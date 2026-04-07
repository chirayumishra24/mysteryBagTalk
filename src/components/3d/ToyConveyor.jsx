import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import {
  RoundedBox,
  Sphere,
  Torus,
  Cone,
  Cylinder,
  MeshDistortMaterial,
  Environment,
  Float,
  Stars,
} from "@react-three/drei";

// ─── Mouse Tracker ────────────────────────────────────────
function MouseCamera() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useFrame(() => {
    camera.position.x += (mouse.current.x * 2.5 - camera.position.x) * 0.03;
    camera.position.y += (mouse.current.y * 1.5 + 3.5 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── Conveyor Belt ────────────────────────────────────────
function ConveyorBelt() {
  const beltRef = useRef();
  const offsetRef = useRef(0);

  useFrame((_, delta) => {
    offsetRef.current += delta * 0.3;
    if (beltRef.current) {
      beltRef.current.material.map.offset.x = offsetRef.current;
    }
  });

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");

    // Dark metallic belt
    ctx.fillStyle = "#2a2a3e";
    ctx.fillRect(0, 0, 512, 128);

    // Grooves
    for (let i = 0; i < 32; i++) {
      ctx.fillStyle = i % 2 === 0 ? "#353550" : "#1e1e30";
      ctx.fillRect(i * 16, 0, 16, 128);
    }

    // Edge lines
    ctx.fillStyle = "#ffd70040";
    ctx.fillRect(0, 0, 512, 4);
    ctx.fillRect(0, 124, 512, 4);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 1);
    return tex;
  }, []);

  return (
    <group position={[0, -1.8, 0]}>
      {/* Belt surface */}
      <mesh ref={beltRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.55, 0]}>
        <planeGeometry args={[20, 2.5]} />
        <meshStandardMaterial map={texture} roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Belt frame - left rail */}
      <mesh position={[0, 0.3, -1.35]}>
        <boxGeometry args={[20, 0.6, 0.15]} />
        <meshStandardMaterial color="#4a3f6b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Belt frame - right rail */}
      <mesh position={[0, 0.3, 1.35]}>
        <boxGeometry args={[20, 0.6, 0.15]} />
        <meshStandardMaterial color="#4a3f6b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Rollers */}
      {[-9, -6, -3, 0, 3, 6, 9].map((x, i) => (
        <Roller key={i} position={[x, 0, 0]} />
      ))}

      {/* Support legs */}
      {[-8, -3, 3, 8].map((x, i) => (
        <group key={i}>
          <mesh position={[x, -0.5, -1.1]}>
            <boxGeometry args={[0.2, 1.2, 0.2]} />
            <meshStandardMaterial color="#3d3560" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[x, -0.5, 1.1]}>
            <boxGeometry args={[0.2, 1.2, 0.2]} />
            <meshStandardMaterial color="#3d3560" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Roller({ position }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 2;
  });
  return (
    <Cylinder ref={ref} args={[0.2, 0.2, 2.5, 16]} position={position} rotation={[Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color="#5a4f8b" metalness={0.8} roughness={0.2} />
    </Cylinder>
  );
}

// ─── Toy Objects on the Belt ──────────────────────────────

const CONVEYOR_SPEED = 1.2;
const BELT_START = 12;
const BELT_END = -12;

const toyColors = [
  "#ff6b6b", "#ffd700", "#7c3aed", "#2dd4bf",
  "#ff6b9d", "#f59e0b", "#22d3ee", "#a78bfa",
];

function GiftBox({ startX, z, color, size = 1 }) {
  const ref = useRef();
  const ribbonColor = useMemo(() => {
    const colors = ["#ffd700", "#ff6b9d", "#7c3aed", "#2dd4bf"];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.position.x -= delta * CONVEYOR_SPEED;
    ref.current.rotation.y += delta * 0.3;
    if (ref.current.position.x < BELT_END) {
      ref.current.position.x = BELT_START;
    }
  });

  const s = size * 0.5;

  return (
    <group ref={ref} position={[startX, -0.95, z]}>
      {/* Box */}
      <RoundedBox args={[s, s, s]} radius={0.04} smoothness={4}>
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </RoundedBox>
      {/* Ribbon horizontal */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[s + 0.02, 0.06, s + 0.02]} />
        <meshStandardMaterial color={ribbonColor} roughness={0.2} metalness={0.3} />
      </mesh>
      {/* Ribbon vertical */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.06, s + 0.02, s + 0.02]} />
        <meshStandardMaterial color={ribbonColor} roughness={0.2} metalness={0.3} />
      </mesh>
      {/* Bow */}
      <Torus args={[0.08 * size, 0.025, 8, 16]} position={[0, s / 2 + 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={ribbonColor} roughness={0.2} metalness={0.4} />
      </Torus>
    </group>
  );
}

function TeddyBear({ startX, z }) {
  const ref = useRef();

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.position.x -= delta * CONVEYOR_SPEED;
    ref.current.rotation.y += delta * 0.5;
    if (ref.current.position.x < BELT_END) {
      ref.current.position.x = BELT_START;
    }
  });

  return (
    <group ref={ref} position={[startX, -0.85, z]}>
      {/* Body */}
      <Sphere args={[0.3, 16, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#c4956a" roughness={0.9} />
      </Sphere>
      {/* Head */}
      <Sphere args={[0.22, 16, 16]} position={[0, 0.38, 0]}>
        <meshStandardMaterial color="#c4956a" roughness={0.9} />
      </Sphere>
      {/* Ears */}
      <Sphere args={[0.1, 12, 12]} position={[-0.16, 0.55, 0]}>
        <meshStandardMaterial color="#a07050" roughness={0.9} />
      </Sphere>
      <Sphere args={[0.1, 12, 12]} position={[0.16, 0.55, 0]}>
        <meshStandardMaterial color="#a07050" roughness={0.9} />
      </Sphere>
      {/* Eyes */}
      <Sphere args={[0.04, 8, 8]} position={[-0.08, 0.42, 0.18]}>
        <meshStandardMaterial color="#1a1a2e" />
      </Sphere>
      <Sphere args={[0.04, 8, 8]} position={[0.08, 0.42, 0.18]}>
        <meshStandardMaterial color="#1a1a2e" />
      </Sphere>
      {/* Nose */}
      <Sphere args={[0.04, 8, 8]} position={[0, 0.35, 0.2]}>
        <meshStandardMaterial color="#333" />
      </Sphere>
    </group>
  );
}

function StarToy({ startX, z, color }) {
  const ref = useRef();

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.position.x -= delta * CONVEYOR_SPEED;
    ref.current.rotation.y += delta * 1.5;
    ref.current.rotation.z += delta * 0.5;
    if (ref.current.position.x < BELT_END) {
      ref.current.position.x = BELT_START;
    }
  });

  const starShape = useMemo(() => {
    const shape = new THREE.Shape();
    const outerR = 0.3, innerR = 0.13, points = 5;
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
  }, []);

  return (
    <group ref={ref} position={[startX, -0.9, z]}>
      <mesh>
        <extrudeGeometry args={[starShape, { depth: 0.12, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 }]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.6} emissive={color} emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

function QuestionMark({ startX, z }) {
  const ref = useRef();

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.position.x -= delta * CONVEYOR_SPEED;
    ref.current.position.y = -0.8 + Math.sin(Date.now() * 0.003) * 0.1;
    if (ref.current.position.x < BELT_END) {
      ref.current.position.x = BELT_START;
    }
  });

  return (
    <group ref={ref} position={[startX, -0.8, z]}>
      {/* The curved part */}
      <Torus args={[0.18, 0.06, 12, 24, Math.PI * 1.4]} position={[0, 0.2, 0]} rotation={[0, 0, 0.4]}>
        <meshStandardMaterial color="#ffd700" roughness={0.2} metalness={0.5} emissive="#ffd700" emissiveIntensity={0.3} />
      </Torus>
      {/* Stem */}
      <Cylinder args={[0.06, 0.06, 0.14, 8]} position={[0.05, 0, 0]}>
        <meshStandardMaterial color="#ffd700" roughness={0.2} metalness={0.5} emissive="#ffd700" emissiveIntensity={0.3} />
      </Cylinder>
      {/* Dot */}
      <Sphere args={[0.07, 12, 12]} position={[0.05, -0.15, 0]}>
        <meshStandardMaterial color="#ffd700" roughness={0.2} metalness={0.5} emissive="#ffd700" emissiveIntensity={0.3} />
      </Sphere>
    </group>
  );
}

function BuildingBlock({ startX, z, color }) {
  const ref = useRef();
  const rotSpeed = useMemo(() => 0.3 + Math.random() * 0.5, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.position.x -= delta * CONVEYOR_SPEED;
    ref.current.rotation.y += delta * rotSpeed;
    if (ref.current.position.x < BELT_END) {
      ref.current.position.x = BELT_START;
    }
  });

  return (
    <group ref={ref} position={[startX, -1.0, z]}>
      <RoundedBox args={[0.35, 0.35, 0.35]} radius={0.03} smoothness={4}>
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
      </RoundedBox>
      {/* Letter on block */}
      <mesh position={[0, 0, 0.18]}>
        <planeGeometry args={[0.2, 0.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} opacity={0.4} transparent />
      </mesh>
    </group>
  );
}

function BallToy({ startX, z, color }) {
  const ref = useRef();

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.position.x -= delta * CONVEYOR_SPEED;
    ref.current.position.y = -0.95 + Math.abs(Math.sin(Date.now() * 0.004 + startX)) * 0.15;
    if (ref.current.position.x < BELT_END) {
      ref.current.position.x = BELT_START;
    }
  });

  return (
    <Sphere ref={ref} args={[0.22, 24, 24]} position={[startX, -0.95, z]}>
      <MeshDistortMaterial color={color} roughness={0.3} metalness={0.2} distort={0.1} speed={2} />
    </Sphere>
  );
}

// ─── Floating Ambient Particles ───────────────────────────
function FloatingParticles() {
  const count = 80;
  const ref = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = Math.random() * 10 - 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const posArr = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 1] += delta * 0.3;
      if (posArr[i * 3 + 1] > 8) posArr[i * 3 + 1] = -2;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#ffd700" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

// ─── Scene ────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <MouseCamera />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#fff5e1" castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.4} color="#a78bfa" />
      <pointLight position={[0, 2, 3]} intensity={0.8} color="#ffd700" distance={10} />
      <pointLight position={[-5, 1, 0]} intensity={0.5} color="#7c3aed" distance={8} />
      <pointLight position={[5, 1, 0]} intensity={0.5} color="#2dd4bf" distance={8} />

      <fog attach="fog" args={["#0d0a1e", 8, 22]} />

      <ConveyorBelt />

      {/* Gift boxes — spread across the belt */}
      <GiftBox startX={-8} z={-0.3} color="#e74c3c" size={1.1} />
      <GiftBox startX={-4} z={0.4} color="#7c3aed" size={0.9} />
      <GiftBox startX={0} z={-0.5} color="#ffd700" size={1.0} />
      <GiftBox startX={4} z={0.2} color="#2dd4bf" size={1.2} />
      <GiftBox startX={8} z={-0.2} color="#ff6b9d" size={0.85} />
      <GiftBox startX={11} z={0.5} color="#f59e0b" size={1.0} />

      {/* Teddy bears */}
      <TeddyBear startX={-6} z={0} />
      <TeddyBear startX={6} z={-0.3} />

      {/* Stars */}
      <StarToy startX={-2} z={0.3} color="#ffd700" />
      <StarToy startX={5} z={-0.6} color="#ff6b9d" />
      <StarToy startX={10} z={0.1} color="#2dd4bf" />

      {/* Question marks */}
      <QuestionMark startX={-5} z={0.6} />
      <QuestionMark startX={3} z={-0.4} />
      <QuestionMark startX={9} z={0.3} />

      {/* Building blocks */}
      <BuildingBlock startX={-3} z={-0.6} color="#ff6b6b" />
      <BuildingBlock startX={1} z={0.5} color="#22d3ee" />
      <BuildingBlock startX={7} z={-0.1} color="#a78bfa" />

      {/* Bouncing balls */}
      <BallToy startX={-7} z={0.5} color="#ff6b9d" />
      <BallToy startX={2} z={-0.3} color="#ffd700" />
      <BallToy startX={8} z={0.4} color="#7c3aed" />

      <FloatingParticles />
      <Stars radius={15} depth={20} count={300} factor={3} saturation={0.5} fade speed={1} />
    </>
  );
}

// ─── Exported Component ───────────────────────────────────
export default function ToyConveyor() {
  return (
    <div className="fixed inset-0 z-0" style={{ background: "linear-gradient(180deg, #0d0a1e 0%, #16213e 40%, #1a1a2e 100%)" }}>
      <Canvas
        camera={{ position: [0, 3.5, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
        style={{ pointerEvents: "auto" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
