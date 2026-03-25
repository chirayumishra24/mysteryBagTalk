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
      <div className="h-6 bg-sky-50 w-full border-b-4 border-sky-100 shadow-inner overflow-hidden">
        <motion.div
          className="h-full bg-secondary rounded-r-full relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
        >
          {/* Glossy overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
        </motion.div>
      </div>

      {/* Step indicators (only on larger screens) */}
      <div className="hidden md:flex justify-between px-8 py-4 max-w-5xl mx-auto">
        {GAME_STEPS.map((step, i) => (
          <motion.div
            key={step}
            animate={{
              scale: currentStep === step ? 1.2 : 1,
              opacity: i <= stepIndex ? 1 : 0.6,
              y: currentStep === step ? -3 : 0
            }}
            className={`flex items-center gap-2 text-xs font-display font-black transition-all duration-300 px-4 py-2 rounded-2xl border-4 ${
              currentStep === step
                ? "bg-secondary border-white text-white shadow-lg"
                : i < stepIndex
                ? "bg-white border-sky-100 text-secondary"
                : "bg-white border-slate-50 text-slate-300"
            }`}
          >
            <span className="text-xl leading-none">{STEP_LABELS[step]}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
