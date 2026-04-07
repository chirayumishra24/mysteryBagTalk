import { motion } from "framer-motion";
import SpeechBubble from "../interactive/SpeechBubble";

export default function Chapter12({ chapter }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-10 pt-8"
    >
      {/* Title */}
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl lg:text-4xl"
          style={{
            background: "linear-gradient(135deg, #ffd700, #ffaa00)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {chapter.title}
        </motion.h2>
      </div>

      {/* Hero */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="flex justify-center"
      >
        <div className="relative group">
          <div className="absolute inset-0 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"
            style={{ background: "linear-gradient(135deg, var(--accent-gold), var(--accent-purple))" }}
          />
          <img
            src={chapter.heroImage}
            alt="Watch and Learn"
            className="w-64 md:w-80 rounded-3xl shadow-2xl relative z-10"
            style={{
              border: "3px solid rgba(255, 215, 0, 0.25)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
            }}
          />
        </div>
      </motion.div>

      {/* Speech Bubble */}
      <SpeechBubble
        text={chapter.intro}
        characterImage="/images/characters/oliver-mascot.png"
        delay={0.3}
      />

      {/* Video Embed */}
      {chapter.video && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%)",
              border: "2px solid rgba(255, 215, 0, 0.2)",
              boxShadow: "0 8px 40px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div className="p-5 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  className="w-3 h-3 rounded-full"
                  style={{ background: "var(--accent-gold)" }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <p className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--accent-gold)" }}>
                  Oliver's Magic Screen
                </p>
              </div>
              <div
                className="aspect-video rounded-xl overflow-hidden"
                style={{
                  border: "2px solid rgba(124, 58, 237, 0.2)",
                  boxShadow: "inset 0 0 30px rgba(0, 0, 0, 0.3)",
                }}
              >
                <iframe
                  src={chapter.video.embedUrl}
                  title={chapter.video.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="text-center text-gray-500 text-sm mt-3 font-semibold">
                {chapter.video.title}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Discussion Questions - Upgraded sticky notes */}
      <div>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-xl font-bold mb-5"
          style={{ color: "rgba(167, 139, 250, 0.9)" }}
        >
          ✨ {chapter.discussionTitle || "Discussion Questions"} ✨
        </motion.h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {chapter.questions.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: (i - 1) * 2 }}
              transition={{ delay: 0.8 + i * 0.15 }}
              whileHover={{ rotate: 0, scale: 1.05, y: -4 }}
              className="cursor-pointer"
              style={{
                background: ["#fff9c4", "#ffe0b2", "#c8e6c9"][i % 3],
                color: "#1e293b",
                padding: "24px 20px",
                borderRadius: "6px",
                boxShadow: "4px 4px 12px rgba(0,0,0,0.2), inset 0 -2px 4px rgba(0,0,0,0.05)",
                transform: `rotate(${(i - 1) * 2}deg)`,
              }}
            >
              <div className="w-4 h-4 rounded-full mx-auto mb-3 shadow-sm"
                style={{ background: ["#f44336", "#2196f3", "#4caf50"][i % 3] }}
              />
              <p className="font-bold text-sm text-center">{q}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Explain */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%)",
          border: "2px solid rgba(255, 215, 0, 0.2)",
        }}
      >
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 mb-3">
            <img src="/images/characters/oliver-mascot.png" alt="" className="w-10 h-10 rounded-full object-cover" />
            <p className="text-sm font-bold" style={{ color: "var(--accent-gold)" }}>Oliver says:</p>
          </div>
          <p className="text-lg text-gray-200 italic font-semibold">{chapter.explain}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
