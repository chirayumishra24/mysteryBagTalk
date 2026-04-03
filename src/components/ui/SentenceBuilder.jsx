import { motion } from "framer-motion";
import useGameStore from "../../store/useGameStore";

/**
 * SentenceBuilder - animated fill-in-the-blank UI for sentence starters.
 * Updated with deep sea underwater theme.
 */
export default function SentenceBuilder({ sentences = [] }) {
  const { sentences: answers, updateSentence } = useGameStore();
  const keyMap = ["name", "colour", "use"];
  const tones = [
    "border-cyan-500/20 bg-cyan-500/8 text-cyan-200",
    "border-amber-500/20 bg-amber-500/8 text-amber-200",
    "border-teal-500/20 bg-teal-500/8 text-teal-200",
  ];
  const icons = ["🗝️", "🎨", "🧭"];

  return (
    <div className="space-y-4">
      <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-400">🐙 Build your treasure clue</p>
      {sentences.map((sentence, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.2, duration: 0.5, ease: "easeOut" }}
          className="group"
        >
          <div className={`flex flex-col items-start gap-4 rounded-[1.8rem] border-2 p-5 shadow-[0_14px_28px_rgba(0,0,0,0.2)] transition-all duration-300 sm:flex-row sm:items-center ${tones[index]}`}>
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-cyan-950/50 text-xl font-display font-black shadow-md border border-cyan-500/10">
              {icons[index]}
            </div>

            <div className="flex-1 flex flex-wrap items-center gap-2">
              {sentence.template.split("___").map((part, partIndex, arr) => (
                <span key={partIndex} className="flex items-center gap-2">
                  <span className="text-lg font-display font-black text-cyan-100">{part}</span>
                  {partIndex < arr.length - 1 && (
                    <motion.div className="relative" whileFocus={{ scale: 1.05 }}>
                      <input
                        type="text"
                        value={answers[keyMap[index]] || ""}
                        onChange={(e) => updateSentence(keyMap[index], e.target.value)}
                        placeholder={sentence.placeholder}
                        className="min-w-[180px] rounded-2xl border-2 border-cyan-500/20 bg-cyan-950/50 px-5 py-3 font-display font-black text-cyan-100 shadow-inner placeholder:text-cyan-500/40 focus:border-cyan-400/40 focus:bg-cyan-950/70 focus:outline-none focus:shadow-[0_0_20px_rgba(103,232,249,0.1)] transition-all duration-300"
                      />
                    </motion.div>
                  )}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
