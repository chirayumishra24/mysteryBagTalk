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
      { threshold: 25, text: "Nice voice!", colors: ["#fb923c", "#facc15"] },
      { threshold: 55, text: "Great clue!", colors: ["#fb923c", "#fb7185"] },
      { threshold: 80, text: "Super Speaker!", colors: ["#14b8a6", "#fb7185", "#fb923c"] },
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
        tone: "orange",
        chips: ["pencil", "ball", "key", "book", "toy"],
      },
      {
        key: "colour",
        title: "It is...",
        tone: "yellow",
        chips: ["red", "blue", "yellow", "green", "brown"],
      },
      {
        key: "use",
        title: "We use it to...",
        tone: "mint",
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
        setMicError("Microphone access is blocked right now. You can allow the mic and try again, or continue with a no-mic version.");
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

    triggerCelebration("Take saved!", ["#fb923c", "#fb7185", "#facc15", "#14b8a6"]);
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
          emoji="?"
          title="Secret object"
          subtitle="Keep the answer hidden"
          size="sm"
          tone="mint"
        />
      </div>

      <div className="mb-8 text-center">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-full bg-[#ff7a45] px-4 py-2 text-xs font-black uppercase tracking-[0.32em] text-white shadow-[0_8px_18px_rgba(249,115,22,0.2)]">
            Speaking Booth
          </span>
          <span className="rounded-full border border-[#ffe7a1] bg-[#fff8db] px-4 py-2 text-sm font-bold text-[#8c5a1a]">
            {selectedObject ? "Secret object locked" : "Use the clue pattern"}
          </span>
          {selectedAvatar && (
            <span className="rounded-full border border-[#d7f4ef] bg-[#effffb] px-4 py-2 text-sm font-bold text-[#0f7c70]">
              {selectedAvatar.emoji} Your turn
            </span>
          )}
        </div>

        <h2 className="mt-5 text-5xl font-black uppercase tracking-tight text-[#432414] text-glow md:text-7xl">
          Describe It!
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-[#654331] md:text-lg">
          {phase === "fill"
            ? "Build the clue with colorful prompt cards, then record a clear and confident answer."
            : phase === "record"
            ? "Speak into the booth and watch the stars pop when your clue gets stronger."
            : "Check the stars, listen back, and move into the guessing round."}
        </p>
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
            <div className="space-y-5 rounded-[2.2rem] border border-white/85 bg-white/86 p-6 shadow-[0_24px_60px_rgba(249,115,22,0.14)] backdrop-blur-2xl">
              <div className="rounded-[1.8rem] border border-[#ffd8c2] bg-[linear-gradient(180deg,rgba(255,245,236,0.96),rgba(255,234,224,0.96))] p-5">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff7a45]">How to sound great</p>
                <div className="mt-4 grid gap-3">
                  {[
                    "Say what the object is.",
                    "Add one clue about colour or shape.",
                    "Tell the class what we use it for.",
                  ].map((tip) => (
                    <div key={tip} className="rounded-[1.2rem] border border-white/70 bg-white/80 px-4 py-3 text-sm font-semibold text-[#654331]">
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

              <div className="rounded-[1.6rem] border border-[#d7f4ef] bg-[#effffb] p-5">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#0f7c70]">Quick check</p>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-[#17685e]">
                  Children can tap the chips first, then change the words in the sentence boxes if they want a better clue.
                </p>
              </div>

              {micError && (
                <div className="rounded-[1.6rem] border border-[#ffd2dc] bg-[#fff1f5] p-5">
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-[#9b3b58]">Microphone fallback</p>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-[#8b3550]">
                    {micError}
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      className="rounded-full border border-[#ffd2dc] bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-[#8b3550] shadow-sm"
                    >
                      Try mic again
                    </button>
                    <button
                      type="button"
                      onClick={handleContinueWithoutMic}
                      className="rounded-full border border-[#ffb087] bg-[linear-gradient(135deg,#fb923c,#fb7185)] px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-white shadow-[0_14px_34px_rgba(249,115,22,0.18)]"
                    >
                      Continue without mic
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-5 rounded-[2.2rem] border border-white/85 bg-white/86 p-6 shadow-[0_24px_60px_rgba(249,115,22,0.14)] backdrop-blur-2xl">
              <SentenceBuilder sentences={gameContent.sentenceStarters} />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className={`inline-flex items-center gap-3 rounded-full border px-5 py-3 text-sm font-black uppercase tracking-[0.22em] ${
                  elapsed <= 15
                    ? "border-[#ccefe8] bg-[#ecfffb] text-[#0f7c70]"
                    : "border-[#ffd8c2] bg-[#fff4ec] text-[#7d4522]"
                }`}>
                  <span>⏱️</span>
                  <span>{elapsed}s</span>
                  {elapsed <= 15 && isComplete && <span>Speed bonus</span>}
                </div>

                <button
                  type="button"
                  onClick={handleStartRecording}
                  disabled={!isComplete}
                  className={`inline-flex items-center justify-center gap-3 rounded-full border px-7 py-4 text-base font-black uppercase tracking-[0.2em] transition-all ${
                    isComplete
                      ? "border-[#ffb087] bg-[linear-gradient(135deg,#fb923c,#fb7185)] text-white shadow-[0_14px_34px_rgba(249,115,22,0.18)] hover:-translate-y-0.5"
                      : "cursor-not-allowed border-[#f4e1d3] bg-white text-[#b69a86] opacity-70"
                  }`}
                >
                  🎙️ Record now
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
            <div className="space-y-5 rounded-[2.2rem] border border-white/85 bg-white/86 p-6 shadow-[0_24px_60px_rgba(249,115,22,0.14)] backdrop-blur-2xl">
              <div className="rounded-[1.8rem] border border-[#ffd8c2] bg-[linear-gradient(180deg,rgba(255,245,236,0.96),rgba(255,234,224,0.96))] p-5">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff7a45]">Say this clue</p>
                <div className="mt-4 space-y-3 text-left">
                  <PromptLine label="1" text={`This is a ${sentences.name}.`} />
                  <PromptLine label="2" text={`It is ${sentences.colour} in colour.`} />
                  <PromptLine label="3" text={`We use it to ${sentences.use}.`} />
                </div>
              </div>

              <div className="rounded-[1.8rem] border border-[#ffe7a1] bg-[#fff8db] p-5">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.28em] text-[#8c5a1a]">
                  <span>Voice meter</span>
                  <span>{volumeLevel}%</span>
                </div>
                <div className="mt-4 h-5 overflow-hidden rounded-full border border-white/80 bg-white/70">
                  <motion.div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#fb923c,#fb7185,#14b8a6)]"
                    animate={{ width: `${Math.max(6, volumeLevel)}%` }}
                    transition={{ duration: 0.12 }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-[11px] font-bold uppercase tracking-[0.18em] text-[#a67b53]">
                  <span>Too quiet</span>
                  <span>Great voice</span>
                  <span>Very loud</span>
                </div>
              </div>

              {!isSupported && (
                <div className="rounded-[1.5rem] border border-[#ffd2dc] bg-[#fff1f5] p-4 text-sm font-semibold text-[#8b3550]">
                  Speech recognition is not available here, but the audio recorder can still capture the clue.
                </div>
              )}
            </div>

            <div className="relative overflow-hidden rounded-[2.2rem] border border-white/85 bg-white/86 p-6 shadow-[0_24px_60px_rgba(249,115,22,0.14)] backdrop-blur-2xl">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(253,224,71,0.28),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(45,212,191,0.18),_transparent_30%)]" />

              <div className="relative flex min-h-[460px] flex-col items-center justify-center text-center">
                <motion.div
                  animate={{
                    scale: isRecording ? [1, 1.08, 1] : 1,
                    opacity: isRecording ? [0.24, 0.42, 0.24] : 0.2,
                  }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute h-72 w-72 rounded-full bg-[#ffe06f]/[0.55] blur-2xl"
                />
                <motion.div
                  animate={{
                    scale: isRecording ? [0.94, 1.12, 0.94] : 1,
                    opacity: isRecording ? [0.12, 0.26, 0.12] : 0.12,
                  }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  className="absolute h-96 w-96 rounded-full bg-[#a7f4e9]/35 blur-3xl"
                />

                <AnimatePresence>
                  {celebrationText && (
                    <motion.div
                      key={celebrationText}
                      initial={{ opacity: 0, y: 12, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.96 }}
                      className="absolute top-8 rounded-full border border-[#ffb087] bg-white px-5 py-2 text-sm font-black uppercase tracking-[0.22em] text-[#ff7a45] shadow-[0_12px_24px_rgba(249,115,22,0.12)]"
                    >
                      {celebrationText}
                    </motion.div>
                  )}
                </AnimatePresence>

                <StarBurst seed={burstSeed} />

                <p className="text-xs font-black uppercase tracking-[0.34em] text-[#ff7a45]">
                  Live booth
                </p>
                <h3 className="mt-4 text-3xl font-black text-[#432414] md:text-4xl">
                  {isRecording ? "Keep talking" : "Tap to go live"}
                </h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-[#654331]">
                  Speak naturally and let the star meter fill. The louder and clearer the clue sounds, the more the booth celebrates.
                </p>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleStopRecording}
                  className="relative z-10 mt-8 flex h-36 w-36 items-center justify-center rounded-full border border-[#ffb4b4] bg-[linear-gradient(135deg,#f87171,#fb7185)] text-lg font-black uppercase tracking-[0.22em] text-white shadow-[0_0_36px_rgba(251,113,133,0.22)]"
                >
                  Stop
                </motion.button>

                <div className="mt-8 flex h-14 items-end gap-2">
                  {Array.from({ length: 16 }).map((_, index) => {
                    const height = Math.max(12, ((volumeLevel + index * 5) % 100) * 0.62);
                    return (
                      <motion.div
                        key={index}
                        className="w-3 rounded-full"
                        animate={{
                          height: isRecording ? height : 14,
                          backgroundColor: isRecording ? "#14b8a6" : "#f9c9b5",
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
                    className="mt-6 w-full max-w-lg rounded-[1.6rem] border border-[#ffd8c2] bg-white/90 p-4"
                  >
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-[#a86132]">Live transcript</p>
                    <p className="mt-2 text-sm italic leading-relaxed text-[#654331]">"{transcript}"</p>
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
    orange: "border-[#ffd6c2] bg-[#fff1e8] text-[#86401b]",
    yellow: "border-[#ffe7a1] bg-[#fff8db] text-[#8c5a1a]",
    mint: "border-[#ccefe8] bg-[#ecfffb] text-[#11685d]",
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
            className="rounded-full border border-white/90 bg-white px-4 py-2 text-sm font-black capitalize tracking-[0.04em] shadow-sm"
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
    <div className="flex items-start gap-4 rounded-[1.2rem] border border-white/70 bg-white/85 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fff1e8] text-sm font-black text-[#86401b]">
        {label}
      </div>
      <p className="text-left text-lg font-black leading-relaxed text-[#513120]">{text}</p>
    </div>
  );
}

function StarBurst({ seed }) {
  const stars = [
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
      {stars.map((star, index) => (
        <motion.span
          key={`${seed}-${index}`}
          initial={{ opacity: 0, scale: 0.2, x: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.2, 1.1, 0.8], x: star.left, y: star.top }}
          transition={{ duration: 0.9, delay: index * 0.03, ease: "easeOut" }}
          className="absolute text-3xl"
        >
          ⭐
        </motion.span>
      ))}
    </div>
  );
}
