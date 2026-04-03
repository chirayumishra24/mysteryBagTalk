import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Timer from "../ui/Timer";
import MysteryToken from "../ui/MysteryToken";
import useGameStore from "../../store/useGameStore";

const mockGuesses = [
  { text: "Is it a key? 🗝️", delay: 0.5, avatar: "🧜‍♂️", tone: "cyan", x: -250, y: -40 },
  { text: "Maybe a shell? 🐚", delay: 2.6, avatar: "🧜‍♀️", tone: "pink", x: 240, y: -90 },
  { text: "A tiny pearl!", delay: 5.5, avatar: "🐙", tone: "teal", x: -300, y: -170 },
  { text: "Wait... a starfish? ⭐", delay: 8.4, avatar: "🦑", tone: "gold", x: 210, y: -220 },
  { text: "Is it a coin? 🪙", delay: 12, avatar: "🐠", tone: "cyan", x: -180, y: -290 },
];

export default function GuessPanel() {
  const { setStep, setTimerActive, timerSeconds, resetTimer, selectedObject, activityMode } = useGameStore();
  const [showGuesses, setShowGuesses] = useState(false);
  const isGroupMode = activityMode === "group";
  const tips = isGroupMode
    ? ["Whisper with your crew first! 🤫", "One brave diver shares the guess! 🐙", "Timer up = reveal time! 🎉"]
    : ["Raise a fin if you know! 🐠", "Use the strongest clue!", "Timer up = reveal time! 🎉"];

  useEffect(() => {
    resetTimer(30);
    setTimerActive(true);
    const timeout = setTimeout(() => setShowGuesses(true), 1100);
    return () => clearTimeout(timeout);
  }, [resetTimer, setTimerActive]);

  const handleReveal = () => {
    setTimerActive(false);
    setStep("reveal");
  };

  const isUrgent = timerSeconds <= 10 && timerSeconds > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-24 md:px-6"
    >
      <AnimatePresence>
        {isUrgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, repeat: Infinity }}
            className="pointer-events-none fixed inset-0 z-0"
            style={{ background: "radial-gradient(circle, transparent 40%, rgba(244,114,182,0.15) 100%)" }}
          />
        )}
      </AnimatePresence>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="space-y-5 sea-glass p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="sea-tag-coral px-4 py-2 flex items-center gap-2">
              🐙 Guessing Time!
            </span>
            <span className="sea-tag px-4 py-2">
              {isGroupMode ? "Huddle, then guess!" : "Listen carefully!"}
            </span>
          </div>

          <h2 className={`text-4xl font-black uppercase tracking-tight text-cyan-50 bio-glow md:text-5xl ${isUrgent ? "animate-pulse" : ""}`}>
            Who Knows It? 🏴‍☠️
          </h2>

          <div className="grid gap-2">
            {tips.map((tip, index) => (
              <motion.div
                key={tip}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 * index }}
                className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 px-4 py-3 text-sm font-semibold text-cyan-200/80"
              >
                {tip}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sonar arena */}
        <div className="relative overflow-hidden sea-glass p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(103,232,249,0.06),_transparent_40%)]" />

          {/* Sonar pulse rings */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                className="absolute rounded-full border border-cyan-500/10"
                style={{ width: `${ring * 30}%`, height: `${ring * 30}%` }}
                animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 3, delay: ring * 0.5, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </div>

          <div className="relative flex min-h-[500px] items-center justify-center">
            <AnimatePresence>
              {showGuesses &&
                timerSeconds > 0 &&
                mockGuesses.map((guess) => (
                  <GuessBubble key={guess.text} guess={guess} />
                ))}
            </AnimatePresence>

            <div className="relative z-20 flex flex-col items-center">
              <div className="mb-6">
                <MysteryToken
                  emoji="🔮"
                  title="Secret clue"
                  subtitle={isGroupMode ? "Can the crews guess it?" : "Can the crew guess it?"}
                  size="sm"
                  tone="mint"
                />
              </div>
              <div className="rounded-[2rem] border border-amber-500/20 bg-amber-500/5 p-6 shadow-[0_0_30px_rgba(251,191,36,0.08)]">
                <Timer initialSeconds={30} onComplete={handleReveal} />
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReveal}
                className="coral-btn mt-8 inline-flex items-center gap-3 px-7 py-4 text-base"
              >
                🐙 Reveal the Treasure!
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function GuessBubble({ guess }) {
  const tones = {
    cyan: "border-cyan-500/20 bg-cyan-500/10 text-cyan-200",
    pink: "border-pink-500/20 bg-pink-500/10 text-pink-200",
    teal: "border-teal-500/20 bg-teal-500/10 text-teal-200",
    gold: "border-amber-500/20 bg-amber-500/10 text-amber-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0.85, 1.05, 1.05, 0.92],
        x: guess.x,
        y: guess.y,
        rotate: guess.x < 0 ? -4 : 4,
      }}
      transition={{
        delay: guess.delay,
        duration: 5.4,
        times: [0, 0.1, 0.82, 1],
        ease: "backOut",
      }}
      className="absolute z-10 pointer-events-none"
    >
      <div className={`flex items-center gap-4 rounded-[1.8rem] border p-4 shadow-[0_8px_24px_rgba(0,0,0,0.3)] backdrop-blur-sm ${tones[guess.tone]}`}>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-950/50 text-3xl shadow-sm border border-cyan-500/10">
          {guess.avatar}
        </div>
        <div className="pr-2 text-xl font-black tracking-tight">{guess.text}</div>
      </div>
    </motion.div>
  );
}
