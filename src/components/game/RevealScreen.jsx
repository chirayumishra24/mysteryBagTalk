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
      for (let index = 0; index < 18; index += 1) {
        emojis.push({
          id: index,
          left: Math.random() * 100,
          delay: Math.random() * 2.6,
          duration: 2 + Math.random() * 2.5,
          size: 1.6 + Math.random() * 1.8,
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
        colors: ["#facc15", "#fb923c", "#fb7185", "#2dd4bf", "#ffffff"],
        zIndex: 100,
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 82,
        origin: { x: 1 },
        colors: ["#facc15", "#fb923c", "#fb7185", "#2dd4bf", "#ffffff"],
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
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#fff7ef]/90 px-4 py-24 backdrop-blur-2xl md:px-6"
    >
      {emojiRain.map((emoji) => (
        <motion.span
          key={emoji.id}
          initial={{ y: -120, opacity: 0, rotate: 0 }}
          animate={{ y: "110vh", opacity: [0, 1, 1, 0], rotate: 360 }}
          transition={{ duration: emoji.duration, delay: emoji.delay, ease: "linear" }}
          className="absolute pointer-events-none z-[60]"
          style={{ left: `${emoji.left}%`, fontSize: `${emoji.size}rem` }}
        >
          {selectedObject.emoji}
        </motion.span>
      ))}

      {flash && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="absolute inset-0 z-[100] bg-white pointer-events-none"
        />
      )}

      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(253,224,71,0.3),rgba(251,146,60,0.12),transparent_70%)] blur-[110px]"
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: -34, letterSpacing: "0.9em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.22em" }}
          transition={{ duration: 1.2, delay: 0.35, ease: "backOut" }}
          className="rounded-full bg-[#fff4ea] px-8 py-3 text-sm font-black uppercase text-[#ff7a45] shadow-[0_14px_28px_rgba(249,115,22,0.12)]"
        >
          It was a...
        </motion.span>

        <div className="relative mt-10 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.04, 1] }}
            transition={{
              rotate: { duration: 15, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute h-96 w-96 rounded-full border-4 border-[#ffd8c2] bg-[#fff3eb]/70"
          />
          <motion.div
            animate={{ rotate: -360, scale: [1, 1.08, 1] }}
            transition={{
              rotate: { duration: 18, repeat: Infinity, ease: "linear" },
              scale: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute h-[430px] w-[430px] rounded-full border-4 border-dashed border-[#ffb087]"
          />

          <motion.div
            initial={{ scale: 0.92 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10"
          >
            <MysteryToken
              emoji={selectedObject.emoji}
              title="Mystery solved"
              subtitle={isGroupMode ? "The teams solved it!" : "You solved the mystery!"}
              size="xl"
              tone="pink"
            />
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 40, scale: 0.86 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.9, type: "spring", bounce: 0.35 }}
          className="mt-12 text-6xl font-black uppercase tracking-tight text-[#432414] text-glow md:text-8xl"
        >
          {selectedObject.name}
        </motion.h2>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#654331] md:text-lg">
          {isGroupMode
            ? "The teams have the answer. Celebrate the reveal, then move on to the final reward screen."
            : "The class has the answer. Celebrate the reveal, then move on to the final reward screen."}
        </p>

        <motion.button
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: showContinue ? 1 : 0, y: showContinue ? 0 : 36 }}
          transition={{ duration: 0.8 }}
          onClick={() => setStep("reward")}
          className="mt-10 inline-flex items-center gap-3 rounded-full border border-[#ffb087] bg-[linear-gradient(135deg,#fb923c,#fb7185)] px-8 py-4 text-base font-black uppercase tracking-[0.2em] text-white shadow-[0_14px_34px_rgba(249,115,22,0.18)]"
        >
          {isGroupMode ? "Celebrate the teams" : "Collect stars"}
        </motion.button>
      </div>
    </motion.div>
  );
}
