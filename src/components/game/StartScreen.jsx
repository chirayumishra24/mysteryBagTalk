import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import useGameStore from "../../store/useGameStore";
import Button from "../ui/Button";
import Logo from "../ui/Logo";
import mascotHappy from "../../assets/mascot_happy.png"; // Placeholder path
import { resumeAudio, playChime, playClick } from "../../hooks/useAudio";
import Avatar3D, { AVATAR_CONFIGS } from "../3d/Avatar3D";

export default function StartScreen() {
  const { setStep, setAvatar, setPlayerName, selectedAvatar } = useGameStore();
  const [name, setName] = useState("");
  const [chosenAvatar, setChosenAvatar] = useState(null);

  const handleStart = () => {
    resumeAudio();
    playChime();
    setPlayerName(name || "Mystery Speaker");
    if (chosenAvatar) setAvatar(chosenAvatar);
    setStep("content");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[80vh] text-center z-20 relative"
    >
      {/* Hero Section */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
        className="text-center space-y-8 mb-6"
      >
        <Logo />
        
        <p className="text-xl md:text-2xl text-purple-200/80 max-w-2xl mx-auto leading-relaxed font-body">
          Step into the classroom of curiosity! Can you guess what's hidden inside the mystery bag?
        </p>
      </motion.div>

      {/* Avatar Selection */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-2xl mb-6"
      >
        <h3 className="text-sm font-display font-bold text-purple-300 uppercase tracking-wider mb-3">
          Choose Your 3D Avatar
        </h3>
        
        {/* Large Showcase of the Chosen Avatar */}
        <div className="w-48 h-48 mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-purple-500/10 blur-xl rounded-full" />
          {chosenAvatar ? (
            <Canvas camera={{ position: [0, 0, 3], fov: 45 }} className="rounded-full border-2 border-purple-400/30 glass shadow-[0_0_30px_rgba(139,92,246,0.5)]">
               <ambientLight intensity={0.5} />
               <directionalLight position={[5, 5, 5]} intensity={1} />
               <Environment preset="city" />
               <Suspense fallback={null}>
                  <Avatar3D name={chosenAvatar.name} isSelected={true} />
               </Suspense>
            </Canvas>
          ) : (
            <div className="w-full h-full rounded-full border-2 border-dashed border-purple-500/30 flex items-center justify-center text-purple-300/50 italic text-sm">
              Select below
            </div>
          )}
        </div>

        {/* Small Picker Grid */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {AVATARS.map((avatar) => {
             const config = AVATAR_CONFIGS[avatar.name] || AVATAR_CONFIGS.Wizard;
             const isSel = chosenAvatar === avatar;
             return (
              <motion.button
                key={avatar.name}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  playClick();
                  setChosenAvatar(avatar);
                }}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden relative ${
                  isSel
                    ? "shadow-[0_0_20px_rgba(139,92,246,0.6)] border-2 scale-110 z-10"
                    : "glass border hover:border-purple-400/50"
                }`}
                style={{
                  borderColor: isSel ? config.accentColor : "rgba(139,92,246,0.2)",
                  background: isSel ? `radial-gradient(circle at center, ${config.accentColor}40, transparent)` : undefined,
                }}
                title={avatar.name}
              >
                  <div className="absolute inset-0 opacity-50">
                     <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
                       <ambientLight intensity={0.6} />
                       <directionalLight position={[2, 5, 2]} intensity={1} />
                       <Suspense fallback={null}>
                         <Avatar3D name={avatar.name} isSelected={false} />
                       </Suspense>
                     </Canvas>
                  </div>
              </motion.button>
             );
          })}
        </div>

        {/* Player Name */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name (optional)"
          className="w-full max-w-sm mx-auto block bg-purple-900/30 border border-purple-500/20 rounded-xl px-4 py-3 text-center text-purple-100 font-body placeholder:text-purple-400/40 focus:outline-none focus:border-purple-400 transition-colors"
        />
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8, type: "spring", stiffness: 100 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full scale-150 animate-pulse-glow" />
        <Button
          size="xl"
          onClick={handleStart}
          icon="🎮"
          className="relative z-10"
        >
          Start Game
        </Button>
      </motion.div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-2xl blur-xl"
        animate={{ y: [0, -30, 0], rotate: [0, 45, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-full blur-xl"
        animate={{ y: [0, 40, 0], x: [0, -20, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </motion.div>
  );
}
