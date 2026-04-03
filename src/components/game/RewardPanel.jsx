import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useGameStore from "../../store/useGameStore";
import { gameContent } from "../../data/gameContent";
import { playStarEarned, playSuccess } from "../../hooks/useAudio";

export default function RewardPanel() {
  const { addScore, resetGame, saveToLeaderboard, selectedAvatar, playerName, updateSentence, setSelectedObject, resetTimer, setStep, activityMode } =
    useGameStore();
  const [animatingStars, setAnimatingStars] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  const isGroupMode = activityMode === "group";

  useEffect(() => {
    addScore(3);

    let currentStar = 0;
    const targetStars = 5;

    const interval = setInterval(() => {
      if (currentStar < targetStars) {
        currentStar += 1;
        setAnimatingStars(currentStar);
        playStarEarned();
      } else {
        clearInterval(interval);
        playSuccess();
        saveToLeaderboard();
        setTimeout(() => setShowBadge(true), 400);
      }
    }, 350);

    return () => clearInterval(interval);
  }, [addScore, saveToLeaderboard]);

  const handlePlayAgain = () => {
    setSelectedObject(null);
    updateSentence("name", "");
    updateSentence("colour", "");
    updateSentence("use", "");
    resetTimer();
    setStep("think");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-24 md:px-6"
    >
      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="space-y-5 sea-glass p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="sea-tag-gold px-4 py-2 flex items-center gap-2">
              🏆 Treasure Reward!
            </span>
            <span className="sea-tag px-4 py-2">
              Celebrate the dive!
            </span>
          </div>

          <h2 className="text-4xl font-black uppercase tracking-tight text-cyan-50 bio-glow-warm md:text-5xl">
            Amazing Dive! 🐙
          </h2>

          <div className="grid gap-2 mt-4">
            {gameContent.browniePoints.map((point, index) => (
              <motion.div
                key={point.action}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.12 }}
                className="flex items-center justify-between rounded-xl border border-cyan-500/15 bg-cyan-500/5 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-xl shadow-sm border border-amber-500/20">{point.emoji || "⭐"}</span>
                  <span className="text-sm font-black uppercase tracking-[0.16em] text-cyan-200">{point.action}</span>
                </div>
                <span className="text-lg font-black text-amber-400">+{point.points}</span>
              </motion.div>
            ))}
          </div>

          <div className="rounded-[1.6rem] border border-teal-500/20 bg-teal-500/5 p-5">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-teal-400">🐙 Captain's words</p>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-teal-200/80">
              {isGroupMode
                ? '"You worked as a crew, shared clear treasure clues, and listened like true ocean explorers. What an amazing dive!"'
                : '"You used clear clues, brave speaking, and kind cheering. That\'s what a real ocean explorer sounds like!"'}
            </p>
          </div>
        </div>

        {/* Golden Pearl Badge Ceremony */}
        <div className="sea-glass p-6">
          <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
            <div className="mb-6 sea-tag-gold px-5 py-2">
              {isGroupMode ? "🐙 Crew celebration" : "🏆 Golden Pearl Board"}
            </div>

            {/* Pearl animation */}
            <div className="mb-6 flex flex-wrap justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.div
                  key={star}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={star <= animatingStars ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                  transition={{ type: "spring", stiffness: 220, damping: 12 }}
                  className="flex h-16 w-16 items-center justify-center"
                >
                  {star <= animatingStars ? (
                    <div className="relative">
                      <span className="text-5xl" style={{ filter: "drop-shadow(0 0 12px rgba(251,191,36,0.4))" }}>🪙</span>
                      <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-[-8px] rounded-full bg-amber-400/20"
                      />
                    </div>
                  ) : (
                    <span className="text-5xl opacity-20 grayscale">🪙</span>
                  )}
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {showBadge && (
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.45 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative mb-6 flex h-48 w-48 items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-[-10px] rounded-full border-4 border-dashed border-amber-400/30"
                    />
                    <div className="flex h-40 w-40 items-center justify-center rounded-full border border-amber-500/30 bg-gradient-to-br from-amber-500/15 to-orange-500/10 shadow-[0_0_60px_rgba(251,191,36,0.2)] animate-treasure-glow overflow-hidden">
                      <img src="/images/sea/pearl.png" alt="Golden Pearl" className="h-32 w-32 object-contain drop-shadow-xl" />
                    </div>
                  </div>

                  <h3 className="text-3xl font-black uppercase tracking-tight text-amber-300 bio-glow-warm">
                    {gameContent.rewardBadge}
                  </h3>
                  <p className="mt-2 max-w-md text-sm font-semibold text-cyan-200/70">
                    {isGroupMode
                      ? `${playerName || "Mystery Crew"} found the treasure! 🐙`
                      : `${selectedAvatar ? `${selectedAvatar.emoji} ` : ""}${playerName || "Brave Diver"} found the treasure! 🐙`}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handlePlayAgain}
                className="coral-btn inline-flex items-center justify-center gap-3 px-7 py-4 text-base"
              >
                {isGroupMode ? "🐙 Next crew dive" : "🐙 Dive again!"}
              </button>
              <button
                type="button"
                onClick={() => resetGame()}
                className="inline-flex items-center justify-center gap-3 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-7 py-4 text-base font-black uppercase tracking-[0.2em] text-cyan-300 shadow-sm hover:bg-cyan-500/15 transition-colors"
              >
                🗺️ Restart guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
