/**
 * Mystery Bag Talk — Gemini Voice Analysis Backend
 *
 * POST /api/analyze
 *   Accepts multipart form data with:
 *     - audio: the recorded audio blob
 *     - transcript: the speech-to-text transcript
 *     - sentences: JSON string of { name, colour, use }
 *     - objectName: (optional) the mystery object name
 *
 *   Returns JSON with AI-generated feedback.
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// Multer: store audio in memory for Gemini inline data
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});

// --- Gemini Client ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- Routes ---
app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "Mystery Bag Talk Voice Analyzer" });
});

app.post("/api/analyze", upload.single("audio"), async (req, res) => {
  try {
    const { transcript, sentences: sentencesRaw, objectName } = req.body;
    const sentences = sentencesRaw ? JSON.parse(sentencesRaw) : {};

    if (!transcript && !req.file) {
      return res.status(400).json({ error: "No audio or transcript provided." });
    }

    // Build the evaluation prompt
    const prompt = buildPrompt(transcript, sentences, objectName);

    // Choose model — use audio inline data if file was uploaded
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const parts = [{ text: prompt }];

    // Attach audio as inline data if provided
    if (req.file) {
      parts.push({
        inlineData: {
          mimeType: req.file.mimetype || "audio/webm",
          data: req.file.buffer.toString("base64"),
        },
      });
    }

    const result = await model.generateContent(parts);
    const response = await result.response;
    const text = response.text();

    // Try to parse structured JSON from Gemini's response
    const review = parseGeminiResponse(text);

    res.json({ success: true, review });
  } catch (err) {
    console.error("Gemini analysis error:", err);
    res.status(500).json({
      error: "Analysis failed",
      message: err.message,
    });
  }
});

// --- Prompt Builder ---
function buildPrompt(transcript, sentences, objectName) {
  return `You are a friendly, encouraging teacher evaluating a young student's (ages 7-9) spoken description of a mystery object.

CONTEXT:
- The student picked an object from a mystery bag and described it.
- Their written sentences were:
  • "This is a ${sentences.name || "[not provided]"}."
  • "It is ${sentences.colour || "[not provided]"} in colour."
  • "We use it to ${sentences.use || "[not provided]"}."
${objectName ? `- The actual mystery object was: "${objectName}"` : ""}

TRANSCRIPT OF WHAT THEY SAID:
"${transcript || "[No transcript available — analyze the audio instead]"}"

EVALUATION CRITERIA (score each 1-5):
1. **clarity** — Was their speech clear and easy to understand?
2. **vocabulary** — Did they use good describing words (colors, shapes, textures)?
3. **sentence_structure** — Did they speak in complete, well-formed sentences?
4. **accuracy** — Did their description match the object correctly?
5. **confidence** — Did they sound confident and enthusiastic?

RESPOND IN THIS EXACT JSON FORMAT (no markdown, no code fences):
{
  "clarity": <1-5>,
  "vocabulary": <1-5>,
  "sentence_structure": <1-5>,
  "accuracy": <1-5>,
  "confidence": <1-5>,
  "overall_stars": <1-5>,
  "feedback": "<2-3 sentences of warm, encouraging feedback for the child>",
  "tip": "<one specific, actionable tip to improve next time>",
  "highlighted_words": ["<list of good describing words they used>"]
}`;
}

// --- Response Parser ---
function parseGeminiResponse(text) {
  try {
    // Try direct JSON parse first
    return JSON.parse(text);
  } catch {
    // Try to extract JSON from markdown code fences
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1].trim());
      } catch { /* fall through */ }
    }

    // Try to find any JSON object in the text
    const braceMatch = text.match(/\{[\s\S]*\}/);
    if (braceMatch) {
      try {
        return JSON.parse(braceMatch[0]);
      } catch { /* fall through */ }
    }

    // Fallback: return the raw text as feedback
    return {
      clarity: 3,
      vocabulary: 3,
      sentence_structure: 3,
      accuracy: 3,
      confidence: 3,
      overall_stars: 3,
      feedback: text.slice(0, 300),
      tip: "Keep practicing your descriptions!",
      highlighted_words: [],
    };
  }
}

// --- Start ---
app.listen(PORT, () => {
  console.log(`🎒 Mystery Bag Talk API running on http://localhost:${PORT}`);
});
