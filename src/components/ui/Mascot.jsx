import { motion, AnimatePresence } from "framer-motion";
import useGameStore from "../../store/useGameStore";
import { gameContent } from "../../data/gameContent";

const contentSlides = gameContent.modules.flatMap((module) => module.chapters);

const STEP_TIPS = {
  think: { emoji: "🕵️", text: "Pick one secret object and keep it hidden from the class." },
  speaking: { emoji: "🎤", text: "Use short, clear clues so everyone can understand your idea." },
  guessing: { emoji: "💭", text: "Listen for the best clue and make your smartest guess." },
  reveal: { emoji: "🎊", text: "Big reveal time! Let the whole class celebrate the answer." },
  reward: { emoji: "🏆", text: "Celebrate the effort, not just the perfect answer." },
};

const GROUP_STEP_TIPS = {
  think: { emoji: "👥", text: "Give each team a quick huddle before one speaker shares the clue." },
  speaking: { emoji: "🎤", text: "Let one child speak for the group while teammates help build the clue first." },
  guessing: { emoji: "💭", text: "Ask teams to whisper quickly, then choose one voice for the final guess." },
  reveal: { emoji: "🎊", text: "Celebrate the answer and the teamwork that helped the class solve it." },
  reward: { emoji: "🏆", text: "Praise strong teamwork, clear clues, and kind listening." },
};

function getContentTip(slide) {
  if (!slide) {
    return { emoji: "🌟", text: "Swipe through the guide and collect the best clue ideas." };
  }

  if (slide.video) {
    return {
      emoji: "🎬",
      text: "Pause after the demo and ask children to copy the sentence pattern together.",
    };
  }

  if (slide.questions?.length) {
    return {
      emoji: "🧩",
      text: "Pick one prompt and let a child answer in a full sentence before moving on.",
    };
  }

  return {
    emoji: "💡",
    text: "Keep the explanation short, playful, and easy to repeat aloud.",
  };
}

export default function Mascot() {
  const { currentStep, contentSlideIndex, activityMode } = useGameStore();
  const stepTips = activityMode === "group" ? GROUP_STEP_TIPS : STEP_TIPS;
  const tip =
    currentStep === "content"
      ? getContentTip(contentSlides[contentSlideIndex])
      : stepTips[currentStep] || { emoji: "🌟", text: "Keep the energy high and the instructions simple." };

  return (
    <div className="fixed bottom-5 right-5 z-[90] hidden max-w-sm pointer-events-none lg:block">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentStep}-${contentSlideIndex}`}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.92 }}
          transition={{ type: "spring", damping: 18, stiffness: 200 }}
          className="flex items-end gap-3"
        >
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 4, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-[1.6rem] border border-white/90 bg-[linear-gradient(135deg,#fb923c,#facc15)] text-3xl shadow-[0_14px_28px_rgba(249,115,22,0.18)]"
          >
            {tip.emoji}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="relative rounded-[1.8rem] rounded-br-[0.6rem] border border-white/85 bg-white/88 px-5 py-4 shadow-[0_18px_40px_rgba(249,115,22,0.12)] backdrop-blur-xl"
          >
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#ff7a45]">
              Buddy Tip
            </p>
            <p className="mt-2 text-sm font-bold leading-relaxed text-[#654331]">{tip.text}</p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
