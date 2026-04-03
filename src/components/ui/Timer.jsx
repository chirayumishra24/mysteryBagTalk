import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import useGameStore from "../../store/useGameStore";

export default function Timer({ initialSeconds = 30, onComplete }) {
  const { timerSeconds, timerActive, setTimerActive, decrementTimer } = useGameStore();
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
  }, [decrementTimer, onComplete, setTimerActive, timerActive, timerSeconds]);

  const progress = timerSeconds / initialSeconds;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference * (1 - progress);
  const isUrgent = timerSeconds <= 10;

  return (
    <motion.div
      className="relative inline-flex items-center justify-center"
      animate={isUrgent ? { scale: [1, 1.04, 1] } : {}}
      transition={isUrgent ? { duration: 0.6, repeat: Infinity } : {}}
    >
      <svg width="140" height="140" className="transform -rotate-90">
        <circle
          cx="70"
          cy="70"
          r="54"
          fill="none"
          stroke="rgba(255, 216, 194, 0.8)"
          strokeWidth="10"
        />
        <motion.circle
          cx="70"
          cy="70"
          r="54"
          fill="none"
          stroke={isUrgent ? "url(#urgentGradient)" : "url(#timerGradient)"}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transition={{ duration: 0.3 }}
        />
        <defs>
          <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="55%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
          <linearGradient id="urgentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-display font-black ${isUrgent ? "text-red-500" : "text-[#7d4522]"}`}>
          {timerSeconds}
        </span>
        <span className="text-[11px] uppercase tracking-[0.24em] text-[#9b7a64]">seconds</span>
      </div>

      {isUrgent && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              "0 0 0 rgba(239,68,68,0.18)",
              "0 0 36px rgba(239,68,68,0.28)",
              "0 0 0 rgba(239,68,68,0.18)",
            ],
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
