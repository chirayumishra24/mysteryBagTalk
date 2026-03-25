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
        colors: ["#fde047", "#3b82f6", "#22c55e", "#fb923c", "#ffffff"],
        zIndex: 100,
      });
      confetti({
        particleCount: 5, angle: 120, spread: 80, origin: { x: 1 },
        colors: ["#fde047", "#3b82f6", "#22c55e", "#fb923c", "#ffffff"],
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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-sky-200/90 backdrop-blur-3xl overflow-hidden"
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
          className="text-secondary font-display font-black text-2xl uppercase mb-10 bg-white/50 px-8 py-2 rounded-full border-4 border-white shadow-md transform -rotate-2"
        >
          IT WAS A...
        </motion.span>

        {/* Centerpiece: Holographic Platform */}
        <div className="relative flex items-center justify-center">
           {/* Rotating Rings */}
           <motion.div
             animate={{ rotate: 360, scale: [1, 1.05, 1] }}
             transition={{ rotate: { duration: 15, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
             className="absolute w-96 h-96 border-4 border-white rounded-full bg-primary/20"
           />
           <motion.div
             animate={{ rotate: -360, scale: [1, 1.1, 1] }}
             transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
             className="absolute w-[450px] h-[450px] border-4 border-dashed border-secondary/30 rounded-full"
           />

           <Card animate={false} variant="yellow" className="w-80 h-80 flex items-center justify-center rounded-[3rem] shadow-2xl z-10 border-8 border-white relative overflow-hidden group">
              <motion.span
                initial={{ scale: 0, rotateY: 180 }}
                animate={{ scale: [0, 1.4, 1], rotateY: [180, -20, 0] }}
                transition={{ duration: 1.5, type: "spring", bounce: 0.5, delay: 0.2 }}
                className="text-[12rem] drop-shadow-2xl relative z-20 group-hover:scale-110 transition-transform duration-500"
              >
                {selectedObject.emoji}
              </motion.span>
           </Card>
        </div>

        <motion.h2 
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 1, type: "spring", bounce: 0.4 }}
          className="text-6xl md:text-8xl font-display font-black text-secondary text-outline-blue mt-12 tracking-tight uppercase"
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
          variant="primary"
          onClick={() => setStep("reward")}
          icon="⭐"
          className="px-20 py-8 text-3xl shadow-2xl"
        >
          COLLECT STARS!
        </Button>
      </motion.div>
    </motion.div>
  );
}
