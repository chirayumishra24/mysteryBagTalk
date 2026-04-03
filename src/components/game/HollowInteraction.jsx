import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import useGameStore from "../../store/useGameStore";
import { playChime, resumeAudio } from "../../hooks/useAudio";

const readinessPoints = [
  { icon: "🐙", title: "Secret pick", text: "Grab a treasure — keep it hidden!" },
  { icon: "🗣️", title: "2-3 clues", text: "Short, clear sentences only!" },
  { icon: "🎉", title: "Big reveal!", text: "Guess, reveal, celebrate!" },
];

export default function HollowInteraction() {
  const { setStep, setHasSeenContent } = useGameStore();
  const [isLaunching, setIsLaunching] = useState(false);

  useEffect(() => {
    confetti({
      particleCount: 60,
      spread: 80,
      startVelocity: 26,
      origin: { y: 0.2 },
      colors: ["#38bdf8", "#2dd4bf", "#fbbf24", "#f472b6", "#67e8f9"],
    });
  }, []);

  const handleBegin = () => {
    if (isLaunching) return;

    resumeAudio();
    playChime();
    setHasSeenContent(true);
    setIsLaunching(true);

    confetti({
      particleCount: 140,
      spread: 100,
      startVelocity: 34,
      origin: { y: 0.55 },
      colors: ["#38bdf8", "#2dd4bf", "#fbbf24", "#f472b6", "#67e8f9", "#ffffff"],
    });

    setTimeout(() => setStep("think"), 650);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative mx-auto flex min-h-[78vh] max-w-6xl items-center justify-center overflow-hidden sea-glass px-6 py-10 md:px-10"
    >
      {/* Underwater ambient effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(103,232,249,0.08),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.06),_transparent_24%),radial-gradient(circle_at_left,_rgba(56,189,248,0.04),_transparent_24%)]" />
        <motion.div
          animate={{ y: [0, -18, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[6%] top-[14%] h-28 w-28 rounded-[2rem] bg-cyan-500/[0.06] blur-2xl"
        />
        <motion.div
          animate={{ y: [0, 16, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] right-[8%] h-36 w-36 rounded-full bg-teal-400/[0.06] blur-3xl"
        />
      </div>

      <div className="relative z-10 grid w-full gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="sea-tag-coral px-4 py-2 flex items-center gap-2">
              🎯 Ready To Dive?
            </span>
            <span className="sea-tag-mint px-4 py-2">
              Final checkpoint
            </span>
          </div>

          <div>
            <h2 className="text-4xl font-black leading-tight text-cyan-50 bio-glow md:text-5xl">
              Ready to Dive? 🐙
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {readinessPoints.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 * index }}
                className="rounded-[1.5rem] border border-cyan-500/15 bg-cyan-500/5 p-4"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-950/50 text-2xl shadow-sm border border-cyan-500/10">
                  {item.icon}
                </div>
                <h3 className="text-sm font-black uppercase tracking-[0.24em] text-cyan-300">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cyan-200/70">{item.text}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {["Clear clues", "Brave voices", "Fast guesses", "Happy cheers"].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-cyan-500/15 bg-cyan-500/5 px-4 py-2 text-sm font-bold text-cyan-300"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* Treasure Chest Launch Panel */}
        <div className="relative overflow-hidden rounded-[2.2rem] border border-cyan-500/15 bg-gradient-to-b from-cyan-950/50 to-blue-950/40 p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.08),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(103,232,249,0.06),_transparent_30%)]" />

          <div className="relative flex min-h-[420px] flex-col items-center justify-center text-center">
            <motion.div
              animate={{ scale: [1, 1.06, 1], rotate: [0, 2, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Treasure chest image */}
              <div className="relative flex h-52 w-52 items-center justify-center rounded-[3rem] border border-amber-500/20 bg-amber-500/5 shadow-[0_0_60px_rgba(251,191,36,0.1)] animate-treasure-glow overflow-hidden">
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-[-18px] rounded-[3.5rem] border-4 border-dashed border-amber-400/30"
                />
                <img src="/images/sea/treasure_chest.png" alt="Treasure Chest" className="h-44 w-44 object-contain drop-shadow-lg" />
              </div>
            </motion.div>

            <h3 className="mt-8 text-3xl font-black text-cyan-50 bio-glow-warm md:text-4xl">
              Open the Treasure Chest! 🏴‍☠️
            </h3>
            <p className="mt-4 max-w-md text-base leading-relaxed text-cyan-200/70">
              Dive in when the crew is ready. The next screen will help the diver think, pick a secret treasure, and get ready to describe it!
            </p>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBegin}
              className="coral-btn mt-8 inline-flex items-center gap-3 px-7 py-4 text-base"
            >
              {isLaunching ? "🌊 Diving..." : "🐙 Dive Into the Quest!"}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
