import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Timer from "../ui/Timer";
import MysteryToken from "../ui/MysteryToken";
import useGameStore from "../../store/useGameStore";

const mockGuesses = [
  { text: "Is it a pencil?", delay: 0.5, avatar: "👦", tone: "orange", x: -250, y: -40 },
  { text: "Maybe an eraser?", delay: 2.6, avatar: "👧", tone: "pink", x: 240, y: -90 },
  { text: "A tiny ball!", delay: 5.5, avatar: "🧒", tone: "mint", x: -300, y: -170 },
  { text: "Wait... a key?", delay: 8.4, avatar: "👦🏽", tone: "yellow", x: 210, y: -220 },
  { text: "Is it a coin?", delay: 12, avatar: "👧🏼", tone: "orange", x: -180, y: -290 },
];

export default function GuessPanel() {
  const { setStep, setTimerActive, timerSeconds, resetTimer, selectedObject } = useGameStore();
  const [showGuesses, setShowGuesses] = useState(false);

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
            animate={{ opacity: [0, 0.4, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, repeat: Infinity }}
            className="pointer-events-none fixed inset-0 z-0"
            style={{ background: "radial-gradient(circle, transparent 40%, rgba(251,146,60,0.24) 100%)" }}
          />
        )}
      </AnimatePresence>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="space-y-5 rounded-[2.4rem] border border-white/85 bg-white/86 p-6 shadow-[0_24px_80px_rgba(249,115,22,0.14)] backdrop-blur-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#ff7a45] px-4 py-2 text-xs font-black uppercase tracking-[0.32em] text-white">
              Guessing Time
            </span>
            <span className="rounded-full border border-[#ffe7a1] bg-[#fff8db] px-4 py-2 text-sm font-bold text-[#8c5a1a]">
              Listen carefully
            </span>
          </div>

          <h2 className={`text-5xl font-black uppercase tracking-tight text-[#432414] text-glow md:text-7xl ${isUrgent ? "animate-pulse" : ""}`}>
            Who knows it?
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-[#654331] md:text-lg">
            One student has already given the clue. Now the class listens, thinks, and races to guess the mystery object before the timer ends.
          </p>

          <div className="grid gap-3">
            {[
              "Raise a hand when you think you know the answer.",
              "Use the strongest clue to help you guess.",
              "When time is up, reveal the object together!",
            ].map((tip, index) => (
              <motion.div
                key={tip}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 * index }}
                className="rounded-[1.4rem] border border-[#ffd8c2] bg-[#fff4ec] p-4 text-sm font-semibold leading-relaxed text-[#654331]"
              >
                {tip}
              </motion.div>
            ))}
          </div>

          <div className="rounded-[1.6rem] border border-[#d7f4ef] bg-[#effffb] p-4 text-sm font-bold text-[#0f7c70]">
            Speaker clue target: {selectedObject?.name ? "keep it secret until the reveal" : "secret object still hidden"}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2.4rem] border border-white/85 bg-white/86 p-6 shadow-[0_24px_80px_rgba(249,115,22,0.14)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(253,224,71,0.32),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(45,212,191,0.16),_transparent_30%)]" />

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
                  emoji="?"
                  title="Secret clue"
                  subtitle="Can the class guess it?"
                  size="sm"
                  tone="mint"
                />
              </div>
              <div className="rounded-[2rem] border border-[#ffe7a1] bg-[#fff8db] p-6 shadow-[0_14px_28px_rgba(249,115,22,0.08)]">
                <Timer initialSeconds={30} onComplete={handleReveal} />
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReveal}
                className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#ffb087] bg-[linear-gradient(135deg,#fb923c,#fb7185)] px-7 py-4 text-base font-black uppercase tracking-[0.2em] text-white shadow-[0_14px_34px_rgba(249,115,22,0.18)]"
              >
                Reveal the answer
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
    orange: "border-[#ffd6c2] bg-[#fff1e8] text-[#86401b]",
    pink: "border-[#ffd2dc] bg-[#fff1f5] text-[#9b3b58]",
    mint: "border-[#ccefe8] bg-[#ecfffb] text-[#11685d]",
    yellow: "border-[#ffe7a1] bg-[#fff8db] text-[#8c5a1a]",
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
      <div className={`flex items-center gap-4 rounded-[1.8rem] border p-4 shadow-[0_14px_28px_rgba(249,115,22,0.08)] ${tones[guess.tone]}`}>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-3xl shadow-sm">
          {guess.avatar}
        </div>
        <div className="pr-2 text-xl font-black tracking-tight">{guess.text}</div>
      </div>
    </motion.div>
  );
}
