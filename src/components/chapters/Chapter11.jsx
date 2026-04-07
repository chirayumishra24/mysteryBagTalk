import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SpeechBubble from "../interactive/SpeechBubble";
import FlipCard from "../interactive/FlipCard";

export default function Chapter11({ chapter }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-10 pt-8"
    >
      {/* Chapter Title with decorative accent */}
      <div className="text-center relative">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full max-w-xl h-14 rounded-full blur-2xl opacity-10"
          style={{ background: "var(--accent-gold)" }}
        />
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl lg:text-4xl relative z-10"
          style={{
            background: "linear-gradient(135deg, #ffd700, #ffaa00)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {chapter.title}
        </motion.h2>
      </div>

      {/* Hero Scene - Oliver at the shop */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
        className="relative flex justify-center"
      >
        <div className="relative group">
          {/* Glow behind image */}
          <div
            className="absolute inset-0 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"
            style={{ background: "linear-gradient(135deg, var(--accent-gold), var(--accent-purple))" }}
          />
          <img
            src={chapter.heroImage}
            alt="Welcome to the Activity"
            className="w-72 md:w-96 rounded-3xl shadow-2xl relative z-10"
            style={{
              border: "3px solid rgba(255, 215, 0, 0.25)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 215, 0, 0.1)",
            }}
          />
        </div>
      </motion.div>

      {/* Intro Speech Bubble */}
      <SpeechBubble
        text={chapter.intro}
        characterImage="/images/characters/oliver-mascot.png"
        delay={0.4}
      />

      {/* Content Images from course in premium frames */}
      {chapter.contentImages && chapter.contentImages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {chapter.contentImages.map((img, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02, y: -4 }}
              className="relative group rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(124, 58, 237, 0.1))",
                border: "2px solid rgba(255, 215, 0, 0.15)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div className="p-3">
                <img
                  src={img}
                  alt={`Activity image ${i + 1}`}
                  className="w-full rounded-xl object-cover"
                  style={{ maxHeight: "300px" }}
                />
              </div>
              {/* Shimmer overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ transform: "skewX(-20deg)" }}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Interactive Question Cards */}
      <div>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-xl font-bold mb-5 text-center"
          style={{ color: "rgba(167, 139, 250, 0.9)" }}
        >
          ✨ Tap to Discover Questions ✨
        </motion.h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {chapter.questions.map((q, i) => (
            <FlipCard key={i} index={i} front="?" back={q} />
          ))}
        </div>
      </div>

      {/* Explain Section - premium card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%)",
          border: "2px solid rgba(255, 215, 0, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10" style={{ background: "var(--accent-gold)" }} />

        <div className="p-6 md:p-8 relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <img src="/images/characters/oliver-mascot.png" alt="" className="w-10 h-10 rounded-full object-cover" />
            <p className="text-sm font-bold" style={{ color: "var(--accent-gold)" }}>Oliver says:</p>
          </div>
          <p className="text-lg md:text-xl text-gray-200 italic font-semibold leading-relaxed">
            {chapter.explain}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
