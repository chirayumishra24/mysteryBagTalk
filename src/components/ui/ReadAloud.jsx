/**
 * ReadAloud - A small speaker button that uses browser Text-to-Speech.
 * Kids can tap it to hear any text read aloud.
 */
import { useState } from "react";
import { motion } from "framer-motion";

export default function ReadAloud({ text, className = "" }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = () => {
    if (!("speechSynthesis" in window)) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85; // Slightly slower for kids
    utterance.pitch = 1.1; // Slightly higher for friendliness
    utterance.lang = "en-US";

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  if (!("speechSynthesis" in window)) return null;

  return (
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={isSpeaking ? stop : speak}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 cursor-pointer ${
        isSpeaking
          ? "bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)] animate-pulse"
          : "bg-purple-600/40 hover:bg-purple-500/60 border border-purple-400/30"
      } ${className}`}
      title={isSpeaking ? "Stop reading" : "Read aloud"}
    >
      <span className="text-sm">{isSpeaking ? "⏹️" : "🔊"}</span>
    </motion.button>
  );
}
