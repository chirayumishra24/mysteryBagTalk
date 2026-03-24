import { useState, useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import SentenceBuilder from "../ui/SentenceBuilder";
import { gameContent } from "../../data/gameContent";
import useGameStore from "../../store/useGameStore";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";
import { playClick } from "../../hooks/useAudio";
import Avatar3D from "../3d/Avatar3D";

export default function SpeakingScreen() {
  const { setStep, sentences, selectedAvatar, addScore } = useGameStore();
  const { transcript, isListening, isSupported, startListening, stopListening } =
    useSpeechRecognition();
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  // Start a timer when the screen mounts
  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const isComplete =
    sentences.name.trim() !== "" &&
    sentences.colour.trim() !== "" &&
    sentences.use.trim() !== "";

  const handleProceed = () => {
    clearInterval(timerRef.current);
    playClick();
    // Bonus points if completed under 15 seconds
    if (elapsed <= 15) {
      addScore(2); // +2 bonus points for speed
    }
    setStep("guessing");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto z-20 relative px-4 py-8 flex flex-col items-center min-h-[80vh]"
    >
      <div className="text-center mb-8 w-full">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Avatar badge */}
          {selectedAvatar && (
            <span className="inline-flex items-center justify-center gap-3 py-1.5 pr-5 pl-2 rounded-full glass bg-purple-900/40 text-purple-300 font-display text-xs font-bold tracking-widest uppercase mb-4 border border-purple-500/30">
              <div className="w-8 h-8 rounded-full bg-black/20 overflow-hidden relative shadow-inner">
                 <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[2, 5, 2]} intensity={1} />
                    <Suspense fallback={null}>
                      <Avatar3D name={selectedAvatar.name} isSelected={false} />
                    </Suspense>
                 </Canvas>
              </div>
              Mystery Speaker Turn
            </span>
          )}
          {!selectedAvatar && (
            <span className="inline-block py-1 px-4 rounded-full glass bg-purple-900/40 text-purple-300 font-display text-xs font-bold tracking-widest uppercase mb-4 border border-purple-500/30">
              Mystery Speaker Turn
            </span>
          )}
          <h2 className="text-4xl md:text-5xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-4">
            Describe Your Object
          </h2>
          <p className="text-lg text-purple-200/80 font-body max-w-2xl mx-auto">
            Use these sentence starters clearly so others can guess what you have.
          </p>
        </motion.div>
      </div>

      <div className="w-full max-w-2xl mb-8 relative">
        <div className="absolute inset-0 bg-purple-600/10 blur-3xl rounded-full" />
        <div className="relative z-10">
          <SentenceBuilder sentences={gameContent.sentenceStarters} />
        </div>
      </div>

      {/* Voice Recognition Panel */}
      {isSupported && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full max-w-2xl mb-8"
        >
          <div className="glass p-6 rounded-2xl border border-purple-500/20 text-center">
            <h3 className="text-sm font-display font-bold text-purple-300 uppercase tracking-wider mb-4 flex items-center justify-center gap-2">
              🎤 Voice Practice Mode
            </h3>
            <p className="text-purple-200/60 text-sm font-body mb-4">
              Press the microphone button and say your description out loud!
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playClick();
                isListening ? stopListening() : startListening();
              }}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 transition-all duration-300 cursor-pointer ${
                isListening
                  ? "bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.6)] animate-pulse"
                  : "bg-purple-600 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:bg-purple-500"
              }`}
            >
              {isListening ? "⏹️" : "🎙️"}
            </motion.button>

            {/* Live Transcript */}
            {transcript && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-purple-900/40 rounded-xl p-4 border border-purple-500/20 mt-2"
              >
                <p className="text-purple-100 font-body text-lg italic">
                  "{transcript}"
                </p>
                <div className="flex items-center justify-center gap-2 mt-2 text-xs text-purple-300/60">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  {isListening ? "Listening..." : "Tap mic to try again"}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-auto"
      >
        <div className="flex flex-col items-center gap-4">
          {/* Timer Badge */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-display font-semibold ${
            elapsed <= 15 ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
          }`}>
            <span>⏱️</span>
            <span>{elapsed}s</span>
            {elapsed <= 15 && isComplete && (
              <span className="text-green-400 animate-pulse ml-1">⚡ Speed Bonus!</span>
            )}
          </div>

          <Button
            size="lg"
            onClick={handleProceed}
            disabled={!isComplete}
            icon="⏱️"
            className={isComplete ? "animate-pulse-glow" : ""}
          >
            Start Guessing Timer
          </Button>
          {!isComplete && (
            <span className="text-sm text-purple-400/60 font-body italic">
              Fill in all blanks to continue
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
