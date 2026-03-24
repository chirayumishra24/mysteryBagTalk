import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import Card from "../ui/Card";
import useGameStore from "../../store/useGameStore";
import { playRevealFanfare, playCheering } from "../../hooks/useAudio";
import confetti from "canvas-confetti";

export default function RevealScreen() {
  const { selectedObject, setStep } = useGameStore();
  const [showContinue, setShowContinue] = useState(false);
  const [flash, setFlash] = useState(true);
  const [emojiRain, setEmojiRain] = useState([]);

  useEffect(() => {
    setTimeout(() => setFlash(false), 500);
    playRevealFanfare();
    setTimeout(() => playCheering(), 600);

    // Emoji rain - spawn falling emojis of the selected object
    if (selectedObject) {
      const emojis = [];
      for (let i = 0; i < 20; i++) {
        emojis.push({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 3,
          duration: 2 + Math.random() * 3,
          size: 1.5 + Math.random() * 2,
        });
      }
      setEmojiRain(emojis);
    }

    const duration = 4000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5, angle: 60, spread: 80, origin: { x: 0 },
        colors: ["#7c3aed", "#f472b6", "#3b82f6", "#fde047", "#ffffff"],
        zIndex: 100,
      });
      confetti({
        particleCount: 5, angle: 120, spread: 80, origin: { x: 1 },
        colors: ["#7c3aed", "#f472b6", "#3b82f6", "#fde047", "#ffffff"],
        zIndex: 100,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    
    setTimeout(frame, 300);

    const timeout = setTimeout(() => setShowContinue(true), 3500);
    return () => clearTimeout(timeout);
  }, []);

  if (!selectedObject) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "brightness(0)" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-3xl overflow-hidden"
    >
      {/* Emoji Rain */}
      {emojiRain.map((e) => (
        <motion.span
          key={e.id}
          initial={{ y: -100, opacity: 0, rotate: 0 }}
          animate={{ y: "110vh", opacity: [0, 1, 1, 0], rotate: 360 }}
          transition={{ duration: e.duration, delay: e.delay, ease: "linear" }}
          className="absolute pointer-events-none z-[60]"
          style={{ left: `${e.left}%`, fontSize: `${e.size}rem` }}
        >
          {selectedObject?.emoji}
        </motion.span>
      ))}

      {/* Cinematic Flashbang Effect */}
      {flash && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0 bg-white z-[100] pointer-events-none"
        />
      )}

      {/* Extreme Glows */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-pink-500/20 via-purple-600/30 to-blue-500/20 blur-[150px] rounded-full pointer-events-none"
      />

      <div className="z-10 flex flex-col items-center">
        <motion.span 
          initial={{ opacity: 0, y: -50, letterSpacing: "1em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.2em" }}
          transition={{ duration: 1.5, delay: 0.5, ease: "backOut" }}
          className="text-purple-300/80 font-display font-bold text-xl uppercase mb-8"
        >
          It was a...
        </motion.span>

        {/* Centerpiece: Holographic Platform */}
        <div className="relative flex items-center justify-center">
           {/* Rotating Rings */}
           <motion.div
             animate={{ rotate: 360, scale: [1, 1.05, 1] }}
             transition={{ rotate: { duration: 15, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
             className="absolute w-96 h-96 border border-purple-500/30 rounded-full"
           />
           <motion.div
             animate={{ rotate: -360, scale: [1, 1.1, 1] }}
             transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
             className="absolute w-[450px] h-[450px] border border-dashed border-pink-500/20 rounded-full"
           />

           <Card animate={false} variant="highlight" className="w-80 h-80 flex items-center justify-center rounded-[40px] shadow-[0_0_80px_rgba(139,92,246,0.3)] bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-md z-10 border-2 border-purple-400/50 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-50 mixes-blend-overlay" />
              <motion.span
                initial={{ scale: 0, rotateY: 180 }}
                animate={{ scale: [0, 1.4, 1], rotateY: [180, -20, 0] }}
                transition={{ duration: 1.5, type: "spring", bounce: 0.5, delay: 0.2 }}
                className="text-[12rem] drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] relative z-20 group-hover:scale-110 transition-transform duration-500"
                style={{ filter: "drop-shadow(0px 20px 40px rgba(0,0,0,0.8))" }}
              >
                {selectedObject.emoji}
              </motion.span>
           </Card>
        </div>

        <motion.h2 
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 1, type: "spring", bounce: 0.4 }}
          className="text-6xl md:text-8xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-200 to-indigo-500 mt-12 tracking-tight drop-shadow-2xl"
        >
          {selectedObject.name}
        </motion.h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: showContinue ? 1 : 0, y: showContinue ? 0 : 50 }}
        transition={{ duration: 0.8 }}
        className="absolute bottom-12"
      >
        <Button
          size="xl"
          onClick={() => setStep("reward")}
          icon="⭐"
          className="shadow-[0_0_50px_rgba(244,114,182,0.4)] px-16 py-6 text-2xl"
        >
          Collect Rewards
        </Button>
      </motion.div>
    </motion.div>
  );
}
