import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import useGameStore from "../../store/useGameStore";

/**
 * Timer - circular countdown timer with urgency animation.
 */
export default function Timer({ initialSeconds = 30, onComplete }) {
  const { timerSeconds, timerActive, setTimerActive, decrementTimer } =
    useGameStore();
  const intervalRef = useRef(null);

  useEffect(() => {
    if (timerActive && timerSeconds > 0) {
      intervalRef.current = setInterval(() => {
        decrementTimer();
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
      onComplete?.();
    }

    return () => clearInterval(intervalRef.current);
  }, [timerActive, timerSeconds]);

  const progress = timerSeconds / initialSeconds;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference * (1 - progress);
  const isUrgent = timerSeconds <= 10;

  return (
    <motion.div
      className="relative inline-flex items-center justify-center"
      animate={isUrgent ? { scale: [1, 1.05, 1] } : {}}
      transition={isUrgent ? { duration: 0.5, repeat: Infinity } : {}}
    >
      <svg width="140" height="140" className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="70"
          cy="70"
          r="54"
          fill="none"
          stroke="rgba(139, 92, 246, 0.15)"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <motion.circle
          cx="70"
          cy="70"
          r="54"
          fill="none"
          stroke={
            isUrgent
              ? "url(#urgentGradient)"
              : "url(#timerGradient)"
          }
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transition={{ duration: 0.3 }}
        />
        <defs>
          <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="urgentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`text-3xl font-display font-bold ${isUrgent ? "text-red-400" : "text-white"}`}
        >
          {timerSeconds}
        </span>
        <span className="text-xs text-purple-400/70 uppercase tracking-wider">
          seconds
        </span>
      </div>

      {/* Outer glow ring */}
      {isUrgent && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ boxShadow: ["0 0 20px rgba(239,68,68,0.3)", "0 0 40px rgba(239,68,68,0.5)", "0 0 20px rgba(239,68,68,0.3)"] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
