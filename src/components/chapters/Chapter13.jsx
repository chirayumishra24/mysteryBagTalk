import { useState } from "react";
import { motion } from "framer-motion";
import SpeechBubble from "../interactive/SpeechBubble";

export default function Chapter13({ chapter }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pt-6"
    >
      {/* Chapter Title */}
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl mb-2"
          style={{ color: "var(--accent-gold)" }}
        >
          {chapter.title}
        </motion.h2>
      </div>

      {/* Intro */}
      <SpeechBubble
        text={chapter.intro}
        characterImage="/images/characters/oliver-mascot.png"
        delay={0.2}
      />

      {/* Interactive Mystery Reveal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col items-center"
      >
        <div
          className="relative cursor-pointer group"
          onClick={() => setRevealed(!revealed)}
        >
          {/* Mystery bag overlay */}
          <div
            className={`absolute inset-0 z-10 flex items-center justify-center rounded-2xl transition-all duration-700 ${
              revealed
                ? "opacity-0 pointer-events-none scale-110"
                : "opacity-100"
            }`}
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)",
            }}
          >
            <div className="text-center">
              <img
                src="/images/ui/mystery-bag.png"
                alt="Mystery Bag"
                className="w-28 h-28 mx-auto mb-3 object-contain animate-wobble"
              />
              <p className="text-yellow-200 font-bold text-lg">
                Tap to Reveal!
              </p>
              <p className="text-purple-200 text-sm mt-1">
                What's hiding inside?
              </p>
            </div>
          </div>

          {/* Actual content image */}
          {chapter.contentImages && chapter.contentImages[0] && (
            <img
              src={chapter.contentImages[0]}
              alt="Practice Object"
              className="w-72 md:w-96 rounded-2xl shadow-2xl border-2 border-yellow-400/20"
            />
          )}
        </div>

        <p className="text-gray-400 text-sm mt-3 font-semibold">
          {revealed ? "Great! Now answer these questions:" : "Tap the mystery bag to reveal the object!"}
        </p>
      </motion.div>

      {/* Questions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0.3 }}
        transition={{ duration: 0.5 }}
        className="space-y-3"
      >
        {chapter.questions.map((q, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: revealed ? 1 : 0.3, x: 0 }}
            transition={{ delay: revealed ? i * 0.2 : 0 }}
            className="glass-card p-4 flex items-center gap-3 hover-lift"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
              style={{
                background: "var(--accent-gold)",
                color: "var(--text-dark)",
              }}
            >
              {i + 1}
            </div>
            <p className="font-semibold text-gray-200">{q}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Explain */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass-card p-6 text-center border border-yellow-400/20"
      >
        <p className="text-base font-bold text-yellow-100 mb-1">Oliver says:</p>
        <p className="text-lg text-gray-200 italic font-semibold">{chapter.explain}</p>
      </motion.div>
    </motion.div>
  );
}
