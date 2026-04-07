import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import SpeechBubble from "../interactive/SpeechBubble";

const skillColors = [
  { bg: "linear-gradient(135deg, #ffd700, #ff8c00)", border: "#ffd700", text: "#ffd700" },
  { bg: "linear-gradient(135deg, #e74c3c, #c0392b)", border: "#e74c3c", text: "#e74c3c" },
  { bg: "linear-gradient(135deg, #2dd4bf, #0d9488)", border: "#2dd4bf", text: "#2dd4bf" },
  { bg: "linear-gradient(135deg, #7c3aed, #6d28d9)", border: "#7c3aed", text: "#7c3aed" },
  { bg: "linear-gradient(135deg, #ff6b9d, #ec4899)", border: "#ff6b9d", text: "#ff6b9d" },
];

export default function Chapter23({ chapter }) {
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCelebration(true);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#ffd700", "#7c3aed", "#e74c3c", "#2dd4bf", "#ff6b9d"],
      });
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

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
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="flex justify-center"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl blur-xl opacity-20" style={{ background: "var(--accent-gold)" }} />
          <img
            src={chapter.heroImage}
            alt="Celebration"
            className="w-60 md:w-80 rounded-3xl shadow-2xl relative z-10"
            style={{
              border: "3px solid rgba(255, 215, 0, 0.25)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
            }}
          />
        </div>
      </motion.div>

      {/* Intro Quote */}
      <SpeechBubble
        text={chapter.intro}
        characterImage="/images/characters/oliver-mascot.png"
        delay={0.3}
      />

      {/* Skills Label */}
      <div className="text-center">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl"
          style={{ color: "rgba(167, 139, 250, 0.9)" }}
        >
          ✨ Students Learn ✨
        </motion.h3>
      </div>

      {/* Skill Trading Cards - premium design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {chapter.skills.map((skill, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.7 + i * 0.2, duration: 0.6, type: "spring" }}
            whileHover={{ scale: 1.05, y: -8 }}
            className="group cursor-pointer"
          >
            <div
              className="relative p-6 rounded-2xl overflow-hidden h-full"
              style={{
                background: `rgba(13, 10, 30, 0.8)`,
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: `2px solid ${skillColors[i].border}40`,
                boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px ${skillColors[i].border}10`,
              }}
            >
              {/* Background glow */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 group-hover:opacity-25 transition-opacity"
                style={{ background: skillColors[i].border }}
              />
              <div
                className="absolute bottom-0 left-0 w-24 h-24 rounded-full blur-2xl opacity-5 group-hover:opacity-15 transition-opacity"
                style={{ background: skillColors[i].border }}
              />

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl overflow-hidden mb-4 flex items-center justify-center"
                  style={{
                    background: `${skillColors[i].border}15`,
                    border: `1px solid ${skillColors[i].border}30`,
                  }}
                >
                  <img
                    src={skill.icon}
                    alt={skill.title}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <h4
                  className="text-lg font-bold mb-2"
                  style={{ color: skillColors[i].text }}
                >
                  {skill.title}
                </h4>
                <p className="text-gray-400 text-sm font-semibold leading-relaxed">
                  {skill.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Celebration badge */}
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-center py-6"
        >
          <div
            className="relative max-w-md mx-auto rounded-3xl overflow-hidden p-8"
            style={{
              background: "rgba(13, 10, 30, 0.85)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "2px solid rgba(255, 215, 0, 0.3)",
              boxShadow: "0 0 40px rgba(255, 215, 0, 0.15), 0 20px 60px rgba(0, 0, 0, 0.3)",
            }}
          >
            {/* Animated glow */}
            <div className="absolute inset-0 animate-glow rounded-3xl" style={{ boxShadow: "inset 0 0 40px rgba(255, 215, 0, 0.05)" }} />

            <motion.img
              src="/images/ui/star-badge.png"
              alt="Star Badge"
              className="w-28 h-28 mx-auto mb-4 object-contain relative z-10"
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <h3
              className="text-2xl md:text-3xl font-bold mb-2 relative z-10"
              style={{
                background: "linear-gradient(135deg, #ffd700, #ffaa00)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Great Job!
            </h3>
            <p className="text-gray-300 font-semibold relative z-10">
              You've completed the Mystery Bag Talk activity!<br />
              You are now a confident Mystery Speaker!
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
