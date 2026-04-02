import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useAudioRecorder from "../../hooks/useAudioRecorder";

export default function HollowInteraction() {
  const { isRecording, volumeLevel, startRecording, stopRecording, audioUrl } = useAudioRecorder();
  const [energyLevel, setEnergyLevel] = useState(0);
  const [takeReady, setTakeReady] = useState(false);

  useEffect(() => {
    if (isRecording && volumeLevel > 10) {
      setEnergyLevel((previous) => {
        const nextLevel = previous + volumeLevel * 0.05;
        if (nextLevel >= 100 && !takeReady) {
          finishTake();
          return 100;
        }
        return Math.min(nextLevel, 100);
      });
    } else if (!isRecording && energyLevel > 0 && !takeReady) {
      const timer = setTimeout(() => {
        setEnergyLevel((previous) => Math.max(previous - 5, 0));
      }, 500);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, [energyLevel, isRecording, takeReady, volumeLevel]);

  const finishTake = () => {
    setTakeReady(true);
    stopRecording();
  };

  const handleMicTap = () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    startRecording();
    setEnergyLevel(0);
    setTakeReady(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden pointer-events-auto">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(253,224,71,0.36),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(251,146,60,0.24),_transparent_26%),radial-gradient(circle_at_center,_rgba(45,212,191,0.14),_transparent_24%)]" />
        <div
          className={`absolute left-[10%] top-[14%] h-52 w-52 rounded-[2.5rem] bg-[#ffe074]/[0.55] blur-3xl transition-opacity duration-500 ${
            isRecording ? "opacity-90" : "opacity-55"
          }`}
        />
        <div
          className={`absolute bottom-[8%] right-[8%] h-64 w-64 rounded-full bg-[#ffb3a8]/[0.45] blur-3xl transition-opacity duration-500 ${
            takeReady ? "opacity-90" : "opacity-55"
          }`}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 mx-auto grid w-full max-w-6xl gap-6 rounded-[2.4rem] border border-white/[0.8] bg-white/[0.82] p-6 shadow-[0_24px_80px_rgba(249,115,22,0.16)] backdrop-blur-2xl md:p-8 lg:grid-cols-[0.95fr_1.05fr]"
      >
        <div className="flex flex-col gap-5 rounded-[2rem] border border-[#ffe1ce] bg-[#fffaf4] p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#ff7a45] px-4 py-2 text-xs font-black uppercase tracking-[0.32em] text-white shadow-[0_8px_18px_rgba(249,115,22,0.2)]">
              Voice Booth
            </span>
            <span className="rounded-full border border-[#d7f4ef] bg-[#effffb] px-4 py-2 text-sm font-bold text-[#0f7c70]">
              Ready to play
            </span>
          </div>

          <div>
            <h2 className="text-4xl font-black leading-tight text-[#432414] text-glow md:text-5xl">
              {takeReady ? "Great take!" : "Record the clue"}
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-[#654331] md:text-lg">
              {takeReady
                ? "The audio is ready to replay. Let the class listen, then tap again if you want another fun round."
                : "Tap the mic, describe the object, and watch the meter fill up. The brighter the meter gets, the stronger the clue."}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <BoothStat label="Power" value={`${Math.round(energyLevel)}%`} tone="orange" />
            <BoothStat label="Volume" value={`${Math.round(volumeLevel)}%`} tone="pink" />
            <BoothStat label="Status" value={takeReady ? "Saved" : isRecording ? "Live" : "Standby"} tone="mint" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.28em] text-[#a86132]">
              <span>Voice meter</span>
              <span>{takeReady ? "Take complete" : isRecording ? "Speaking now" : "Waiting for input"}</span>
            </div>
            <div className="relative h-4 overflow-hidden rounded-full border border-[#ffd9c5] bg-[#fff0e5]">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,#fb923c,#fb7185,#14b8a6)] shadow-[0_0_18px_rgba(249,115,22,0.22)]"
                animate={{ width: `${energyLevel}%` }}
                transition={{ ease: "linear", duration: 0.2 }}
              />
              <div
                className="absolute inset-0 bg-white transition-opacity duration-75"
                style={{ opacity: isRecording ? Math.min(volumeLevel / 120, 0.3) : 0 }}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <GuideCard
              title="Clue idea"
              body="Encourage children to say what the object looks like, feels like, or is used for."
              tone="yellow"
            />
            <GuideCard
              title="Speaking tip"
              body="A clear voice and short sentences make the clue easier and more fun to guess."
              tone="mint"
            />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-[#ffdccc] bg-[linear-gradient(180deg,rgba(255,244,231,0.96),rgba(255,233,226,0.96))] p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(253,224,71,0.26),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(45,212,191,0.16),_transparent_30%)]" />

          <AnimatePresence mode="wait">
            {!takeReady ? (
              <motion.div
                key="recording"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                className="relative flex min-h-[440px] flex-col items-center justify-center text-center"
              >
                <motion.div
                  animate={{
                    scale: isRecording ? [1, 1.08, 1] : 1,
                    opacity: isRecording ? [0.22, 0.45, 0.22] : 0.18,
                  }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute h-72 w-72 rounded-full bg-[#ffe06f]/[0.55] blur-2xl"
                />
                <motion.div
                  animate={{
                    scale: isRecording ? [0.94, 1.12, 0.94] : 1,
                    opacity: isRecording ? [0.1, 0.26, 0.1] : 0.1,
                  }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  className="absolute h-96 w-96 rounded-full bg-[#a7f4e9]/35 blur-3xl"
                />

                <div className="relative mb-8 flex flex-col items-center">
                  <p className="text-xs font-black uppercase tracking-[0.34em] text-[#ff7a45]">
                    Game action
                  </p>
                  <h3 className="mt-4 text-3xl font-black text-[#432414] md:text-4xl">
                    {isRecording ? "Keep talking" : "Tap to go live"}
                  </h3>
                  <p className="mt-3 max-w-md text-base leading-relaxed text-[#654331]">
                    {isRecording
                      ? "Speak naturally and let the meter climb. The booth will stop automatically when the clue is strong enough."
                      : "Start a practice take and let children hear how fun, clear speaking sounds."}
                  </p>
                </div>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleMicTap}
                  className={`relative z-10 flex h-36 w-36 items-center justify-center rounded-full border text-lg font-black uppercase tracking-[0.24em] transition-all ${
                    isRecording
                      ? "border-[#ffb4b4] bg-[linear-gradient(135deg,#f87171,#fb7185)] text-white shadow-[0_0_36px_rgba(251,113,133,0.22)]"
                      : "border-[#ffd6b6] bg-[linear-gradient(135deg,#fb923c,#facc15)] text-white shadow-[0_0_36px_rgba(249,115,22,0.2)]"
                  }`}
                >
                  {isRecording ? "Stop" : "Mic"}
                </motion.button>

                <div className="mt-8 flex h-14 items-end gap-2">
                  {Array.from({ length: 14 }).map((_, index) => {
                    const barHeight = Math.max(12, ((volumeLevel + index * 4) % 100) * 0.6);

                    return (
                      <motion.div
                        key={index}
                        className="w-3 rounded-full"
                        animate={{
                          height: isRecording ? barHeight : 14,
                          backgroundColor: isRecording ? "#14b8a6" : "#f9c9b5",
                        }}
                        transition={{ duration: 0.18 }}
                      />
                    );
                  })}
                </div>

                <p className="mt-5 text-sm font-medium text-[#7d5a45]">
                  {isRecording ? "Recording live" : "Ready when you are"}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="playback"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                className="relative flex min-h-[440px] flex-col items-center justify-center text-center"
              >
                <div className="mb-8 rounded-full bg-[#fff2d8] px-5 py-2 text-xs font-black uppercase tracking-[0.34em] text-[#8f5b15]">
                  Take saved
                </div>
                <h3 className="text-3xl font-black text-[#432414] md:text-4xl">Listen back together</h3>
                <p className="mt-4 max-w-md text-base leading-relaxed text-[#654331]">
                  Replay the audio for the class, then reset and record another turn if you want an even better clue.
                </p>

                {audioUrl && (
                  <div className="mt-8 w-full max-w-md rounded-[1.6rem] border border-[#ffd8c2] bg-white p-4 shadow-[0_12px_24px_rgba(249,115,22,0.08)]">
                    <audio src={audioUrl} controls className="w-full" />
                  </div>
                )}

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setTakeReady(false);
                    setEnergyLevel(0);
                  }}
                  className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#ffb087] bg-[linear-gradient(135deg,#fb923c,#fb7185)] px-6 py-3.5 text-base font-black text-white shadow-[0_14px_34px_rgba(249,115,22,0.18)]"
                >
                  Record another take
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

function BoothStat({ label, value, tone }) {
  const tones = {
    orange: "border-[#ffd6c2] bg-[#fff1e8] text-[#86401b]",
    pink: "border-[#ffd2dc] bg-[#fff1f5] text-[#9b3b58]",
    mint: "border-[#ccefe8] bg-[#ecfffb] text-[#0f7c70]",
  };

  return (
    <div className={`rounded-[1.3rem] border px-4 py-3 ${tones[tone]}`}>
      <p className="text-[11px] font-black uppercase tracking-[0.28em] opacity-70">{label}</p>
      <p className="mt-2 text-lg font-black">{value}</p>
    </div>
  );
}

function GuideCard({ title, body, tone }) {
  const tones = {
    yellow: "border-[#ffe7a1] bg-[#fff8db] text-[#8c5a1a]",
    mint: "border-[#ccefe8] bg-[#ecfffb] text-[#14675d]",
  };

  return (
    <div className={`rounded-[1.4rem] border p-4 ${tones[tone]}`}>
      <p className="text-sm font-black uppercase tracking-[0.24em]">{title}</p>
      <p className="mt-2 text-sm leading-relaxed opacity-85">{body}</p>
    </div>
  );
}
