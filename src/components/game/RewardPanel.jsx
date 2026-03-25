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
      <div className="text-center mb-12 w-full relative z-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-64 bg-primary/20 blur-3xl rounded-full" />
        
        <motion.h2
          initial={{ y: -30, opacity: 0, rotate: -2 }}
          animate={{ y: 0, opacity: 1, rotate: 2 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
          className="text-6xl md:text-8xl font-display font-black text-secondary text-outline-blue relative z-10 uppercase tracking-tighter"
        >
          YOU DID IT!
        </motion.h2>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full items-stretch justify-center relative z-10">
        
        {/* Left Card: Score Breakdown */}
        <Card variant="light" className="flex-1 flex flex-col p-8 border-4 border-sky-100" delay={0.2}>
          <h3 className="text-2xl font-display font-black text-secondary border-b-4 border-sky-50 pb-4 mb-6 uppercase tracking-tight">
            MYSTERY POINTS 🏅
          </h3>
          
          <ul className="space-y-4 flex-1">
            {gameContent.browniePoints.map((point, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.2 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border-2 border-sky-50 shadow-sm transition-all hover:scale-[1.02]">
                  <span className="text-2xl bg-sky-50 rounded-full p-1">✅</span>
                  <span className="text-slate-700 font-display font-bold text-lg">{point.action}</span>
                </div>
                <span className="font-display font-black text-secondary text-2xl">+{point.points}</span>
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
                <div className="relative w-48 h-48 mb-6 flex justify-center items-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-10px] border-4 border-dashed border-primary/50 rounded-full"
                  />
                  <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center p-2 shadow-2xl border-8 border-primary">
                    <div className="w-full h-full bg-sky-50 rounded-full flex items-center justify-center relative overflow-hidden border-4 border-white">
                      <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent transform -skew-x-12"
                      />
                      <span className="text-7xl group-hover:scale-110 transition-transform drop-shadow-md">🏆</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-4xl font-display font-black text-secondary text-outline-blue uppercase transform -rotate-2">
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
          size="xl"
          variant="primary"
          onClick={() => {
            const store = useGameStore.getState();
            store.setSelectedObject(null);
            store.updateSentence("name", "");
            store.updateSentence("colour", "");
            store.updateSentence("use", "");
            store.resetTimer();
            store.setStep("think");
          }}
          icon="🎒"
        >
          PLAY AGAIN!
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
          Main Menu
        </Button>
      </motion.div>
    </motion.div>
  );
}
