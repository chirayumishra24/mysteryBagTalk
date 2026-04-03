import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import MysteryToken from "../ui/MysteryToken";
import useGameStore from "../../store/useGameStore";
import { playCheering, playRevealFanfare } from "../../hooks/useAudio";

export default function RevealScreen() {
  const { selectedObject, setStep, activityMode } = useGameStore();
  const [showContinue, setShowContinue] = useState(false);
  const [flash, setFlash] = useState(true);
  const [emojiRain, setEmojiRain] = useState([]);
  const isGroupMode = activityMode === "group";

  useEffect(() => {
    setTimeout(() => setFlash(false), 450);
    playRevealFanfare();
    setTimeout(() => playCheering(), 500);

    if (selectedObject) {
      const emojis = [];
      const rainEmojis = ["🫧", "✨", "⭐", "🐠", "🐙", "💎", "🪸"];
      for (let index = 0; index < 22; index += 1) {
        emojis.push({
          id: index,
          left: Math.random() * 100,
          delay: Math.random() * 2.6,
          duration: 2 + Math.random() * 2.5,
          size: 1.6 + Math.random() * 1.8,
          emoji: rainEmojis[index % rainEmojis.length],
        });
      }
      setEmojiRain(emojis);
    }

    const duration = 3200;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 82,
        origin: { x: 0 },
        colors: ["#fbbf24", "#38bdf8", "#f472b6", "#2dd4bf", "#67e8f9"],
        zIndex: 100,
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 82,
        origin: { x: 1 },
        colors: ["#fbbf24", "#38bdf8", "#f472b6", "#2dd4bf", "#67e8f9"],
        zIndex: 100,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };

    setTimeout(frame, 250);

    const timeout = setTimeout(() => setShowContinue(true), 2600);
    return () => clearTimeout(timeout);
  }, [selectedObject]);

  if (!selectedObject) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-4 py-24 backdrop-blur-2xl md:px-6"
      style={{ background: "radial-gradient(circle at center, rgba(14,58,94,0.95), rgba(10,22,40,0.98))" }}
    >
      {/* Emoji rain */}
      {emojiRain.map((emoji) => (
        <motion.span
          key={emoji.id}
          initial={{ y: -120, opacity: 0, rotate: 0 }}
          animate={{ y: "110vh", opacity: [0, 1, 1, 0], rotate: 360 }}
          transition={{ duration: emoji.duration, delay: emoji.delay, ease: "linear" }}
          className="absolute pointer-events-none z-[60]"
          style={{ left: `${emoji.left}%`, fontSize: `${emoji.size}rem` }}
        >
          {emoji.emoji}
        </motion.span>
      ))}

      {/* White flash */}
      {flash && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="absolute inset-0 z-[100] bg-cyan-200 pointer-events-none"
        />
      )}

      {/* Glow effect */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(251,191,36,0.2),rgba(103,232,249,0.1),transparent_70%)] blur-[110px]"
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: -34, letterSpacing: "0.9em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.22em" }}
          transition={{ duration: 1.2, delay: 0.35, ease: "backOut" }}
          className="sea-tag-gold px-8 py-3 text-sm shadow-[0_0_30px_rgba(251,191,36,0.15)]"
        >
          🏴‍☠️ The treasure was...
        </motion.span>

        <div className="relative mt-10 flex items-center justify-center">
          {/* Orbiting rings */}
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.04, 1] }}
            transition={{
              rotate: { duration: 15, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute h-96 w-96 rounded-full border-2 border-cyan-500/15"
          />
          <motion.div
            animate={{ rotate: -360, scale: [1, 1.08, 1] }}
            transition={{
              rotate: { duration: 18, repeat: Infinity, ease: "linear" },
              scale: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute h-[430px] w-[430px] rounded-full border-2 border-dashed border-amber-500/20"
          />

          <motion.div
            initial={{ scale: 0.92 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10"
          >
            {selectedObject.image ? (
              <div className="flex h-72 w-72 items-center justify-center rounded-[3rem] border border-amber-500/30 bg-amber-500/10 shadow-[0_0_60px_rgba(251,191,36,0.2)] animate-treasure-glow overflow-hidden">
                <img src={selectedObject.image} alt={selectedObject.name} className="h-56 w-56 object-contain drop-shadow-xl" />
              </div>
            ) : (
              <MysteryToken
                emoji={selectedObject.emoji || "🏆"}
                title="Mystery solved!"
                subtitle={isGroupMode ? "The crews solved it!" : "You solved the mystery!"}
                size="xl"
                tone="gold"
              />
            )}
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 40, scale: 0.86 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.9, type: "spring", bounce: 0.35 }}
          className="mt-12 text-6xl font-black uppercase tracking-tight text-cyan-50 bio-glow-warm md:text-8xl"
        >
          {selectedObject.name}
        </motion.h2>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-cyan-200/70 md:text-lg">
          {isGroupMode
            ? "The crews have discovered the treasure! Celebrate the reveal, then swim to the reward ceremony! 🐙"
            : "The crew has found the treasure! Celebrate the reveal, then swim to collect your Golden Pearls! 🐙"}
        </p>

        <motion.button
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: showContinue ? 1 : 0, y: showContinue ? 0 : 36 }}
          transition={{ duration: 0.8 }}
          onClick={() => setStep("reward")}
          className="coral-btn mt-10 inline-flex items-center gap-3 px-8 py-4 text-base"
        >
          {isGroupMode ? "🏆 Celebrate the crews!" : "🏆 Collect Golden Pearls!"}
        </motion.button>
      </div>
    </motion.div>
  );
}
