import { useState, useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import SentenceBuilder from "../ui/SentenceBuilder";
import SpeechReportCard from "../ui/SpeechReportCard";
import { gameContent } from "../../data/gameContent";
import useGameStore from "../../store/useGameStore";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";
import useAudioRecorder from "../../hooks/useAudioRecorder";
import { playClick, playChime } from "../../hooks/useAudio";
import Avatar3D from "../3d/Avatar3D";

export default function SpeakingScreen() {
  const { setStep, sentences, selectedAvatar, addScore } = useGameStore();
  const { transcript, isListening, isSupported, startListening, stopListening, resetTranscript } =
    useSpeechRecognition();
  const {
    isRecording, volumeLevel, audioUrl, metrics,
    startRecording, stopRecording, resetRecording,
  } = useAudioRecorder();
  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState("fill"); // "fill" | "record" | "report"
  const timerRef = useRef(null);

  // Count up timer
  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const isComplete =
    sentences.name.trim() !== "" &&
    sentences.colour.trim() !== "" &&
    sentences.use.trim() !== "";

  // Start recording + speech recognition together
  const handleStartRecording = async () => {
    playClick();
    resetTranscript();
    resetRecording();
    setPhase("record");

    // Start speech recognition first (it has its own mic access)
    if (isSupported) {
      try {
        startListening();
      } catch (e) {
        console.warn("Speech recognition failed to start:", e);
      }
    }

    // Small delay so speech recognition grabs mic first, then recorder layers on
    setTimeout(async () => {
      try {
        await startRecording();
      } catch (e) {
        console.warn("Audio recording failed to start:", e);
      }
    }, 300);
  };

  // Stop recording + speech recognition together
  const handleStopRecording = () => {
    playClick();
    // Always try to stop both — don't rely on stale isListening/isRecording
    try { stopRecording(); } catch (e) {}
    try { stopListening(); } catch (e) {}
    // Short delay to let recorder.onstop fire and compute metrics
    setTimeout(() => setPhase("report"), 400);
  };

  // Retry recording
  const handleRetry = () => {
    resetTranscript();
    resetRecording();
    setPhase("fill");
  };

  // Continue to guessing with awarded stars
  const handleContinue = (stars) => {
    clearInterval(timerRef.current);
    playChime();
    addScore(stars);
    if (elapsed <= 15) addScore(2); // Speed bonus
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
            {phase === "fill"
              ? "Fill in the blanks, then record yourself speaking!"
              : phase === "record"
              ? "Speak clearly into the microphone..."
              : "Here's your Speech Report Card!"}
          </p>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {/* PHASE 1: Fill in the blanks */}
        {phase === "fill" && (
          <motion.div
            key="fill"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full flex flex-col items-center"
          >
            <div className="w-full max-w-2xl mb-8 relative">
              <div className="absolute inset-0 bg-purple-600/10 blur-3xl rounded-full" />
              <div className="relative z-10">
                <SentenceBuilder sentences={gameContent.sentenceStarters} />
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 mt-auto">
              {/* Timer Badge */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-display font-semibold ${
                elapsed <= 15
                  ? "bg-green-500/20 text-green-300 border border-green-500/30"
                  : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
              }`}>
                <span>⏱️</span>
                <span>{elapsed}s</span>
                {elapsed <= 15 && isComplete && (
                  <span className="text-green-400 animate-pulse ml-1">⚡ Speed Bonus!</span>
                )}
              </div>

              <Button
                size="lg"
                onClick={handleStartRecording}
                disabled={!isComplete}
                icon="🎙️"
                className={isComplete ? "animate-pulse-glow" : ""}
              >
                Record My Speech
              </Button>
              {!isComplete && (
                <span className="text-sm text-purple-400/60 font-body italic">
                  Fill in all blanks to unlock recording
                </span>
              )}
            </div>
          </motion.div>
        )}

        {/* PHASE 2: Recording (live volume meter) */}
        {phase === "record" && (
          <motion.div
            key="record"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-lg flex flex-col items-center"
          >
            {/* Your sentences to say */}
            <div className="glass p-5 rounded-2xl border border-purple-500/20 w-full mb-8">
              <div className="text-xs font-display font-bold text-purple-400 uppercase tracking-wider mb-3">
                Say This Out Loud
              </div>
              <div className="space-y-2">
                <p className="text-purple-100 font-body text-lg">
                  "This is a <span className="text-pink-300 font-semibold">{sentences.name}</span>."
                </p>
                <p className="text-purple-100 font-body text-lg">
                  "It is <span className="text-pink-300 font-semibold">{sentences.colour}</span> in colour."
                </p>
                <p className="text-purple-100 font-body text-lg">
                  "We use it to <span className="text-pink-300 font-semibold">{sentences.use}</span>."
                </p>
              </div>
            </div>

            {/* Volume Visualizer */}
            <div className="w-full mb-6">
              <div className="flex items-center justify-between mb-2 text-xs text-purple-300/60 font-body">
                <span>Volume</span>
                <span>{volumeLevel}%</span>
              </div>
              <div className="w-full h-6 bg-purple-900/40 rounded-full overflow-hidden border border-purple-500/20 relative">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max(3, volumeLevel)}%`,
                    background: volumeLevel > 40
                      ? "linear-gradient(90deg, #22c55e, #4ade80)"
                      : volumeLevel > 15
                      ? "linear-gradient(90deg, #eab308, #facc15)"
                      : "linear-gradient(90deg, #ef4444, #f87171)",
                  }}
                  animate={{ width: `${Math.max(3, volumeLevel)}%` }}
                  transition={{ duration: 0.1 }}
                />
                {/* Pulsing glow */}
                {volumeLevel > 20 && (
                  <div
                    className="absolute inset-0 rounded-full animate-pulse"
                    style={{
                      background: `radial-gradient(circle at ${volumeLevel}% 50%, rgba(34,197,94,0.3), transparent 60%)`,
                    }}
                  />
                )}
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-purple-400/40 font-body">
                <span>Too Quiet</span>
                <span>Perfect!</span>
                <span>Too Loud</span>
              </div>
            </div>

            {/* Live Waveform Dots */}
            <div className="flex gap-1 mb-6 h-12 items-end">
              {Array.from({ length: 20 }).map((_, i) => {
                const height = Math.max(4, Math.random() * volumeLevel * 0.8);
                return (
                  <motion.div
                    key={i}
                    className="w-2 rounded-full"
                    animate={{
                      height: isRecording ? height : 4,
                      backgroundColor: volumeLevel > 30
                        ? "#4ade80"
                        : volumeLevel > 10
                        ? "#facc15"
                        : "#a78bfa",
                    }}
                    transition={{ duration: 0.15 }}
                  />
                );
              })}
            </div>

            {/* Live Transcript */}
            {transcript && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full bg-purple-900/30 rounded-xl p-4 border border-purple-500/10 mb-6"
              >
                <p className="text-purple-100 font-body text-sm italic">"{transcript}"</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-purple-300/60">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  Listening...
                </div>
              </motion.div>
            )}

            {/* Stop Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStopRecording}
              className="w-24 h-24 rounded-full bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.5)] flex items-center justify-center text-4xl animate-pulse cursor-pointer border-4 border-red-300/30"
            >
              ⏹️
            </motion.button>
            <p className="text-purple-300/60 text-sm font-body mt-3">
              Tap to stop recording
            </p>
          </motion.div>
        )}

        {/* PHASE 3: Report Card */}
        {phase === "report" && (
          <motion.div
            key="report"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <SpeechReportCard
              transcript={transcript}
              audioUrl={audioUrl}
              metrics={metrics}
              sentences={sentences}
              onContinue={handleContinue}
              onRetry={handleRetry}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
