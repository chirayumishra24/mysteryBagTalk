import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import Card from "../ui/Card";
import useGameStore from "../../store/useGameStore";
import { gameContent } from "../../data/gameContent";
import { playSuccess, playStarEarned } from "../../hooks/useAudio";

export default function RewardPanel() {
  const { setStep, addScore, stars, resetGame, saveToLeaderboard, selectedAvatar, playerName } = useGameStore();
  const [animatingStars, setAnimatingStars] = useState(0);
  const [showBadge, setShowBadge] = useState(false);

  // Animate stars appearing one by one based on criteria
  useEffect(() => {
    // We give all 3 criteria points for the demo logic
    // Add 3 points -> 3 stars out of 5 total max
    addScore(3); 
    
    let currentStar = 0;
    const targetStars = 5; // Simulating max success for feel-good gameplay
    
    const interval = setInterval(() => {
      if (currentStar < targetStars) {
        currentStar++;
        setAnimatingStars(currentStar);
        playStarEarned();
      } else {
        clearInterval(interval);
        playSuccess();
        saveToLeaderboard();
        setTimeout(() => setShowBadge(true), 500);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [addScore]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-4xl mx-auto z-20 relative px-4 flex flex-col items-center justify-center min-h-[90vh]"
    >
      <div className="text-center mb-10 w-full relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-64 bg-gradient-to-b from-yellow-500/20 to-pink-500/20 blur-3xl rounded-full" />
        
        <motion.h2
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl md:text-6xl font-display font-black text-white relative z-10"
        >
          Great Job!
        </motion.h2>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full items-stretch justify-center relative z-10">
        
        {/* Left Card: Score Breakdown */}
        <Card className="flex-1 flex flex-col p-8" delay={0.2}>
          <h3 className="text-xl font-display font-bold text-purple-300 border-b border-purple-500/20 pb-4 mb-6">
            Brownie Points Earned
          </h3>
          
          <ul className="space-y-4 flex-1">
            {gameContent.browniePoints.map((point, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.2 }}
                className="flex items-center justify-between bg-purple-900/40 p-4 rounded-xl border border-purple-500/20"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <span className="text-purple-100 font-body text-lg">{point.action}</span>
                </div>
                <span className="font-display font-bold text-pink-400 text-xl">+{point.points}</span>
              </motion.li>
            ))}
          </ul>
        </Card>

        {/* Right Card: Final Reward */}
        <Card variant="highlight" className="flex-1 flex flex-col items-center justify-center p-8 text-center" delay={0.4}>
          <div className="mb-6 flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.div
                key={star}
                initial={{ scale: 0, rotate: -180 }}
                animate={
                  star <= animatingStars
                    ? { scale: 1, rotate: 0 }
                    : { scale: 0, rotate: -180 }
                }
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-5xl"
                style={{ filter: "drop-shadow(0 0 10px rgba(253,224,71,0.5))" }}
              >
                {star <= animatingStars ? "⭐" : <span className="opacity-20 grayscale">⭐</span>}
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {showBadge && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.6 }}
                className="flex flex-col items-center"
              >
                <div className="relative w-40 h-40 mb-4 flex justify-center items-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-dashed border-yellow-400/50 rounded-full"
                  />
                  <div className="w-32 h-32 bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 rounded-full flex items-center justify-center p-1 shadow-[0_0_40px_rgba(250,204,21,0.6)]">
                    <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center relative overflow-hidden">
                      {/* Shine effect */}
                      <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12"
                      />
                      <span className="text-6xl group-hover:scale-110 transition-transform">🏆</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                  {gameContent.rewardBadge}
                </h3>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: showBadge ? 1 : 0, y: showBadge ? 0 : 30 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-12 flex flex-col sm:flex-row gap-4 items-center"
      >
        {/* Quick Replay - Skip content, go straight to next object */}
        <Button
          size="lg"
          onClick={() => {
            // Partial reset: keep hasSeenContent true, reset object/sentences/score
            const store = useGameStore.getState();
            store.setSelectedObject(null);
            store.updateSentence("name", "");
            store.updateSentence("colour", "");
            store.updateSentence("use", "");
            store.resetTimer();
            store.setStep("think");
          }}
          icon="⚡"
          className="shadow-[0_0_30px_rgba(139,92,246,0.3)]"
        >
          Quick Play Again
        </Button>
        
        {/* Full Reset */}
        <Button
          size="lg"
          variant="outline"
          onClick={() => {
            resetGame();
          }}
          icon="🔄"
        >
          New Game
        </Button>
      </motion.div>
    </motion.div>
  );
}
