import { useState } from "react";
import { motion } from "framer-motion";
import SpeechBubble from "../interactive/SpeechBubble";
import StepTimeline from "../interactive/StepTimeline";

export default function Chapter21({ chapter }) {
  const [activeGrade, setActiveGrade] = useState("2nd grade");

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
          <div className="absolute inset-0 rounded-3xl blur-xl opacity-20"
            style={{ background: "linear-gradient(135deg, var(--accent-gold), var(--accent-purple))" }}
          />
          <img
            src={chapter.heroImage}
            alt="Mystery Mission"
            className="w-72 md:w-96 rounded-3xl shadow-2xl relative z-10"
            style={{
              border: "3px solid rgba(255, 215, 0, 0.25)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
            }}
          />
        </div>
      </motion.div>

      {/* Mission Briefing */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        style={{ transformOrigin: "top" }}
      >
        <div
          className="relative p-6 md:p-8 rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #faf3e0 0%, #f5e6c8 100%)",
            border: "3px solid #d4a574",
            boxShadow: "inset 0 2px 10px rgba(0,0,0,0.08), 0 12px 40px rgba(0,0,0,0.25)",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-8 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #e74c3c, #c0392b)" }}
          >
            <p className="text-white text-xs font-bold uppercase tracking-wider">Mission Briefing</p>
          </div>
          <p
            className="text-center text-base md:text-lg font-bold mt-6 leading-relaxed italic"
            style={{ color: "#1e293b" }}
          >
            {chapter.intro}
          </p>
        </div>
      </motion.div>

      {/* Task Instructions */}
      {chapter.taskInstructions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl font-bold mb-5" style={{ color: "rgba(167, 139, 250, 0.9)" }}>
            ✨ Task Instructions ✨
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {chapter.taskInstructions.map((task, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1, type: "spring" }}
                whileHover={{ scale: 1.05, y: -6 }}
                className="rounded-2xl p-5 text-center cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02))",
                  border: "2px solid rgba(255, 215, 0, 0.15)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg"
                  style={{
                    background: "linear-gradient(135deg, #ffd700, #ff8c00)",
                    color: "#1a1a2e",
                    boxShadow: "0 4px 15px rgba(255, 215, 0, 0.3)",
                  }}
                >
                  {i + 1}
                </div>
                <p className="text-sm font-semibold text-gray-200">{task}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Steps */}
      <div>
        <h3
          className="text-xl md:text-2xl font-bold mb-6"
          style={{
            background: "linear-gradient(135deg, #ffd700, #ffaa00)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Step-by-Step Activity
        </h3>
        <StepTimeline steps={chapter.steps} />
      </div>

      {/* Objects with Grade Tabs */}
      {chapter.objects && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: "rgba(167, 139, 250, 0.9)" }}>
            ✨ Objects for the Mystery Bag ✨
          </h3>

          <div className="flex gap-3 mb-5">
            {Object.keys(chapter.objects).map((grade) => (
              <motion.button
                key={grade}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveGrade(grade)}
                style={{
                  padding: "10px 24px",
                  borderRadius: "16px",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  border: activeGrade === grade
                    ? "2px solid rgba(255, 215, 0, 0.6)"
                    : "2px solid rgba(255, 255, 255, 0.08)",
                  background: activeGrade === grade
                    ? "linear-gradient(135deg, #ffd700, #ff8c00)"
                    : "rgba(255, 255, 255, 0.04)",
                  color: activeGrade === grade ? "#1a1a2e" : "rgba(255, 255, 255, 0.5)",
                  boxShadow: activeGrade === grade
                    ? "0 4px 15px rgba(255, 215, 0, 0.3)"
                    : "none",
                }}
              >
                {grade}
              </motion.button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {chapter.objects[activeGrade]?.map((obj, i) => (
              <motion.div
                key={`${activeGrade}-${i}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03, type: "spring" }}
                whileHover={{ scale: 1.08, y: -4 }}
                className="rounded-xl p-4 text-center cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #faf3e0, #f5e6c8)",
                  border: "2px dashed rgba(124, 58, 237, 0.25)",
                  boxShadow: "3px 3px 0px rgba(124, 58, 237, 0.1)",
                }}
              >
                <p className="text-sm font-bold" style={{ color: "#1e293b" }}>{obj}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Sentence Starters */}
      {chapter.sentenceStarters && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3
            className="text-xl md:text-2xl font-bold mb-5"
            style={{
              background: "linear-gradient(135deg, #ffd700, #ffaa00)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Sentence Starters
          </h3>
          <div className="space-y-4">
            {chapter.sentenceStarters.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.15, type: "spring" }}
                whileHover={{ x: 6 }}
                className="rounded-2xl overflow-hidden flex items-center gap-5"
                style={{
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02))",
                  border: "2px solid rgba(124, 58, 237, 0.2)",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div
                  className="w-14 h-full flex items-center justify-center py-5 flex-shrink-0"
                  style={{
                    background: ["linear-gradient(135deg, #7c3aed, #6d28d9)", "linear-gradient(135deg, #2dd4bf, #0d9488)", "linear-gradient(135deg, #ff6b9d, #ec4899)"][i % 3],
                  }}
                >
                  <span className="text-white font-bold text-lg">{i + 1}</span>
                </div>
                <div className="py-4 pr-5">
                  <p className="text-lg font-bold" style={{ color: "var(--accent-gold)" }}>
                    {s.template}
                  </p>
                  <p className="text-sm text-gray-400 italic mt-1">({s.placeholder})</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
