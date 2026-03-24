import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import Timer from "../ui/Timer";
import useGameStore from "../../store/useGameStore";

export default function GuessPanel() {
  const { setStep, setTimerActive, timerSeconds, resetTimer } = useGameStore();
  const [showGuesses, setShowGuesses] = useState(false);

  useEffect(() => {
    resetTimer(30);
    setTimerActive(true);
    const timeout = setTimeout(() => setShowGuesses(true), 1500);
    return () => clearTimeout(timeout);
  }, []);

  const handleReveal = () => {
    setTimerActive(false);
    setStep("reveal");
  };

  const mockGuesses = [
    { text: "Is it a pencil?", delay: 0.5, avatar: "👦", color: "from-blue-400 to-indigo-500", x: -250, y: -40 },
    { text: "Maybe an eraser?", delay: 3, avatar: "👧", color: "from-pink-400 to-rose-500", x: 250, y: -90 },
    { text: "A small ball!", delay: 6, avatar: "🧒", color: "from-emerald-400 to-teal-500", x: -300, y: -160 },
    { text: "Wait, is it a key?", delay: 10, avatar: "👦🏽", color: "from-amber-400 to-orange-500", x: 200, y: -220 },
    { text: "A coin!", delay: 15, avatar: "👧🏼", color: "from-purple-400 to-fuchsia-500", x: -200, y: -300 },
  ];

  const isUrgent = timerSeconds <= 10 && timerSeconds > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-5xl mx-auto z-20 relative px-4 flex flex-col items-center justify-center min-h-[90vh]"
    >
      {/* Urgent Vignette Overlay */}
      <AnimatePresence>
        {isUrgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ background: "radial-gradient(circle, transparent 40%, rgba(220,38,38,0.3) 100%)" }}
          />
        )}
      </AnimatePresence>

      <div className="text-center w-full absolute top-10">
        <h2 className={`text-4xl md:text-5xl font-display font-black text-transparent bg-clip-text mb-4 ${isUrgent ? 'bg-gradient-to-r from-red-400 to-orange-500 animate-pulse' : 'bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500'}`}>
          Class Guessing Time!
        </h2>
        <p className="text-xl text-purple-100 font-body">
          Listen carefully and shout out your answers!
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center relative w-full h-[60vh] mt-20">
        
        {/* Animated Guess Bubbles */}
        <AnimatePresence>
          {showGuesses && timerSeconds > 0 && mockGuesses.map((guess, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.8, 1, 1, 0.9],
                x: guess.x,
                y: guess.y,
              }}
              transition={{
                delay: guess.delay,
                duration: 6,
                times: [0, 0.1, 0.8, 1],
                ease: "easeOut",
              }}
              className="absolute z-10 pointer-events-none"
            >
              <div className="flex items-end gap-3 glass-light bg-black/40 backdrop-blur-xl p-4 rounded-3xl rounded-bl-sm border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl bg-gradient-to-br ${guess.color} shadow-lg shrink-0`}>
                  {guess.avatar}
                </div>
                <div className="font-display font-medium text-xl text-white tracking-wide pr-2">
                  {guess.text}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Central Timer Array */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative z-30"
        >
          <div className="absolute inset-0 bg-blue-500/10 blur-[100px] scale-[3] rounded-full" />
          <div className="glass p-6 rounded-full border border-purple-400/30 shadow-[0_0_50px_rgba(139,92,246,0.2)] bg-black/50">
             <Timer initialSeconds={30} onComplete={handleReveal} />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 w-full flex justify-center z-40"
      >
        <div className="w-full max-w-md glass p-6 rounded-3xl border border-purple-500/30 text-center bg-purple-900/30 backdrop-blur-xl shadow-2xl">
          <p className="font-display font-medium text-purple-100/80 mb-5 text-lg">
             Did someone guess it correctly?
          </p>
          <Button size="lg" variant="primary" onClick={handleReveal} className="w-full text-white shadow-xl shadow-purple-500/20">
            Reveal Answer 🎬
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
