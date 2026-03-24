/**
 * Mascot - A floating animated guide character that gives contextual tips.
 */
import { motion, AnimatePresence } from "framer-motion";
import useGameStore from "../../store/useGameStore";

const TIPS = {
  start: { emoji: "🧚", text: "Welcome! Pick an avatar and let's play! ✨" },
  content: { emoji: "📖", text: "Read carefully! You'll need this info soon! 🤓" },
  mysteryBag: { emoji: "🎒", text: "Tap the glowing bag to open it! 👆" },
  think: { emoji: "🤔", text: "Feel the object... What could it be? 🔍" },
  speaking: { emoji: "🗣️", text: "Speak clearly! Try the microphone! 🎤" },
  guessing: { emoji: "⏱️", text: "Hurry! Your classmates are guessing! 🏃" },
  reveal: { emoji: "🎉", text: "TADA! Look what it was! 🌟" },
  reward: { emoji: "🏆", text: "Amazing job! You're a Star Speaker! ⭐" },
};

export default function Mascot() {
  const { currentStep } = useGameStore();
  const tip = TIPS[currentStep] || TIPS.start;

  return (
    <div className="fixed bottom-6 left-6 z-[90] pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="flex items-end gap-3 pointer-events-auto"
        >
          {/* Mascot Character */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-2xl shadow-[0_0_25px_rgba(236,72,153,0.4)] border-2 border-white/20 flex-shrink-0"
          >
            {tip.emoji}
          </motion.div>

          {/* Speech Bubble */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative bg-white/10 backdrop-blur-xl rounded-2xl rounded-bl-sm px-4 py-3 max-w-[220px] border border-white/15 shadow-xl"
          >
            <p className="text-sm text-white/90 font-body leading-snug">
              {tip.text}
            </p>
            {/* Bubble tail */}
            <div className="absolute -left-2 bottom-2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-white/10 border-b-8 border-b-transparent" />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
