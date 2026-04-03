import { motion } from "framer-motion";
import useGameStore, { GAME_STEPS } from "../../store/useGameStore";

const STEP_LABELS = {
  content: { icon: "📖", label: "Guide" },
  think: { icon: "🤔", label: "Pick" },
  speaking: { icon: "🎤", label: "Speak" },
  guessing: { icon: "💭", label: "Guess" },
  reveal: { icon: "🎉", label: "Reveal" },
  reward: { icon: "🏆", label: "Reward" },
};

export default function ProgressBar() {
  const { currentStep, stepIndex, contentSlideIndex } = useGameStore();
  const progress = ((stepIndex + 1) / GAME_STEPS.length) * 100;
  const contentCaption =
    currentStep === "content" ? `Guide slide ${contentSlideIndex + 1}` : STEP_LABELS[currentStep]?.label;

  return (
    <div className="fixed left-0 right-0 top-0 z-[80] px-3 pt-3 pointer-events-none md:px-5">
      <div className="mx-auto max-w-6xl rounded-[1.6rem] border border-white/80 bg-white/80 px-4 py-3 shadow-[0_16px_34px_rgba(249,115,22,0.12)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#a86132]">
              Activity Flow
            </p>
            <p className="truncate text-sm font-bold text-[#654331]">{contentCaption}</p>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {GAME_STEPS.map((step, index) => {
              const active = currentStep === step;
              const completed = index < stepIndex;
              const meta = STEP_LABELS[step];

              return (
                <div
                  key={step}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-black uppercase tracking-[0.18em] transition-all ${
                    active
                      ? "border-[#ffb087] bg-[#fff1e7] text-[#7b3918]"
                      : completed
                      ? "border-[#d7f4ef] bg-[#effffb] text-[#0f7c70]"
                      : "border-[#f4e1d3] bg-white text-[#9d7d68]"
                  }`}
                >
                  <span className="text-base leading-none">{meta.icon}</span>
                  <span>{meta.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#ffe9db]">
          <motion.div
            className="h-full rounded-full bg-[linear-gradient(90deg,#fb923c,#fb7185,#14b8a6)]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", damping: 24, stiffness: 110 }}
          />
        </div>
      </div>
    </div>
  );
}
