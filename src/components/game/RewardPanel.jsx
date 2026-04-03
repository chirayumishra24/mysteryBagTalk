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
        <div className="space-y-5 rounded-[2.4rem] border border-white/85 bg-white/86 p-6 shadow-[0_24px_80px_rgba(249,115,22,0.14)] backdrop-blur-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#ff7a45] px-4 py-2 text-xs font-black uppercase tracking-[0.32em] text-white">
              Reward Time
            </span>
            <span className="rounded-full border border-[#ffe7a1] bg-[#fff8db] px-4 py-2 text-sm font-bold text-[#8c5a1a]">
              Celebrate the effort
            </span>
          </div>

          <h2 className="text-5xl font-black uppercase tracking-tight text-[#432414] text-glow md:text-7xl">
            You did it!
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-[#654331] md:text-lg">
            {isGroupMode
              ? "The groups listened, guessed, and celebrated together. End the round with stars, praise, and one quick reminder about the teamwork that made the clue work well."
              : "The class listened, guessed, and celebrated together. End the round with stars, praise, and one quick reminder about what made the clue work well."}
          </p>

          <div className="grid gap-3">
            {gameContent.browniePoints.map((point, index) => (
              <motion.div
                key={point.action}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.12 }}
                className="flex items-center justify-between rounded-[1.5rem] border border-[#ffd8c2] bg-[#fff4ec] p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">⭐</span>
                  <span className="text-sm font-black uppercase tracking-[0.16em] text-[#7d4522]">{point.action}</span>
                </div>
                <span className="text-lg font-black text-[#ff7a45]">+{point.points}</span>
              </motion.div>
            ))}
          </div>

          <div className="rounded-[1.6rem] border border-[#d7f4ef] bg-[#effffb] p-5">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#0f7c70]">Teacher line</p>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-[#17685e]">
              {isGroupMode
                ? '"You worked as a team, shared clear clues, and listened carefully. That is what great group speaking looks like."'
                : '"You used clear clues, strong listening, and kind applause. That is what great speaking looks like."'}
            </p>
          </div>
        </div>

        <div className="rounded-[2.4rem] border border-white/85 bg-white/86 p-6 shadow-[0_24px_80px_rgba(249,115,22,0.14)] backdrop-blur-2xl">
          <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
            <div className="mb-6 rounded-full border border-[#ffd8c2] bg-[#fff4ea] px-5 py-2 text-xs font-black uppercase tracking-[0.32em] text-[#ff7a45]">
              {isGroupMode ? "Group celebration board" : "Star speaker board"}
            </div>

            <div className="mb-6 flex flex-wrap justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.span
                  key={star}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={star <= animatingStars ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                  transition={{ type: "spring", stiffness: 220, damping: 12 }}
                  className="text-5xl"
                  style={{ filter: "drop-shadow(0 8px 0 rgba(249,115,22,0.16))" }}
                >
                  {star <= animatingStars ? "⭐" : <span className="opacity-20 grayscale">⭐</span>}
                </motion.span>
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
                      className="absolute inset-[-10px] rounded-full border-4 border-dashed border-[#ffc83d]/60"
                    />
                    <div className="flex h-40 w-40 items-center justify-center rounded-full border border-white/90 bg-[linear-gradient(135deg,#fff8db,#fff1e8)] text-7xl shadow-[0_24px_50px_rgba(249,115,22,0.16)]">
                      🏆
                    </div>
                  </div>

                  <h3 className="text-4xl font-black uppercase tracking-tight text-[#432414]">
                    {gameContent.rewardBadge}
                  </h3>
                  <p className="mt-3 max-w-md text-base leading-relaxed text-[#654331]">
                    {isGroupMode
                      ? `${playerName || "Mystery Team"} finished the round with strong teamwork and confident clues.`
                      : `${selectedAvatar ? `${selectedAvatar.emoji} ` : ""}${playerName || "Mystery Speaker"} finished the round with strong clues and brave speaking.`}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handlePlayAgain}
                className="inline-flex items-center justify-center gap-3 rounded-full border border-[#ffb087] bg-[linear-gradient(135deg,#fb923c,#fb7185)] px-7 py-4 text-base font-black uppercase tracking-[0.2em] text-white shadow-[0_14px_34px_rgba(249,115,22,0.18)]"
              >
                {isGroupMode ? "Next group round" : "Play again"}
              </button>
              <button
                type="button"
                onClick={() => resetGame()}
                className="inline-flex items-center justify-center gap-3 rounded-full border border-[#ffd8c2] bg-white px-7 py-4 text-base font-black uppercase tracking-[0.2em] text-[#7d4522] shadow-sm"
              >
                Restart guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
