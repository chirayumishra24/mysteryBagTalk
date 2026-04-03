import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import useGameStore from "../../store/useGameStore";
import { playChime, resumeAudio } from "../../hooks/useAudio";

const readinessPoints = [
  { icon: "🎒", title: "Secret pick", text: "Choose one object and keep it hidden from the class." },
  { icon: "🗣️", title: "Say 2-3 clues", text: "Use short, clear sentences so everyone can follow along." },
  { icon: "👏", title: "Big finish", text: "Let the class guess, reveal the object, and celebrate together." },
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
      colors: ["#fb923c", "#fb7185", "#facc15", "#2dd4bf", "#ffffff"],
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
      colors: ["#fb923c", "#fb7185", "#facc15", "#2dd4bf", "#60a5fa", "#ffffff"],
    });

    setTimeout(() => setStep("think"), 650);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative mx-auto flex min-h-[78vh] max-w-6xl items-center justify-center overflow-hidden rounded-[2.6rem] border border-white/80 bg-white/82 px-6 py-10 shadow-[0_24px_80px_rgba(249,115,22,0.16)] backdrop-blur-2xl md:px-10"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(253,224,71,0.42),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(251,146,60,0.18),_transparent_24%),radial-gradient(circle_at_left,_rgba(45,212,191,0.14),_transparent_24%)]" />
        <motion.div
          animate={{ y: [0, -18, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[6%] top-[14%] h-28 w-28 rounded-[2rem] bg-[#ffe074]/[0.6] blur-2xl"
        />
        <motion.div
          animate={{ y: [0, 16, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] right-[8%] h-36 w-36 rounded-full bg-[#ffb3a8]/[0.45] blur-3xl"
        />
      </div>

      <div className="relative z-10 grid w-full gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#ff7a45] px-4 py-2 text-xs font-black uppercase tracking-[0.32em] text-white shadow-[0_8px_18px_rgba(249,115,22,0.2)]">
              Ready To Play?
            </span>
            <span className="rounded-full border border-[#d7f4ef] bg-[#effffb] px-4 py-2 text-sm font-bold text-[#0f7c70]">
              Final checkpoint
            </span>
          </div>

          <div>
            <h2 className="text-4xl font-black leading-tight text-[#432414] text-glow md:text-6xl">
              The class challenge starts here
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#654331] md:text-lg">
              Everyone has seen the clues, heard the examples, and practiced the pattern. Now it is time to turn the lesson into a playful speaking game.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {readinessPoints.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 * index }}
                className="rounded-[1.5rem] border border-[#ffe0cf] bg-[#fffaf4] p-4"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-[0_10px_20px_rgba(249,115,22,0.08)]">
                  {item.icon}
                </div>
                <h3 className="text-sm font-black uppercase tracking-[0.24em] text-[#9b5430]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6b4633]">{item.text}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {["Clear clues", "Big smiles", "Fast guesses", "Happy applause"].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-[#ffd6c2] bg-white px-4 py-2 text-sm font-bold text-[#7d4522]"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2.2rem] border border-[#ffdccc] bg-[linear-gradient(180deg,rgba(255,247,236,0.96),rgba(255,232,224,0.96))] p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(253,224,71,0.28),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(45,212,191,0.18),_transparent_30%)]" />

          <div className="relative flex min-h-[420px] flex-col items-center justify-center text-center">
            <motion.div
              animate={{ scale: [1, 1.06, 1], rotate: [0, 2, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative flex h-52 w-52 items-center justify-center rounded-[3rem] border border-white/80 bg-white/[0.88] shadow-[0_20px_40px_rgba(249,115,22,0.12)]"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.24, 0.42, 0.24] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-[-18px] rounded-[3.5rem] border-4 border-dashed border-[#ffc83d]/50"
              />
              <span className="text-[5.5rem]">🎤</span>
            </motion.div>

            <h3 className="mt-8 text-3xl font-black text-[#432414] md:text-4xl">
              Let the mystery speaking game begin
            </h3>
            <p className="mt-4 max-w-md text-base leading-relaxed text-[#654331]">
              Start the challenge when the group is ready. The next screen will help the speaker think, choose the secret object, and get ready to describe it.
            </p>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBegin}
              className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#ffb087] bg-[linear-gradient(135deg,#fb923c,#fb7185)] px-7 py-4 text-base font-black text-white shadow-[0_14px_34px_rgba(249,115,22,0.18)]"
            >
              {isLaunching ? "Starting..." : "Begin the challenge"}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
