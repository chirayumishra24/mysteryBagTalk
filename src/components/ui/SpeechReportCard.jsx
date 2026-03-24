/**
 * SpeechReportCard - Visual scoring card after audio recording.
 * Analyzes the transcript and audio metrics against activity parameters.
 */
import { useMemo } from "react";
import { motion } from "framer-motion";

// Lists of describing/color words to detect
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

  // 1. Sentence Completeness — did they mention name, colour, use?
  const hasName = sentences.name.trim() !== "" && lower.includes(sentences.name.toLowerCase());
  const hasColour = sentences.colour.trim() !== "" && (
    lower.includes(sentences.colour.toLowerCase()) ||
    COLOR_WORDS.some((c) => lower.includes(c))
  );
  const hasUse = sentences.use.trim() !== "" && lower.includes(sentences.use.toLowerCase());
  const completenessScore = [hasName, hasColour, hasUse].filter(Boolean).length; // 0–3

  // 2. Describing Words
  const foundColors = COLOR_WORDS.filter((w) => lower.includes(w));
  const foundAdj = ADJECTIVES.filter((w) => {
    const regex = new RegExp(`\\b${w}\\b`, "i");
    return regex.test(lower);
  });
  const describingWords = [...new Set([...foundColors, ...foundAdj])];
  const describingScore = Math.min(3, describingWords.length); // 0–3

  // 3. Word count
  const wordCount = words.length;

  return {
    hasName,
    hasColour,
    hasUse,
    completenessScore,
    describingWords,
    describingScore,
    wordCount,
  };
}

function StarRating({ score, maxStars = 3 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: maxStars }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 300 }}
          className={`text-lg ${i < score ? "" : "opacity-20"}`}
        >
          ⭐
        </motion.span>
      ))}
    </div>
  );
}

function ScoreRow({ icon, label, score, maxStars = 3, detail, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-4 bg-purple-900/30 p-4 rounded-xl border border-purple-500/10"
    >
      <span className="text-2xl flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-purple-100 font-display font-semibold text-sm">{label}</div>
        {detail && (
          <div className="text-purple-300/60 text-xs font-body mt-0.5 truncate">{detail}</div>
        )}
      </div>
      <StarRating score={score} maxStars={maxStars} />
    </motion.div>
  );
}

export default function SpeechReportCard({
  transcript,
  audioUrl,
  metrics, // { avgVolume, peakVolume, durationMs }
  sentences, // { name, colour, use }
  onContinue,
  onRetry,
}) {
  const analysis = useMemo(
    () => analyzeTranscript(transcript || "", sentences || {}),
    [transcript, sentences]
  );

  // Volume score: 0–3 stars based on avgVolume
  const volumeScore = !metrics
    ? 0
    : metrics.avgVolume >= 30
    ? 3
    : metrics.avgVolume >= 15
    ? 2
    : metrics.avgVolume >= 5
    ? 1
    : 0;

  // Duration score: 0–3 stars based on seconds spoken
  const durationSec = metrics ? Math.round(metrics.durationMs / 1000) : 0;
  const durationScore = durationSec >= 8 ? 3 : durationSec >= 5 ? 2 : durationSec >= 3 ? 1 : 0;

  // Overall: total from all 4 categories (max 12) → mapped to 0–5 stars
  const totalRaw = volumeScore + analysis.completenessScore + analysis.describingScore + durationScore;
  const overallStars = Math.min(5, Math.round((totalRaw / 12) * 5));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", damping: 20 }}
      className="w-full max-w-lg mx-auto glass p-6 rounded-2xl border border-purple-500/20 shadow-[0_0_40px_rgba(139,92,246,0.2)]"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-4xl mb-2"
        >
          📊
        </motion.div>
        <h3 className="text-xl font-display font-bold text-white">Speech Report Card</h3>
        <p className="text-purple-300/60 text-xs font-body mt-1">
          Here's how you did on this round!
        </p>
      </div>

      {/* Score Rows */}
      <div className="space-y-3 mb-6">
        <ScoreRow
          icon="🔊"
          label="Clear, Loud Voice"
          score={volumeScore}
          detail={metrics ? `Avg. volume: ${metrics.avgVolume}%` : "No data"}
          delay={0.1}
        />
        <ScoreRow
          icon="📝"
          label="Complete Sentences"
          score={analysis.completenessScore}
          detail={`${analysis.hasName ? "✅" : "❌"} Name  ${analysis.hasColour ? "✅" : "❌"} Colour  ${analysis.hasUse ? "✅" : "❌"} Use`}
          delay={0.2}
        />
        <ScoreRow
          icon="🎨"
          label="Good Describing Words"
          score={analysis.describingScore}
          detail={
            analysis.describingWords.length > 0
              ? analysis.describingWords.slice(0, 5).join(", ")
              : "None detected"
          }
          delay={0.3}
        />
        <ScoreRow
          icon="⏱️"
          label="Speaking Duration"
          score={durationScore}
          detail={`${durationSec} seconds  ·  ${analysis.wordCount} words`}
          delay={0.4}
        />
      </div>

      {/* Overall Stars */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center mb-6 py-4 bg-gradient-to-r from-purple-600/20 via-pink-500/20 to-purple-600/20 rounded-xl border border-purple-400/20"
      >
        <div className="text-sm font-display font-bold text-purple-300 uppercase tracking-wider mb-2">
          Overall Score
        </div>
        <div className="flex justify-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.8 + i * 0.15, type: "spring", stiffness: 300 }}
              className={`text-2xl ${i < overallStars ? "" : "opacity-20"}`}
            >
              ⭐
            </motion.span>
          ))}
        </div>
        <div className="text-purple-200/60 text-xs font-body mt-1">
          {overallStars >= 4 ? "🎉 Amazing Speaker!" : overallStars >= 2 ? "👏 Great Job!" : "💪 Keep Practicing!"}
        </div>
      </motion.div>

      {/* Transcript Preview */}
      {transcript && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/10 mb-4"
        >
          <div className="text-xs font-display font-bold text-purple-400 uppercase tracking-wider mb-2">
            What You Said
          </div>
          <p className="text-purple-100 font-body text-sm italic leading-relaxed">
            "{transcript}"
          </p>
        </motion.div>
      )}

      {/* Audio Playback */}
      {audioUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-6"
        >
          <div className="text-xs font-display font-bold text-purple-400 uppercase tracking-wider mb-2">
            🎧 Listen to Yourself
          </div>
          <audio
            controls
            src={audioUrl}
            className="w-full h-10 rounded-lg"
            style={{ filter: "hue-rotate(260deg)" }}
          />
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="flex gap-3"
      >
        <button
          onClick={onRetry}
          className="flex-1 py-3 rounded-xl border border-purple-500/30 text-purple-300 font-display font-semibold text-sm hover:bg-purple-500/10 transition-colors cursor-pointer"
        >
          🔄 Try Again
        </button>
        <button
          onClick={() => onContinue(overallStars)}
          className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-display font-semibold text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-colors cursor-pointer"
        >
          ✅ Continue
        </button>
      </motion.div>
    </motion.div>
  );
}
