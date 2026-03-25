import { motion } from "framer-motion";
import useGameStore from "../../store/useGameStore";

/**
 * SentenceBuilder - animated fill-in-the-blank UI for sentence starters.
 */
export default function SentenceBuilder({ sentences = [] }) {
  const { sentences: answers, updateSentence } = useGameStore();
  const keyMap = ["name", "colour", "use"];

  return (
    <div className="space-y-6">
      {sentences.map((sentence, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.2, duration: 0.5, ease: "easeOut" }}
          className="group"
        >
          <div className="bg-white p-6 rounded-[2rem] flex flex-col sm:flex-row items-start sm:items-center gap-6 border-4 border-sky-100 hover:border-secondary transition-all duration-300 shadow-md">
            {/* Sentence number */}
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-white font-display font-black text-xl shadow-md transform -rotate-3">
              {index + 1}
            </div>

            {/* Sentence template with input */}
            <div className="flex-1 flex flex-wrap items-center gap-2">
              {sentence.template.split("___").map((part, partIndex, arr) => (
                <span key={partIndex} className="flex items-center gap-2">
                  <span className="text-slate-700 font-display font-black text-xl">{part}</span>
                  {partIndex < arr.length - 1 && (
                    <motion.div className="relative" whileFocus={{ scale: 1.05 }}>
                      <input
                        type="text"
                        value={answers[keyMap[index]] || ""}
                        onChange={(e) => updateSentence(keyMap[index], e.target.value)}
                        placeholder={sentence.placeholder}
                        className="bg-sky-50 border-4 border-sky-100 rounded-2xl px-5 py-3 text-secondary font-display font-black placeholder-slate-300 focus:outline-none focus:border-secondary focus:bg-white transition-all duration-300 min-w-[200px] shadow-inner"
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
