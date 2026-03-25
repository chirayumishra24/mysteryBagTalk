import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import SentenceBuilder from "../ui/SentenceBuilder";
import SpeechReportCard from "../ui/SpeechReportCard";
import { gameContent } from "../../data/gameContent";
import useGameStore from "../../store/useGameStore";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";
import useAudioRecorder from "../../hooks/useAudioRecorder";
import { playClick, playChime } from "../../hooks/useAudio";
import { analyzeVoice } from "../../services/api";

export default function SpeakingScreen() {
  const { setStep, sentences, selectedAvatar, addScore, selectedObject, setAiReview, setIsAnalyzing, aiReview, isAnalyzing } = useGameStore();
  const { transcript, isListening, isSupported, startListening, stopListening, resetTranscript } =
    useSpeechRecognition();
  const {
    isRecording, volumeLevel, audioUrl, audioBlob, metrics,
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

  // Stop recording + speech recognition together, then trigger AI analysis
  const handleStopRecording = () => {
    playClick();
    try { stopRecording(); } catch (e) {}
    try { stopListening(); } catch (e) {}
    // Show report immediately, analysis happens in background
    setTimeout(() => setPhase("report"), 400);

    // Trigger Gemini analysis in background
    setTimeout(async () => {
      setIsAnalyzing(true);
      try {
        const review = await analyzeVoice({
          audioBlob,
          transcript,
          sentences,
          objectName: selectedObject?.name,
        });
        setAiReview(review);
      } catch (err) {
        console.error("AI analysis failed:", err);
        setAiReview(null);
      } finally {
        setIsAnalyzing(false);
      }
    }, 600);
  };

  // Retry recording
  const handleRetry = () => {
    resetTranscript();
    resetRecording();
    setAiReview(null);
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
      <div className="text-center mb-10 w-full relative z-30">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Avatar badge */}
          {selectedAvatar && (
            <span className="inline-flex items-center justify-center gap-3 py-2 pr-6 pl-2 rounded-full bg-white border-4 border-secondary text-secondary font-display text-sm font-black tracking-widest uppercase mb-6 shadow-lg transform -rotate-1">
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center border-2 border-secondary shadow-inner">
                <span className="text-2xl">{selectedAvatar.emoji}</span>
              </div>
              MYSTERY SPEAKER TURN
            </span>
          )}
          {!selectedAvatar && (
            <span className="inline-block py-2 px-6 rounded-full bg-white border-4 border-secondary text-secondary font-display text-sm font-black tracking-widest uppercase mb-6 shadow-lg transform -rotate-1">
              MYSTERY SPEAKER TURN
            </span>
          )}
          <h2 className="text-5xl md:text-7xl font-display font-black text-secondary text-outline-blue mb-4 uppercase tracking-tighter">
            Describe It!
          </h2>
          <p className="text-xl text-slate-600 font-display font-bold max-w-2xl mx-auto bg-white/50 px-4 py-2 rounded-full inline-block">
            {phase === "fill"
              ? "Fill in the blanks, then record your voice! 🎤"
              : phase === "record"
              ? "Speak clearly into the microphone... 📢"
              : "Check out your speech results! ✨"}
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
              <div className={`flex items-center gap-2 px-6 py-3 rounded-full text-lg font-display font-black shadow-md border-4 ${
                elapsed <= 15
                  ? "bg-accent text-white border-white"
                  : "bg-white text-secondary border-secondary"
              }`}>
                <span>⏱️</span>
                <span>{elapsed}S</span>
                {elapsed <= 15 && isComplete && (
                  <span className="text-white animate-bounce ml-2 text-xs bg-black/20 px-2 py-0.5 rounded-full">SPEED BONUS! ⚡</span>
                )}
              </div>

              <Button
                size="xl"
                variant={isComplete ? "primary" : "ghost"}
                onClick={handleStartRecording}
                disabled={!isComplete}
                icon="🎙️"
                className={isComplete ? "animate-bounce" : ""}
              >
                RECORD NOW!
              </Button>
              {!isComplete && (
                <span className="text-sm text-slate-500 font-display font-bold uppercase tracking-widest mt-2">
                  Finish the sentences first! 👇
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
            <div className="card-playful-yellow p-6 w-full mb-8 relative">
              <div className="absolute -top-4 -left-4 bg-primary text-secondary font-display font-black px-4 py-1 rounded-full border-4 border-white shadow-md uppercase text-xs">
                SAY THIS! 📣
              </div>
              <div className="space-y-4 pt-2">
                <p className="text-slate-800 font-display font-bold text-2xl">
                  "This is a <span className="text-secondary underline decoration-4 decoration-secondary/30">{sentences.name}</span>."
                </p>
                <p className="text-slate-800 font-display font-bold text-2xl">
                  "It is <span className="text-secondary underline decoration-4 decoration-secondary/30">{sentences.colour}</span> in colour."
                </p>
                <p className="text-slate-800 font-display font-bold text-2xl">
                  "We use it to <span className="text-secondary underline decoration-4 decoration-secondary/30">{sentences.use}</span>."
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
              aiReview={aiReview}
              isAnalyzing={isAnalyzing}
              onContinue={handleContinue}
              onRetry={handleRetry}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
