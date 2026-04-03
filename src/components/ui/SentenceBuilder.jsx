import { motion } from "framer-motion";
import useGameStore from "../../store/useGameStore";

/**
 * SentenceBuilder - animated fill-in-the-blank UI for sentence starters.
 */
export default function SentenceBuilder({ sentences = [] }) {
  const { sentences: answers, updateSentence } = useGameStore();
  const keyMap = ["name", "colour", "use"];
  const tones = [
    "border-[#ffd6c2] bg-[#fff1e8] text-[#86401b]",
    "border-[#ffe7a1] bg-[#fff8db] text-[#8c5a1a]",
    "border-[#ccefe8] bg-[#ecfffb] text-[#0f7c70]",
  ];

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
          <div className={`flex flex-col items-start gap-6 rounded-[2rem] border-4 p-6 shadow-[0_14px_28px_rgba(249,115,22,0.08)] transition-all duration-300 sm:flex-row sm:items-center ${tones[index]}`}>
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-xl font-display font-black shadow-md">
              {index + 1}
            </div>

            <div className="flex-1 flex flex-wrap items-center gap-2">
              {sentence.template.split("___").map((part, partIndex, arr) => (
                <span key={partIndex} className="flex items-center gap-2">
                  <span className="text-xl font-display font-black text-[#513120]">{part}</span>
                  {partIndex < arr.length - 1 && (
                    <motion.div className="relative" whileFocus={{ scale: 1.05 }}>
                      <input
                        type="text"
                        value={answers[keyMap[index]] || ""}
                        onChange={(e) => updateSentence(keyMap[index], e.target.value)}
                        placeholder={sentence.placeholder}
                        className="min-w-[200px] rounded-2xl border-4 border-white bg-white/85 px-5 py-3 font-display font-black text-[#7d4522] shadow-inner placeholder:text-[#c79c82] focus:border-[#ffb087] focus:bg-white focus:outline-none transition-all duration-300"
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
