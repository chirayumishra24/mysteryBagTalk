/**
 * ProgressBar - A glowing step indicator at the top of the screen.
 * Step indicators are hidden on the start screen to prevent overlapping with the title.
 */
import { motion, AnimatePresence } from "framer-motion";
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
  const showStepIndicators = currentStep !== "start";

  return (
    <div className="fixed top-0 left-0 right-0 z-[80] pointer-events-none">
      {/* Background track */}
      <div className="h-2 bg-sky-50/60 w-full border-b-2 border-sky-100/40 overflow-hidden">
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

      {/* Step indicators — hidden on start screen to avoid overlapping title */}
      <AnimatePresence>
        {showStepIndicators && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="hidden md:flex justify-between px-8 py-3 max-w-5xl mx-auto"
          >
            {GAME_STEPS.map((step, i) => (
              <motion.div
                key={step}
                animate={{
                  scale: currentStep === step ? 1.15 : 1,
                  opacity: i <= stepIndex ? 1 : 0.5,
                  y: currentStep === step ? -2 : 0
                }}
                className={`flex items-center gap-2 text-xs font-display font-black transition-all duration-300 px-3 py-1.5 rounded-xl border-3 ${
                  currentStep === step
                    ? "bg-secondary border-white text-white shadow-lg"
                    : i < stepIndex
                    ? "bg-white border-sky-100 text-secondary"
                    : "bg-white/70 border-slate-50 text-slate-300"
                }`}
              >
                <span className="text-lg leading-none">{STEP_LABELS[step]}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
