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
      <div className="h-1.5 bg-white/5 w-full">
        <motion.div
          className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-r-full relative"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
        >
          {/* Glow on the tip */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-md opacity-60" />
        </motion.div>
      </div>

      {/* Step indicators (only on larger screens) */}
      <div className="hidden md:flex justify-between px-8 py-2 max-w-4xl mx-auto">
        {GAME_STEPS.map((step, i) => (
          <motion.div
            key={step}
            animate={{
              scale: currentStep === step ? 1.2 : 1,
              opacity: i <= stepIndex ? 1 : 0.3,
            }}
            className={`flex items-center gap-1.5 text-xs font-display transition-all duration-300 ${
              currentStep === step
                ? "text-white"
                : i < stepIndex
                ? "text-purple-300"
                : "text-purple-500/50"
            }`}
          >
            <span className="text-sm">{STEP_LABELS[step]}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
