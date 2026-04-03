import { useMemo } from "react";
import { motion } from "framer-motion";

const COLOR_WORDS = [
  "red", "blue", "green", "yellow", "orange", "purple", "pink", "white",
  "black", "brown", "grey", "gray", "silver", "golden", "gold", "transparent",
  "shiny", "bright", "dark", "light", "colourful", "colorful",
];

const ADJECTIVES = [
  "big", "small", "long", "short", "round", "flat", "soft", "hard",
  "smooth", "rough", "heavy", "light", "thin", "thick", "sharp",
  "cold", "warm", "pointy", "fuzzy", "squishy", "plastic", "metal",
  "wooden", "rubber", "cool", "tiny", "little", "large",
];

function analyzeTranscript(transcript, sentences) {
  const lower = transcript.toLowerCase();
  const words = lower.split(/\s+/).filter(Boolean);

  const hasName = sentences.name.trim() !== "" && lower.includes(sentences.name.toLowerCase());
  const hasColour = sentences.colour.trim() !== "" && (
    lower.includes(sentences.colour.toLowerCase()) ||
    COLOR_WORDS.some((color) => lower.includes(color))
  );
  const hasUse = sentences.use.trim() !== "" && lower.includes(sentences.use.toLowerCase());
  const completenessScore = [hasName, hasColour, hasUse].filter(Boolean).length;

  const foundColors = COLOR_WORDS.filter((word) => lower.includes(word));
  const foundAdj = ADJECTIVES.filter((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    return regex.test(lower);
  });
  const describingWords = [...new Set([...foundColors, ...foundAdj])];
  const describingScore = Math.min(3, describingWords.length);

  return {
    hasName,
    hasColour,
    hasUse,
    completenessScore,
    describingWords,
    describingScore,
    wordCount: words.length,
  };
}

function StarRating({ score, maxStars = 3 }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxStars }).map((_, index) => (
        <motion.span
          key={index}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.24 + index * 0.12, type: "spring", stiffness: 300 }}
          className={`text-xl ${index < score ? "" : "opacity-20 grayscale"}`}
        >
          🪙
        </motion.span>
      ))}
    </div>
  );
}

function ScoreRow({ icon, label, score, detail, delay, tone }) {
  const tones = {
    cyan: "border-cyan-500/20 bg-cyan-500/8 text-cyan-200",
    gold: "border-amber-500/20 bg-amber-500/8 text-amber-200",
    teal: "border-teal-500/20 bg-teal-500/8 text-teal-200",
    pink: "border-pink-500/20 bg-pink-500/8 text-pink-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`flex items-center gap-4 rounded-[1.5rem] border p-4 ${tones[tone]}`}
    >
      <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-cyan-950/50 text-2xl shadow-sm border border-cyan-500/10">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-black uppercase tracking-[0.2em]">{label}</div>
        {detail && (
          <div className="mt-1 text-xs font-semibold opacity-80">{detail}</div>
        )}
      </div>
      <StarRating score={score} />
    </motion.div>
  );
}

export default function SpeechReportCard({
  transcript,
  audioUrl,
  metrics,
  sentences,
  aiReview,
  isAnalyzing,
  onContinue,
  onRetry,
}) {
  const analysis = useMemo(
    () => analyzeTranscript(transcript || "", sentences || {}),
    [sentences, transcript],
  );

  const volumeScore = !metrics
    ? 0
    : metrics.avgVolume >= 30
    ? 3
    : metrics.avgVolume >= 15
    ? 2
    : metrics.avgVolume >= 5
    ? 1
    : 0;

  const durationSec = metrics ? Math.round(metrics.durationMs / 1000) : 0;
  const durationScore = durationSec >= 8 ? 3 : durationSec >= 5 ? 2 : durationSec >= 3 ? 1 : 0;
  const totalRaw = volumeScore + analysis.completenessScore + analysis.describingScore + durationScore;
  const overallStars = Math.min(5, Math.round((totalRaw / 12) * 5));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", damping: 22 }}
      className="mx-auto w-full max-w-5xl sea-glass overflow-hidden p-6 md:p-8"
    >
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5">
          <div className="rounded-[2rem] border border-cyan-500/15 bg-gradient-to-b from-cyan-950/40 to-blue-950/30 p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="sea-tag-coral px-4 py-2">
                🐙 Dive Report
              </span>
              <span className="sea-tag-mint px-4 py-2">
                Treasure feedback
              </span>
            </div>

            <div className="mt-5 rounded-[1.8rem] border border-cyan-500/15 bg-[rgba(10,22,40,0.5)] p-6 text-center">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-400">Overall pearls</p>
              <div className="mt-4 flex justify-center gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <motion.span
                    key={index}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.48 + index * 0.12, type: "spring", stiffness: 300 }}
                    className={`text-4xl ${index < overallStars ? "" : "opacity-20 grayscale"}`}
                    style={{ filter: index < overallStars ? "drop-shadow(0 0 12px rgba(251,191,36,0.3))" : "none" }}
                  >
                    🪙
                  </motion.span>
                ))}
              </div>
              <p className="mt-4 text-xl font-black uppercase tracking-[0.16em] text-cyan-100">
                {overallStars >= 4 ? "Amazing Diver! 🐙" : overallStars >= 2 ? "Great Dive! 🐠" : "Keep Exploring! 🐟"}
              </p>
              <p className="mt-2 text-sm text-cyan-200/70">
                {overallStars >= 4
                  ? "Your treasure clues sounded clear and confident."
                  : "Each dive helps the next clue sound even stronger."}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <ScoreRow
              icon="🔊"
              label="Clear voice"
              score={volumeScore}
              detail={metrics ? `Average volume ${metrics.avgVolume}%` : "No voice data yet"}
              delay={0.1}
              tone="cyan"
            />
            <ScoreRow
              icon="📝"
              label="Full clues"
              score={analysis.completenessScore}
              detail={`${analysis.hasName ? "Name ✓" : "Name ✗"} · ${analysis.hasColour ? "Colour ✓" : "Colour ✗"} · ${analysis.hasUse ? "Use ✓" : "Use ✗"}`}
              delay={0.18}
              tone="gold"
            />
            <ScoreRow
              icon="🎨"
              label="Describing words"
              score={analysis.describingScore}
              detail={analysis.describingWords.length > 0 ? analysis.describingWords.slice(0, 5).join(", ") : "Add more describing words next dive"}
              delay={0.26}
              tone="teal"
            />
            <ScoreRow
              icon="⏱️"
              label="Speaking time"
              score={durationScore}
              detail={`${durationSec} seconds · ${analysis.wordCount} words`}
              delay={0.34}
              tone="pink"
            />
          </div>
        </div>

        <div className="space-y-5">
          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-[1.8rem] border border-cyan-500/15 bg-[rgba(10,22,40,0.5)] p-5"
            >
              <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-400">📝 What you said</p>
              <p className="mt-3 text-base font-semibold italic leading-relaxed text-cyan-200/80">"{transcript}"</p>
            </motion.div>
          )}

          {audioUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-[1.8rem] border border-teal-500/20 bg-teal-500/5 p-5"
            >
              <p className="text-xs font-black uppercase tracking-[0.28em] text-teal-400">🎧 Listen back</p>
              <audio controls src={audioUrl} className="mt-4 h-10 w-full rounded-lg" />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48 }}
            className="rounded-[1.8rem] border border-amber-500/20 bg-amber-500/5 p-5"
          >
            <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-400">🐙 Captain's review</p>

            {isAnalyzing && (
              <div className="mt-4 rounded-[1.5rem] border border-cyan-500/15 bg-cyan-950/30 p-6 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                  className="mx-auto mb-3 h-12 w-12 rounded-full border-4 border-cyan-900 border-t-cyan-400"
                />
                <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
                  🐙 Reading the treasure clue...
                </p>
              </div>
            )}

            {!isAnalyzing && aiReview && (
              <div className="mt-4 space-y-4">
                <div className="rounded-[1.5rem] border border-teal-500/20 bg-teal-500/5 p-4">
                  <p className="text-sm font-semibold leading-relaxed text-teal-200">{aiReview.feedback}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Clarity", score: aiReview.clarity, icon: "🗣️", tone: "cyan" },
                    { label: "Vocabulary", score: aiReview.vocabulary, icon: "📚", tone: "gold" },
                    { label: "Confidence", score: aiReview.confidence, icon: "💪", tone: "pink" },
                  ].map(({ label, score, icon, tone }) => (
                    <MiniStat key={label} label={label} score={score} icon={icon} tone={tone} />
                  ))}
                </div>

                {aiReview.tip && (
                  <div className="rounded-[1.5rem] border border-pink-500/20 bg-pink-500/5 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-pink-400">🐠 Next dive tip</p>
                    <p className="mt-2 text-sm font-semibold leading-relaxed text-pink-200/80">{aiReview.tip}</p>
                  </div>
                )}

                {aiReview.highlighted_words?.length > 0 && (
                  <div className="rounded-[1.5rem] border border-cyan-500/15 bg-cyan-500/5 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-400">✨ Words you used well</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {aiReview.highlighted_words.map((word) => (
                        <span
                          key={word}
                          className="rounded-full border border-cyan-500/20 bg-cyan-950/50 px-3 py-1 text-sm font-bold text-cyan-200"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!isAnalyzing && !aiReview && (
              <div className="mt-4 rounded-[1.5rem] border border-cyan-500/10 bg-cyan-950/30 p-4 text-sm font-semibold text-cyan-300/70">
                Captain's review is not available right now. The crew can still use the pearls and transcript as feedback. 🐙
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.58 }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <button
              onClick={onRetry}
              className="flex-1 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-cyan-300 shadow-sm transition hover:-translate-y-0.5 hover:bg-cyan-500/15"
            >
              🔄 Try again
            </button>
            <button
              onClick={() => onContinue(overallStars)}
              className="coral-btn flex-1 px-6 py-4 text-sm"
            >
              🐙 Next round
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function MiniStat({ label, score, icon, tone }) {
  const tones = {
    cyan: "border-cyan-500/20 bg-cyan-500/8 text-cyan-200",
    gold: "border-amber-500/20 bg-amber-500/8 text-amber-200",
    pink: "border-pink-500/20 bg-pink-500/8 text-pink-200",
  };

  return (
    <div className={`rounded-[1.4rem] border p-4 text-center ${tones[tone]}`}>
      <div className="text-2xl">{icon}</div>
      <p className="mt-2 text-[11px] font-black uppercase tracking-[0.24em] opacity-70">{label}</p>
      <p className="mt-2 text-2xl font-black">
        {score}
        <span className="text-sm opacity-60">/5</span>
      </p>
    </div>
  );
}
