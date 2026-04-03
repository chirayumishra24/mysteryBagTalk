import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import SentenceBuilder from "../ui/SentenceBuilder";
import SpeechReportCard from "../ui/SpeechReportCard";
import MysteryToken from "../ui/MysteryToken";
import { gameContent } from "../../data/gameContent";
import useGameStore from "../../store/useGameStore";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";
import useAudioRecorder from "../../hooks/useAudioRecorder";
import { playClick, playChime } from "../../hooks/useAudio";
import { analyzeVoice } from "../../services/api";

export default function SpeakingScreen() {
  const {
    setStep,
    sentences,
    selectedAvatar,
    addScore,
    selectedObject,
    activityMode,
    updateSentence,
    setAiReview,
    setIsAnalyzing,
    aiReview,
    isAnalyzing,
  } = useGameStore();
  const { transcript, isSupported, startListening, stopListening, resetTranscript } = useSpeechRecognition();
  const {
    isRecording,
    volumeLevel,
    audioUrl,
    audioBlob,
    metrics,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState("fill");
  const [celebrationText, setCelebrationText] = useState("");
  const [burstSeed, setBurstSeed] = useState(0);
  const [micError, setMicError] = useState("");
  const [manualTranscript, setManualTranscript] = useState("");
  const timerRef = useRef(null);
  const celebrationTimeoutRef = useRef(null);
  const milestoneRef = useRef(new Set());
  const isGroupMode = activityMode === "group";

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed((seconds) => seconds + 1), 1000);
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(celebrationTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isRecording) {
      milestoneRef.current.clear();
      return;
    }

    const milestones = [
      { threshold: 25, text: "Nice voice! 🐠", colors: ["#38bdf8", "#fbbf24"] },
      { threshold: 55, text: "Great clue! 🐙", colors: ["#f472b6", "#fbbf24"] },
      { threshold: 80, text: "Super Diver! 🌟", colors: ["#2dd4bf", "#f472b6", "#38bdf8"] },
    ];

    milestones.forEach((item) => {
      if (volumeLevel >= item.threshold && !milestoneRef.current.has(item.threshold)) {
        milestoneRef.current.add(item.threshold);
        triggerCelebration(item.text, item.colors);
      }
    });
  }, [isRecording, volumeLevel]);

  const isComplete =
    sentences.name.trim() !== "" &&
    sentences.colour.trim() !== "" &&
    sentences.use.trim() !== "";

  const promptGroups = useMemo(() => {
    return [
      {
        key: "name",
        title: "This is...",
        tone: "cyan",
        chips: ["pencil", "ball", "key", "book", "toy"],
      },
      {
        key: "colour",
        title: "It is...",
        tone: "gold",
        chips: ["red", "blue", "yellow", "green", "brown"],
      },
      {
        key: "use",
        title: "We use it to...",
        tone: "teal",
        chips: ["write", "draw", "play", "open", "learn"],
      },
    ];
  }, []);

  const activeTranscript = manualTranscript || transcript;

  const buildManualTranscript = () =>
    `This is a ${sentences.name}. It is ${sentences.colour} in colour. We use it to ${sentences.use}.`;

  const triggerCelebration = (text, colors) => {
    setCelebrationText(text);
    setBurstSeed((value) => value + 1);
    clearTimeout(celebrationTimeoutRef.current);
    celebrationTimeoutRef.current = setTimeout(() => setCelebrationText(""), 1400);

    confetti({
      particleCount: 40,
      spread: 70,
      startVelocity: 28,
      origin: { x: 0.5, y: 0.6 },
      colors,
      scalar: 0.8,
    });
  };

  const handleStartRecording = async () => {
    playClick();
    resetTranscript();
    resetRecording();
    setAiReview(null);
    setMicError("");
    setManualTranscript("");
    setPhase("record");
    setCelebrationText("");
    milestoneRef.current.clear();

    if (isSupported) {
      try {
        startListening();
      } catch (error) {
        console.warn("Speech recognition failed to start:", error);
      }
    }

    setTimeout(async () => {
      try {
        await startRecording();
      } catch (error) {
        console.warn("Audio recording failed to start:", error);
        try {
          stopListening();
        } catch (stopError) {}
        setPhase("fill");
        setMicError("Microphone access is blocked. You can allow the mic and try again, or continue without it!");
      }
    }, 300);
  };

  const handleStopRecording = () => {
    playClick();
    try {
      stopRecording();
    } catch (error) {}
    try {
      stopListening();
    } catch (error) {}

    triggerCelebration("Dive recorded! 🐙", ["#38bdf8", "#f472b6", "#fbbf24", "#2dd4bf"]);
    setTimeout(() => setPhase("report"), 450);

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
      } catch (error) {
        console.error("AI analysis failed:", error);
        setAiReview(null);
      } finally {
        setIsAnalyzing(false);
      }
    }, 650);
  };

  const handleRetry = () => {
    resetTranscript();
    resetRecording();
    setAiReview(null);
    setCelebrationText("");
    setMicError("");
    setManualTranscript("");
    setElapsed(0);
    setPhase("fill");
  };

  const handleContinueWithoutMic = () => {
    setManualTranscript(buildManualTranscript());
    setAiReview(null);
    setIsAnalyzing(false);
    setPhase("report");
  };

  const handleContinue = (stars) => {
    clearInterval(timerRef.current);
    playChime();
    addScore(stars);
    if (elapsed <= 15) addScore(2);
    setStep("guessing");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-24 md:px-6"
    >
      <div className="absolute right-4 top-28 z-20 hidden md:block">
        <MysteryToken
          emoji="🔮"
          title="Secret treasure"
          subtitle="Keep it hidden!"
          size="sm"
          tone="mint"
        />
      </div>

      <div className="mb-8 text-center">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="sea-tag-coral px-4 py-2 flex items-center gap-2">
            🎤 Speaking Booth
          </span>
          <span className="sea-tag-gold px-4 py-2">
            {selectedObject ? "🔒 Treasure locked" : "Use the clue pattern"}
          </span>
          {isGroupMode ? (
            <span className="sea-tag-mint px-4 py-2">
              👥 Crew turn
            </span>
          ) : selectedAvatar ? (
            <span className="sea-tag-mint px-4 py-2">
              {selectedAvatar.emoji} Your dive
            </span>
          ) : null}
        </div>
        <h2 className="mt-4 text-4xl font-black uppercase tracking-tight text-cyan-50 bio-glow md:text-5xl">
          {isGroupMode ? "Describe it! 🐙" : "Describe it! 🐙"}
        </h2>
      </div>

      <AnimatePresence mode="wait">
        {phase === "fill" && (
          <motion.div
            key="fill"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]"
          >
            <div className="space-y-5 sea-glass p-6">
              <div className="rounded-[1.8rem] border border-cyan-500/15 bg-gradient-to-b from-cyan-950/40 to-blue-950/30 p-5">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-400">🐙 How to sound great</p>
                <div className="mt-4 grid gap-3">
                  {[
                    "Say what the treasure is.",
                    "Add one clue about colour or shape.",
                    "Tell the crew what it's used for!",
                  ].map((tip) => (
                    <div key={tip} className="rounded-[1.2rem] border border-cyan-500/10 bg-cyan-500/5 px-4 py-3 text-sm font-semibold text-cyan-200">
                      {tip}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {promptGroups.map((group) => (
                  <PromptChipGroup
                    key={group.key}
                    group={group}
                    onSelect={(value) => updateSentence(group.key, value)}
                  />
                ))}
              </div>

              <div className="rounded-[1.6rem] border border-teal-500/20 bg-teal-500/5 p-5">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-teal-400">🐠 Quick check</p>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-teal-200/80">
                  {isGroupMode
                    ? "Crews can tap the chips together, then choose one strong final clue before the diver records it."
                    : "Divers can tap the chips first, then change the words in the sentence boxes for a better clue."}
                </p>
              </div>

              {micError && (
                <div className="rounded-[1.6rem] border border-pink-500/20 bg-pink-500/5 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-pink-400">⚠️ Microphone fallback</p>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-pink-200/80">
                    {micError}
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      className="rounded-full border border-pink-500/20 bg-pink-500/10 px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-pink-300"
                    >
                      Try mic again
                    </button>
                    <button
                      type="button"
                      onClick={handleContinueWithoutMic}
                      className="coral-btn px-5 py-3 text-sm"
                    >
                      Continue without mic
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-5 sea-glass p-6">
              <SentenceBuilder sentences={gameContent.sentenceStarters} />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className={`inline-flex items-center gap-3 rounded-full border px-5 py-3 text-sm font-black uppercase tracking-[0.22em] ${
                  elapsed <= 15
                    ? "border-teal-500/20 bg-teal-500/10 text-teal-300"
                    : "border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
                }`}>
                  <span>⏱️</span>
                  <span>{elapsed}s</span>
                  {elapsed <= 15 && isComplete && <span>⚡ Speed bonus</span>}
                </div>

                <button
                  type="button"
                  onClick={handleStartRecording}
                  disabled={!isComplete}
                  className={`inline-flex items-center justify-center gap-3 rounded-full border px-7 py-4 text-base font-black uppercase tracking-[0.2em] transition-all ${
                    isComplete
                      ? "coral-btn hover:-translate-y-0.5"
                      : "cursor-not-allowed border-cyan-500/10 bg-cyan-950/30 text-cyan-600 opacity-70"
                  }`}
                >
                  {isGroupMode ? "🎤 Start crew dive" : "🎤 Record now!"}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {phase === "record" && (
          <motion.div
            key="record"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]"
          >
            <div className="space-y-5 sea-glass p-6">
              <div className="rounded-[1.8rem] border border-cyan-500/15 bg-gradient-to-b from-cyan-950/40 to-blue-950/30 p-5">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-400">🗺️ Say this treasure clue</p>
                <div className="mt-4 space-y-3 text-left">
                  <PromptLine label="1" text={`This is a ${sentences.name}.`} />
                  <PromptLine label="2" text={`It is ${sentences.colour} in colour.`} />
                  <PromptLine label="3" text={`We use it to ${sentences.use}.`} />
                </div>
              </div>

              {/* Bubble Voice Meter */}
              <div className="rounded-[1.8rem] border border-cyan-500/15 bg-cyan-500/5 p-5">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.28em] text-cyan-400">
                  <span>🫧 Bubble meter</span>
                  <span>{volumeLevel}%</span>
                </div>
                <div className="mt-4 h-5 overflow-hidden rounded-full border border-cyan-500/20 bg-cyan-950/50">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-amber-400 shadow-[0_0_20px_rgba(103,232,249,0.3)]"
                    animate={{ width: `${Math.max(6, volumeLevel)}%` }}
                    transition={{ duration: 0.12 }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-400/60">
                  <span>🐟 Whisper</span>
                  <span>🐙 Great!</span>
                  <span>🐳 Whale call!</span>
                </div>
              </div>

              {!isSupported && (
                <div className="rounded-[1.5rem] border border-pink-500/20 bg-pink-500/5 p-4 text-sm font-semibold text-pink-200/80">
                  Speech recognition isn't available, but the recorder can still capture your treasure clue! 🐙
                </div>
              )}
            </div>

            {/* Recording Booth */}
            <div className="relative overflow-hidden sea-glass p-6">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.06),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(103,232,249,0.06),_transparent_30%)]" />

              <div className="relative flex min-h-[460px] flex-col items-center justify-center text-center">
                {/* Animated glow rings */}
                <motion.div
                  animate={{
                    scale: isRecording ? [1, 1.08, 1] : 1,
                    opacity: isRecording ? [0.1, 0.2, 0.1] : 0.08,
                  }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute h-72 w-72 rounded-full bg-cyan-400/10 blur-2xl"
                />
                <motion.div
                  animate={{
                    scale: isRecording ? [0.94, 1.12, 0.94] : 1,
                    opacity: isRecording ? [0.06, 0.15, 0.06] : 0.05,
                  }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  className="absolute h-96 w-96 rounded-full bg-teal-400/10 blur-3xl"
                />

                <AnimatePresence>
                  {celebrationText && (
                    <motion.div
                      key={celebrationText}
                      initial={{ opacity: 0, y: 12, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.96 }}
                      className="absolute top-8 rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-2 text-sm font-black uppercase tracking-[0.22em] text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.15)]"
                    >
                      {celebrationText}
                    </motion.div>
                  )}
                </AnimatePresence>

                <BubbleBurst seed={burstSeed} />

                <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-400">
                  🐙 Deep sea booth
                </p>
                <h3 className="mt-4 text-3xl font-black text-cyan-50 bio-glow md:text-4xl">
                  {isRecording ? "Keep talking! 🫧" : "Tap to dive in!"}
                </h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-cyan-200/70">
                  Speak bravely and let the bubble meter fill! The louder and clearer the treasure clue, the more bubbles celebrate!
                </p>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleStopRecording}
                  className="relative z-10 mt-8 flex h-36 w-36 items-center justify-center rounded-full border-2 border-pink-400/30 bg-gradient-to-br from-pink-500 to-red-500 text-lg font-black uppercase tracking-[0.22em] text-white shadow-[0_0_40px_rgba(244,114,182,0.2)]"
                >
                  Stop 🛑
                </motion.button>

                {/* Audio visualizer bars */}
                <div className="mt-8 flex h-14 items-end gap-2">
                  {Array.from({ length: 16 }).map((_, index) => {
                    const height = Math.max(12, ((volumeLevel + index * 5) % 100) * 0.62);
                    return (
                      <motion.div
                        key={index}
                        className="w-3 rounded-full"
                        animate={{
                          height: isRecording ? height : 14,
                          backgroundColor: isRecording ? "#2dd4bf" : "#164e63",
                        }}
                        transition={{ duration: 0.18 }}
                      />
                    );
                  })}
                </div>

                {transcript && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 w-full max-w-lg rounded-[1.6rem] border border-cyan-500/15 bg-cyan-950/40 p-4"
                  >
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-400">📝 Live transcript</p>
                    <p className="mt-2 text-sm italic leading-relaxed text-cyan-200/80">"{transcript}"</p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {phase === "report" && (
          <motion.div
            key="report"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <SpeechReportCard
              transcript={activeTranscript}
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

function PromptChipGroup({ group, onSelect }) {
  const tones = {
    cyan: "border-cyan-500/20 bg-cyan-500/8 text-cyan-200",
    gold: "border-amber-500/20 bg-amber-500/8 text-amber-200",
    teal: "border-teal-500/20 bg-teal-500/8 text-teal-200",
  };

  return (
    <div className={`rounded-[1.6rem] border p-4 ${tones[group.tone]}`}>
      <p className="text-xs font-black uppercase tracking-[0.24em] opacity-70">{group.title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {group.chips.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => onSelect(chip)}
            className="rounded-full border border-cyan-500/15 bg-cyan-950/40 px-4 py-2 text-sm font-black capitalize tracking-[0.04em] text-cyan-200 shadow-sm hover:bg-cyan-500/10 hover:border-cyan-400/30 transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}

function PromptLine({ label, text }) {
  return (
    <div className="flex items-start gap-4 rounded-[1.2rem] border border-cyan-500/10 bg-cyan-500/5 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-sm font-black text-amber-300 border border-amber-500/20">
        {label}
      </div>
      <p className="text-left text-lg font-black leading-relaxed text-cyan-100">{text}</p>
    </div>
  );
}

function BubbleBurst({ seed }) {
  const bubbles = [
    { left: "-64px", top: "-6px" },
    { left: "-46px", top: "-54px" },
    { left: "0px", top: "-82px" },
    { left: "48px", top: "-52px" },
    { left: "68px", top: "-4px" },
    { left: "40px", top: "54px" },
    { left: "-34px", top: "58px" },
  ];

  if (!seed) return null;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {bubbles.map((bubble, index) => (
        <motion.span
          key={`${seed}-${index}`}
          initial={{ opacity: 0, scale: 0.2, x: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.2, 1.1, 0.8], x: bubble.left, y: bubble.top }}
          transition={{ duration: 0.9, delay: index * 0.03, ease: "easeOut" }}
          className="absolute text-3xl"
        >
          🫧
        </motion.span>
      ))}
    </div>
  );
}
