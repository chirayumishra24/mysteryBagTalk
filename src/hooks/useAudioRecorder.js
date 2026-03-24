/**
 * useAudioRecorder - Records microphone audio with real-time volume analysis.
 *
 * Uses MediaRecorder for audio capture and Web Audio API AnalyserNode for
 * live volume metering. Returns metrics for speech evaluation.
 */
import { useState, useRef, useCallback } from "react";

export default function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [metrics, setMetrics] = useState(null);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const chunksRef = useRef([]);
  const volumeSamplesRef = useRef([]);
  const startTimeRef = useRef(0);
  const isRecordingRef = useRef(false); // ref to avoid stale closures

  // Continuously sample volume via AnalyserNode
  const sampleVolume = useCallback(() => {
    if (!analyserRef.current || !isRecordingRef.current) return;
    const data = new Uint8Array(analyserRef.current.fftSize);
    analyserRef.current.getByteTimeDomainData(data);

    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      const val = (data[i] - 128) / 128;
      sum += val * val;
    }
    const rms = Math.sqrt(sum / data.length);
    const level = Math.min(100, Math.round(rms * 300));

    setVolumeLevel(level);
    volumeSamplesRef.current.push(level);

    animFrameRef.current = requestAnimationFrame(sampleVolume);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      // Clean up any previous recording
      if (audioContextRef.current) {
        try { audioContextRef.current.close(); } catch (e) {}
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Set up Web Audio analyser for volume
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      // Determine supported mime type
      let mimeType = "audio/webm";
      if (typeof MediaRecorder !== "undefined") {
        if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
          mimeType = "audio/webm;codecs=opus";
        } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
          mimeType = "audio/mp4";
        } else if (MediaRecorder.isTypeSupported("audio/ogg")) {
          mimeType = "audio/ogg";
        }
      }

      const recorder = new MediaRecorder(stream, { mimeType });

      chunksRef.current = [];
      volumeSamplesRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        const samples = volumeSamplesRef.current;
        const avgVolume =
          samples.length > 0
            ? Math.round(samples.reduce((a, b) => a + b, 0) / samples.length)
            : 0;
        const peakVolume = samples.length > 0 ? Math.max(...samples) : 0;
        const durationMs = Date.now() - startTimeRef.current;

        setMetrics({ avgVolume, peakVolume, durationMs });

        // Cleanup
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        cancelAnimationFrame(animFrameRef.current);
      };

      mediaRecorderRef.current = recorder;
      startTimeRef.current = Date.now();
      recorder.start(250);
      isRecordingRef.current = true;
      setIsRecording(true);
      setAudioUrl(null);
      setMetrics(null);

      sampleVolume();
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  }, [sampleVolume]);

  const stopRecording = useCallback(() => {
    // Use ref instead of state to avoid stale closure
    if (mediaRecorderRef.current && isRecordingRef.current) {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.warn("Error stopping recorder:", e);
      }
      isRecordingRef.current = false;
      setIsRecording(false);
      setVolumeLevel(0);
      cancelAnimationFrame(animFrameRef.current);

      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    }
  }, []);

  const resetRecording = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setMetrics(null);
    setVolumeLevel(0);
    chunksRef.current = [];
    volumeSamplesRef.current = [];
  }, [audioUrl]);

  return {
    isRecording,
    volumeLevel,
    audioUrl,
    metrics,
    startRecording,
    stopRecording,
    resetRecording,
  };
}
