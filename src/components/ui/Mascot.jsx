import { motion, AnimatePresence } from "framer-motion";
import useGameStore from "../../store/useGameStore";
import { gameContent } from "../../data/gameContent";

const contentSlides = gameContent.modules.flatMap((module) => module.chapters);

const STEP_TIPS = {
  think: { text: "Psst! Pick one treasure and keep it hidden from your crew!" },
  speaking: { text: "Use your best pirate voice — loud, clear, and brave!" },
  guessing: { text: "Listen to the clue and make your smartest guess, matey!" },
  reveal: { text: "Woohoo! Time to open the treasure chest!" },
  reward: { text: "You earned a golden pearl! What an amazing diver!" },
};

const GROUP_STEP_TIPS = {
  think: { text: "Huddle up, crew! Whisper your treasure secrets together!" },
  speaking: { text: "Pick one brave diver to share the clue for the whole team!" },
  guessing: { text: "Teams, put your heads together and guess the treasure!" },
  reveal: { text: "The treasure is revealed! Everyone celebrate!" },
  reward: { text: "Your team earned golden pearls! Amazing teamwork!" },
};

function getContentTip(slide) {
  if (!slide) {
    return { text: "Swim through the guide and discover the hidden clues! 🐠" };
  }

  if (slide.video) {
    return {
      text: "Watch the demo and copy the speaking pattern together with your crew!",
    };
  }

  if (slide.questions?.length) {
    return {
      text: "Dive into a question and answer in a full sentence!",
    };
  }

  return {
    text: "Keep the explanation short, fun, and easy to repeat!",
  };
}

export default function Mascot() {
  const { currentStep, contentSlideIndex, activityMode } = useGameStore();
  const stepTips = activityMode === "group" ? GROUP_STEP_TIPS : STEP_TIPS;
  const tip =
    currentStep === "content"
      ? getContentTip(contentSlides[contentSlideIndex])
      : stepTips[currentStep] || { text: "Keep exploring the deep sea! 🌊" };

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
          {/* Mascot image */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative flex-shrink-0"
          >
            <div className="h-20 w-20 rounded-[1.6rem] overflow-hidden border-2 border-cyan-400/30 shadow-[0_0_30px_rgba(103,232,249,0.2)]">
              <img
                src="/images/sea/mascot.png"
                alt="Bubbles the Octopus"
                className="h-full w-full object-cover"
              />
            </div>
            {/* Glow effect */}
            <div className="absolute inset-[-4px] rounded-[1.8rem] border-2 border-cyan-400/20 animate-pulse pointer-events-none" />
          </motion.div>

          {/* Speech bubble */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="sea-glass-light relative rounded-[1.8rem] rounded-br-[0.6rem] px-5 py-4"
          >
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-cyan-400">
              🐙 Bubbles says
            </p>
            <p className="mt-2 text-sm font-bold leading-relaxed text-cyan-100">{tip.text}</p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
