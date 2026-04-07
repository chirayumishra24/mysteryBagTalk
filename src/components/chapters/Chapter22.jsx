import { useState } from "react";
import { motion } from "framer-motion";
import SpeechBubble from "../interactive/SpeechBubble";

export default function Chapter22({ chapter }) {
  const [filledStars, setFilledStars] = useState(0);

  const handleStarClick = () => {
    setFilledStars((p) => (p >= 5 ? 0 : p + 1));
  };

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
            alt="Discussion Time"
            className="w-72 md:w-96 rounded-3xl shadow-2xl relative z-10"
            style={{
              border: "3px solid rgba(255, 215, 0, 0.25)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
            }}
          />
        </div>
      </motion.div>

      {/* Speech */}
      <SpeechBubble
        text={chapter.intro}
        characterImage="/images/characters/oliver-mascot.png"
        delay={0.3}
      />

      {/* Cork Board */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative p-6 md:p-8 rounded-2xl"
        style={{
          background: "linear-gradient(135deg, #8B6914 0%, #A0522D 50%, #8B6914 100%)",
          border: "8px solid #654321",
          boxShadow: "inset 0 0 30px rgba(0,0,0,0.3), 0 8px 40px rgba(0,0,0,0.3)",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {chapter.questions.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: (i - 1) * 2.5 }}
              transition={{ delay: 0.7 + i * 0.15, type: "spring" }}
              whileHover={{ rotate: 0, scale: 1.08, y: -6 }}
              className="cursor-pointer"
              style={{
                background: ["#fff9c4", "#ffe0b2", "#c8e6c9"][i % 3],
                color: "#1e293b",
                padding: "24px 18px",
                borderRadius: "4px",
                boxShadow: "4px 4px 12px rgba(0,0,0,0.3)",
                transform: `rotate(${(i - 1) * 2.5}deg)`,
              }}
            >
              <div className="w-4 h-4 rounded-full mx-auto mb-3 shadow"
                style={{ background: ["#f44336", "#2196f3", "#4caf50"][i % 3] }}
              />
              <p className="font-bold text-sm text-center">{q}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Speaker Qualities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <p className="font-bold mb-4 text-lg" style={{ color: "rgba(167, 139, 250, 0.9)" }}>
          ✨ {chapter.encourageNotice} ✨
        </p>
        <div className="flex flex-wrap gap-3">
          {chapter.speakerQualities.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.1, type: "spring" }}
              whileHover={{ scale: 1.08, y: -3 }}
              className="rounded-2xl px-6 py-3 cursor-pointer"
              style={{
                background: "rgba(13, 10, 30, 0.75)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "2px solid rgba(255, 215, 0, 0.2)",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.25)",
              }}
            >
              <p className="font-bold text-sm" style={{ color: "var(--accent-gold)" }}>★ {q}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Brownie Points Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: "rgba(13, 10, 30, 0.8)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "2px solid rgba(255, 215, 0, 0.2)",
          boxShadow: "0 8px 40px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-10" style={{ background: "var(--accent-gold)" }} />

        <div className="p-6 md:p-8 relative z-10">
          <h3
            className="text-xl md:text-2xl font-bold text-center mb-6"
            style={{
              background: "linear-gradient(135deg, #ffd700, #ffaa00)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Bonus Brownie Points
          </h3>

          <div className="space-y-3 mb-8">
            {chapter.browniePoints.map((bp, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 4 }}
                className="flex items-center justify-between px-5 py-4 rounded-xl"
                style={{
                  background: "rgba(13, 10, 30, 0.7)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <span className="font-semibold text-gray-200">{bp.action}</span>
                <span
                  className="font-bold px-3 py-1 rounded-full text-sm"
                  style={{
                    background: "rgba(255, 215, 0, 0.15)",
                    color: "var(--accent-gold)",
                    border: "1px solid rgba(255, 215, 0, 0.2)",
                  }}
                >
                  +{bp.points} point
                </span>
              </motion.div>
            ))}
          </div>

          {/* Interactive Star Jar */}
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-4 font-semibold">
              ✨ Tap to collect stars! ✨
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex gap-3 cursor-pointer p-5 rounded-2xl"
              onClick={handleStarClick}
              style={{
                background: "rgba(13, 10, 30, 0.75)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "2px solid rgba(255, 215, 0, 0.2)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              }}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <motion.div
                  key={n}
                  animate={filledStars >= n ? { scale: [1, 1.4, 1], rotate: [0, 15, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="score-star"
                  style={{
                    width: 44,
                    height: 44,
                    background: filledStars >= n
                      ? "linear-gradient(135deg, #ffd700, #ff8c00)"
                      : "rgba(255, 215, 0, 0.15)",
                    filter: filledStars >= n ? "drop-shadow(0 2px 6px rgba(255, 215, 0, 0.5))" : "none",
                  }}
                />
              ))}
            </motion.div>

            <motion.p
              className="mt-4 font-bold text-lg"
              style={{
                color: filledStars >= 5 ? "var(--accent-gold)" : "var(--text-muted)",
              }}
              animate={filledStars >= 5 ? { scale: [1, 1.05, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              {filledStars >= 5
                ? "🎉 Star Speaker Badge Earned!"
                : `${filledStars} / 5 points`}
            </motion.p>
          </div>

          {/* Badge reveal */}
          {filledStars >= 5 && chapter.badgeImage && (
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
              className="flex justify-center mt-6"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-xl opacity-30" style={{ background: "var(--accent-gold)" }} />
                <img
                  src={chapter.badgeImage}
                  alt="Star Speaker Badge"
                  className="w-36 h-36 object-contain relative z-10"
                />
              </div>
            </motion.div>
          )}

          <p className="text-center font-bold mt-5 text-sm" style={{ color: "var(--accent-gold)" }}>
            {chapter.rewardText}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
