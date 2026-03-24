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
      className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-6"
    >
      {!showOptions ? (
        // Initial thought prompts
        <div className="max-w-3xl w-full flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="w-32 h-32 mb-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-6xl shadow-[0_0_50px_rgba(139,92,246,0.5)]"
          >
            🤔
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8 text-center">
            Think Mode
          </h2>

          <div className="space-y-4 mb-12 w-full max-w-lg">
            {["Feel its shape.", "What is it used for?", "What colour is it?"].map(
              (prompt, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.4 }}
                  className="glass p-4 rounded-xl text-center text-xl font-body text-purple-100"
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
            <Button size="lg" onClick={() => { playMagicOpen(); setShowOptions(true); }}>
              I have an object in mind
            </Button>
          </motion.div>
        </div>
      ) : (
        // Object Selection Grid (Teacher / Student simulation)
        <div className="max-w-5xl w-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-display font-bold text-white mb-2">
              Select what you pulled from the bag
            </h2>
            <p className="text-purple-300 font-body">Don't show the others yet!</p>
          </motion.div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
            {objects.map((obj, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectObject(obj)}
                disabled={selected !== null}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 aspect-square ${
                  selected === obj
                    ? "bg-purple-600/50 border-purple-400 shadow-[0_0_30px_rgba(139,92,246,0.6)]"
                    : selected !== null
                    ? "glass-light opacity-30 border-transparent grayscale"
                    : "glass border-purple-500/20 hover:border-purple-400 hover:bg-purple-900/40"
                }`}
              >
                <span className="text-4xl mb-3 drop-shadow-md">{obj.emoji}</span>
                <span className="text-sm font-body text-purple-100 text-center leading-tight">
                  {obj.name}
                </span>
                
                {/* Selection indicator */}
                {selected === obj && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 rounded-2xl border-4 border-purple-400"
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
