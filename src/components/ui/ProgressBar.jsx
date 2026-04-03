import { motion } from "framer-motion";
import useGameStore, { GAME_STEPS } from "../../store/useGameStore";

const STEP_LABELS = {
  content: { icon: "🗺️", label: "Map" },
  think: { icon: "🧠", label: "Think" },
  speaking: { icon: "🎤", label: "Speak" },
  guessing: { icon: "🐙", label: "Guess" },
  reveal: { icon: "💎", label: "Reveal" },
  reward: { icon: "🏆", label: "Reward" },
};

export default function ProgressBar() {
  const { currentStep, stepIndex, contentSlideIndex, activityMode, setActivityMode } = useGameStore();
  const progress = ((stepIndex + 1) / GAME_STEPS.length) * 100;
  const contentCaption =
    currentStep === "content" ? `Treasure map slide ${contentSlideIndex + 1}` : STEP_LABELS[currentStep]?.label;

  return (
    <div className="fixed left-0 right-0 top-0 z-[80] px-3 pt-3 pointer-events-none md:px-5">
      <div className="mx-auto max-w-6xl rounded-[1.6rem] border border-cyan-500/20 bg-[rgba(10,22,40,0.8)] px-4 py-3 shadow-[0_16px_34px_rgba(0,0,0,0.3)] backdrop-blur-xl">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-cyan-400">
                🐙 Deep Sea Quest
              </p>
              <p className="truncate text-sm font-bold text-cyan-200">{contentCaption}</p>
            </div>

            <div className="pointer-events-auto xl:hidden">
              <ActivityModeSwitch activityMode={activityMode} onChange={setActivityMode} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <div className="hidden pointer-events-auto xl:block">
              <ActivityModeSwitch activityMode={activityMode} onChange={setActivityMode} />
            </div>

            <div className="hidden items-center gap-2 lg:flex">
              {GAME_STEPS.map((step, index) => {
                const active = currentStep === step;
                const completed = index < stepIndex;
                const meta = STEP_LABELS[step];

                return (
                  <div
                    key={step}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-black uppercase tracking-[0.18em] transition-all ${
                      active
                        ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-100 shadow-[0_0_16px_rgba(103,232,249,0.1)]"
                        : completed
                        ? "border-teal-500/30 bg-teal-500/10 text-teal-200"
                        : "border-cyan-500/10 bg-cyan-950/30 text-cyan-400/50"
                    }`}
                  >
                    <span className="text-base leading-none">{meta.icon}</span>
                    <span>{meta.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-cyan-950/60 border border-cyan-500/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-amber-400 shadow-[0_0_12px_rgba(103,232,249,0.3)]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", damping: 24, stiffness: 110 }}
          />
        </div>
      </div>
    </div>
  );
}

function ActivityModeSwitch({ activityMode, onChange }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-cyan-500/20 bg-cyan-950/50 px-1 py-1 shadow-[0_10px_22px_rgba(0,0,0,0.2)]">
      {[
        { id: "solo", label: "Solo" },
        { id: "group", label: "Crew" },
      ].map((option) => {
        const active = activityMode === option.id;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`rounded-full px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] transition-all ${
              active
                ? "bg-gradient-to-r from-cyan-500 to-teal-400 text-white shadow-[0_0_16px_rgba(103,232,249,0.2)]"
                : "text-cyan-400/60 hover:bg-cyan-500/10"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
