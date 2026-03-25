import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import useGameStore, { AVATARS } from "../../store/useGameStore";
import { GameLogo } from "../ui/Logo";
import { resumeAudio, playChime, playClick } from "../../hooks/useAudio";
import Avatar3D, { AVATAR_CONFIGS } from "../3d/Avatar3D";

export default function StartScreen() {
  const { setStep, setAvatar, setPlayerName } = useGameStore();
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
        <GameLogo />
        
        <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-display font-black uppercase tracking-tight">
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
        <h3 className="text-sm font-display font-black text-secondary uppercase tracking-widest mb-4">
          CHOOSE YOUR 3D AVATAR
        </h3>
        
        {/* Large Showcase of the Chosen Avatar */}
        <div className="w-48 h-48 mx-auto mb-8 relative group">
          <div className="absolute inset-[-10px] bg-secondary/10 blur-2xl rounded-full group-hover:bg-secondary/20 transition-all" />
          {chosenAvatar ? (
            <Canvas camera={{ position: [0, 0, 3], fov: 45 }} className="rounded-[3rem] border-4 border-white bg-white/50 shadow-xl overflow-hidden">
               <ambientLight intensity={0.5} />
               <directionalLight position={[5, 5, 5]} intensity={1} />
               <Environment preset="city" />
               <Suspense fallback={null}>
                  <Avatar3D name={chosenAvatar.name} isSelected={true} />
               </Suspense>
            </Canvas>
          ) : (
            <div className="w-full h-full rounded-[3rem] border-4 border-dashed border-slate-200 flex items-center justify-center text-slate-300 font-display font-black uppercase text-xs text-center px-4 leading-tight">
              PICK AN AVATAR BELOW!
            </div>
          )}
        </div>

        {/* Small Picker Grid */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {AVATARS.map((avatar) => {
             const isSel = chosenAvatar?.name === avatar.name;
             return (
              <motion.button
                key={avatar.name}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  playClick();
                  setChosenAvatar(avatar);
                }}
                className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden relative border-4 shadow-sm ${
                  isSel
                    ? "border-secondary bg-white scale-110 z-10 shadow-lg"
                    : "border-slate-100 bg-white/50 hover:border-slate-200"
                }`}
                title={avatar.name}
              >
                <span className="text-4xl filter drop-shadow-sm">{avatar.emoji}</span>
              </motion.button>
             );
          })}
        </div>

        {/* Player Name */}
        <div className="relative max-w-sm mx-auto">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ENTER YOUR NAME..."
            className="w-full bg-white border-4 border-slate-100 rounded-2xl px-6 py-4 text-center text-slate-700 font-display font-black placeholder:text-slate-300 focus:outline-none focus:border-secondary transition-all shadow-inner"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8, type: "spring", stiffness: 100 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
        <Button
          size="xl"
          variant="primary"
          onClick={handleStart}
          icon="🎮"
          className="relative z-10 px-20 py-8 text-3xl"
        >
          START LEARNING!
        </Button>
      </motion.div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-10 w-24 h-24 bg-primary/10 rounded-[2rem] blur-xl border-4 border-white"
        animate={{ y: [0, -30, 0], rotate: [0, 45, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl border-4 border-white"
        animate={{ y: [0, 40, 0], x: [0, -20, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </motion.div>
  );
}
