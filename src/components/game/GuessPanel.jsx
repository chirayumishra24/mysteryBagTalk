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
      className="w-full max-w-6xl mx-auto z-20 relative px-4 flex flex-col items-center justify-center min-h-[90vh]"
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
            style={{ background: "radial-gradient(circle, transparent 40%, rgba(245,158,11,0.3) 100%)" }}
          />
        )}
      </AnimatePresence>

      <div className="text-center w-full absolute top-10 z-30">
        <h2 className={`text-5xl md:text-7xl font-display font-black uppercase tracking-tighter mb-4 ${isUrgent ? 'text-red-500 animate-bounce' : 'text-secondary text-outline-blue'}`}>
          GUESSING TIME!
        </h2>
        <div className="bg-white/50 backdrop-blur-sm px-8 py-3 rounded-full border-4 border-white shadow-lg inline-block transform rotate-1">
          <p className="text-2xl text-slate-700 font-display font-black">
            LISTEN CAREFULLY! 👂
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative w-full h-[60vh] mt-24">
        
        {/* Animated Guess Bubbles */}
        <AnimatePresence>
          {showGuesses && timerSeconds > 0 && mockGuesses.map((guess, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.8, 1.1, 1.1, 0.9],
                x: guess.x,
                y: guess.y,
                rotate: i % 2 === 0 ? 5 : -5
              }}
              transition={{
                delay: guess.delay,
                duration: 6,
                times: [0, 0.1, 0.8, 1],
                ease: "backOut",
              }}
              className="absolute z-10 pointer-events-none"
            >
              <div className="flex items-center gap-4 bg-white p-5 rounded-[2rem] rounded-bl-sm border-8 border-primary shadow-2xl">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl bg-gradient-to-br ${guess.color} border-4 border-white shadow-md shrink-0`}>
                  {guess.avatar}
                </div>
                <div className="font-display font-black text-2xl text-slate-800 tracking-tight pr-4">
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
          <div className="absolute inset-0 bg-primary/20 blur-[100px] scale-[3] rounded-full" />
          <div className="bg-white p-8 rounded-full border-8 border-secondary shadow-2xl">
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
        <div className="w-full max-w-md bg-white p-8 rounded-[2.5rem] border-8 border-secondary text-center shadow-2xl transform -rotate-1">
          <p className="font-display font-black text-slate-800 mb-6 text-xl uppercase tracking-tight">
             Correct Guess? 🏆
          </p>
          <Button size="xl" variant="primary" onClick={handleReveal} className="w-full">
            REVEAL BAG! 🎒
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
