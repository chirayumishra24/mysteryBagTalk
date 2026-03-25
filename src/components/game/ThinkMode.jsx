import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import useGameStore from "../../store/useGameStore";
import { gameContent } from "../../data/gameContent";
import { playPop, playMagicOpen } from "../../hooks/useAudio";

export default function ThinkMode() {
  const { setStep, setSelectedObject, gradeLevel } = useGameStore();
  const [showOptions, setShowOptions] = useState(false);
  const [selected, setSelected] = useState(null);

  const objects = (() => {
    try {
      const custom = JSON.parse(localStorage.getItem("customObjects") || "null");
      if (custom && custom.length > 0) return custom;
    } catch (e) {}
    return gameContent.objects[gradeLevel] || gameContent.objects["2nd grade"];
  })();

  const handleSelectObject = (obj) => {
    setSelected(obj);
    setSelectedObject(obj);
    playPop();
    setTimeout(() => {
      setStep("speaking");
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-sky-100/90 backdrop-blur-xl p-6"
    >
      {!showOptions ? (
        // Initial thought prompts
        <div className="max-w-3xl w-full flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="w-40 h-40 mb-10 bg-gradient-to-br from-primary to-amber-400 rounded-full flex items-center justify-center text-7xl shadow-xl border-8 border-white"
          >
            🤔
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-display font-black text-secondary text-outline-blue mb-10 text-center uppercase tracking-tighter">
            THINK MODE
          </h2>

          <div className="space-y-6 mb-14 w-full max-w-lg">
            {["Feel its shape.", "What is it used for?", "What colour is it?"].map(
              (prompt, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.4 }}
                  className="card-playful p-5 rounded-3xl text-center text-2xl font-display font-bold text-slate-800 border-secondary"
                >
                  {prompt}
                </motion.div>
              )
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5 }}
          >
            <Button size="xl" variant="primary" onClick={() => { playMagicOpen(); setShowOptions(true); }}>
              I HAVE AN OBJECT! 🎒
            </Button>
          </motion.div>
        </div>
      ) : (
        // Object Selection Grid (Teacher / Student simulation)
        <div className="max-w-6xl w-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-black text-secondary mb-4 uppercase tracking-tight">
              What did you find?
            </h2>
            <div className="inline-block bg-primary px-6 py-2 rounded-full border-4 border-white shadow-md -rotate-1">
              <p className="text-slate-800 font-display font-black uppercase text-sm italic">Shhh! Keep it a secret! 🤫</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 max-h-[65vh] overflow-y-auto custom-scrollbar p-4 bg-white/40 rounded-[3rem] border-4 border-sky-200">
            {objects.map((obj, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, y: -8, rotate: i % 2 === 0 ? 2 : -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectObject(obj)}
                disabled={selected !== null}
                className={`group relative flex flex-col items-center justify-center p-6 rounded-[2.5rem] border-4 transition-all duration-300 aspect-square shadow-lg ${
                  selected === obj
                    ? "bg-primary border-white shadow-xl scale-110 z-10"
                    : selected !== null
                    ? "bg-slate-100 opacity-30 border-transparent grayscale"
                    : "bg-white border-sky-100 hover:border-secondary hover:shadow-2xl"
                }`}
              >
                <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">{obj.emoji}</span>
                <span className={`text-base font-display font-black uppercase text-center leading-tight ${
                  selected === obj ? "text-slate-800" : "text-secondary"
                }`}>
                  {obj.name}
                </span>
                
                {/* Selection indicator */}
                {selected === obj && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-[-10px] rounded-[3rem] border-6 border-white/50 -z-10 bg-primary/20"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
