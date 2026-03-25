/**
 * API service for communicating with the Gemini voice analysis backend.
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

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
    formData.append("audio", audioBlob, "recording.webm");
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
