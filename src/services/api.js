/**
 * API service for communicating with the Gemini voice analysis backend.
 */

const API_BASE = import.meta.env.GEMINI_API_URL || "https://mystery-bag-talk-1xs8.vercel.app/";

/**
 * Send recorded audio and transcript to the backend for Gemini analysis.
 *
 * @param {Object} params
 * @param {Blob}   params.audioBlob  - The recorded audio blob
 * @param {string} params.transcript - Speech-to-text transcript
 * @param {Object} params.sentences  - { name, colour, use }
 * @param {string} [params.objectName] - The mystery object name (optional)
 * @returns {Promise<Object>} The AI review result
 */
export async function analyzeVoice({ audioBlob, transcript, sentences, objectName }) {
  const formData = new FormData();

  if (audioBlob) {
    // Note: The browser still inherently records in WebM/Opus or MP4,
    // but we can send it with the .mp3 extension as requested.
    formData.append("audio", audioBlob, "recording.mp3");
  }
  if (transcript) {
    formData.append("transcript", transcript);
  }
  if (sentences) {
    formData.append("sentences", JSON.stringify(sentences));
  }
  if (objectName) {
    formData.append("objectName", objectName);
  }

  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.message || `Analysis failed (${response.status})`);
  }

  const data = await response.json();
  return data.review;
}
