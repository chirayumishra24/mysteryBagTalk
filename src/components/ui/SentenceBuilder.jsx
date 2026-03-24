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
          <div className="glass p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 hover:border-purple-400/40 transition-all duration-300">
            {/* Sentence number */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-display font-bold text-sm">
              {index + 1}
            </div>

            {/* Sentence template with input */}
            <div className="flex-1 flex flex-wrap items-center gap-2 text-lg font-body">
              {sentence.template.split("___").map((part, partIndex, arr) => (
                <span key={partIndex} className="flex items-center gap-2">
                  <span className="text-purple-100">{part}</span>
                  {partIndex < arr.length - 1 && (
                    <motion.div
                      className="relative"
                      whileFocus={{ scale: 1.02 }}
                    >
                      <input
                        type="text"
                        value={answers[keyMap[index]] || ""}
                        onChange={(e) =>
                          updateSentence(keyMap[index], e.target.value)
                        }
                        placeholder={sentence.placeholder}
                        className="bg-purple-900/30 border-2 border-purple-500/30 rounded-xl px-4 py-2 text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-400 focus:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300 min-w-[140px] font-body"
                      />
                      {/* Focus glow effect */}
                      <div className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" 
                        style={{ boxShadow: "0 0 20px rgba(139,92,246,0.2)" }} 
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
