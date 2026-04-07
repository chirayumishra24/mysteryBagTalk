import { motion } from "framer-motion";

export default function SpeechBubble({ text, characterImage, characterName = "Oliver", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      className="flex items-end gap-4 mb-6"
    >
      {characterImage && (
        <motion.div
          className="relative flex-shrink-0"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 rounded-full blur-md opacity-30" style={{ background: "var(--accent-gold)" }} />
          <img
            src={characterImage}
            alt={characterName}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover relative z-10"
            style={{
              border: "3px solid rgba(255, 215, 0, 0.4)",
              boxShadow: "0 4px 20px rgba(255, 215, 0, 0.2)",
            }}
          />
        </motion.div>
      )}
      <div
        className="relative flex-1 rounded-2xl p-5 md:p-6"
        style={{
          background: "linear-gradient(135deg, #faf3e0 0%, #f5e6c8 100%)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15), 4px 4px 0px rgba(124, 58, 237, 0.1)",
          border: "2px solid rgba(124, 58, 237, 0.15)",
        }}
      >
        {/* Tail */}
        <div
          className="absolute -bottom-3 left-10 w-0 h-0"
          style={{
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderTop: "12px solid #f5e6c8",
          }}
        />
        <p className="text-base md:text-lg leading-relaxed font-semibold italic" style={{ color: "#1e293b" }}>
          {text}
        </p>
      </div>
    </motion.div>
  );
}
