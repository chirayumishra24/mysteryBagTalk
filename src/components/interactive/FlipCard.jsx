import { useState } from "react";
import { motion } from "framer-motion";

export default function FlipCard({ front, back, index = 0 }) {
  const [flipped, setFlipped] = useState(false);

  const gradients = [
    "linear-gradient(135deg, #7c3aed 0%, #4c1d95 50%, #6d28d9 100%)",
    "linear-gradient(135deg, #e74c3c 0%, #c0392b 50%, #e74c3c 100%)",
    "linear-gradient(135deg, #0d9488 0%, #115e59 50%, #0d9488 100%)",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: 15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: index * 0.2, duration: 0.6, type: "spring" }}
      className={`flip-card w-full min-h-[160px] ${flipped ? "flipped" : ""}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="flip-card-inner">
        <div
          className="flip-card-front"
          style={{
            background: gradients[index % gradients.length],
            border: "2px solid rgba(255, 215, 0, 0.25)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="text-center">
            <motion.img
              src="/images/ui/mystery-bag.png"
              alt="Mystery"
              className="w-14 h-14 mx-auto mb-3 object-contain"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <p className="text-sm font-bold" style={{ color: "var(--accent-gold)" }}>
              ✨ Tap to reveal! ✨
            </p>
          </div>
        </div>
        <div
          className="flip-card-back"
          style={{
            background: "linear-gradient(135deg, #faf3e0 0%, #f5e6c8 100%)",
            border: "2px solid rgba(124, 58, 237, 0.3)",
            boxShadow: "4px 4px 0px rgba(124, 58, 237, 0.15), 0 8px 32px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="text-center px-4">
            <p className="text-sm md:text-base font-bold leading-relaxed" style={{ color: "#1e293b" }}>
              {back}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
