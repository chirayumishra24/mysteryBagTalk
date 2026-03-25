/**
 * ProgressBar - A glowing step indicator at the top of the screen.
 */
import { motion } from "framer-motion";
import useGameStore, { GAME_STEPS } from "../../store/useGameStore";

const STEP_LABELS = {
  start: "🏠",
  mysteryBag: "🎒",
  content: "📖",
  think: "🤔",
  speaking: "🗣️",
  guessing: "⏱️",
  reveal: "🎉",
  reward: "🏆",
};

export default function ProgressBar() {
  const { currentStep, stepIndex } = useGameStore();
  const progress = ((stepIndex + 1) / GAME_STEPS.length) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-[80] pointer-events-none">
      {/* Background track */}
      <div className="h-4 bg-white/50 w-full backdrop-blur-sm border-b-2 border-sky-100 shadow-sm">
        <motion.div
          className="h-full bg-gradient-to-r from-secondary via-blue-400 to-accent rounded-r-full relative"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
        >
          {/* Tip highlight */}
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/40" />
        </motion.div>
      </div>

      {/* Step indicators (only on larger screens) */}
      <div className="hidden md:flex justify-between px-8 py-3 max-w-4xl mx-auto">
        {GAME_STEPS.map((step, i) => (
          <motion.div
            key={step}
            animate={{
              scale: currentStep === step ? 1.25 : 1,
              opacity: i <= stepIndex ? 1 : 0.4,
              y: currentStep === step ? -2 : 0
            }}
            className={`flex items-center gap-1.5 text-xs font-display font-black transition-all duration-300 px-3 py-1 rounded-full ${
              currentStep === step
                ? "bg-secondary text-white shadow-md border-2 border-white"
                : i < stepIndex
                ? "bg-blue-100 text-secondary"
                : "bg-white/30 text-slate-400"
            }`}
          >
            <span className="text-sm">{STEP_LABELS[step]}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
